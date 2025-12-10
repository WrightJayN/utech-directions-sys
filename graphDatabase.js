/**
 * Graph Database Component
 * Creates the graph structure for UTech campus navigation with weighted edges
 * 
 * Graph Node Structure:
 * - name: string
 * - type: 'building' or 'walkway'
 * - neighbors: g_node[]
 * - x_coor: number (pixel coordinate)
 * - y_coor: number (pixel coordinate)
 * 
 * Edge weights are calculated as Euclidean distance between nodes
 * 
 * Map Feature Classification:
 * A. Walkways (type='walkway'): Straight segments, Curves, Intersections, Roundabouts
 * B. Buildings (type='building'): Building entrance nodes
 * C. Gates (type='building'): Main gate, Walkin gate, Back gate
 */

class GraphNode {
    constructor(name, type, x_coor, y_coor) {
        this.name = name;
        this.type = type; // 'building' or 'walkway'
        this.neighbors = [];
        this.x_coor = x_coor;
        this.y_coor = y_coor;
    }

    addNeighbor(node) {
        if (!this.neighbors.includes(node)) {
            this.neighbors.push(node);
        }
    }

    addBidirectionalNeighbor(node) {
        this.addNeighbor(node);
        node.addNeighbor(this);
    }
}

class GraphDatabase {
    constructor() {
        this.buildingGraph = new Map();
        this.buildGraph();
    }

