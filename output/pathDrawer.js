/**
 * PathDrawer Component
 * Draws the campus map with path and colored buildings
 * 
 * According to documentation:
 * - Loads UTech map image and creates canvas
 * - Draws yellow lines along path from PathFinder
 * - Gets vertices of from and to buildings from Building Vertices Hash Map
 * - Colors from building red and to building blue using their vertices
 * - Sends map with drawn path to user
 * 
 * Drawing Algorithm:
 * 1. Load map image onto canvas
 * 2. Draw yellow path line connecting all nodes in path
 * 3. Get building vertices from Building Vertices Hash Map
 * 4. Color from building in red
 * 5. Color to building in blue
 */

class PathDrawer {
    /**
     * Building Vertices Hash Map
     * Maps building names to their vertex coordinates (polygon points)
     * Key: building name (string)
     * Value: Array of {x, y} coordinates representing building outline
     */
    static buildingVerticesHashMap = new Map([
        // Building 1 - Engineering
        ['building1', [
            { x: 1811, y: 1911 },
            { x: 1900, y: 1911 },
            { x: 1900, y: 2100 },
            { x: 1811, y: 2100 }
        ]],
        
        // Building 2 - SCIT Lab
        ['building2', [
            { x: 1578, y: 1777 },
            { x: 1650, y: 1777 },
            { x: 1650, y: 1850 },
            { x: 1578, y: 1850 }
        ]],
        
        // Building 3
        ['building3', [
            { x: 1443, y: 2220 },
            { x: 1530, y: 2220 },
            { x: 1530, y: 2310 },
            { x: 1443, y: 2310 }
        ]],
        
        // Building 4
        ['building4', [
            { x: 1084, y: 2132 },
            { x: 1160, y: 2132 },
            { x: 1160, y: 2200 },
            { x: 1084, y: 2200 }
        ]],
        
        // Building 5 - SOBA
        ['building5', [
            { x: 1277, y: 1972 },
            { x: 1360, y: 1972 },
            { x: 1360, y: 2050 },
            { x: 1277, y: 2050 }
        ]],
        
        // Building 8 - FELS
        ['building8', [
            { x: 1357, y: 1597 },
            { x: 1440, y: 1597 },
            { x: 1440, y: 1680 },
            { x: 1357, y: 1680 }
        ]],
        
        // Building 18
        ['building18', [
            { x: 1273, y: 1053 },
            { x: 1350, y: 1053 },
            { x: 1350, y: 1130 },
            { x: 1273, y: 1130 }
        ]],
        
        // Building 22 - COBAM
        ['building22', [
            { x: 1264, y: 1861 },
            { x: 1340, y: 1861 },
            { x: 1340, y: 1940 },
            { x: 1264, y: 1940 }
        ]],
        
        // Building 45
        ['building45', [
            { x: 266, y: 2905 },
            { x: 340, y: 2905 },
            { x: 340, y: 2980 },
            { x: 266, y: 2980 }
        ]],
        
        // Building 47
        ['building47', [
            { x: 694, y: 1386 },
            { x: 770, y: 1386 },
            { x: 770, y: 1460 },
            { x: 694, y: 1460 }
        ]],
        
        // LT 49
        ['lt49', [
            { x: 674, y: 1644 },
            { x: 750, y: 1644 },
            { x: 750, y: 1720 },
            { x: 674, y: 1720 }
        ]],
        
        // Main Gate
        ['main gate', [
            { x: 1280, y: 3100 },
            { x: 1290, y: 3100 },
            { x: 1290, y: 3130 },
            { x: 1280, y: 3130 }
        ]],
        
        // Walk-in Gate
        ['walkin gate', [
            { x: 1721, y: 3185 },
            { x: 1731, y: 3185 },
            { x: 1731, y: 3210 },
            { x: 1721, y: 3210 }
        ]],
        
        // Back Gate
        ['back gate', [
            { x: 2135, y: 30 },
            { x: 2145, y: 30 },
            { x: 2145, y: 55 },
            { x: 2135, y: 55 }
        ]]
    ]);

    /**
     * Loads map image and returns a promise
     * @param {string} imagePath - Path to the map image
     * @param {HTMLCanvasElement} canvas - Canvas element to draw on
     * @returns {Promise<Image>} Promise that resolves with loaded image
     */
    static loadMapImage(imagePath, canvas) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                // Set canvas dimensions to match image
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Draw image on canvas
                const context = canvas.getContext('2d');
                context.drawImage(img, 0, 0);
                
