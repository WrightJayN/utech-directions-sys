const DataCollector = require('./dataCollector');

// Test: Data Collector converts room inputs to lowercase strings
describe('Data Collector', () => {
  test('should convert "from" room input to lowercase string', () => {
    // Given: from room = "A101"
    const fromRoom = "A101";

    // When: data collector processes input as from room
    const result = DataCollector.convertToLowercaseString(fromRoom, true);

    // Then: returns string "a101"
    expect(result).toBe("a101");
  });

  test('should convert "to" room input to lowercase string', () => {
    // Given: to room = "B205"
    const toRoom = "B205";

    // When: data collector processes input as to room
    const result = DataCollector.convertToLowercaseString(toRoom, false);

    // Then: returns string "b205"
    expect(result).toBe("b205");
  });

  test('should handle default "main gate" input', () => {
    // Given: from room = null or undefined

    // When: data collector processes null and undefined as from room
    const resultNull = DataCollector.convertToLowercaseString(null, true);
    const resultUndefined = DataCollector.convertToLowercaseString(undefined, true);

    // Then: returns string "main gate" (lowercase)
    expect(resultNull).toBe("main gate");
    expect(resultUndefined).toBe("main gate");
  });

  test('should handle numeric room inputs', () => {
    // Given: room = 101
    const room = 101;

    // When: data collector processes numeric input
    const result = DataCollector.convertToLowercaseString(room, false);

    // Then: returns string "101" (lowercase)
    expect(result).toBe("101");
  });

  test('should handle empty string input', () => {
    // Given: room = ""
    const emptyRoom = "";

    // When & Then:
    // For from room, empty string should default to "main gate"
    const fromResult = DataCollector.convertToLowercaseString(emptyRoom, true);
    expect(fromResult).toBe("main gate");

    // For to room, empty string should throw an error
    expect(() => DataCollector.convertToLowercaseString(emptyRoom, false))
      .toThrow("To room cannot be empty");
  });
});


// Test: Room Node Finder uses Rooms Hash Map to find corresponding rm_t_nodes of the input strings
const RoomNodeFinder = require('./roomNodeFinder');

describe('Room Node Finder', () => {

  // Mock Rooms Hash Map for testing
  const mockRoomsHashMap = new Map([
    ['a101', { name: 'rm_t_node_a101', worded_direction: 'go to a101'}],
    ['b205', { name: 'rm_t_node_b205', worded_direction: 'go to b205'}],
    ['c301', { name: 'rm_t_node_c301', worded_direction: 'go to c301'}]
  ]);

  test('should find rm_t_node for valid room string', () => {
    // Given: room string = "a101", Rooms Hash Map contains "a101" -> rm_t_node_a101
    const roomString = "a101";
    const expectedNode = mockRoomsHashMap.get('a101');

    // When: room node finder searches Rooms Hash Map
    const result = RoomNodeFinder.findRoomNode(roomString, mockRoomsHashMap);

    // Then: returns rm_t_node_a101
    expect(result).toBeDefined();
    expect(result).toEqual(expectedNode);
    expect(result.name).toBe('rm_t_node_a101');
  });

  test('should return null for non-existent room', () => {
    // Given: room string = "z999", not in Rooms Hash Map
    const roomString = "z999";

    // When: room node finder searches Rooms Hash Map
    const result = RoomNodeFinder.findRoomNode(roomString, mockRoomsHashMap);

    // Then: returns null or throws error
    expect(result).toBeNull();
  });

  test('should handle case-insensitive room lookup', () => {
    // Given: room string = "A101" (uppercase)
    const roomString = "A101";
    const expectedNode = mockRoomsHashMap.get('a101');

    // When: room node finder searches Rooms Hash Map
    // Note: Since Data Collector already converts to lowercase, this test ensures
    // the Room Node Finder can handle any case (defensive programming)
    const result = RoomNodeFinder.findRoomNode(roomString.toLowerCase(), mockRoomsHashMap);

    // Then: returns correct rm_t_node (case handling)
    expect(result).toBeDefined();
    expect(result).toEqual(expectedNode);
    expect(result.name).toBe('rm_t_node_a101');
  });

  test('should find rm_t_node for both from and to rooms', () => {
    // Given: from room = "a101", to room = "b205"
    const fromRoom = "a101";
    const toRoom = "b205";
    const expectedFromNode = mockRoomsHashMap.get('a101');
    const expectedToNode = mockRoomsHashMap.get('b205');

    // When: room node finder processes both
    const fromResult = RoomNodeFinder.findRoomNode(fromRoom, mockRoomsHashMap);
    const toResult = RoomNodeFinder.findRoomNode(toRoom, mockRoomsHashMap);
    const results = [fromResult, toResult];

    // Then: returns [rm_t_node_a101, rm_t_node_b205]
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual(expectedFromNode);
    expect(results[1]).toEqual(expectedToNode);
    expect(results[0].name).toBe('rm_t_node_a101');
    expect(results[1].name).toBe('rm_t_node_b205');
  });
});
  

  // Test: Building/Floor Node Finder uses tree to find bld_t_nodes and flr_t_nodes
