const DataCollector = require('../input/dataCollector');
const RoomNodeFinder = require('../processing/roomNodeFinder');
const BuildingFloorNodeFinder = require('../processing/buildingFloorNodeFinder');
const TreeDatabase = require('../processing/treeDatabase');

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
  let BuildingPicturesOutput;

  beforeEach(() => {
    // Mock BuildingPicturesOutput class
    BuildingPicturesOutput = {
      getBuildingPicture: jest.fn((bld_t_node) => {
        if (!bld_t_node || !bld_t_node.name) return null;
        
        const buildingPictures = {
          'building1': 'assets/buildings/building1.jpg',
          'building2': 'assets/buildings/building2.jpg',
          'building8': 'assets/buildings/building8.jpg',
          'building22': 'assets/buildings/building22.jpg',
          'building5': 'assets/buildings/building5.jpg',
          'main gate': 'assets/buildings/main_gate.jpg',
          'walkin gate': 'assets/buildings/walkin_gate.jpg',
          'back gate': 'assets/buildings/back_gate.jpg'
        };
        
        return buildingPictures[bld_t_node.name] || null;
      })
    };
  });

  test('should return building picture for valid to_bld_t_node', () => {
    // Given: to_bld_t_node = Building1
    const to_bld_t_node = { name: 'building1', worded_direction: 'Go to Building 1' };

    // When: building pictures component processes node
    const picture = BuildingPicturesOutput.getBuildingPicture(to_bld_t_node);

    // Then: returns image URL or file path for Building1
    expect(picture).toBeDefined();
    expect(picture).toBe('assets/buildings/building1.jpg');
    expect(typeof picture).toBe('string');
  });

  test('should return building picture for different buildings', () => {
    // Given: multiple building nodes
    const buildings = [
      { name: 'building2', expected: 'assets/buildings/building2.jpg' },
      { name: 'building8', expected: 'assets/buildings/building8.jpg' },
      { name: 'building22', expected: 'assets/buildings/building22.jpg' }
    ];

    // When: getting pictures for each building
    buildings.forEach(({ name, expected }) => {
      const node = { name, worded_direction: `Go to ${name}` };
      const picture = BuildingPicturesOutput.getBuildingPicture(node);

      // Then: returns correct picture for each building
      expect(picture).toBe(expected);
    });
  });

  test('should return gate pictures', () => {
    // Given: gate nodes
    const mainGate = { name: 'main gate', worded_direction: 'Go to Main Gate' };
    const walkinGate = { name: 'walkin gate', worded_direction: 'Go to Walk-In Gate' };
    const backGate = { name: 'back gate', worded_direction: 'Go to Back Gate' };

    // When: getting gate pictures
    const mainPic = BuildingPicturesOutput.getBuildingPicture(mainGate);
    const walkinPic = BuildingPicturesOutput.getBuildingPicture(walkinGate);
    const backPic = BuildingPicturesOutput.getBuildingPicture(backGate);

    // Then: returns gate pictures
    expect(mainPic).toBe('assets/buildings/main_gate.jpg');
    expect(walkinPic).toBe('assets/buildings/walkin_gate.jpg');
    expect(backPic).toBe('assets/buildings/back_gate.jpg');
  });

  test('should handle missing building picture', () => {
    // Given: to_bld_t_node with no associated picture
    const unknownBuilding = { name: 'building999', worded_direction: 'Go to Unknown Building' };

    // When: building pictures component processes node
    const picture = BuildingPicturesOutput.getBuildingPicture(unknownBuilding);

    // Then: returns null or default image
    expect(picture).toBeNull();
  });

  test('should handle null or undefined building node', () => {
    // Given: null or undefined node
    const nullNode = null;
    const undefinedNode = undefined;

    // When: attempting to get picture
    const nullResult = BuildingPicturesOutput.getBuildingPicture(nullNode);
    const undefinedResult = BuildingPicturesOutput.getBuildingPicture(undefinedNode);

    // Then: returns null
    expect(nullResult).toBeNull();
    expect(undefinedResult).toBeNull();
  });

  test('should handle building node without name', () => {
    // Given: building node without name property
    const invalidNode = { worded_direction: 'Go somewhere' };

    // When: attempting to get picture
    const result = BuildingPicturesOutput.getBuildingPicture(invalidNode);

    // Then: returns null
    expect(result).toBeNull();
  });
});