                resolve(img);
            };
            
            img.onerror = () => {
                reject(new Error('Image not found'));
            };
            
            img.src = imagePath;
        });
    }

    /**
     * Gets building vertices from Building Vertices Hash Map
     * @param {Object} buildingNode - Building graph node with name property
     * @param {Map} verticesHashMap - Building Vertices Hash Map (optional, uses default if not provided)
     * @returns {Array|null} Array of {x, y} vertices or null if not found
     */
    static getBuildingVertices(buildingNode, verticesHashMap = null) {
        // Validate input
        if (!buildingNode || !buildingNode.name) {
            return null;
        }

        // Use provided hash map or default
        const hashMap = verticesHashMap || this.buildingVerticesHashMap;
        
        if (!hashMap) {
            return null;
        }

        // Get vertices from hash map
        const buildingName = buildingNode.name.toLowerCase();
        const vertices = hashMap.get(buildingName);

        return vertices || undefined;
    }

    /**
     * Colors a building using its vertices
     * @param {Array} vertices - Array of {x, y} vertices representing building outline
     * @param {string} color - Color to fill building (e.g., '#FF0000' for red)
     * @param {CanvasRenderingContext2D} context - Canvas 2D context
     * @returns {boolean} True if successful, false otherwise
     */
    static colorBuilding(vertices, color, context) {
        // Validate inputs
        if (!vertices || !Array.isArray(vertices) || vertices.length === 0) {
            return false;
        }

        if (!color || !context) {
            return false;
        }

        // Set fill color
        context.fillStyle = color;

        // Begin path
        context.beginPath();

        // Move to first vertex
        context.moveTo(vertices[0].x, vertices[0].y);

        // Draw lines to all other vertices
        for (let i = 1; i < vertices.length; i++) {
            context.lineTo(vertices[i].x, vertices[i].y);
        }

        // Close path and fill
        context.closePath();
        context.fill();

        return true;
    }

    /**
     * Draws yellow path line along all nodes in path
     * @param {Array} path - Array of graph nodes with x_coor and y_coor properties
     * @param {CanvasRenderingContext2D} context - Canvas 2D context
     * @returns {boolean} True if successful, false otherwise
     */
    static drawPathLine(path, context) {
        // Validate inputs
        if (!path || !Array.isArray(path) || path.length < 2) {
            return false;
        }

        if (!context) {
            return false;
        }

        // Set line style
        context.strokeStyle = '#FFD700'; // Yellow (Gold)
        context.lineWidth = 5;

        // Begin path
        context.beginPath();

        // Move to first node
        context.moveTo(path[0].x_coor, path[0].y_coor);

        // Draw lines to all other nodes in path
        for (let i = 1; i < path.length; i++) {
            context.lineTo(path[i].x_coor, path[i].y_coor);
        }

        // Stroke the path
        context.stroke();

        return true;
    }

    /**
     * Creates complete map with path and colored buildings
     * Main method that coordinates all drawing operations
     * 
     * @param {Object} fromBuilding - Starting building graph node
     * @param {Object} toBuilding - Destination building graph node
     * @param {Array} path - Array of graph nodes representing the path
     * @param {Map} verticesHashMap - Building Vertices Hash Map (optional)
     * @param {HTMLCanvasElement} canvas - Canvas element to draw on
     * @returns {HTMLCanvasElement} Canvas with complete map drawing
     */
    static createMapWithPath(fromBuilding, toBuilding, path, verticesHashMap, canvas) {
        // Get canvas context
        const context = canvas.getContext('2d');

        // Step 1: Load map image
        this.loadMapImage('utech_map.png', canvas);

        // Step 2: Draw yellow path line
        this.drawPathLine(path, context);

        // Step 3: Get vertices for from building and color it red
        const fromVertices = this.getBuildingVertices(fromBuilding, verticesHashMap);
        if (fromVertices) {
            this.colorBuilding(fromVertices, '#FF0000', context); // Red
        }

        // Step 4: Get vertices for to building and color it blue
        const toVertices = this.getBuildingVertices(toBuilding, verticesHashMap);
        if (toVertices) {
            this.colorBuilding(toVertices, '#0000FF', context); // Blue
        }

        return canvas;
    }

    /**
     * Gets the default Building Vertices Hash Map
     * @returns {Map} The building vertices hash map
     */
    static getBuildingVerticesHashMap() {
        return this.buildingVerticesHashMap;
    }

    /**
     * Sets custom building vertices
     * @param {string} buildingName - Name of the building
     * @param {Array} vertices - Array of {x, y} vertices
     */
    static setBuildingVertices(buildingName, vertices) {
        if (buildingName && vertices && Array.isArray(vertices)) {
            this.buildingVerticesHashMap.set(buildingName.toLowerCase(), vertices);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PathDrawer;
}
