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
     * Draws the map key/legend on the canvas
     * @param {CanvasRenderingContext2D} context - Canvas 2D context
     * @param {number} canvasWidth - Width of the canvas
     * @param {number} canvasHeight - Height of the canvas
     */
    static drawMapKey(context, canvasWidth, canvasHeight) {
        const keyX = canvasWidth - 220; // Position from right edge
        const keyY = canvasHeight - 120; // Position from bottom edge
        const keyWidth = 200;
        const keyHeight = 90;

        // Draw white background for key
        context.fillStyle = '#FFFFFF';
        context.fillRect(keyX - 10, keyY - 10, keyWidth + 20, keyHeight + 20);

        // Red square for source building
        context.fillStyle = '#FF0000';
        context.fillRect(keyX, keyY, 20, 20);
        context.fillStyle = '#000000';
        context.font = '12px Arial';
        context.textBaseline = 'middle';
        context.fillText("Source Building", keyX + 25, keyY + 10);

        // Blue square for destination building
        context.fillStyle = '#0000FF';
        context.fillRect(keyX, keyY + 30, 20, 20);
        context.fillStyle = '#000000';
        context.fillText("Destination Building", keyX + 25, keyY + 40);

        // Yellow line for path
        context.strokeStyle = '#FFD700';
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(keyX, keyY + 70);
        context.lineTo(keyX + 50, keyY + 70);
        context.stroke();
        context.fillStyle = '#000000';
        context.fillText("Path", keyX + 55, keyY + 70);
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

        // Step 5: Draw the map key
        this.drawMapKey(context, canvas.width, canvas.height);

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