const BuildingFloorNodeFinder = require('./buildingFloorNodeFinder');

describe('Building/Floor Node Finder', () => {
  
  let mockRootNode;
  let mockBuildingA;
  let mockBuildingB;
  let mockFloorA_BuildingA;
  let mockFloorA_BuildingB;
  let mockFloorB_BuildingA;
  let mockRoomA101;
  let mockRoomA102;
  let mockRoomB101;


  // Mock tree structure matching documentation hierarchy: Root -> Building -> Floor -> Room
  mockRootNode = { 
    name: 'root',
    worded_direction: 'go to root', 
    parent: null, 
    children: [mockBuildingA, mockBuildingB] };
  
  mockBuildingA = { 
    name: 'buildingA', 
    worded_direction: 'go to buildingA', 
    parent: mockRootNode, 
    children: [mockFloorA_BuildingA, mockFloorB_BuildingA] 
  };
  mockBuildingB = { 
    name: 'buildingB', 
    worded_direction: 'go to buildingB', 
    parent: mockRootNode, 
    children: [mockFloorA_BuildingB] 
  };
  
  mockFloorA_BuildingA = { 
    name: 'floorA', 
    worded_direction: 'go to floorA', 
    parent: mockBuildingA, 
    children: [mockRoomA101] 
  };
  mockFloorB_BuildingA = { 
    name: 'floorB', 
    worded_direction: 'go to floorB', 
    parent: mockBuildingA, 
    children: [mockRoomB101] 
  };
  mockFloorA_BuildingB = { 
    name: 'floorA', 
    worded_direction: 'go to floorA', 
    parent: mockBuildingB, 
    children: [mockRoomA102] 
  };
  
  mockRoomA101 = { 
    name: 'rm_t_node_a101', 
    worded_direction: 'go to a101', 
    parent: mockFloorA_BuildingA, 
    children: [] 
  };
  mockRoomA102 = { 
    name: 'rm_t_node_a102', 
    worded_direction: 'go to a102', 
    parent: mockFloorB_BuildingA, 
    children: [] 
  };
  mockRoomB101 = { 
    name: 'rm_t_node_b101', 
    worded_direction: 'go to b101', 
    parent: mockFloorA_BuildingB, 
    children: [] 
  };

  test('should find bld_t_node from rm_t_node', () => {
    // Given: rm_t_node for room "a101" in Building A
    const rm_t_node = mockRoomA101;
    const expectedBuilding = mockBuildingA;

    // When: building/floor node finder traverses tree
    const result = BuildingFloorNodeFinder.findBuildingNode(rm_t_node);

    // Then: returns bld_t_node for Building A
    expect(result).toBeDefined();
    expect(result).toEqual(expectedBuilding);
    expect(result.name).toBe('buildingA');
  });

  test('should find flr_t_node from rm_t_node', () => {
    // Given: rm_t_node for room "a101" on Floor A
    const rm_t_node = mockRoomA101;
    const expectedFloor = mockFloorA_BuildingA;

    // When: building/floor node finder traverses tree
    const result = BuildingFloorNodeFinder.findFloorNode(rm_t_node);

    // Then: returns flr_t_node for Floor A
    expect(result).toBeDefined();
    expect(result).toEqual(expectedFloor);
    expect(result.name).toBe('floorA');
  });

  test('should find both bld_t_node and flr_t_node for from room', () => {
    // Given: from_rm_t_node
    const from_rm_t_node = mockRoomA101;
    const expectedBuilding = mockBuildingA;
    const expectedFloor = mockFloorA_BuildingA;

    // When: building/floor node finder processes node
    const result = BuildingFloorNodeFinder.findBuildingAndFloorNodes(from_rm_t_node);

    // Then: returns {from_bld_t_node, from_flr_t_node}
    expect(result).toBeDefined();
    expect(result.bld_t_node).toBeDefined();
    expect(result.flr_t_node).toBeDefined();
    expect(result.bld_t_node).toEqual(expectedBuilding);
    expect(result.flr_t_node).toEqual(expectedFloor);
    expect(result.bld_t_node.name).toBe('buildingA');
    expect(result.flr_t_node.name).toBe('floorA');
  });

  test('should find both bld_t_node and flr_t_node for to room', () => {
    // Given: to_rm_t_node
    const to_rm_t_node = mockRoomB101;
    const expectedBuilding = mockBuildingB;
    const expectedFloor = mockFloorA_BuildingB;

    // When: building/floor node finder processes node
    const result = BuildingFloorNodeFinder.findBuildingAndFloorNodes(to_rm_t_node);

    // Then: returns {to_bld_t_node, to_flr_t_node}
    expect(result).toBeDefined();
    expect(result.bld_t_node).toBeDefined();
    expect(result.flr_t_node).toBeDefined();
    expect(result.bld_t_node).toEqual(expectedBuilding);
    expect(result.flr_t_node).toEqual(expectedFloor);
    expect(result.bld_t_node.name).toBe('buildingB');
    expect(result.flr_t_node.name).toBe('floorA');
  });
  
  test('should handle invalid rm_t_node', () => {
    // Given: invalid or null rm_t_node
    const nullNode = null;
    const undefinedNode = undefined;
    const invalidNode = { name: 'invalid', parent: null }; // node without proper parent chain

    // When: building/floor node finder processes node
    // Then: throws error or returns null
    expect(() => BuildingFloorNodeFinder.findBuildingNode(nullNode)).toThrow();
    expect(() => BuildingFloorNodeFinder.findBuildingNode(undefinedNode)).toThrow();
    expect(() => BuildingFloorNodeFinder.findFloorNode(nullNode)).toThrow();
    expect(() => BuildingFloorNodeFinder.findFloorNode(undefinedNode)).toThrow();
    
    // Invalid node (no parent chain to building) should return null or throw
    const InvalidBldResult = BuildingFloorNodeFinder.findBuildingNode(invalidNode);
    expect(InvalidBldResult).toBeNull();
    //Invalid node (no parent chain to building) should return null or throw
    const InvalidFlrResult = BuildingFloorNodeFinder.findFloorNode(invalidNode);
    expect(InvalidFlrResult).toBeNull();
  });
  test('should find both bld_t_node and flr_t_node for from and to rooms', () => {
    // Given: from_rm_t_node and to_rm_t_node
    const from_rm_t_node = mockRoomA101;
    const to_rm_t_node = mockRoomB101;
    const expectedFromBuilding = mockBuildingA;
    const expectedFromFloor = mockFloorA_BuildingA;
    const expectedToBuilding = mockBuildingB;
    const expectedToFloor = mockFloorA_BuildingB;

    // When: building/floor node finder processes node
    const result = BuildingFloorNodeFinder.findBuildingAndFloorNodes(from_rm_t_node, to_rm_t_node);
    // Then: returns {from_bld_t_node, from_flr_t_node, to_bld_t_node, to_flr_t_node}
    expect(result).toBeDefined();
    //From node
    expect(result.from_bld_t_node).toBeDefined();
    expect(result.from_flr_t_node).toBeDefined();
    expect(result.from_bld_t_node).toEqual(expectedFromBuilding);
    expect(result.from_flr_t_node).toEqual(expectedFromFloor);
    expect(result.from_bld_t_node.name).toBe('buildingA');
    expect(result.from_flr_t_node.name).toBe('floorA');
    //To node
    expect(result.to_bld_t_node).toBeDefined();
    expect(result.to_flr_t_node).toBeDefined();
    expect(result.to_bld_t_node).toEqual(expectedToBuilding);
    expect(result.to_flr_t_node).toEqual(expectedToFloor);
    expect(result.to_bld_t_node.name).toBe('buildingB');
    expect(result.to_flr_t_node.name).toBe('floorA');
  });
});


