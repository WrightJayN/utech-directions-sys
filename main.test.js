// Test: Data Collector converts room inputs to lowercase strings
describe('Data Collector', () => {
    test('should convert "from" room input to lowercase string', () => {
      // Given: from room = "A101"
      // When: data collector processes input
      // Then: returns string "a101"
    });
  
    test('should convert "to" room input to lowercase string', () => {
      // Given: to room = "B205"
      // When: data collector processes input
      // Then: returns string "b205"
    });
  
    test('should handle default "main gate" input', () => {
      // Given: from room = null or undefined
      // When: data collector processes input
      // Then: returns string "main gate" (lowercase)
    });
  
    test('should handle numeric room inputs', () => {
      // Given: room = 101
      // When: data collector processes input
      // Then: returns string "101" (lowercase)
    });
  
    test('should handle empty string input', () => {
      // Given: room = ""
      // When: data collector processes input
      // Then: throws error or returns default (lowercase)  
    });
  });


// Test: Room Node Finder uses Rooms Hash Map to find corresponding rm_t_nodes of the input strings
describe('Room Node Finder', () => {
  test('should find rm_t_node for valid room string', () => {
    // Given: room string = "a101", Rooms Hash Map contains "a101" -> rm_t_node_a101
    // When: room node finder searches Rooms Hash Map
    // Then: returns rm_t_node_a101
  });

  test('should return null for non-existent room', () => {
    // Given: room string = "z999", not in Rooms Hash Map
    // When: room node finder searches Rooms Hash Map
    // Then: returns null or throws error
  });

  test('should handle case-insensitive room lookup', () => {
    // Given: room string = "A101" (uppercase)
    // When: room node finder searches Rooms Hash Map
    // Then: returns correct rm_t_node (case handling)
  });

  test('should find rm_t_node for both from and to rooms', () => {
    // Given: from room = "a101", to room = "b205"
    // When: room node finder processes both
    // Then: returns [rm_t_node_a101, rm_t_node_b205]
  });
});
  

  // Test: Building/Floor Node Finder uses tree to find bld_t_nodes and flr_t_nodes
describe('Building/Floor Node Finder', () => {
  test('should find bld_t_node from rm_t_node', () => {
    // Given: rm_t_node for room "a101" in Building 1
    // When: building/floor node finder traverses tree
    // Then: returns bld_t_node for Building 1
  });

  test('should find flr_t_node from rm_t_node', () => {
    // Given: rm_t_node for room "a101" on Floor A
    // When: building/floor node finder traverses tree
    // Then: returns flr_t_node for Floor A
  });

  test('should find both bld_t_node and flr_t_node for from room', () => {
    // Given: from_rm_t_node
    // When: building/floor node finder processes node
    // Then: returns {from_bld_t_node, from_flr_t_node}
  });

  test('should find both bld_t_node and flr_t_node for to room', () => {
    // Given: to_rm_t_node
    // When: building/floor node finder processes node
    // Then: returns {to_bld_t_node, to_flr_t_node}
  });
  
  test('should handle invalid rm_t_node', () => {
    // Given: invalid or null rm_t_node
    // When: building/floor node finder processes node
    // Then: throws error or returns null
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