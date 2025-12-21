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
        this.utechgraph = new Map();
        this.buildGraph();
    }

    buildGraph() {

    }

    getutechgraph() {
        return this.utechgraph;
    }

    getNode(nodeName) {
        return this.utechgraph.get(nodeName);
    }
    
    getAllNodes() {
        return Array.from(this.utechgraph.values());
    }
    
    getAllBuildings() {
        return Array.from(this.utechgraph.values()).filter(node => node.type === 'building');
    }
    
    getAllWalkways() {
        return Array.from(this.utechgraph.values()).filter(node => node.type === 'walkway');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GraphDatabase;
}