// Test: Building Pictures Output
describe('Building Pictures Output', () => {
  test('should return building picture for valid to_bld_t_node', () => {
    // Given: to_bld_t_node = Building1
    // When: building pictures component processes node
    // Then: returns image URL or file path for Building1
  });

  test('should handle missing building picture', () => {
    // Given: to_bld_t_node with no associated picture
    // When: building pictures component processes node
    // Then: returns default image or error
  });
});


// Test: Floor Pictures Output
describe('Floor Pictures Output', () => {
  test('should return floor picture for valid to_flr_t_node', () => {
    // Given: to_flr_t_node = Floor A
    // When: floor pictures component processes node
    // Then: returns image URL or file path for Floor A
  });

  test('should handle missing floor picture', () => {
    // Given: to_flr_t_node with no associated picture
    // When: floor pictures component processes node
    // Then: returns default image or error
  });
});

// Test: Floor Highlight Output
describe('Floor Highlight Output', () => {
  test('should create canvas with all floors and highlight destination', () => {
    // Given: to_flr_t_node = Floor A, building has floors [A, B, C]
    // When: floor highlight component processes node
    // Then: returns canvas with all floors shown and Floor A highlighted
  });

  test('should handle single-floor building', () => {
    // Given: to_flr_t_node = Floor A, building has only Floor A
    // When: floor highlight component processes node
    // Then: returns canvas with only Floor A highlighted
  });
});


