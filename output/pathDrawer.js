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
            {x: 1760, y: 1500},
            {x: 1815, y: 1500},
            {x: 1815, y: 1534},
            {x: 1829, y: 1534},
            {x: 1829, y: 1545},
            {x: 1850, y: 1546},
            {x: 1851, y: 1508},
            {x: 2010, y: 1508},
            {x: 2012, y: 1600},
            {x: 1832, y: 1598},
            {x: 1831, y: 1619},
            {x: 1837, y: 1619},
            {x: 1835, y: 1676},
            {x: 1939, y: 1676},
            {x: 1938, y: 1758},
            {x: 1844, y: 1758},
            {x: 1844, y: 1756},
            {x: 1835, y: 1756},
            {x: 1836, y: 1869},
            {x: 1937, y: 1870},
            {x: 1938, y: 1874},
            {x: 1969, y: 1875},
            {x: 1969, y: 1993},
            {x: 1846, y: 1991},
            {x: 1845, y: 1970},
            {x: 1833, y: 1970},
            {x: 1836, y: 2165},
            {x: 1755, y: 2165},
            {x: 1756, y: 2146},
            {x: 1761, y: 2146},
            {x: 1759, y: 2069},
            {x: 1756, y: 2067},
            {x: 1756, y: 2048},
            {x: 1760, y: 2048},
            {x: 1760, y: 2028},
            {x: 1754, y: 2028},
            {x: 1755, y: 2010},
            {x: 1761, y: 2009},
            {x: 1761, y: 1988},
            {x: 1754, y: 1989},
            {x: 1756, y: 1970},
            {x: 1767, y: 1969},
            {x: 1767, y: 1893},
            {x: 1761, y: 1892},
            {x: 1759, y: 1871},
            {x: 1756, y: 1869},
            {x: 1757, y: 1851},
            {x: 1762, y: 1850},
            {x: 1760, y: 1830},
            {x: 1757, y: 1831},
            {x: 1755, y: 1813},
            {x: 1761, y: 1812},
            {x: 1760, y: 1792},
            {x: 1755, y: 1792},
            {x: 1755, y: 1775},
            {x: 1760, y: 1773},
            {x: 1761, y: 1752},
            {x: 1767, y: 1753},
            {x: 1768, y: 1676},
            {x: 1763, y: 1676},
            {x: 1761, y: 1636},
            {x: 1754, y: 1637},
            {x: 1756, y: 1620},
            {x: 1760, y: 1616}
        ]],
        
        // Building 2 - SCIT Lab
        ['building2', [
            {x: 1543, y: 1720},
            {x: 1615, y: 1721},
            {x: 1615, y: 1741},
            {x: 1636, y: 1742},
            {x: 1636, y: 1849},
            {x: 1651, y: 1851},
            {x: 1651, y: 1884},
            {x: 1636, y: 1884},
            {x: 1634, y: 1994},
            {x: 1580, y: 1994},
            {x: 1579, y: 1946},
            {x: 1558, y: 1945},
            {x: 1556, y: 1996},
            {x: 1546, y: 1997},
            {x: 1544, y: 1992},
            {x: 1535, y: 1992},
            {x: 1534, y: 1997},
            {x: 1523, y: 1997},
            {x: 1522, y: 1937},
            {x: 1413, y: 1938},
            {x: 1412, y: 1882},
            {x: 1543, y: 1883},
            {x: 1543, y: 1873},
            {x: 1581, y: 1872},
            {x: 1580, y: 1852},
            {x: 1504, y: 1852},
            {x: 1504, y: 1761},
            {x: 1532, y: 1760},
            {x: 1532, y: 1741},
            {x: 1538, y: 1735},
            {x: 1542, y: 1741}
        ]],
        
        // Building 3
        ['building3', [
            {x: 1449, y: 2003},
            {x: 1484, y: 2003},
            {x: 1483, y: 2098},
            {x: 1467, y: 2099},
            {x: 1468, y: 2115},
            {x: 1632, y: 2115},
            {x: 1633, y: 2166},
            {x: 1451, y: 2165},
            {x: 1452, y: 2191},
            {x: 1487, y: 2192},
            {x: 1487, y: 2301},
            {x: 1474, y: 2300},
            {x: 1474, y: 2326},
            {x: 1617, y: 2327},
            {x: 1618, y: 2364},
            {x: 1473, y: 2365},
            {x: 1473, y: 2381},
            {x: 1469, y: 2382},
            {x: 1468, y: 2416},
            {x: 1416, y: 2417},
            {x: 1416, y: 2382},
            {x: 1411, y: 2381},
            {x: 1410, y: 2364},
            {x: 1321, y: 2364},
            {x: 1321, y: 2328},
            {x: 1433, y: 2325},
            {x: 1433, y: 2298},
            {x: 1398, y: 2297},
            {x: 1397, y: 2196},
            {x: 1403, y: 2194},
            {x: 1403, y: 2165},
            {x: 1400, y: 2165},
            {x: 1399, y: 2114},
            {x: 1450, y: 2114}
        ]],
        
        // Building 4
        ['building4', [
            {x: 976, y: 2075},
            {x: 1149, y: 2076},
            {x: 1151, y: 2118},
            {x: 1307, y: 2120},
            {x: 1308, y: 2162},
            {x: 977, y: 2162}
        ]],
        
        // Building 5 - SOBA
        ['building5', [

        ]],
        
        // Building 8 - FELS
        ['building8', [
                        {x: 1357, y: 1559},
            {x: 1395, y: 1559},
            {x: 1395, y: 1546},
            {x: 1432, y: 1537},
            {x: 1475, y: 1530},
            {x: 1506, y: 1528},
            {x: 1509, y: 1546},
            {x: 1512, y: 1547},
            {x: 1513, y: 1573},
            {x: 1527, y: 1579},
            {x: 1529, y: 1628},
            {x: 1294, y: 1629},
            {x: 1293, y: 1646},
            {x: 1326, y: 1647},
            {x: 1330, y: 1752},
            {x: 1282, y: 1758},
            {x: 1281, y: 1629},
            {x: 1168, y: 1628},
            {x: 1166, y: 1583},
            {x: 1332, y: 1584},
            {x: 1331, y: 1577},
            {x: 1336, y: 1578},
            {x: 1338, y: 1584},
            {x: 1357, y: 1572}
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