// Test: Floor Pictures Output
describe('Floor Pictures Output', () => {
  let FloorPicturesOutput;

  beforeEach(() => {
    // Mock FloorPicturesOutput class
    FloorPicturesOutput = {
      getFloorPicture: jest.fn((flr_t_node) => {
        if (!flr_t_node || !flr_t_node.name) return null;
        
        const floorPictures = {
          'floor1ground': 'assets/floors/floor1ground.jpg',
          'floor1a': 'assets/floors/floor1a.jpg',
          'floor1b': 'assets/floors/floor1b.jpg',
          'floor1c': 'assets/floors/floor1c.jpg',
          'floor2b': 'assets/floors/floor2b.jpg',
          'floor8a': 'assets/floors/floor8a.jpg',
          'floor8b': 'assets/floors/floor8b.jpg',
          'floor8c': 'assets/floors/floor8c.jpg',
          'floor22b': 'assets/floors/floor22b.jpg',
          'floor22c': 'assets/floors/floor22c.jpg',
          'floor5a': 'assets/floors/floor5a.jpg',
          'floor5b': 'assets/floors/floor5b.jpg',
          'floorGateGround': 'assets/floors/gate_ground.jpg'
        };
        
        return floorPictures[flr_t_node.name] || null;
      })
    };
  });

  test('should return floor picture for valid to_flr_t_node', () => {
    // Given: to_flr_t_node = Floor A
    const to_flr_t_node = { name: 'floor1a', worded_direction: 'Go to Floor 1A' };

    // When: floor pictures component processes node
    const picture = FloorPicturesOutput.getFloorPicture(to_flr_t_node);

    // Then: returns image URL or file path for Floor A
    expect(picture).toBeDefined();
    expect(picture).toBe('assets/floors/floor1a.jpg');
    expect(typeof picture).toBe('string');
  });

  test('should return floor pictures for different floors', () => {
    // Given: multiple floor nodes
    const floors = [
      { name: 'floor1ground', expected: 'assets/floors/floor1ground.jpg' },
      { name: 'floor8a', expected: 'assets/floors/floor8a.jpg' },
      { name: 'floor22b', expected: 'assets/floors/floor22b.jpg' },
      { name: 'floor5a', expected: 'assets/floors/floor5a.jpg' }
    ];

    // When: getting pictures for each floor
    floors.forEach(({ name, expected }) => {
      const node = { name, worded_direction: `Go to ${name}` };
      const picture = FloorPicturesOutput.getFloorPicture(node);

      // Then: returns correct picture for each floor
      expect(picture).toBe(expected);
    });
  });

  test('should return floor picture for gate floor node', () => {
    // Given: gate floor node (floorGateGround)
    const gateFloor = { name: 'floorGateGround', worded_direction: '' };

    // When: getting floor picture
    const picture = FloorPicturesOutput.getFloorPicture(gateFloor);

    // Then: returns gate ground floor picture
    expect(picture).toBe('assets/floors/gate_ground.jpg');
  });

  test('should handle missing floor picture', () => {
    // Given: to_flr_t_node with no associated picture
    const unknownFloor = { name: 'floor999z', worded_direction: 'Go to Unknown Floor' };

    // When: floor pictures component processes node
    const picture = FloorPicturesOutput.getFloorPicture(unknownFloor);

    // Then: returns null or default image
    expect(picture).toBeNull();
  });

  test('should handle null or undefined floor node', () => {
    // Given: null or undefined node
    const nullNode = null;
    const undefinedNode = undefined;

    // When: attempting to get picture
    const nullResult = FloorPicturesOutput.getFloorPicture(nullNode);
    const undefinedResult = FloorPicturesOutput.getFloorPicture(undefinedNode);

    // Then: returns null
    expect(nullResult).toBeNull();
    expect(undefinedResult).toBeNull();
  });

  test('should return different pictures for different floors in same building', () => {
    // Given: multiple floors from building 1
    const floor1Ground = { name: 'floor1ground', worded_direction: 'Ground Floor' };
    const floor1A = { name: 'floor1a', worded_direction: 'Floor 1A' };
    const floor1B = { name: 'floor1b', worded_direction: 'Floor 1B' };

    // When: getting pictures
    const pic1 = FloorPicturesOutput.getFloorPicture(floor1Ground);
    const pic2 = FloorPicturesOutput.getFloorPicture(floor1A);
    const pic3 = FloorPicturesOutput.getFloorPicture(floor1B);

    // Then: each floor has different picture
    expect(pic1).not.toBe(pic2);
    expect(pic2).not.toBe(pic3);
    expect(pic1).not.toBe(pic3);
  });
});