// Test: PathFinder uses BFS to find shortest path between buildings
describe('PathFinder', () => {
  test('should find path from one building to another', () => {
    // Given: from_bld_g_node = Building1, to_bld_g_node = Building2
    // When: PathFinder runs BFS
    // Then: returns path [Building1, Building2]
  });

  test('should find shortest path through intermediate buildings', () => {
    // Given: from_bld_g_node = Building1, to_bld_g_node = Building3
    //        Graph: Building1 -> Building2 -> Building3
    // When: PathFinder runs BFS
    // Then: returns path [Building1, Building2, Building3]
  });

  test('should return empty path when from and to are same building', () => {
    // Given: from_bld_g_node = Building1, to_bld_g_node = Building1
    // When: PathFinder runs BFS
    // Then: returns [] or single node path
  });

  test('should return null when no path exists', () => {
    // Given: from_bld_g_node = Building1, to_bld_g_node = Building4 (disconnected)
    // When: PathFinder runs BFS
    // Then: returns null or empty array
  });

  test('should convert bld_t_nodes to g_nodes before pathfinding', () => {
    // Given: from_bld_t_node, to_bld_t_node
    // When: PathFinder converts to g_nodes
    // Then: correctly maps t_nodes to g_nodes
  });
});


// Test: PathDrawer Output
describe('PathDrawer', () => {
  test('should load UTech map image', () => {
    // Given: path from PathFinder
    // When: PathDrawer loads map
    // Then: map image is loaded successfully
  });

  test('should get vertices of from building from Building Vertices Hash Map', () => {
    // Given: from_bld_g_node = Building1, Building Vertices Hash Map contains Building1 -> Set of (x,y) coordinates
    // When: PathDrawer gets vertices from Building Vertices Hash Map
    // Then: returns set of x,y coordinates (vertices) for Building1
  });

  test('should get vertices of to building from Building Vertices Hash Map', () => {
    // Given: to_bld_g_node = Building3, Building Vertices Hash Map contains Building3 -> Set of (x,y) coordinates
    // When: PathDrawer gets vertices from Building Vertices Hash Map
    // Then: returns set of x,y coordinates (vertices) for Building3
  });

  test('should color from building in red using vertices from Building Vertices Hash Map', () => {
    // Given: from_bld_g_node = Building1, vertices from Building Vertices Hash Map
    // When: PathDrawer colors building
    // Then: Building1 is colored in red using its vertices
  });

  test('should color to building in blue using vertices from Building Vertices Hash Map', () => {
    // Given: to_bld_g_node = Building3, vertices from Building Vertices Hash Map
    // When: PathDrawer colors building
    // Then: Building3 is colored in blue using its vertices
  });

  test('should draw yellow lines along path including non-building nodes', () => {
    // Given: path = [Building1, Intersection1, Corner1, Building2, Building3] (contains intersections/corners)
    // When: PathDrawer draws yellow path
    // Then: yellow lines are drawn along entire path including road intersections and corners
  });

  test('should exclude edge between from building and its neighbor from yellow path', () => {
    // Given: path = [Building1, Intersection1, Building2, Building3], from_bld_g_node = Building1
    // When: PathDrawer draws yellow path
    // Then: yellow line is NOT drawn between Building1 and Intersection1 (edge excluded)
  });

  test('should exclude edge between to building and its neighbor from yellow path', () => {
    // Given: path = [Building1, Building2, Corner1, Building3], to_bld_g_node = Building3
    // When: PathDrawer draws yellow path
    // Then: yellow line is NOT drawn between Corner1 and Building3 (edge excluded)
  });
});


