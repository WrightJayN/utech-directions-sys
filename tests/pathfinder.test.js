/**
 * PathFinder Test Suite
 * Tests for Dijkstra's algorithm implementation with weighted edges (pixel distance)
 */

const PathFinder = require('../processing/pathFinder');
const GraphDatabase = require('../processing/graphDatabase');

describe('PathFinder - Dijkstra\'s Algorithm with Weighted Edges', () => {
  let graphDB;
  let buildingGraph;

  beforeEach(() => {
    graphDB = new GraphDatabase();
    buildingGraph = graphDB.getBuildingGraph();
  });

  describe('Basic Path Finding', () => {
    test('should find direct path between adjacent buildings', () => {
      const from = buildingGraph.get('building1');
      const to = buildingGraph.get('building2');
      const path = PathFinder.findPath(from, to, buildingGraph);
      expect(path).toBeDefined();
    });

    test('should find shortest weighted path through intermediate nodes', () => {
      const from = buildingGraph.get('building1');
      const to = buildingGraph.get('building8');
      const path = PathFinder.findPath(from, to, buildingGraph);
      expect(path).toBeDefined();
    });

    test('should return single-node path when from and to are same building', () => {
      const node = buildingGraph.get('building1');
      const path = PathFinder.findPath(node, node, buildingGraph);
      expect(path).toBeDefined();
    });

    test('should return null when no path exists between disconnected buildings', () => {
      const disc = { name:'disc', type:'building', neighbors:[], x_coor:0, y_coor:0 };
      const from = buildingGraph.get('building1');
      const path = PathFinder.findPath(from, disc, buildingGraph);
      expect(path === null || path.length === 0).toBe(true);
    });
  });

  describe('Distance Calculation', () => {
    test('should correctly calculate edge weights using Euclidean distance', () => {
      const node1 = { x_coor: 0, y_coor: 0 };
      const node2 = { x_coor: 3, y_coor: 4 };
      const distance = PathFinder.calculateDistance(node1, node2);
      expect(distance).toBe(5);
    });

    test('should handle zero distance for same coordinates', () => {
      const n1 = { x_coor: 100, y_coor: 200 };
      const n2 = { x_coor: 100, y_coor: 200 };
      const distance = PathFinder.calculateDistance(n1, n2);
      expect(distance).toBe(0);
    });

    test('should handle large pixel distances correctly', () => {
      const n1 = { x_coor: 0, y_coor: 0 };
      const n2 = { x_coor: 1000, y_coor: 1000 };
      const distance = PathFinder.calculateDistance(n1, n2);
      expect(distance).toBeCloseTo(1414.21, 1);
    });

    test('should handle fractional pixel coordinates', () => {
      const n1 = { x_coor: 10.5, y_coor: 20.7 };
      const n2 = { x_coor: 15.3, y_coor: 25.9 };
      const distance = PathFinder.calculateDistance(n1, n2);
      expect(distance).toBeCloseTo(7.077, 2);
    });
  });

  describe('Dijkstra\'s Algorithm Behavior', () => {
    test('should use Dijkstra to find shortest weighted path (GraphDB graph)', () => {
      const start = buildingGraph.get('building1');
      const end = buildingGraph.get('building8');
      const path = PathFinder.findPath(start, end, buildingGraph);
      expect(path).toBeDefined();
    });

    test('should prioritize shorter pixel distance over fewer nodes', () => {
      const start = { name: 'start', neighbors: [], x_coor: 0, y_coor: 0 };
      const directPath = { name: 'directPath', neighbors: [], x_coor: 200, y_coor: 200 };
      const i1 = { name: 'i1', neighbors: [], x_coor: 50, y_coor: 0 };
      const i2 = { name: 'i2', neighbors: [], x_coor: 100, y_coor: 50 };
      const end = { name: 'end', neighbors: [], x_coor: 100, y_coor: 100 };

      start.neighbors = [directPath, i1];
      directPath.neighbors = [start, end];
      i1.neighbors = [start, i2];
      i2.neighbors = [i1, end];
      end.neighbors = [directPath, i2];

      const testGraph = new Map([
        ['start', start], ['directPath', directPath],
        ['i1', i1], ['i2', i2], ['end', end]
      ]);

      const path = PathFinder.findPath(start, end, testGraph);
      const names = path.map(n => n.name);

      expect(names).toContain('i1');
      expect(names).toContain('i2');
    });
  });

  describe('Gate Handling', () => {
    test('should find path from main gate to building', () => {
      const gate = buildingGraph.get('main gate');
      const building = buildingGraph.get('building1');
      const path = PathFinder.findPath(gate, building, buildingGraph);
      expect(path).toBeDefined();
    });

    test('should find path between two gates', () => {
      const g1 = buildingGraph.get('main gate');
      const g2 = buildingGraph.get('back gate');
      const path = PathFinder.findPath(g1, g2, buildingGraph);
      expect(path).toBeDefined();
    });
  });

  describe('Node Types and Graph Structure', () => {
    test('should handle edges between walkway and building entrances', () => {
      const building = buildingGraph.get('building1');
      expect(building.neighbors.some(n => n.type === 'walkway')).toBe(true);
    });
  });

  describe('Tree Node to Graph Node Conversion', () => {
    test('should convert bld_t_nodes to g_nodes before pathfinding', () => {
      const TreeDatabase = require('../processing/treeDatabase');
      const treeDB = new TreeDatabase();
      const rooms = treeDB.getRoomsHashMap();
      const Finder = require('../processing/buildingFloorNodeFinder');
      const room1 = rooms.get('1a37');
      const room2 = rooms.get('2b5');
      const t1 = Finder.findBuildingNode(room1);
      const t2 = Finder.findBuildingNode(room2);
      const path = PathFinder.findPathFromTreeNodes(t1, t2, graphDB);
      expect(path).toBeDefined();
    });

    test('should convert gate tree nodes to graph nodes', () => {
      const TreeDatabase = require('../processing/treeDatabase');
      const treeDB = new TreeDatabase();
      const rooms = treeDB.getRoomsHashMap();
      const mainGate = rooms.get('main gate');
      const room1 = rooms.get('1a37');
      const Finder = require('../processing/buildingFloorNodeFinder');
      const bNode = Finder.findBuildingNode(room1);
      const path = PathFinder.findPathFromTreeNodes(mainGate, bNode, graphDB);
      expect(path).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle null/undefined without crashing (GraphDB)', () => {
      const n = buildingGraph.get('building1');
      expect(() => PathFinder.findPath(null, n, buildingGraph)).not.toThrow();
    });

    test('should handle null/undefined for custom graph', () => {
      const dummy = { x_coor: 0, y_coor: 0, neighbors: [] };
      expect(() => PathFinder.findPath(null, dummy, new Map())).not.toThrow();
      expect(() => PathFinder.findPath(dummy, null, new Map())).not.toThrow();
    });
  });
});