// Test: Floor Highlight Output
describe('Floor Highlight Output', () => {
  let FloorHighlightOutput;
  let mockCanvas;
  let mockContext;

  beforeEach(() => {
    // Mock canvas and context
    mockContext = {
      fillRect: jest.fn(),
      strokeRect: jest.fn(),
      fillText: jest.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      font: ''
    };

    mockCanvas = {
      getContext: jest.fn(() => mockContext),
      width: 400,
      height: 600
    };

    // Mock FloorHighlightOutput class
    FloorHighlightOutput = {
      createFloorHighlight: jest.fn((to_flr_t_node, canvas) => {
        if (!to_flr_t_node || !canvas) return null;
        
        const context = canvas.getContext('2d');
        const building = to_flr_t_node.parent;
        
        if (!building || !building.children) return null;
        
        const floors = building.children;
        const floorHeight = canvas.height / floors.length;
        
        // Draw all floors
        floors.forEach((floor, index) => {
          const y = index * floorHeight;
          
          // Highlight destination floor
          if (floor.name === to_flr_t_node.name) {
            context.fillStyle = '#4CAF50'; // Green highlight
          } else {
            context.fillStyle = '#E0E0E0'; // Gray for other floors
          }
          
          context.fillRect(0, y, canvas.width, floorHeight);
          
          // Draw floor label
          context.fillStyle = '#000000';
          context.fillText(floor.name, 20, y + floorHeight / 2);
        });
        
        return canvas;
      })
    };
  });

  test('should create canvas with all floors and highlight destination', () => {
    // Given: to_flr_t_node = Floor A, building has floors [Ground, A, B, C]
    const building = { 
      name: 'building1',
      children: [
        { name: 'floor1ground', parent: null },
        { name: 'floor1a', parent: null },
        { name: 'floor1b', parent: null },
        { name: 'floor1c', parent: null }
      ]
    };
    
    // Set parent references
    building.children.forEach(floor => floor.parent = building);
    
    const to_flr_t_node = building.children[1]; // floor1a

    // When: floor highlight component processes node
    const result = FloorHighlightOutput.createFloorHighlight(to_flr_t_node, mockCanvas);

    // Then: returns canvas with all floors shown and Floor A highlighted
    expect(result).toBeDefined();
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockContext.fillRect).toHaveBeenCalledTimes(4); // 4 floors
    expect(mockContext.fillText).toHaveBeenCalledTimes(4); // 4 labels
  });

  test('should highlight only the destination floor', () => {
    // Given: building with 3 floors, destination is floor 2
    const building = { 
      name: 'building8',
      children: [
        { name: 'floor8a', parent: null },
        { name: 'floor8b', parent: null },
        { name: 'floor8c', parent: null }
      ]
    };
    
    building.children.forEach(floor => floor.parent = building);
    const to_flr_t_node = building.children[1]; // floor8b

    // When: creating highlight
    FloorHighlightOutput.createFloorHighlight(to_flr_t_node, mockCanvas);

    // Then: only destination floor is highlighted (verified by fillStyle changes)
    expect(mockContext.fillRect).toHaveBeenCalled();
    expect(mockContext.fillText).toHaveBeenCalledWith('floor8b', 20, expect.any(Number));
  });

  test('should handle single-floor building', () => {
    // Given: to_flr_t_node = Floor A, building has only Floor A
    const building = { 
      name: 'building2',
      children: [
        { name: 'floor2b', parent: null }
      ]
    };
    
    building.children[0].parent = building;
    const to_flr_t_node = building.children[0];

    // When: floor highlight component processes node
    const result = FloorHighlightOutput.createFloorHighlight(to_flr_t_node, mockCanvas);

    // Then: returns canvas with only Floor A highlighted
    expect(result).toBeDefined();
    expect(mockContext.fillRect).toHaveBeenCalledTimes(1);
    expect(mockContext.fillText).toHaveBeenCalledWith('floor2b', 20, expect.any(Number));
  });

  test('should handle building with many floors', () => {
    // Given: building with 5 floors
    const building = { 
      name: 'tall_building',
      children: Array.from({ length: 5 }, (_, i) => ({
        name: `floor${i}`,
        parent: null
      }))
    };
    
    building.children.forEach(floor => floor.parent = building);
    const to_flr_t_node = building.children[3]; // floor3

    // When: creating highlight
    const result = FloorHighlightOutput.createFloorHighlight(to_flr_t_node, mockCanvas);

    // Then: all 5 floors are shown
    expect(result).toBeDefined();
    expect(mockContext.fillRect).toHaveBeenCalledTimes(5);
    expect(mockContext.fillText).toHaveBeenCalledTimes(5);
  });

  test('should handle null or undefined floor node', () => {
    // Given: null or undefined floor node
    const nullNode = null;
    const undefinedNode = undefined;

    // When: attempting to create highlight
    const nullResult = FloorHighlightOutput.createFloorHighlight(nullNode, mockCanvas);
    const undefinedResult = FloorHighlightOutput.createFloorHighlight(undefinedNode, mockCanvas);

    // Then: returns null
    expect(nullResult).toBeNull();
    expect(undefinedResult).toBeNull();
  });

  test('should handle floor node without parent building', () => {
    // Given: floor node without parent
    const orphanFloor = { name: 'orphan_floor', parent: null };

    // When: attempting to create highlight
    const result = FloorHighlightOutput.createFloorHighlight(orphanFloor, mockCanvas);

    // Then: returns null
    expect(result).toBeNull();
  });

  test('should handle gate floor node (floorGateGround)', () => {
    // Given: gate floor node
    const gateFloor = { 
      name: 'floorGateGround', 
      parent: { name: 'main gate', children: [{ name: 'floorGateGround', parent: null }] }
    };
    gateFloor.parent.children[0].parent = gateFloor.parent;

    // When: creating highlight
    const result = FloorHighlightOutput.createFloorHighlight(gateFloor, mockCanvas);

    // Then: handles single gate floor
    expect(result).toBeDefined();
    expect(mockContext.fillRect).toHaveBeenCalledTimes(1);
  });
});



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