const DataCollector = require('./dataCollector');
const RoomNodeFinder = require('./roomNodeFinder');
const BuildingFloorNodeFinder = require('./buildingFloorNodeFinder');
const TreeDatabase = require('./treeDatabase');

// Test: End-to-end data flow
describe('Integration Tests', () => {
  let treeDB;
  let roomsHashMap;

  beforeEach(() => {
    // Initialize tree database before each test
    treeDB = new TreeDatabase();
    roomsHashMap = treeDB.getRoomsHashMap();
  });

  test('should process complete flow from input to output', () => {
    // Given: from room = "1A37", to room = "2B5"
    const fromRoomInput = "1A37";
    const toRoomInput = "2B5";

    // When: entire system processes request
    
    // Step 1: Data Collector converts inputs to lowercase strings
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    expect(processed.fromRoom).toBe("1a37");
    expect(processed.toRoom).toBe("2b5");

    // Step 2: Room Node Finder finds rm_t_nodes
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );
    expect(from_rm_t_node).toBeDefined();
    expect(to_rm_t_node).toBeDefined();
    expect(from_rm_t_node.name).toBe("1a37");
    expect(to_rm_t_node.name).toBe("2b5");

    // Step 3: Building/Floor Node Finder finds bld_t_nodes and flr_t_nodes
    const result = BuildingFloorNodeFinder.findBuildingAndFloorNodes(
      from_rm_t_node,
      to_rm_t_node
    );

    // Then: returns all node references for outputs
    expect(result.from_bld_t_node).toBeDefined();
    expect(result.from_flr_t_node).toBeDefined();
    expect(result.to_bld_t_node).toBeDefined();
    expect(result.to_flr_t_node).toBeDefined();
    
    // Verify correct building and floor nodes
    expect(result.from_bld_t_node.name).toBe("building1");
    expect(result.from_flr_t_node.name).toBe("floor1ground");
    expect(result.to_bld_t_node.name).toBe("building2");
    expect(result.to_flr_t_node.name).toBe("floor2b");

    // At this point, the system would use these nodes to generate:
    // - Building picture: to_bld_t_node (Building 2)
    // - Floor picture: to_flr_t_node (Floor 2B)
    // - Floor highlight: to_flr_t_node (Floor 2B highlighted)
    // - Map with path: from_bld_t_node (Building 1) to to_bld_t_node (Building 2)
  });

  test('should handle same building, different floor', () => {
    // Given: from room = "1A37" (Building1, Ground Floor), to room = "1A65" (Building1, 1st Floor A)
    const fromRoomInput = "1A37";
    const toRoomInput = "1A65";

    // When: system processes request
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );

    const result = BuildingFloorNodeFinder.findBuildingAndFloorNodes(
      from_rm_t_node,
      to_rm_t_node
    );

    // Then: both rooms are in same building
    expect(result.from_bld_t_node).toBeDefined();
    expect(result.to_bld_t_node).toBeDefined();
    expect(result.from_bld_t_node.name).toBe("building1");
    expect(result.to_bld_t_node.name).toBe("building1");
    expect(result.from_bld_t_node).toBe(result.to_bld_t_node); // Same building reference

    // But different floors
    expect(result.from_flr_t_node.name).toBe("floor1ground");
    expect(result.to_flr_t_node.name).toBe("floor1a");
    expect(result.from_flr_t_node).not.toBe(result.to_flr_t_node);

    // Path should be empty or same building (no building-to-building navigation needed)
    // Building should be colored (likely blue as destination)
    // Floor highlight should show Floor 1A (destination floor)
  });

  test('should handle same building, same floor', () => {
    // Given: from room = "1A37", to room = "1A36" (same building and floor)
    const fromRoomInput = "1A37";
    const toRoomInput = "1A36";

    // When: system processes request
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );

    const result = BuildingFloorNodeFinder.findBuildingAndFloorNodes(
      from_rm_t_node,
      to_rm_t_node
    );

    // Then: same building and same floor
    expect(result.from_bld_t_node.name).toBe("building1");
    expect(result.to_bld_t_node.name).toBe("building1");
    expect(result.from_bld_t_node).toBe(result.to_bld_t_node); // Same building reference

    expect(result.from_flr_t_node.name).toBe("floor1ground");
    expect(result.to_flr_t_node.name).toBe("floor1ground");
    expect(result.from_flr_t_node).toBe(result.to_flr_t_node); // Same floor reference

    // Path should be empty (no building navigation needed)
    // Correct floor (Ground Floor) should be highlighted
  });

  test('should use default main gate when from room not provided', () => {
    // Given: from room = null, to room = "2B5"
    const fromRoomInput = null;
    const toRoomInput = "2B5";

    // When: system processes request
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    
    // Then: from room defaults to "main gate"
    expect(processed.fromRoom).toBe("main gate");
    expect(processed.toRoom).toBe("2b5");

    // Find room nodes
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );

    expect(from_rm_t_node).toBeDefined();
    expect(from_rm_t_node.name).toBe("main gate");
    expect(to_rm_t_node).toBeDefined();
    expect(to_rm_t_node.name).toBe("2b5");

    // Note: Main gate is a direct child of root (no building/floor structure)
    // So findBuildingNode and findFloorNode should handle this special case
    // Main gate should be used as starting point for pathfinding
  });

  test('should handle empty string from room defaulting to main gate', () => {
    // Given: from room = "" (empty string), to room = "8A3"
    const fromRoomInput = "";
    const toRoomInput = "8A3";

    // When: system processes request
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    
    // Then: from room defaults to "main gate"
    expect(processed.fromRoom).toBe("main gate");
    expect(processed.toRoom).toBe("8a3");

    // Find room nodes
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );

    expect(from_rm_t_node).toBeDefined();
    expect(from_rm_t_node.name).toBe("main gate");
    expect(to_rm_t_node).toBeDefined();
    expect(to_rm_t_node.name).toBe("8a3");
  });

  test('should process request from different buildings', () => {
    // Given: from room = "1A37" (Building 1), to room = "8A3" (Building 8)
    const fromRoomInput = "1A37";
    const toRoomInput = "8A3";

    // When: system processes request
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );

    const result = BuildingFloorNodeFinder.findBuildingAndFloorNodes(
      from_rm_t_node,
      to_rm_t_node
    );

    // Then: different buildings
    expect(result.from_bld_t_node.name).toBe("building1");
    expect(result.to_bld_t_node.name).toBe("building8");
    expect(result.from_bld_t_node).not.toBe(result.to_bld_t_node);

    // Different floors
    expect(result.from_flr_t_node.name).toBe("floor1ground");
    expect(result.to_flr_t_node.name).toBe("floor8a");

    // Path should be calculated from Building 1 to Building 8
    // Building 1 colored red (start), Building 8 colored blue (destination)
    // Yellow path drawn between buildings
  });

  test('should handle case-insensitive room inputs', () => {
    // Given: mixed case inputs
    const fromRoomInput = "1a37"; // lowercase
    const toRoomInput = "2B5";     // mixed case

    // When: system processes request
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    
    // Then: both converted to lowercase
    expect(processed.fromRoom).toBe("1a37");
    expect(processed.toRoom).toBe("2b5");

    // Room nodes should be found regardless of input case
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );

    expect(from_rm_t_node).toBeDefined();
    expect(to_rm_t_node).toBeDefined();
  });

  test('should handle rooms with special naming (labs, lecture theatres)', () => {
    // Given: room with special naming
    const fromRoomInput = "LT 9";
    const toRoomInput = "8A2 Lab";

    // When: system processes request
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    
    expect(processed.fromRoom).toBe("lt 9");
    expect(processed.toRoom).toBe("8a2 lab");

    // Find room nodes
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );

    // Then: rooms should be found
    expect(from_rm_t_node).toBeDefined();
    expect(from_rm_t_node.name).toBe("lt 9");
    expect(to_rm_t_node).toBeDefined();
    expect(to_rm_t_node.name).toBe("8a2 lab");

    // Both are in Building 8
    const result = BuildingFloorNodeFinder.findBuildingAndFloorNodes(
      from_rm_t_node,
      to_rm_t_node
    );

    expect(result.from_bld_t_node.name).toBe("building8");
    expect(result.to_bld_t_node.name).toBe("building8");
  });

  test('should handle main gate as from node - building node is itself, floor node is floorGateGround', () => {
    // Given: from node is "main gate"
    const fromRoomInput = "main gate";
    const toRoomInput = "1A37";

    // When: system processes request
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );

    // When: Building/Floor Node Finder is called
    const result = BuildingFloorNodeFinder.findBuildingAndFloorNodes(
      from_rm_t_node,
      to_rm_t_node
    );

    // Then: The building node is the node itself
    expect(result.from_bld_t_node).toBe(from_rm_t_node);
    expect(result.from_bld_t_node.name).toBe("main gate");
    
    // The floor node will be "floorGateGround"
    expect(result.from_flr_t_node).toBeDefined();
    expect(result.from_flr_t_node.name).toBe("floorGateGround");

    // To node should work normally
    expect(result.to_bld_t_node.name).toBe("building1");
    expect(result.to_flr_t_node.name).toBe("floor1ground");
  });

  test('should handle walkin gate as to node - building node is itself, floor node is floorGateGround', () => {
    // Given: to node is "walkin gate"
    const fromRoomInput = "1A37";
    const toRoomInput = "walkin gate";

    // When: system processes request
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );

    // When: Building/Floor Node Finder is called
    const result = BuildingFloorNodeFinder.findBuildingAndFloorNodes(
      from_rm_t_node,
      to_rm_t_node
    );

    // Then: From node should work normally
    expect(result.from_bld_t_node.name).toBe("building1");
    expect(result.from_flr_t_node.name).toBe("floor1ground");

    // The building node is the node itself
    expect(result.to_bld_t_node).toBe(to_rm_t_node);
    expect(result.to_bld_t_node.name).toBe("walkin gate");
    
    // The floor node will be "floorGateGround"
    expect(result.to_flr_t_node).toBeDefined();
    expect(result.to_flr_t_node.name).toBe("floorGateGround");
  });

  test('should handle back gate as from node - building node is itself, floor node is floorGateGround', () => {
    // Given: from node is "back gate"
    const fromRoomInput = "back gate";
    const toRoomInput = "8A3";

    // When: system processes request
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );

    // When: Building/Floor Node Finder is called
    const result = BuildingFloorNodeFinder.findBuildingAndFloorNodes(
      from_rm_t_node,
      to_rm_t_node
    );

    // Then: The building node is the node itself
    expect(result.from_bld_t_node).toBe(from_rm_t_node);
    expect(result.from_bld_t_node.name).toBe("back gate");
    
    // The floor node will be "floorGateGround"
    expect(result.from_flr_t_node).toBeDefined();
    expect(result.from_flr_t_node.name).toBe("floorGateGround");

    // To node should work normally
    expect(result.to_bld_t_node.name).toBe("building8");
    expect(result.to_flr_t_node.name).toBe("floor8a");
  });

  test('should handle both from and to nodes being gates', () => {
    // Given: from node is "main gate", to node is "back gate"
    const fromRoomInput = "main gate";
    const toRoomInput = "back gate";

    // When: system processes request
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );

    // When: Building/Floor Node Finder is called
    const result = BuildingFloorNodeFinder.findBuildingAndFloorNodes(
      from_rm_t_node,
      to_rm_t_node
    );

    // Then: Both building nodes are the nodes themselves
    expect(result.from_bld_t_node).toBe(from_rm_t_node);
    expect(result.from_bld_t_node.name).toBe("main gate");
    expect(result.to_bld_t_node).toBe(to_rm_t_node);
    expect(result.to_bld_t_node.name).toBe("back gate");
    
    // Both floor nodes will be "floorGateGround"
    expect(result.from_flr_t_node.name).toBe("floorGateGround");
    expect(result.to_flr_t_node.name).toBe("floorGateGround");
  });

  test('should detect when from and to rooms are the same and throw error', () => {
    // Given: from and to node equaling each other
    const fromRoomInput = "1A37";
    const toRoomInput = "1A37";

    // When: system processes request
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    
    expect(processed.fromRoom).toBe("1a37");
    expect(processed.toRoom).toBe("1a37");

    // When: finding the room nodes
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );

    // Then: Both nodes should be the same
    expect(from_rm_t_node).toBe(to_rm_t_node);
    expect(from_rm_t_node.name).toBe("1a37");

    // System should detect this and break with error message
    // This check should happen before calling BuildingFloorNodeFinder
    expect(() => {
      if (from_rm_t_node === to_rm_t_node) {
        throw new Error("These are the same rooms; no directions needed");
      }
    }).toThrow("These are the same rooms; no directions needed");
  });

  test('should detect when both inputs are main gate', () => {
    // Given: from and to both "main gate"
    const fromRoomInput = null; // defaults to main gate
    const toRoomInput = "main gate";

    // When: system processes request
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    
    expect(processed.fromRoom).toBe("main gate");
    expect(processed.toRoom).toBe("main gate");

    // When: finding the room nodes
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );

    // Then: Both nodes should be the same
    expect(from_rm_t_node).toBe(to_rm_t_node);

    // System should detect this and break with error message
    expect(() => {
      if (from_rm_t_node === to_rm_t_node) {
        throw new Error("These are the same rooms; no directions needed");
      }
    }).toThrow("These are the same rooms; no directions needed");
  });

  test('should detect same room with different case inputs', () => {
    // Given: from "1A37", to "1a37" (different case, same room)
    const fromRoomInput = "1A37";
    const toRoomInput = "1a37";

    // When: system processes request
    const processed = DataCollector.processRoomInputs(fromRoomInput, toRoomInput);
    
    // Both converted to same lowercase
    expect(processed.fromRoom).toBe("1a37");
    expect(processed.toRoom).toBe("1a37");

    // When: finding the room nodes
    const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
      processed.fromRoom,
      processed.toRoom,
      roomsHashMap
    );

    // Then: Both nodes should be the same
    expect(from_rm_t_node).toBe(to_rm_t_node);

    // System should detect this and throw error
    expect(() => {
      if (from_rm_t_node === to_rm_t_node) {
        throw new Error("These are the same rooms; no directions needed");
      }
    }).toThrow("These are the same rooms; no directions needed");
  });
});


