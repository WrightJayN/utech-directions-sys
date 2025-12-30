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
         ['building1', [
            // TODO: Add vertices {x: , y: }
            {x: 1760, y: 1500},
            {x: 1815, y: 1500},
            {x: 1815, y: 1535},
            {x: 1831, y: 1535},
            {x: 1829, y: 1546},
            {x: 1851, y: 1546},
            {x: 1850, y: 1510},
            {x: 2010, y: 1507},
            {x: 2012, y: 1600},
            {x: 1835, y: 1598},
            {x: 1835, y: 1678},
            {x: 1940, y: 1677},
            {x: 1941, y: 1756},
            {x: 1835, y: 1758},
            {x: 1834, y: 1869},
            {x: 1968, y: 1868},
            {x: 1970, y: 1994},
            {x: 1846, y: 1991},
            {x: 1847, y: 1970},
            {x: 1832, y: 1970},
            {x: 1835, y: 2167},
            {x: 1754, y: 2167},
            {x: 1755, y: 2145},
            {x: 1763, y: 2144},
            {x: 1761, y: 2068},
            {x: 1754, y: 2069},
            {x: 1754, y: 2049},
            {x: 1762, y: 2048},
            {x: 1759, y: 2029},
            {x: 1754, y: 2028},
            {x: 1755, y: 2009},
            {x: 1761, y: 2008},
            {x: 1762, y: 1988},
            {x: 1754, y: 1990},
            {x: 1754, y: 1970},
            {x: 1767, y: 1970},
            {x: 1767, y: 1892},
            {x: 1760, y: 1891},
            {x: 1760, y: 1869},
            {x: 1754, y: 1868},
            {x: 1755, y: 1850},
            {x: 1762, y: 1851},
            {x: 1760, y: 1830},
            {x: 1754, y: 1830},
            {x: 1754, y: 1811},
            {x: 1761, y: 1810},
            {x: 1760, y: 1792},
            {x: 1754, y: 1792},
            {x: 1755, y: 1771},
            {x: 1763, y: 1770},
            {x: 1760, y: 1752},
            {x: 1766, y: 1752},
            {x: 1768, y: 1676},
            {x: 1762, y: 1678},
            {x: 1762, y: 1639},
            {x: 1754, y: 1638},
            {x: 1755, y: 1616},
            {x: 1763, y: 1615}
        ]],
        ['building2', [
            // TODO: Add vertices {x: , y: }
            {x: 1543, y: 1722},
            {x: 1613, y: 1721},
            {x: 1612, y: 1742},
            {x: 1634, y: 1743},
            {x: 1635, y: 1850},
            {x: 1651, y: 1852},
            {x: 1652, y: 1885},
            {x: 1636, y: 1884},
            {x: 1634, y: 1995},
            {x: 1580, y: 1994},
            {x: 1580, y: 1944},
            {x: 1557, y: 1944},
            {x: 1558, y: 1997},
            {x: 1545, y: 1997},
            {x: 1546, y: 1991},
            {x: 1534, y: 1991},
            {x: 1535, y: 1997},
            {x: 1523, y: 1997},
            {x: 1522, y: 1937},
            {x: 1414, y: 1938},
            {x: 1414, y: 1881},
            {x: 1522, y: 1883},
            {x: 1542, y: 1884},
            {x: 1543, y: 1873},
            {x: 1581, y: 1873},
            {x: 1579, y: 1852},
            {x: 1504, y: 1852},
            {x: 1504, y: 1759},
            {x: 1533, y: 1760},
            {x: 1530, y: 1742},
            {x: 1537, y: 1735},
            {x: 1543, y: 1741}
        ]],
        ['building4', [
            // TODO: Add vertices {x: , y: }
            {x: 976, y: 2075},
            {x: 1150, y: 2077},
            {x: 1150, y: 2119},
            {x: 1309, y: 2120},
            {x: 1309, y: 2164},
            {x: 976, y: 2163},
            {x: 976, y: 2180},
            {x: 969, y: 2180},
            {x: 968, y: 2303},
            {x: 976, y: 2304},
            {x: 974, y: 2321},
            {x: 986, y: 2321},
            {x: 985, y: 2331},
            {x: 975, y: 2331},
            {x: 974, y: 2361},
            {x: 972, y: 2365},
            {x: 965, y: 2368},
            {x: 958, y: 2365},
            {x: 955, y: 2359},
            {x: 957, y: 2342},
            {x: 926, y: 2341},
            {x: 926, y: 2322},
            {x: 909, y: 2322},
            {x: 900, y: 2314},
            {x: 909, y: 2304},
            {x: 899, y: 2296},
            {x: 908, y: 2286},
            {x: 900, y: 2279},
            {x: 908, y: 2268},
            {x: 899, y: 2259},
            {x: 909, y: 2252},
            {x: 909, y: 2234},
            {x: 901, y: 2224},
            {x: 909, y: 2216},
            {x: 900, y: 2206},
            {x: 909, y: 2199},
            {x: 901, y: 2189},
            {x: 909, y: 218},
            {x: 924, y: 2178},
            {x: 924, y: 2163},
            {x: 894, y: 2161},
            {x: 893, y: 2132},
            {x: 888, y: 2133},
            {x: 888, y: 2119},
            {x: 974, y: 2118}
        ]],
        ['building5', [
            // TODO: Add vertices {x: , y: }
            {x: 1181, y: 1948},
            {x: 1400, y: 1952},
            {x: 1401, y: 1994},
            {x: 1166, y: 1994},
            {x: 1163, y: 1964},
            {x: 1165, y: 1957},
            {x: 1181, y: 1957}
        ]],
        ['building8', [
            // TODO: Add vertices {x: , y: }
            {x: 1357, y: 1558},
            {x: 1395, y: 1560},
            {x: 1394, y: 1546},
            {x: 1422, y: 1540},
            {x: 1447, y: 1534},
            {x: 1475, y: 1530},
            {x: 1497, y: 1529},
            {x: 1508, y: 1528},
            {x: 1509, y: 1547},
            {x: 1513, y: 1549},
            {x: 1513, y: 1574},
            {x: 1526, y: 1578},
            {x: 1527, y: 1628},
            {x: 1293, y: 1630},
            {x: 1291, y: 1648},
            {x: 1325, y: 1647},
            {x: 1328, y: 1756},
            {x: 1283, y: 1757},
            {x: 1280, y: 1629},
            {x: 1169, y: 1630},
            {x: 1170, y: 1589},
            {x: 1166, y: 1589},
            {x: 1166, y: 1583},
            {x: 1332, y: 1583},
            {x: 1332, y: 1578},
            {x: 1337, y: 1578},
            {x: 1339, y: 1583},
            {x: 1341, y: 1578},
            {x: 1358, y: 1571}
        ]],
        ['ltbsdbld8', [
            // TODO: Add vertices {x: , y: }
            {x: 1443, y: 1644},
            {x: 1490, y: 1644},
            {x: 1491, y: 1766},
            {x: 1486, y: 1772},
            {x: 1414, y: 1774},
            {x: 1414, y: 1786},
            {x: 1400, y: 1786},
            {x: 1401, y: 1755},
            {x: 1416, y: 1753},
            {x: 1415, y: 1730},
            {x: 1427, y: 1730},
            {x: 1426, y: 1723},
            {x: 1439, y: 1725},
            {x: 1437, y: 1700},
            {x: 1443, y: 1700}
        ]],
        ['building22', [
            // TODO: Add vertices {x: , y: }
            {x: 1177, y: 1834},
            {x: 1322, y: 1837},
            {x: 1323, y: 1882},
            {x: 1248, y: 1882},
            {x: 1247, y: 1906},
            {x: 1243, y: 1912},
            {x: 1240, y: 1913},
            {x: 1233, y: 1909},
            {x: 1232, y: 1902},
            {x: 1221, y: 1902},
            {x: 1218, y: 1905},
            {x: 1217, y: 1882},
            {x: 1177, y: 1882}
        ]],
        ['building47', [
            // TODO: Add vertices {x: , y: }
            {x: 560, y: 1596},
            {x: 586, y: 1596},
            {x: 602, y: 1596},
            {x: 604, y: 1570},
            {x: 607, y: 1576},
            {x: 622, y: 1576},
            {x: 622, y: 1571},
            {x: 633, y: 1572},
            {x: 634, y: 1577},
            {x: 651, y: 1577},
            {x: 649, y: 1571},
            {x: 663, y: 1573},
            {x: 663, y: 1577},
            {x: 696, y: 1578},
            {x: 695, y: 1572},
            {x: 709, y: 1573},
            {x: 708, y: 1578},
            {x: 726, y: 1577},
            {x: 726, y: 1574},
            {x: 736, y: 1574},
            {x: 736, y: 1578},
            {x: 753, y: 1577},
            {x: 755, y: 1573},
            {x: 756, y: 1620},
            {x: 755, y: 1669},
            {x: 755, y: 1720},
            {x: 752, y: 1714},
            {x: 738, y: 1714},
            {x: 737, y: 1719},
            {x: 725, y: 1719},
            {x: 723, y: 1713},
            {x: 708, y: 1713},
            {x: 708, y: 1719},
            {x: 695, y: 1717},
            {x: 694, y: 1714},
            {x: 662, y: 1712},
            {x: 662, y: 1717},
            {x: 649, y: 1717},
            {x: 648, y: 1712},
            {x: 633, y: 1711},
            {x: 632, y: 1717},
            {x: 621, y: 1717},
            {x: 621, y: 1712},
            {x: 606, y: 1712},
            {x: 603, y: 1716},
            {x: 601, y: 1692},
            {x: 560, y: 1691},
            {x: 561, y: 1653},
            {x: 552, y: 1652},
            {x: 551, y: 1635},
            {x: 566, y: 1635},
            {x: 566, y: 1609},
            {x: 562, y: 1609}
        ]],
        ['ltbsdbld47', [
            // TODO: Add vertices {x: , y: }
            {x: 823, y: 1298},
            {x: 821, y: 1320},
            {x: 828, y: 1320},
            {x: 827, y: 1375},
            {x: 799, y: 1378},
            {x: 766, y: 1386},
            {x: 744, y: 1400},
            {x: 728, y: 1414},
            {x: 713, y: 1427},
            {x: 700, y: 1447},
            {x: 689, y: 1472},
            {x: 683, y: 1498},
            {x: 682, y: 1515},
            {x: 625, y: 1517},
            {x: 625, y: 1511},
            {x: 606, y: 1511},
            {x: 607, y: 1484},
            {x: 613, y: 1461},
            {x: 621, y: 1437},
            {x: 628, y: 1421},
            {x: 612, y: 1411},
            {x: 632, y: 1383},
            {x: 645, y: 1392},
            {x: 657, y: 1379},
            {x: 642, y: 1364},
            {x: 674, y: 1332},
            {x: 688, y: 1345},
            {x: 703, y: 1336},
            {x: 695, y: 1320},
            {x: 723, y: 1302},
            {x: 733, y: 1318}
        ]],
        ["back gate",[
            // TODO: Add vertices {x: , y: }
            {x: 2115, y: 56},
            {x: 2138, y: 44},
            {x: 2161, y: 54},
            {x: 2164, y: 101},
            {x: 2138, y: 110},
            {x: 2118, y: 101},

        ]],
        ["main gate",[
            // TODO: Add vertices {x: , y: }
            {x: 1258, y: 3099},
            {x: 1281, y: 3087},
            {x: 1304, y: 3095},
            {x: 1307, y: 3142},
            {x: 1281, y: 3151},
            {x: 1261, y: 3142}
        ]],
        ["walkin gate",[
            // TODO: Add vertices {x: , y: }
            {x: 1742, y: 3108},
            {x: 1764, y: 3102},
            {x: 1786, y: 3108},
            {x: 1786, y: 3175},
            {x: 1766, y: 3179},
            {x: 1741, y: 3175}
        ]],

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
