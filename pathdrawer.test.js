// Test: PathDrawer Output
describe('PathDrawer', () => {
  let mockCanvas;
  let mockContext;
  let mockImage;
  let mockBuildingVerticesHashMap;
  let PathDrawer;

  beforeEach(() => {
    // Mock canvas and 2D context
    mockContext = {
      drawImage: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0
    };

    mockCanvas = {
      getContext: jest.fn(() => mockContext),
      width: 2200,
      height: 3200
    };

    mockImage = {
      src: '',
      onload: null,
      width: 2200,
      height: 3200
    };

    // Mock Building Vertices Hash Map
    mockBuildingVerticesHashMap = new Map([
      ['building1', [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 },
        { x: 100, y: 200 }
      ]],
      ['building2', [
        { x: 500, y: 500 },
        { x: 600, y: 500 },
        { x: 600, y: 600 },
        { x: 500, y: 600 }
      ]],
      ['building8', [
        { x: 1000, y: 1500 },
        { x: 1100, y: 1500 },
        { x: 1100, y: 1600 },
        { x: 1000, y: 1600 }
      ]],
      ['main gate', [
        { x: 1280, y: 3100 },
        { x: 1290, y: 3100 },
        { x: 1290, y: 3130 },
        { x: 1280, y: 3130 }
      ]]
    ]);

    // Mock PathDrawer class (would be implemented in actual code)
    PathDrawer = {
      loadMapImage: jest.fn((imagePath, canvas) => {
        return new Promise((resolve) => {
          mockImage.src = imagePath;
          resolve(mockImage);
        });
      }),

      getBuildingVertices: jest.fn((buildingNode, verticesHashMap) => {
        if (!buildingNode || !verticesHashMap) return null;
        return verticesHashMap.get(buildingNode.name);
      }),

      colorBuilding: jest.fn((vertices, color, context) => {
        if (!vertices || !color || !context) return false;
        
        context.fillStyle = color;
        context.beginPath();
        vertices.forEach((vertex, index) => {
          if (index === 0) {
            context.moveTo(vertex.x, vertex.y);
          } else {
            context.lineTo(vertex.x, vertex.y);
          }
        });
        context.closePath();
        context.fill();
        return true;
      }),

      drawPathLine: jest.fn((path, context) => {
        if (!path || path.length < 2 || !context) return false;

        context.strokeStyle = '#FFD700'; // Yellow
        context.lineWidth = 5;
        context.beginPath();
        
        path.forEach((node, index) => {
          if (index === 0) {
            context.moveTo(node.x_coor, node.y_coor);
          } else {
            context.lineTo(node.x_coor, node.y_coor);
          }
        });
        
        context.stroke();
        return true;
      }),

      createMapWithPath: jest.fn((fromBuilding, toBuilding, path, verticesHashMap, canvas) => {
        const context = canvas.getContext('2d');
        
        // Load map image
        PathDrawer.loadMapImage('utech_map.png', canvas);
        
        // Draw yellow path line
        PathDrawer.drawPathLine(path, context);
        
        // Get and color from building (red)
        const fromVertices = PathDrawer.getBuildingVertices(fromBuilding, verticesHashMap);
        PathDrawer.colorBuilding(fromVertices, '#FF0000', context);
        
        // Get and color to building (blue)
        const toVertices = PathDrawer.getBuildingVertices(toBuilding, verticesHashMap);
        PathDrawer.colorBuilding(toVertices, '#0000FF', context);
        
        return canvas;
      })
    };
  });

  describe('Map Image Loading', () => {
    test('should load UTech map image', async () => {
      // Given: path from PathFinder
      const imagePath = 'utech_map.png';

      // When: PathDrawer loads map
      const result = await PathDrawer.loadMapImage(imagePath, mockCanvas);

      // Then: map image is loaded successfully
      expect(PathDrawer.loadMapImage).toHaveBeenCalledWith(imagePath, mockCanvas);
      expect(result).toBeDefined();
      expect(result.src).toBe(imagePath);
    });

    test('should handle map image dimensions correctly', async () => {
      // Given: map image with specific dimensions
      const imagePath = 'utech_map.png';

      // When: loading map
      const result = await PathDrawer.loadMapImage(imagePath, mockCanvas);

      // Then: image dimensions match canvas
      expect(result.width).toBe(2200);
      expect(result.height).toBe(3200);
    });

    test('should handle missing map image file', async () => {
      // Given: invalid image path
      const invalidPath = 'nonexistent_map.png';
      
      PathDrawer.loadMapImage = jest.fn((imagePath) => {
        return new Promise((resolve, reject) => {
          reject(new Error('Image not found'));
        });
      });

      // When & Then: should handle error gracefully
      await expect(PathDrawer.loadMapImage(invalidPath, mockCanvas))
        .rejects.toThrow('Image not found');
    });
  });

  describe('Building Vertices Retrieval', () => {
    test('should get vertices of from building from Building Vertices Hash Map', () => {
      // Given: from_bld_g_node = Building1, Building Vertices Hash Map contains Building1 -> Set of (x,y) coordinates
      const fromBuilding = { name: 'building1', type: 'building', x_coor: 150, y_coor: 150 };

      // When: PathDrawer gets vertices from Building Vertices Hash Map
      const vertices = PathDrawer.getBuildingVertices(fromBuilding, mockBuildingVerticesHashMap);

      // Then: returns set of x,y coordinates (vertices) for Building1
      expect(vertices).toBeDefined();
      expect(Array.isArray(vertices)).toBe(true);
      expect(vertices.length).toBe(4);
      expect(vertices[0]).toEqual({ x: 100, y: 100 });
      expect(vertices[1]).toEqual({ x: 200, y: 100 });
      expect(vertices[2]).toEqual({ x: 200, y: 200 });
      expect(vertices[3]).toEqual({ x: 100, y: 200 });
    });

    test('should get vertices of to building from Building Vertices Hash Map', () => {
      // Given: to_bld_g_node = Building8, Building Vertices Hash Map contains Building8 -> Set of (x,y) coordinates
      const toBuilding = { name: 'building8', type: 'building', x_coor: 1050, y_coor: 1550 };

      // When: PathDrawer gets vertices from Building Vertices Hash Map
      const vertices = PathDrawer.getBuildingVertices(toBuilding, mockBuildingVerticesHashMap);

      // Then: returns set of x,y coordinates (vertices) for Building8
      expect(vertices).toBeDefined();
      expect(Array.isArray(vertices)).toBe(true);
      expect(vertices.length).toBe(4);
      expect(vertices[0]).toEqual({ x: 1000, y: 1500 });
      expect(vertices[3]).toEqual({ x: 1000, y: 1600 });
    });

    test('should handle building not in vertices hash map', () => {
      // Given: building not in hash map
      const unknownBuilding = { name: 'unknown_building', type: 'building', x_coor: 999, y_coor: 999 };

      // When: attempting to get vertices
      const vertices = PathDrawer.getBuildingVertices(unknownBuilding, mockBuildingVerticesHashMap);

      // Then: returns null or undefined
      expect(vertices).toBeUndefined();
    });

    test('should get vertices for gate buildings', () => {
      // Given: main gate as building node
      const mainGate = { name: 'main gate', type: 'gate', x_coor: 1285, y_coor: 3115 };

      // When: getting vertices
      const vertices = PathDrawer.getBuildingVertices(mainGate, mockBuildingVerticesHashMap);

      // Then: returns vertices for gate
      expect(vertices).toBeDefined();
      expect(Array.isArray(vertices)).toBe(true);
      expect(vertices.length).toBeGreaterThan(0);
    });
  });

  describe('Building Coloring', () => {
    test('should color from building in red using vertices from Building Vertices Hash Map', () => {
      // Given: from_bld_g_node = Building1, vertices from Building Vertices Hash Map
      const fromBuilding = { name: 'building1', type: 'building', x_coor: 150, y_coor: 150 };
      const vertices = mockBuildingVerticesHashMap.get('building1');

      // When: PathDrawer colors building
      const result = PathDrawer.colorBuilding(vertices, '#FF0000', mockContext);

      // Then: Building1 is colored in red using its vertices
      expect(result).toBe(true);
      expect(mockContext.fillStyle).toBe('#FF0000');
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.fill).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalledWith(100, 100);
      expect(mockContext.lineTo).toHaveBeenCalledWith(200, 100);
      expect(mockContext.lineTo).toHaveBeenCalledWith(200, 200);
      expect(mockContext.lineTo).toHaveBeenCalledWith(100, 200);
    });

    test('should color to building in blue using vertices from Building Vertices Hash Map', () => {
      // Given: to_bld_g_node = Building2, vertices from Building Vertices Hash Map
      const toBuilding = { name: 'building2', type: 'building', x_coor: 550, y_coor: 550 };
      const vertices = mockBuildingVerticesHashMap.get('building2');

      // When: PathDrawer colors building
      const result = PathDrawer.colorBuilding(vertices, '#0000FF', mockContext);

      // Then: Building2 is colored in blue using its vertices
      expect(result).toBe(true);
      expect(mockContext.fillStyle).toBe('#0000FF');
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.fill).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalledWith(500, 500);
      expect(mockContext.lineTo).toHaveBeenCalledWith(600, 600);
    });

    test('should handle coloring with null or undefined vertices', () => {
      // Given: null vertices
      const nullVertices = null;

      // When: attempting to color
      const result = PathDrawer.colorBuilding(nullVertices, '#FF0000', mockContext);

      // Then: returns false or handles gracefully
      expect(result).toBe(false);
    });

    test('should handle different building shapes (various vertex counts)', () => {
      // Given: building with different number of vertices (e.g., L-shaped building)
      const lShapedVertices = [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 150 },
        { x: 150, y: 150 },
        { x: 150, y: 200 },
        { x: 100, y: 200 }
      ];

      // When: coloring complex shape
      const result = PathDrawer.colorBuilding(lShapedVertices, '#FF0000', mockContext);

      // Then: handles all vertices correctly
      expect(result).toBe(true);
      expect(mockContext.moveTo).toHaveBeenCalledWith(100, 100);
      expect(mockContext.lineTo).toHaveBeenCalledTimes(5); // 6 vertices - 1 moveTo = 5 lineTo
    });
  });

  describe('Path Line Drawing', () => {
    test('should draw yellow lines along path including non-building nodes', () => {
      // Given: path = [Building1, Walkway1, Intersection1, Walkway2, Building2] (contains walkways/intersections)
      const path = [
        { name: 'building1', type: 'building', x_coor: 150, y_coor: 150 },
        { name: 'walkway1', type: 'walkway', x_coor: 250, y_coor: 250 },
        { name: 'intersection1', type: 'walkway', x_coor: 350, y_coor: 350 },
        { name: 'walkway2', type: 'walkway', x_coor: 450, y_coor: 450 },
        { name: 'building2', type: 'building', x_coor: 550, y_coor: 550 }
      ];

      // When: PathDrawer draws yellow path
      const result = PathDrawer.drawPathLine(path, mockContext);

      // Then: yellow lines are drawn along entire path including road intersections and corners
      expect(result).toBe(true);
      expect(mockContext.strokeStyle).toBe('#FFD700'); // Yellow
      expect(mockContext.lineWidth).toBe(5);
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.stroke).toHaveBeenCalled();
      
      // Verify all nodes in path are drawn
      expect(mockContext.moveTo).toHaveBeenCalledWith(150, 150); // Start at building1
      expect(mockContext.lineTo).toHaveBeenCalledWith(250, 250); // walkway1
      expect(mockContext.lineTo).toHaveBeenCalledWith(350, 350); // intersection1
      expect(mockContext.lineTo).toHaveBeenCalledWith(450, 450); // walkway2
      expect(mockContext.lineTo).toHaveBeenCalledWith(550, 550); // building2
    });

    test('should draw path with only building nodes (direct connection)', () => {
      // Given: path with only two buildings (adjacent)
      const path = [
        { name: 'building1', type: 'building', x_coor: 150, y_coor: 150 },
        { name: 'building2', type: 'building', x_coor: 550, y_coor: 550 }
      ];

      // When: drawing path
      const result = PathDrawer.drawPathLine(path, mockContext);

      // Then: draws straight line between buildings
      expect(result).toBe(true);
      expect(mockContext.moveTo).toHaveBeenCalledWith(150, 150);
      expect(mockContext.lineTo).toHaveBeenCalledWith(550, 550);
    });

    test('should handle complex path with many intermediate nodes', () => {
      // Given: long path with many walkway/intersection nodes
      const complexPath = [];
      for (let i = 0; i < 20; i++) {
        complexPath.push({
          name: `node${i}`,
          type: i === 0 || i === 19 ? 'building' : 'walkway',
          x_coor: 100 + (i * 50),
          y_coor: 100 + (i * 50)
        });
      }

      // When: drawing complex path
      const result = PathDrawer.drawPathLine(complexPath, mockContext);

      // Then: all nodes are included in path line
      expect(result).toBe(true);
      expect(mockContext.moveTo).toHaveBeenCalledTimes(1);
      expect(mockContext.lineTo).toHaveBeenCalledTimes(19); // 20 nodes - 1 moveTo = 19 lineTo
    });

    test('should handle path with single node (same start and end)', () => {
      // Given: path with single node
      const singleNodePath = [
        { name: 'building1', type: 'building', x_coor: 150, y_coor: 150 }
      ];

      // When: attempting to draw path
      const result = PathDrawer.drawPathLine(singleNodePath, mockContext);

      // Then: returns false (no line to draw)
      expect(result).toBe(false);
    });

    test('should handle path with roundabout/circular sections', () => {
      // Given: path going through roundabout
      const path = [
        { name: 'building1', type: 'building', x_coor: 100, y_coor: 100 },
        { name: 'entrance_roundabout', type: 'walkway', x_coor: 200, y_coor: 150 },
        { name: 'roundabout_north', type: 'walkway', x_coor: 250, y_coor: 200 },
        { name: 'roundabout_east', type: 'walkway', x_coor: 300, y_coor: 200 },
        { name: 'exit_roundabout', type: 'walkway', x_coor: 350, y_coor: 150 },
        { name: 'building2', type: 'building', x_coor: 400, y_coor: 100 }
      ];

      // When: drawing path through roundabout
      const result = PathDrawer.drawPathLine(path, mockContext);

      // Then: path follows curved route
      expect(result).toBe(true);
      expect(mockContext.lineTo).toHaveBeenCalledTimes(5);
    });
  });

  describe('Complete Map Creation', () => {
    test('should create complete map with path and colored buildings', () => {
      // Given: from building, to building, path, and vertices hash map
      const fromBuilding = { name: 'building1', type: 'building', x_coor: 150, y_coor: 150 };
      const toBuilding = { name: 'building8', type: 'building', x_coor: 1050, y_coor: 1550 };
      const path = [
        fromBuilding,
        { name: 'walkway1', type: 'walkway', x_coor: 300, y_coor: 300 },
        { name: 'walkway2', type: 'walkway', x_coor: 600, y_coor: 800 },
        toBuilding
      ];

      // When: creating complete map
      const result = PathDrawer.createMapWithPath(
        fromBuilding, 
        toBuilding, 
        path, 
        mockBuildingVerticesHashMap, 
        mockCanvas
      );

      // Then: map is created with all elements
      expect(result).toBeDefined();
      expect(PathDrawer.loadMapImage).toHaveBeenCalled();
      expect(PathDrawer.drawPathLine).toHaveBeenCalledWith(path, mockContext);
      expect(PathDrawer.getBuildingVertices).toHaveBeenCalledTimes(2);
      expect(PathDrawer.colorBuilding).toHaveBeenCalledTimes(2);
      
      // Verify red color for from building
      expect(PathDrawer.colorBuilding).toHaveBeenCalledWith(
        expect.any(Array),
        '#FF0000',
        mockContext
      );
      
      // Verify blue color for to building
      expect(PathDrawer.colorBuilding).toHaveBeenCalledWith(
        expect.any(Array),
        '#0000FF',
        mockContext
      );
    });

    test('should handle path from gate to building', () => {
      // Given: path from main gate to building
      const fromGate = { name: 'main gate', type: 'gate', x_coor: 1285, y_coor: 3115 };
      const toBuilding = { name: 'building1', type: 'building', x_coor: 150, y_coor: 150 };
      const path = [
        fromGate,
        { name: 'walkway', type: 'walkway', x_coor: 700, y_coor: 1500 },
        toBuilding
      ];

      // When: creating map
      const result = PathDrawer.createMapWithPath(
        fromGate,
        toBuilding,
        path,
        mockBuildingVerticesHashMap,
        mockCanvas
      );

      // Then: gate and building are both colored correctly
      expect(result).toBeDefined();
      expect(PathDrawer.getBuildingVertices).toHaveBeenCalledWith(fromGate, mockBuildingVerticesHashMap);
      expect(PathDrawer.getBuildingVertices).toHaveBeenCalledWith(toBuilding, mockBuildingVerticesHashMap);
    });

    test('should layer elements in correct order: image, path, buildings', () => {
      // Given: all map elements
      const fromBuilding = { name: 'building1', type: 'building', x_coor: 150, y_coor: 150 };
      const toBuilding = { name: 'building2', type: 'building', x_coor: 550, y_coor: 550 };
      const path = [fromBuilding, toBuilding];

      const drawOrder = [];
      
      // Track call order
      PathDrawer.loadMapImage = jest.fn(() => {
        drawOrder.push('loadImage');
        return Promise.resolve(mockImage);
      });
      PathDrawer.drawPathLine = jest.fn(() => {
        drawOrder.push('drawPath');
        return true;
      });
      PathDrawer.colorBuilding = jest.fn(() => {
        drawOrder.push('colorBuilding');
        return true;
      });

      // When: creating map
      PathDrawer.createMapWithPath(fromBuilding, toBuilding, path, mockBuildingVerticesHashMap, mockCanvas);

      // Then: elements drawn in correct order
      expect(drawOrder[0]).toBe('loadImage');
      expect(drawOrder[1]).toBe('drawPath');
      expect(drawOrder[2]).toBe('colorBuilding');
      expect(drawOrder[3]).toBe('colorBuilding');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle null path', () => {
      // Given: null path
      const nullPath = null;

      // When: attempting to draw
      const result = PathDrawer.drawPathLine(nullPath, mockContext);

      // Then: handles gracefully
      expect(result).toBe(false);
    });

    test('should handle buildings at same location', () => {
      // Given: from and to buildings at same coordinates (same building)
      const building = { name: 'building1', type: 'building', x_coor: 150, y_coor: 150 };
      const path = [building];

      // When: creating map
      const result = PathDrawer.createMapWithPath(
        building,
        building,
        path,
        mockBuildingVerticesHashMap,
        mockCanvas
      );

      // Then: handles same building case
      expect(result).toBeDefined();
    });

    test('should handle buildings with overlapping vertices', () => {
      // Given: buildings with some shared vertices (adjacent buildings)
      const adjacentVerticesMap = new Map([
        ['buildingA', [
          { x: 100, y: 100 },
          { x: 200, y: 100 },
          { x: 200, y: 200 },
          { x: 100, y: 200 }
        ]],
        ['buildingB', [
          { x: 200, y: 100 }, // Shared edge with buildingA
          { x: 300, y: 100 },
          { x: 300, y: 200 },
          { x: 200, y: 200 }  // Shared edge with buildingA
        ]]
      ]);

      const buildingA = { name: 'buildingA', type: 'building', x_coor: 150, y_coor: 150 };
      const buildingB = { name: 'buildingB', type: 'building', x_coor: 250, y_coor: 150 };

      // When: coloring both buildings
      const verticesA = adjacentVerticesMap.get('buildingA');
      const verticesB = adjacentVerticesMap.get('buildingB');
      
      PathDrawer.colorBuilding(verticesA, '#FF0000', mockContext);
      PathDrawer.colorBuilding(verticesB, '#0000FF', mockContext);

      // Then: both buildings colored correctly despite shared edge
      expect(mockContext.fill).toHaveBeenCalledTimes(2);
    });

    test('should handle very long paths efficiently', () => {
      // Given: path with 100+ nodes
      const longPath = [];
      for (let i = 0; i < 150; i++) {
        longPath.push({
          name: `node${i}`,
          type: i === 0 || i === 149 ? 'building' : 'walkway',
          x_coor: i * 10,
          y_coor: i * 10
        });
      }

      // When: drawing long path
      const result = PathDrawer.drawPathLine(longPath, mockContext);

      // Then: handles efficiently without errors
      expect(result).toBe(true);
      expect(mockContext.lineTo).toHaveBeenCalledTimes(149);
    });

    test('should handle coordinates at map boundaries', () => {
      // Given: buildings at edge of map
      const edgeBuilding = { name: 'edge_building', type: 'building', x_coor: 0, y_coor: 0 };
      const cornerBuilding = { name: 'corner_building', type: 'building', x_coor: 2200, y_coor: 3200 };
      
      const edgeVertices = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
      ];

      // When: coloring edge building
      const result = PathDrawer.colorBuilding(edgeVertices, '#FF0000', mockContext);

      // Then: handles boundary coordinates correctly
      expect(result).toBe(true);
      expect(mockContext.moveTo).toHaveBeenCalledWith(0, 0);
    });
  });
});