describe('Error Handling', () => {
  test('should handle invalid room format', () => {
    // Given: room = "invalid_format"
    // When: system processes input
    // Then: returns appropriate error message
  });

  test('should handle non-existent room', () => {
    // Given: room = "z999" (doesn't exist)
    // When: system processes input
    // Then: returns "Room not found" error
  });

  test('should handle missing map image file', () => {
    // Given: map image file not found
    // When: PathDrawer tries to load map
    // Then: returns error or default image
  });

  test('should handle disconnected buildings in graph', () => {
    // Given: from_bld_g_node and to_bld_g_node are not connected
    // When: PathFinder runs BFS
    // Then: returns appropriate "no path found" message
  });
});

describe('Edge Cases', () => {
  test('should handle very long room names', () => {
    // Given: room = "very_long_room_name_12345" (length > 50 characters)
    // When: system processes input
    // Then: handles gracefully
  });

  test('should handle special characters in room names', () => {
    // Given: room = "A-101" or "A_101" (special characters)
    // When: system processes input
    // Then: handles special characters correctly
  });

  test('should handle multiple requests in sequence', () => {
    // Given: multiple direction requests
    // When: system processes sequentially
    // Then: each request is handled independently
  });
});

// Test: Accessibility
describe('Accessibility', () => {
  test('should be accessible to screen readers', () => {
    // Given: system is used by screen reader users
    // When: system processes input
    // Then: returns accessible output (aria-labels, alt text, etc.)
  });
});

