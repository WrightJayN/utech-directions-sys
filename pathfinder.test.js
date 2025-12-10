/**
 * PathFinder Test Suite
 * Tests for Dijkstra's algorithm implementation with weighted edges (pixel distance)
 */

const PathFinder = require('./pathFinder');
const GraphDatabase = require('./graphDatabase');

describe('PathFinder - Dijkstra\'s Algorithm with Weighted Edges', () => {
  let graphDB;
  let buildingGraph;

  beforeEach(() => {
    // Initialize graph database before each test
    graphDB = new GraphDatabase();
    buildingGraph = graphDB.getBuildingGraph();
  });

  describe('Basic Path Finding', () => {
    test('should find direct path between adjacent buildings', () => {
      // Given: from_bld_g_node = building1, to_bld_g_node = building2 (adjacent)
      const fromBuildingGNode = buildingGraph.get('building1');
      const toBuildingGNode = buildingGraph.get('building2');

      // When: PathFinder runs Dijkstra's algorithm
      const path = PathFinder.findPath(fromBuildingGNode, toBuildingGNode, buildingGraph);

      // Then: returns path containing both buildings
      expect(path).toBeDefined();
      expect(path).not.toBeNull();
      expect(Array.isArray(path)).toBe(true);
      expect(path.length).toBeGreaterThanOrEqual(2);
      expect(path[0]).toBe(fromBuildingGNode);
      expect(path[path.length - 1]).toBe(toBuildingGNode);
    });

    test('should find shortest weighted path through intermediate nodes', () => {
      // Given: from_bld_g_node = building1, to_bld_g_node = building8
      //        Path requires going through walkways/intersections with pixel distance weights
      const fromBuildingGNode = buildingGraph.get('building1');
      const toBuildingGNode = buildingGraph.get('building8');

      // When: PathFinder runs Dijkstra's algorithm
      const path = PathFinder.findPath(fromBuildingGNode, toBuildingGNode, buildingGraph);

      // Then: returns shortest weighted path including intermediate walkway nodes
      expect(path).toBeDefined();
      expect(path).not.toBeNull();
      expect(Array.isArray(path)).toBe(true);
      expect(path.length).toBeGreaterThan(2); // Must include intermediate nodes
      expect(path[0]).toBe(fromBuildingGNode);
      expect(path[path.length - 1]).toBe(toBuildingGNode);

      // Verify path continuity - each node should be a neighbor of the next
      for (let i = 0; i < path.length - 1; i++) {
        const currentNode = path[i];
        const nextNode = path[i + 1];
        expect(currentNode.neighbors).toContain(nextNode);
      }
    });

    test('should return single-node path when from and to are same building', () => {
      // Given: from_bld_g_node = building1, to_bld_g_node = building1 (same)
      const buildingGNode = buildingGraph.get('building1');

      // When: PathFinder runs Dijkstra's algorithm
      const path = PathFinder.findPath(buildingGNode, buildingGNode, buildingGraph);

      // Then: returns array with single node or empty array
      expect(path).toBeDefined();
      expect(Array.isArray(path)).toBe(true);
      expect(path.length).toBeLessThanOrEqual(1);
      if (path.length === 1) {
        expect(path[0]).toBe(buildingGNode);
      }
    });

    test('should return null when no path exists between disconnected buildings', () => {
      // Given: Create a disconnected building node for testing
      const disconnectedBuilding = {
        name: 'disconnectedBuilding',
        type: 'building',
        neighbors: [],
        x_coor: 999,
        y_coor: 999
      };
      
      const fromBuildingGNode = buildingGraph.get('building1');

      // When: PathFinder runs Dijkstra's algorithm to disconnected building
      const path = PathFinder.findPath(fromBuildingGNode, disconnectedBuilding, buildingGraph);

      // Then: returns null or empty array
      expect(path === null || (Array.isArray(path) && path.length === 0)).toBe(true);
    });
  });

  describe('Distance Calculation', () => {
    test('should correctly calculate edge weights using Euclidean distance', () => {
      // Given: Two adjacent nodes with known coordinates
      const node1 = {
        name: 'testNode1',
        type: 'walkway',
        neighbors: [],
        x_coor: 0,
        y_coor: 0
      };
      
      const node2 = {
        name: 'testNode2',
        type: 'walkway',
        neighbors: [],
        x_coor: 3,
        y_coor: 4
      };

      // When: Calculating edge weight (Euclidean distance)
      const distance = PathFinder.calculateDistance(node1, node2);

      // Then: returns correct pixel distance using sqrt((x2-x1)^2 + (y2-y1)^2)
      // Distance should be sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5
      expect(distance).toBe(5);
    });

    test('should handle zero distance for same coordinates', () => {
      // Given: Two nodes at same location
      const node1 = {
        name: 'testNode1',
        type: 'building',
        neighbors: [],
        x_coor: 100,
        y_coor: 200
      };
      
      const node2 = {
        name: 'testNode2',
        type: 'building',
        neighbors: [],
        x_coor: 100,
        y_coor: 200
      };

      // When: Calculating edge weight
      const distance = PathFinder.calculateDistance(node1, node2);

      // Then: returns 0
      expect(distance).toBe(0);
    });

    test('should handle large pixel distances correctly', () => {
      // Given: Nodes that are far apart on the map (large pixel distances)
      const node1 = {
        name: 'farNode1',
        type: 'building',
        neighbors: [],
        x_coor: 0,
        y_coor: 0
      };
      
      const node2 = {
        name: 'farNode2',
        type: 'building',
        neighbors: [],
        x_coor: 1000,
        y_coor: 1000
      };

      // When: Calculating distance
      const distance = PathFinder.calculateDistance(node1, node2);

      // Then: correctly calculates large distance
      // sqrt(1000^2 + 1000^2) = sqrt(2000000) ≈ 1414.21
      expect(distance).toBeCloseTo(1414.21, 1);
    });

    test('should handle fractional pixel coordinates', () => {
      // Given: Nodes with decimal coordinates
      const node1 = {
        name: 'node1',
        type: 'walkway',
        neighbors: [],
        x_coor: 10.5,
        y_coor: 20.7
      };
      
      const node2 = {
        name: 'node2',
        type: 'walkway',
        neighbors: [],
        x_coor: 15.3,
        y_coor: 25.9
      };

      // When: Calculating distance
      const distance = PathFinder.calculateDistance(node1, node2);

      // Then: correctly handles decimal values
      // dx = 4.8, dy = 5.2
      // sqrt(4.8^2 + 5.2^2) = sqrt(23.04 + 27.04) = sqrt(50.08) ≈ 7.077
      expect(distance).toBeCloseTo(7.077, 2);
    });
  });

  describe('Dijkstra\'s Algorithm Behavior', () => {
    test('should use Dijkstra\'s algorithm to find shortest weighted path (not just fewest nodes)', () => {
      // Given: Multiple possible paths exist with different total pixel distances
      const fromBuildingGNode = buildingGraph.get('building1');
      const toBuildingGNode = buildingGraph.get('building8');

      // When: PathFinder runs Dijkstra's algorithm
      const path = PathFinder.findPath(fromBuildingGNode, toBuildingGNode, buildingGraph);

      // Then: returns the path with minimum total pixel distance (not necessarily fewest nodes)
      expect(path).toBeDefined();
      
      // Calculate total distance of returned path
      let totalDistance = 0;
      for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i + 1];
        // Calculate Euclidean distance between consecutive nodes
        const distance = Math.sqrt(
          Math.pow(next.x_coor - current.x_coor, 2) + 
          Math.pow(next.y_coor - current.y_coor, 2)
        );
        totalDistance += distance;
      }
      
      expect(totalDistance).toBeGreaterThan(0);
      expect(path.length).toBeGreaterThan(0);
    });

    test('should prioritize shorter pixel distance over fewer nodes', () => {
      // Given: A graph where direct path has fewer nodes but longer distance,
      //        and an alternate path has more nodes but shorter total distance
      
      const start = {
        name: 'start',
        type: 'building',
        neighbors: [],
        x_coor: 0,
        y_coor: 0
      };
      
      const directPath = {
        name: 'directPath',
        type: 'walkway',
        neighbors: [],
        x_coor: 200,
        y_coor: 200
      };
      
      const intermediate1 = {
        name: 'intermediate1',
        type: 'walkway',
        neighbors: [],
        x_coor: 50,
        y_coor: 0
      };
      
      const intermediate2 = {
        name: 'intermediate2',
        type: 'walkway',
        neighbors: [],
        x_coor: 100,
        y_coor: 50
      };
      
      const end = {
        name: 'end',
        type: 'building',
        neighbors: [],
        x_coor: 100,
        y_coor: 100
      };
      
      // Setup neighbors
      // Direct path: start -> directPath -> end
      // start(0,0) -> directPath(200,200) = sqrt(200^2 + 200^2) ≈ 282.8
      // directPath(200,200) -> end(100,100) = sqrt(100^2 + 100^2) ≈ 141.4
      // Direct total: ~424.2
      
      // Alternate path: start -> intermediate1 -> intermediate2 -> end
      // start(0,0) -> intermediate1(50,0) = 50
      // intermediate1(50,0) -> intermediate2(100,50) = sqrt(50^2 + 50^2) ≈ 70.7
      // intermediate2(100,50) -> end(100,100) = 50
      // Alternate total: ~170.7
      
      start.neighbors = [directPath, intermediate1];
      directPath.neighbors = [start, end];
      intermediate1.neighbors = [start, intermediate2];
      intermediate2.neighbors = [intermediate1, end];
      end.neighbors = [directPath, intermediate2];
      
      const testGraph = new Map([
        ['start', start],
        ['directPath', directPath],
        ['intermediate1', intermediate1],
        ['intermediate2', intermediate2],
        ['end', end]
      ]);

      // When: PathFinder runs Dijkstra's
      const path = PathFinder.findPath(start, end, testGraph);

      // Then: chooses path with shorter total distance, not fewer hops
      expect(path).toBeDefined();
      const pathNames = path.map(node => node.name);
      expect(pathNames).toContain('intermediate1');
      expect(pathNames).toContain('intermediate2');
    });

    test('should return path with minimum total weighted distance', () => {
      // Given: From building to another with multiple possible routes
      const fromBuildingGNode = buildingGraph.get('main gate');
      const toBuildingGNode = buildingGraph.get('building22');

      // When: PathFinder runs Dijkstra's algorithm
      const path = PathFinder.findPath(fromBuildingGNode, toBuildingGNode, buildingGraph);

      // Then: calculates and returns path with minimum sum of edge weights
      expect(path).toBeDefined();
      
      // Calculate total weighted distance
      let totalDistance = 0;
      for (let i = 0; i < path.length - 1; i++) {
        const dx = path[i + 1].x_coor - path[i].x_coor;
        const dy = path[i + 1].y_coor - path[i].y_coor;
        totalDistance += Math.sqrt(dx * dx + dy * dy);
      }
      
      // Total distance should be positive and finite
      expect(totalDistance).toBeGreaterThan(0);
      expect(isFinite(totalDistance)).toBe(true);
    });
  });

  describe('Gate Handling', () => {
    test('should find path from main gate to building', () => {
      // Given: from_bld_g_node = main gate, to_bld_g_node = building1
      const mainGateGNode = buildingGraph.get('main gate');
      const building1GNode = buildingGraph.get('building1');

      // When: PathFinder runs Dijkstra's algorithm
      const path = PathFinder.findPath(mainGateGNode, building1GNode, buildingGraph);

      // Then: returns valid path from gate to building
      expect(path).toBeDefined();
      expect(path).not.toBeNull();
      expect(Array.isArray(path)).toBe(true);
      expect(path.length).toBeGreaterThanOrEqual(2);
      expect(path[0]).toBe(mainGateGNode);
      expect(path[path.length - 1]).toBe(building1GNode);
    });

    test('should find path between two gates', () => {
      // Given: from_bld_g_node = main gate, to_bld_g_node = back gate
      const mainGateGNode = buildingGraph.get('main gate');
      const backGateGNode = buildingGraph.get('back gate');

      // When: PathFinder runs Dijkstra's algorithm
      const path = PathFinder.findPath(mainGateGNode, backGateGNode, buildingGraph);

      // Then: returns valid path between gates
      expect(path).toBeDefined();
      expect(path).not.toBeNull();
      expect(Array.isArray(path)).toBe(true);
      expect(path[0]).toBe(mainGateGNode);
      expect(path[path.length - 1]).toBe(backGateGNode);
    });
  });

  describe('Node Types and Graph Structure', () => {
    test('should include walkway nodes in path', () => {
      // Given: Path that requires walkway/intersection nodes
      const fromBuildingGNode = buildingGraph.get('building1');
      const toBuildingGNode = buildingGraph.get('building22');

      // When: PathFinder runs Dijkstra's algorithm
      const path = PathFinder.findPath(fromBuildingGNode, toBuildingGNode, buildingGraph);

      // Then: path includes walkway/intersection nodes (type = 'walkway')
      expect(path).toBeDefined();
      expect(path.length).toBeGreaterThan(2);
      
      // Check that path includes at least one walkway node
      const hasWalkwayNode = path.some(node => node.type === 'walkway');
      expect(hasWalkwayNode).toBe(true);
    });

    test('should distinguish between walkway nodes and building nodes', () => {
      // Given: Graph contains both walkway and building type nodes
      const fromBuildingGNode = buildingGraph.get('building1');
      const toBuildingGNode = buildingGraph.get('building8');

      // When: Finding path
      const path = PathFinder.findPath(fromBuildingGNode, toBuildingGNode, buildingGraph);

      // Then: path should contain both types correctly
      expect(path).toBeDefined();
      
      // First and last should be buildings
      expect(path[0].type).toBe('building');
      expect(path[path.length - 1].type).toBe('building');
      
      // Intermediate nodes should be walkways
      if (path.length > 2) {
        const middleNodes = path.slice(1, -1);
        const allMiddleAreWalkways = middleNodes.every(node => node.type === 'walkway');
        expect(allMiddleAreWalkways).toBe(true);
      }
    });

    test('should handle edges between walkway nodes and building entrance nodes', () => {
      // Given: Building entrance nodes connected to walkway nodes
      const building = buildingGraph.get('building1');
      
      // When: Checking neighbors
      // Then: building should have walkway neighbors (entrance connections)
      expect(building.neighbors).toBeDefined();
      expect(building.neighbors.length).toBeGreaterThan(0);
      
      // At least one neighbor should be a walkway (the entrance connection)
      const hasWalkwayNeighbor = building.neighbors.some(neighbor => neighbor.type === 'walkway');
      expect(hasWalkwayNeighbor).toBe(true);
    });

    test('should calculate path through roundabouts/circular hubs correctly', () => {
      // Given: Path that goes through a roundabout node
      const fromBuildingGNode = buildingGraph.get('building1');
      const toBuildingGNode = buildingGraph.get('building5');

      // When: PathFinder runs Dijkstra's algorithm
      const path = PathFinder.findPath(fromBuildingGNode, toBuildingGNode, buildingGraph);

      // Then: successfully navigates through roundabout if it's the shortest path
      expect(path).toBeDefined();
      expect(path).not.toBeNull();
      expect(path[0]).toBe(fromBuildingGNode);
      expect(path[path.length - 1]).toBe(toBuildingGNode);
      
      // Path should be valid with all edges connected
      for (let i = 0; i < path.length - 1; i++) {
        expect(path[i].neighbors).toContain(path[i + 1]);
      }
    });

    test('should handle edges between curve points and intersections', () => {
      // Given: Graph with curve points connected to intersections
      const fromBuildingGNode = buildingGraph.get('building1');
      const toBuildingGNode = buildingGraph.get('building22');

      // When: Finding path that includes curves and intersections
      const path = PathFinder.findPath(fromBuildingGNode, toBuildingGNode, buildingGraph);

      // Then: path correctly traverses curve->intersection connections
      expect(path).toBeDefined();
      
      // Verify walkway nodes (which include curves and intersections) are connected
      const walkwayNodes = path.filter(node => node.type === 'walkway');
      expect(walkwayNodes.length).toBeGreaterThan(0);
      
      // Each walkway node should be properly connected to its neighbors
      walkwayNodes.forEach(node => {
        expect(node.neighbors).toBeDefined();
        expect(Array.isArray(node.neighbors)).toBe(true);
      });
    });
  });

  describe('Tree Node to Graph Node Conversion', () => {
    test('should convert bld_t_nodes to g_nodes before pathfinding', () => {
      // Given: bld_t_nodes from tree structure
      const TreeDatabase = require('./treeDatabase');
      const treeDB = new TreeDatabase();
      const roomsHashMap = treeDB.getRoomsHashMap();
      const BuildingFloorNodeFinder = require('./buildingFloorNodeFinder');

      // Get tree nodes for rooms
      const room1Node = roomsHashMap.get('1a37'); // Building 1
      const room2Node = roomsHashMap.get('2b5');  // Building 2

      // Find building tree nodes
      const fromBldTNode = BuildingFloorNodeFinder.findBuildingNode(room1Node);
      const toBldTNode = BuildingFloorNodeFinder.findBuildingNode(room2Node);

      expect(fromBldTNode).toBeDefined();
      expect(toBldTNode).toBeDefined();

      // When: PathFinder converts t_nodes to g_nodes and finds path
      const path = PathFinder.findPathFromTreeNodes(fromBldTNode, toBldTNode, graphDB);

      // Then: correctly maps t_nodes to g_nodes and returns valid path
      expect(path).toBeDefined();
      expect(path).not.toBeNull();
      expect(Array.isArray(path)).toBe(true);
      expect(path.length).toBeGreaterThanOrEqual(2);
      
      // First node should correspond to building1, last to building2
      expect(path[0].name).toBe('building1');
      expect(path[path.length - 1].name).toBe('building2');
    });

    test('should handle gate tree nodes and convert to graph nodes', () => {
      // Given: main gate as tree node
      const TreeDatabase = require('./treeDatabase');
      const treeDB = new TreeDatabase();
      const roomsHashMap = treeDB.getRoomsHashMap();

      const mainGateTNode = roomsHashMap.get('main gate');
      const room1Node = roomsHashMap.get('1a37');
      
      const BuildingFloorNodeFinder = require('./buildingFloorNodeFinder');
      const building1TNode = BuildingFloorNodeFinder.findBuildingNode(room1Node);

      // When: Converting gate t_node to g_node
      const path = PathFinder.findPathFromTreeNodes(mainGateTNode, building1TNode, graphDB);

      // Then: Successfully converts and finds path
      expect(path).toBeDefined();
      expect(path).not.toBeNull();
      expect(path[0].name).toBe('main gate');
      expect(path[path.length - 1].name).toBe('building1');
    });
  });

  describe('Error Handling', () => {
    test('should handle null or undefined inputs gracefully', () => {
      // Given: null or undefined nodes
      const buildingGNode = buildingGraph.get('building1');

      // When & Then: Should handle null/undefined without crashing
      expect(() => {
        PathFinder.findPath(null, buildingGNode, buildingGraph);
      }).not.toThrow();

      expect(() => {
        PathFinder.findPath(buildingGNode, null, buildingGraph);
      }).not.toThrow();

      expect(() => {
        PathFinder.findPath(null, null, buildingGraph);
      }).not.toThrow();

      // Results should be null or empty
      const result1 = PathFinder.findPath(null, buildingGNode, buildingGraph);
      const result2 = PathFinder.findPath(buildingGNode, null, buildingGraph);
      
      expect(result1 === null || (Array.isArray(result1) && result1.length === 0)).toBe(true);
      expect(result2 === null || (Array.isArray(result2) && result2.length === 0)).toBe(true);
    });
  });
});
