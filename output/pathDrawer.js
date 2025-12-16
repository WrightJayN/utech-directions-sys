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
            {x: 1180, y: 1948},
            {x: 1401, y: 1951},
            {x: 1402, y: 1992},
            {x: 1164, y: 1992},
            {x: 1164, y: 1959},
            {x: 1179, y: 1955}
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
            {x: 1259, y: 1027},
            {x: 1274, y: 1024},
            {x: 1278, y: 1034},
            {x: 1365, y: 1019},
            {x: 1385, y: 1125},
            {x: 1311, y: 1137},
            {x: 1300, y: 1081},
            {x: 1267, y: 1085},
            {x: 1268, y: 1096},
            {x: 1264, y: 1096},
            {x: 1268, y: 1123},
            {x: 1244, y: 1128},
            {x: 1238, y: 1101},
            {x: 1231, y: 1102},
            {x: 1234, y: 1129},
            {x: 1160, y: 1141},
            {x: 1156, y: 1115},
            {x: 1150, y: 1115},
            {x: 1153, y: 1141},
            {x: 1125, y: 1148},
            {x: 1120, y: 1122},
            {x: 1102, y: 1124},
            {x: 1090, y: 1064},
            {x: 1260, y: 1036}
        ]],
        
        // Building 22 - COBAM
        ['building22', [
            {x: 1177, y: 1833},
            {x: 1322, y: 1836},
            {x: 1324, y: 1882},
            {x: 1247, y: 1880},
            {x: 1247, y: 1906},
            {x: 1246, y: 1910},
            {x: 1242, y: 1912},
            {x: 1235, y: 1912},
            {x: 1233, y: 1908},
            {x: 1231, y: 1904},
            {x: 1232, y: 1902},
            {x: 1217, y: 1903},
            {x: 1217, y: 1881},
            {x: 1179, y: 1881}
        ]],
        
        // Building 45
        ['building45', [
            {x: 182, y: 2868},
            {x: 362, y: 2884},
            {x: 357, y: 2943},
            {x: 353, y: 2985},
            {x: 349, y: 3046},
            {x: 168, y: 3032},
            {x: 174, y: 2971},
            {x: 176, y: 2929}
        ]],
        
        // Building 47
        ['building47', [
            {x: 604, y: 1576},
            {x: 622, y: 1576},
            {x: 622, y: 1571},
            {x: 632, y: 1570},
            {x: 633, y: 1575},
            {x: 650, y: 1576},
            {x: 650, y: 1571},
            {x: 662, y: 1571},
            {x: 662, y: 1576},
            {x: 697, y: 1576},
            {x: 696, y: 1572},
            {x: 709, y: 1572},
            {x: 709, y: 1576},
            {x: 725, y: 1577},
            {x: 725, y: 1573},
            {x: 738, y: 1573},
            {x: 738, y: 1577},
            {x: 755, y: 1577},
            {x: 756, y: 1623},
            {x: 755, y: 1669},
            {x: 755, y: 1715},
            {x: 736, y: 1714},
            {x: 736, y: 1718},
            {x: 724, y: 1719},
            {x: 723, y: 1714},
            {x: 707, y: 1714},
            {x: 708, y: 1717},
            {x: 696, y: 1718},
            {x: 694, y: 1713},
            {x: 661, y: 1713},
            {x: 660, y: 1717},
            {x: 647, y: 1717},
            {x: 647, y: 1714},
            {x: 632, y: 1713},
            {x: 632, y: 1717},
            {x: 620, y: 1718},
            {x: 619, y: 1713},
            {x: 602, y: 1712},
            {x: 601, y: 1692},
            {x: 584, y: 1691},
            {x: 560, y: 1690},
            {x: 561, y: 1653},
            {x: 550, y: 1652},
            {x: 550, y: 1633},
            {x: 564, y: 1633},
            {x: 564, y: 1610},
            {x: 560, y: 1610},
            {x: 561, y: 1596},
            {x: 584, y: 1596},
            {x: 603, y: 1597}
        ]],
        
        // LT 49
        ['lt49', [
            {x: 605, y: 1510},
            {x: 608, y: 1482},
            {x: 615, y: 1454},
            {x: 622, y: 1435},
            {x: 628, y: 1420},
            {x: 611, y: 1411},
            {x: 630, y: 1383},
            {x: 644, y: 1392},
            {x: 656, y: 1378},
            {x: 643, y: 1364},
            {x: 675, y: 1332},
            {x: 689, y: 1345},
            {x: 704, y: 1335},
            {x: 694, y: 1321},
            {x: 723, y: 1302},
            {x: 732, y: 1318},
            {x: 750, y: 1312},
            {x: 769, y: 1305},
            {x: 787, y: 1301},
            {x: 807, y: 1299},
            {x: 823, y: 1298},
            {x: 823, y: 1319},
            {x: 828, y: 1319},
            {x: 827, y: 1374},
            {x: 809, y: 1376},
            {x: 792, y: 1379},
            {x: 775, y: 1384},
            {x: 763, y: 1389},
            {x: 751, y: 1395},
            {x: 740, y: 1402},
            {x: 726, y: 1414},
            {x: 716, y: 1425},
            {x: 707, y: 1436},
            {x: 700, y: 1446},
            {x: 695, y: 1456},
            {x: 692, y: 1462},
            {x: 689, y: 1473},
            {x: 686, y: 1481},
            {x: 685, y: 1491},
            {x: 682, y: 1501},
            {x: 682, y: 1510},
            {x: 682, y: 1514},
            {x: 625, y: 1516},
            {x: 626, y: 1511}
        ]],
        
        // Main Gate
        ['main gate', [
            {x: 1281, y: 3089},
            {x: 1305, y: 3098},
            {x: 1306, y: 3140},
            {x: 1284, y: 3150},
            {x: 1256, y: 3141},
            {x: 1256, y: 3097}   
        ]],
        
        // Walk-in Gate
        ['walkin gate', [
            {x: 1684, y: 3175},
            {x: 1764, y: 3180},
            {x: 1765, y: 3201},
            {x: 1684, y: 3200}
        ]],
        
        // Back Gate
        ['back gate', [
            {x: 2113, y: 18},
            {x: 2157, y: 12},
            {x: 2150, y: 41},
            {x: 2117, y: 44}
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