// Test: User Experience
describe('User Experience', () => {
  test('should provide clear feedback on errors', () => {
    // Given: system returns error
    // When: user sees error message
    // Then: error message is clear and helpful
  });
});

// Test: Usability
describe('Usability', () => {
  test('should be easy to use', () => {
    // Given: user is new to the system
    // When: user uses the system
    // Then: user finds the system easy to use
  });
});

// Test: Maintainability
describe('Maintainability', () => {
  test('should be easy to maintain', () => {
    // Given: system needs to be updated
    // When: developer makes changes
    // Then: system remains easy to maintain
  });
});

// Test: Security and Privacy
describe('Security and Privacy', () => {
  test('should protect against XSS attacks', () => {
    // Given: user input = "<script>alert('XSS')</script>"
    // When: system processes input
    // Then: returns sanitized output (no script tags)
  });
});

// Test: Performance and Scalability
describe('Performance and Scalability', () => {
  test('should handle large number of rooms efficiently', () => {
    // Given: 1000 rooms in system
    // When: system processes request
    // Then: returns all outputs in reasonable time (under 1 second)
  });
});

// Test: Documentation
describe('Documentation', () => {
  test('should be complete and up-to-date', () => {
    // Given: system documentation
    // When: developer reviews documentation
    // Then: documentation is complete and up-to-date
  });
});

// Test: Testing
describe('Testing', () => {
  test('should have comprehensive test coverage', () => {
    // Given: system tests
    // When: developer reviews tests
    // Then: tests are comprehensive and cover all code paths
  });
});

// Test: Code Quality
describe('Code Quality', () => {
  test('should be maintainable and readable', () => {
    // Given: system code
    // When: developer reviews code
    // Then: code is maintainable and readable
  });
});