    buildGraph() {
        // Create building nodes based on the map
        // Coordinates are approximated from the campus map image
        
        // Buildings
        const building1 = new GraphNode('building1', 'building', 520, 720); // Engineering (1)
        const building2 = new GraphNode('building2', 'building', 450, 640); // SCIT Lab (2)
        const building4 = new GraphNode('building4', 'building', 380, 820); // Building 4
        const building5 = new GraphNode('building5', 'building', 640, 520); // SOBA (5)
        const building8 = new GraphNode('building8', 'building', 660, 640); // FELS (8)
        const building9 = new GraphNode('building9', 'building', 580, 580); // Building 9
        const building18 = new GraphNode('building18', 'building', 580, 380); // Building 18
        const building19 = new GraphNode('building19', 'building', 650, 340); // Building 19
        const building21 = new GraphNode('building21', 'building', 480, 340); // Building 21
        const building22 = new GraphNode('building22', 'building', 720, 720); // COBAM (22)
        const building23 = new GraphNode('building23', 'building', 740, 840); // Building 23
        const building25 = new GraphNode('building25', 'building', 700, 1040); // Building 25
        const building29 = new GraphNode('building29', 'building', 280, 420); // Building 29
        const building30 = new GraphNode('building30', 'building', 540, 200); // Building 30
        const building32 = new GraphNode('building32', 'building', 800, 340); // Building 32
        const building45 = new GraphNode('building45', 'building', 160, 1140); // Building 45
        const building47 = new GraphNode('building47', 'building', 340, 620); // Building 47
        const building48 = new GraphNode('building48', 'building', 300, 560); // Building 48
        const building49 = new GraphNode('building49', 'building', 280, 540); // Building 49
        const building50 = new GraphNode('building50', 'building', 300, 520); // Building 50
        
        // Gates
        const mainGate = new GraphNode('main gate', 'building', 520, 1280); // Main entrance (bottom center)
        const walkinGate = new GraphNode('walkin gate', 'building', 140, 180); // Top left
        const backGate = new GraphNode('back gate', 'building', 820, 900); // Right side
        
        // Walkway nodes - Major intersections and path segments
        // These are strategically placed to connect buildings
        
        // Central area walkways
        const walkway1 = new GraphNode('walkway1', 'walkway', 520, 1200); // Near main gate
        const walkway2 = new GraphNode('walkway2', 'walkway', 520, 1100);
        const walkway3 = new GraphNode('walkway3', 'walkway', 520, 1000);
        const walkway4 = new GraphNode('walkway4', 'walkway', 520, 900);
        const walkway5 = new GraphNode('walkway5', 'walkway', 520, 800);
        const walkway6 = new GraphNode('walkway6', 'walkway', 520, 700);
        const walkway7 = new GraphNode('walkway7', 'walkway', 520, 600);
        const walkway8 = new GraphNode('walkway8', 'walkway', 520, 500);
        const walkway9 = new GraphNode('walkway9', 'walkway', 520, 400);
        const walkway10 = new GraphNode('walkway10', 'walkway', 520, 300);
        
        // East-West walkways
        const walkway11 = new GraphNode('walkway11', 'walkway', 420, 640); // Near building 2
        const walkway12 = new GraphNode('walkway12', 'walkway', 580, 640); // Near building 8
        const walkway13 = new GraphNode('walkway13', 'walkway', 640, 640); // Near building 8
        const walkway14 = new GraphNode('walkway14', 'walkway', 700, 640); // Toward building 22
        
        // Around building 22 area
        const walkway15 = new GraphNode('walkway15', 'walkway', 720, 680);
        const walkway16 = new GraphNode('walkway16', 'walkway', 720, 760);
        const walkway17 = new GraphNode('walkway17', 'walkway', 720, 840); // Near building 23
        
        // Lower area (building 25)
        const walkway18 = new GraphNode('walkway18', 'walkway', 650, 900);
        const walkway19 = new GraphNode('walkway19', 'walkway', 650, 1000);
        const walkway20 = new GraphNode('walkway20', 'walkway', 700, 1040); // Near building 25
        
        // Left side (buildings 47, 48, 49, 50)
        const walkway21 = new GraphNode('walkway21', 'walkway', 340, 580);
        const walkway22 = new GraphNode('walkway22', 'walkway', 300, 580);
        const walkway23 = new GraphNode('walkway23', 'walkway', 280, 560);
        
        // Upper area (buildings 18, 19, 21, 30)
        const walkway24 = new GraphNode('walkway24', 'walkway', 480, 360);
        const walkway25 = new GraphNode('walkway25', 'walkway', 580, 360);
        const walkway26 = new GraphNode('walkway26', 'walkway', 650, 360);
        const walkway27 = new GraphNode('walkway27', 'walkway', 540, 240);
        
        // Building 29 area
        const walkway28 = new GraphNode('walkway28', 'walkway', 280, 440);
        const walkway29 = new GraphNode('walkway29', 'walkway', 320, 420);
        
        // Building 5 (SOBA) connections
        const walkway30 = new GraphNode('walkway30', 'walkway', 640, 560);
        const walkway31 = new GraphNode('walkway31', 'walkway', 640, 600);
        
        // Building 4 connection
        const walkway32 = new GraphNode('walkway32', 'walkway', 420, 820);
        const walkway33 = new GraphNode('walkway33', 'walkway', 450, 800);
        
        // Roundabout/intersection nodes
        const roundabout1 = new GraphNode('roundabout1', 'walkway', 520, 720); // Central roundabout
        const roundabout2 = new GraphNode('roundabout2', 'walkway', 520, 560); // Mid campus
        
        // Add all nodes to the graph
        this.buildingGraph.set('building1', building1);
        this.buildingGraph.set('building2', building2);
        this.buildingGraph.set('building4', building4);
        this.buildingGraph.set('building5', building5);
        this.buildingGraph.set('building8', building8);
        this.buildingGraph.set('building9', building9);
        this.buildingGraph.set('building18', building18);
        this.buildingGraph.set('building19', building19);
        this.buildingGraph.set('building21', building21);
        this.buildingGraph.set('building22', building22);
        this.buildingGraph.set('building23', building23);
        this.buildingGraph.set('building25', building25);
        this.buildingGraph.set('building29', building29);
        this.buildingGraph.set('building30', building30);
        this.buildingGraph.set('building32', building32);
        this.buildingGraph.set('building45', building45);
        this.buildingGraph.set('building47', building47);
        this.buildingGraph.set('building48', building48);
        this.buildingGraph.set('building49', building49);
        this.buildingGraph.set('building50', building50);
        this.buildingGraph.set('main gate', mainGate);
        this.buildingGraph.set('walkin gate', walkinGate);
        this.buildingGraph.set('back gate', backGate);
        
        // Add walkway nodes
        this.buildingGraph.set('walkway1', walkway1);
        this.buildingGraph.set('walkway2', walkway2);
        this.buildingGraph.set('walkway3', walkway3);
        this.buildingGraph.set('walkway4', walkway4);
        this.buildingGraph.set('walkway5', walkway5);
        this.buildingGraph.set('walkway6', walkway6);
        this.buildingGraph.set('walkway7', walkway7);
        this.buildingGraph.set('walkway8', walkway8);
        this.buildingGraph.set('walkway9', walkway9);
        this.buildingGraph.set('walkway10', walkway10);
        this.buildingGraph.set('walkway11', walkway11);
        this.buildingGraph.set('walkway12', walkway12);
        this.buildingGraph.set('walkway13', walkway13);
        this.buildingGraph.set('walkway14', walkway14);
        this.buildingGraph.set('walkway15', walkway15);
        this.buildingGraph.set('walkway16', walkway16);
        this.buildingGraph.set('walkway17', walkway17);
        this.buildingGraph.set('walkway18', walkway18);
        this.buildingGraph.set('walkway19', walkway19);
        this.buildingGraph.set('walkway20', walkway20);
        this.buildingGraph.set('walkway21', walkway21);
        this.buildingGraph.set('walkway22', walkway22);
        this.buildingGraph.set('walkway23', walkway23);
        this.buildingGraph.set('walkway24', walkway24);
        this.buildingGraph.set('walkway25', walkway25);
        this.buildingGraph.set('walkway26', walkway26);
        this.buildingGraph.set('walkway27', walkway27);
        this.buildingGraph.set('walkway28', walkway28);
        this.buildingGraph.set('walkway29', walkway29);
        this.buildingGraph.set('walkway30', walkway30);
        this.buildingGraph.set('walkway31', walkway31);
        this.buildingGraph.set('walkway32', walkway32);
        this.buildingGraph.set('walkway33', walkway33);
        this.buildingGraph.set('roundabout1', roundabout1);
        this.buildingGraph.set('roundabout2', roundabout2);
        
        // Create edges (bidirectional connections)
        // Main vertical path from main gate upward
        mainGate.addBidirectionalNeighbor(walkway1);
        walkway1.addBidirectionalNeighbor(walkway2);
        walkway2.addBidirectionalNeighbor(walkway3);
        walkway3.addBidirectionalNeighbor(walkway4);
        walkway4.addBidirectionalNeighbor(walkway5);
        walkway5.addBidirectionalNeighbor(roundabout1);
        roundabout1.addBidirectionalNeighbor(walkway6);
        walkway6.addBidirectionalNeighbor(walkway7);
        walkway7.addBidirectionalNeighbor(roundabout2);
        roundabout2.addBidirectionalNeighbor(walkway8);
        walkway8.addBidirectionalNeighbor(walkway9);
        walkway9.addBidirectionalNeighbor(walkway10);
        
        // Building 1 (Engineering) connections
        building1.addBidirectionalNeighbor(roundabout1);
        building1.addBidirectionalNeighbor(walkway6);
        
        // Building 2 (SCIT) connections
        building2.addBidirectionalNeighbor(walkway11);
        walkway11.addBidirectionalNeighbor(walkway6);
        walkway11.addBidirectionalNeighbor(roundabout1);
        
        // Building 8 (FELS) connections
        building8.addBidirectionalNeighbor(walkway12);
        building8.addBidirectionalNeighbor(walkway13);
        walkway12.addBidirectionalNeighbor(roundabout1);
        walkway13.addBidirectionalNeighbor(walkway12);
        walkway13.addBidirectionalNeighbor(walkway14);
        
        // Building 22 (COBAM) connections
        building22.addBidirectionalNeighbor(walkway15);
        walkway14.addBidirectionalNeighbor(walkway15);
        walkway15.addBidirectionalNeighbor(walkway16);
        walkway16.addBidirectionalNeighbor(walkway17);
        
        // Building 23 connections
        building23.addBidirectionalNeighbor(walkway17);
        walkway17.addBidirectionalNeighbor(walkway18);
        
        // Building 25 connections
        walkway18.addBidirectionalNeighbor(walkway19);
        walkway19.addBidirectionalNeighbor(walkway20);
        building25.addBidirectionalNeighbor(walkway20);
        
        // Back gate connection
        backGate.addBidirectionalNeighbor(walkway17);
        backGate.addBidirectionalNeighbor(walkway18);
        
        // Building 4 connections
        building4.addBidirectionalNeighbor(walkway32);
        walkway32.addBidirectionalNeighbor(walkway33);
        walkway33.addBidirectionalNeighbor(walkway5);
        
        // Buildings 47, 48, 49, 50 connections (left side)
        building47.addBidirectionalNeighbor(walkway21);
        walkway21.addBidirectionalNeighbor(walkway22);
        walkway22.addBidirectionalNeighbor(walkway23);
        building48.addBidirectionalNeighbor(walkway22);
        building49.addBidirectionalNeighbor(walkway23);
        building50.addBidirectionalNeighbor(walkway23);
        walkway21.addBidirectionalNeighbor(roundabout2);
        walkway23.addBidirectionalNeighbor(walkway28);
        
        // Building 29 connections
        building29.addBidirectionalNeighbor(walkway29);
        walkway28.addBidirectionalNeighbor(walkway29);
        walkway29.addBidirectionalNeighbor(walkway9);
        
        // Upper area connections (buildings 18, 19, 21, 30)
        building21.addBidirectionalNeighbor(walkway24);
        walkway24.addBidirectionalNeighbor(walkway25);
        building18.addBidirectionalNeighbor(walkway25);
        walkway25.addBidirectionalNeighbor(walkway26);
        building19.addBidirectionalNeighbor(walkway26);
        walkway25.addBidirectionalNeighbor(walkway9);
        walkway10.addBidirectionalNeighbor(walkway27);
        building30.addBidirectionalNeighbor(walkway27);
        
        // Building 32 connections
        building32.addBidirectionalNeighbor(walkway26);
        
        // Building 5 (SOBA) connections
        building5.addBidirectionalNeighbor(walkway30);
        walkway30.addBidirectionalNeighbor(walkway31);
        walkway31.addBidirectionalNeighbor(roundabout2);
        walkway31.addBidirectionalNeighbor(walkway13);
        
        // Building 9 connections
        building9.addBidirectionalNeighbor(roundabout2);
        building9.addBidirectionalNeighbor(walkway25);
        
        // Walk-in gate connections (top left)
        walkinGate.addBidirectionalNeighbor(walkway28);
        walkinGate.addBidirectionalNeighbor(walkway29);
        
        // Building 45 connections
        building45.addBidirectionalNeighbor(walkway2);
        
        // Cross connections for better pathfinding
        walkway4.addBidirectionalNeighbor(walkway18);
        walkway3.addBidirectionalNeighbor(walkway19);
    }

    getBuildingGraph() {
        return this.buildingGraph;
    }

    getNode(nodeName) {
        return this.buildingGraph.get(nodeName);
    }
    
    getAllNodes() {
        return Array.from(this.buildingGraph.values());
    }
    
    getAllBuildings() {
        return Array.from(this.buildingGraph.values()).filter(node => node.type === 'building');
    }
    
    getAllWalkways() {
        return Array.from(this.buildingGraph.values()).filter(node => node.type === 'walkway');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GraphDatabase;
}
