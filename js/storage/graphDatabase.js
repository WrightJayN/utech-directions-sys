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
        // Created Nodes
        const FENC = new GraphNode('Faculty of Engineering and Computing', 'building', 1805, 1614);
        const building2 = new GraphNode('building2', 'building', 1573, 1754);
        const building4 = new GraphNode('building4', 'building', 1176, 2142);
        const building5 = new GraphNode('building5', 'building', 1330, 1969);
        const building8 = new GraphNode('building8', 'building', 1358, 1598);
        const ltbsdbld8 = new GraphNode('ltbsdbld8', 'building', 1466, 1680);
        const building22 = new GraphNode('building22', 'building', 1266, 1859);
        const building47 = new GraphNode('building47', 'building', 666, 1643);
        const ltbsdbld47 = new GraphNode('ltbsdbld47', 'building', 670, 1480);
        const back_gate = new GraphNode('back gate', 'gate', 2133, 55);
        const walkin_gate = new GraphNode('walkin gate', 'gate', 1733, 3187);
        const main_gate = new GraphNode('main gate', 'gate', 1281, 3119);
        const w1 = new GraphNode('w1', 'walkway', 1335, 2911);
        const w2 = new GraphNode('w2', 'walkway', 1345, 2701);
        const w3 = new GraphNode('w3', 'walkway', 1331, 2553);
        const w4 = new GraphNode('w4', 'walkway', 1405, 2489);
        const w5 = new GraphNode('w5', 'walkway', 1515, 2479);
        const w6 = new GraphNode('w6', 'walkway', 1607, 2443);
        const w7 = new GraphNode('w7', 'walkway', 1723, 2437);
        const w8 = new GraphNode('w8', 'walkway', 1743, 2495);
        const w9 = new GraphNode('w9', 'walkway', 1791, 2589);
        const w10 = new GraphNode('w10', 'walkway', 1760, 2613);
        const w11 = new GraphNode('w11', 'walkway', 1797, 2817);
        const w12 = new GraphNode('w12', 'walkway', 1757, 3059);
        const w13 = new GraphNode('w13', 'walkway', 1550, 2999);
        const w14 = new GraphNode('w14', 'walkway', 1864, 3082);
        const w15 = new GraphNode('w15', 'walkway', 1888, 2903);
        const w16 = new GraphNode('w16', 'walkway', 1896, 2718);
        const w17 = new GraphNode('w17', 'walkway', 1722, 2235);
        const w18 = new GraphNode('w18', 'walkway', 1560, 2226);
        const w19 = new GraphNode('w19', 'walkway', 1730, 1614);
        const w20 = new GraphNode('w20', 'walkway', 1574, 1614);
        const w21 = new GraphNode('w21', 'walkway', 1469, 1606);
        const w22 = new GraphNode('w22', 'walkway', 1564, 2023);
        const w23 = new GraphNode('w23', 'walkway', 1723, 2171);
        const w24 = new GraphNode('w24', 'walkway', 1509, 1997);
        const w25 = new GraphNode('w25', 'walkway', 1328, 2003);
        const w26 = new GraphNode('w26', 'walkway', 1332, 1940);
        const w27 = new GraphNode('w27', 'walkway', 1178, 2112);
        const w28 = new GraphNode('w28', 'walkway', 1174, 2168);
        const w29 = new GraphNode('w29', 'walkway', 1164, 2469);
        const w30 = new GraphNode('w30', 'walkway', 1259, 2228);
        const w31 = new GraphNode('w31', 'walkway', 1171, 2232);
        const w32 = new GraphNode('w32', 'walkway', 1260, 1887);
        const w33 = new GraphNode('w33', 'walkway', 1358, 1869);
        const w34 = new GraphNode('w34', 'walkway', 1514, 1749);
        const w35 = new GraphNode('w35', 'walkway', 1567, 1700);
        const w36 = new GraphNode('w36', 'walkway', 1434, 1806);
        const w37 = new GraphNode('w37', 'walkway', 1350, 1784);
        const w38 = new GraphNode('w38', 'walkway', 1354, 1645);
        const w40 = new GraphNode('w40', 'walkway', 1128, 1589);
        const w39 = new GraphNode('w39', 'walkway', 1360, 1542);
        const w41 = new GraphNode('w41', 'walkway', 1284, 1782);
        const w42 = new GraphNode('w42', 'walkway', 1225, 1680);
        const w43 = new GraphNode('w43', 'walkway', 1309, 1520);
        const w44 = new GraphNode('w44', 'walkway', 1383, 1508);
        const w45 = new GraphNode('w45', 'walkway', 1706, 1470);
        const w48 = new GraphNode('w48', 'walkway', 767, 1647);
        const w46 = new GraphNode('w46', 'walkway', 1005, 1635);
        const w47 = new GraphNode('w47', 'walkway', 874, 1622);
        const w49 = new GraphNode('w49', 'walkway', 766, 1544);
        const w50 = new GraphNode('w50', 'walkway', 670, 1541);
        const w51 = new GraphNode('w51', 'walkway', 2077, 256);
        const w52 = new GraphNode('w52', 'walkway', 2055, 560);
        const w53 = new GraphNode('w53', 'walkway', 1617, 636);
        const w54 = new GraphNode('w54', 'walkway', 1536, 1126);
        const w55 = new GraphNode('w55', 'walkway', 1663, 1226);
        const w56 = new GraphNode('w56', 'walkway', 1078, 1185);
        const w57 = new GraphNode('w57', 'walkway', 857, 1213);
        const w58 = new GraphNode('w58', 'walkway', 850, 1545);
        const w59 = new GraphNode('w59', 'walkway', 1626, 1151);
        const w60 = new GraphNode('w60', 'walkway', 1726, 2021);
        const w61 = new GraphNode('w61', 'walkway', 1536, 941);

        // Add to utechgraph
        this.utechgraph.set('building1', FENC);
        this.utechgraph.set('building2', building2);
        this.utechgraph.set('building4', building4);
        this.utechgraph.set('building5', building5);
        this.utechgraph.set('building8', building8);
        this.utechgraph.set('ltbsdbld8', ltbsdbld8);
        this.utechgraph.set('building22', building22);
        this.utechgraph.set('building47', building47);
        this.utechgraph.set('ltbsdbld47', ltbsdbld47);
        this.utechgraph.set('back gate', back_gate);
        this.utechgraph.set('walkin gate', walkin_gate);
        this.utechgraph.set('main gate', main_gate);
        this.utechgraph.set('w1', w1);
        this.utechgraph.set('w2', w2);
        this.utechgraph.set('w3', w3);
        this.utechgraph.set('w4', w4);
        this.utechgraph.set('w5', w5);
        this.utechgraph.set('w6', w6);
        this.utechgraph.set('w7', w7);
        this.utechgraph.set('w8', w8);
        this.utechgraph.set('w9', w9);
        this.utechgraph.set('w10', w10);
        this.utechgraph.set('w11', w11);
        this.utechgraph.set('w12', w12);
        this.utechgraph.set('w13', w13);
        this.utechgraph.set('w14', w14);
        this.utechgraph.set('w15', w15);
        this.utechgraph.set('w16', w16);
        this.utechgraph.set('w17', w17);
        this.utechgraph.set('w18', w18);
        this.utechgraph.set('w19', w19);
        this.utechgraph.set('w20', w20);
        this.utechgraph.set('w21', w21);
        this.utechgraph.set('w22', w22);
        this.utechgraph.set('w23', w23);
        this.utechgraph.set('w24', w24);
        this.utechgraph.set('w25', w25);
        this.utechgraph.set('w26', w26);
        this.utechgraph.set('w27', w27);
        this.utechgraph.set('w28', w28);
        this.utechgraph.set('w29', w29);
        this.utechgraph.set('w30', w30);
        this.utechgraph.set('w31', w31);
        this.utechgraph.set('w32', w32);
        this.utechgraph.set('w33', w33);
        this.utechgraph.set('w34', w34);
        this.utechgraph.set('w35', w35);
        this.utechgraph.set('w36', w36);
        this.utechgraph.set('w37', w37);
        this.utechgraph.set('w38', w38);
        this.utechgraph.set('w40', w40);
        this.utechgraph.set('w39', w39);
        this.utechgraph.set('w41', w41);
        this.utechgraph.set('w42', w42);
        this.utechgraph.set('w43', w43);
        this.utechgraph.set('w44', w44);
        this.utechgraph.set('w45', w45);
        this.utechgraph.set('w48', w48);
        this.utechgraph.set('w46', w46);
        this.utechgraph.set('w47', w47);
        this.utechgraph.set('w49', w49);
        this.utechgraph.set('w50', w50);
        this.utechgraph.set('w51', w51);
        this.utechgraph.set('w52', w52);
        this.utechgraph.set('w53', w53);
        this.utechgraph.set('w54', w54);
        this.utechgraph.set('w55', w55);
        this.utechgraph.set('w56', w56);
        this.utechgraph.set('w57', w57);
        this.utechgraph.set('w58', w58);
        this.utechgraph.set('w59', w59);
        this.utechgraph.set('w60', w60);
        this.utechgraph.set('w61', w61);

        // Connections
        main_gate.addBidirectionalNeighbor(w1);
        w1.addBidirectionalNeighbor(w2);
        w2.addBidirectionalNeighbor(w3);
        w3.addBidirectionalNeighbor(w4);
        w4.addBidirectionalNeighbor(w5);
        w5.addBidirectionalNeighbor(w6);
        w7.addBidirectionalNeighbor(w8);
        w6.addBidirectionalNeighbor(w7);
        w8.addBidirectionalNeighbor(w9);
        w9.addBidirectionalNeighbor(w10);
        w10.addBidirectionalNeighbor(w11);
        w11.addBidirectionalNeighbor(w12);
        w13.addBidirectionalNeighbor(w12);
        w13.addBidirectionalNeighbor(w1);
        w12.addBidirectionalNeighbor(w14);
        walkin_gate.addBidirectionalNeighbor(w12);
        w14.addBidirectionalNeighbor(w15);
        w15.addBidirectionalNeighbor(w16);
        w16.addBidirectionalNeighbor(w9);
        w19.addBidirectionalNeighbor(FENC);
        w21.addBidirectionalNeighbor(w20);
        w21.addBidirectionalNeighbor(ltbsdbld8);
        w21.addBidirectionalNeighbor(building8);
        w18.addBidirectionalNeighbor(w17);
        w7.addBidirectionalNeighbor(w17);
        w17.addBidirectionalNeighbor(w23);
        w23.addBidirectionalNeighbor(w22);
        w20.addBidirectionalNeighbor(w19);
        w25.addBidirectionalNeighbor(w24);
        w24.addBidirectionalNeighbor(w22);
        w25.addBidirectionalNeighbor(building5);
        building5.addBidirectionalNeighbor(w26);
        w27.addBidirectionalNeighbor(w25);
        building4.addBidirectionalNeighbor(w27);
        w28.addBidirectionalNeighbor(building4);
        w29.addBidirectionalNeighbor(w3);
        w29.addBidirectionalNeighbor(w30);
        w30.addBidirectionalNeighbor(w31);
        w31.addBidirectionalNeighbor(w28);
        w26.addBidirectionalNeighbor(w32);
        w32.addBidirectionalNeighbor(building22);
        w26.addBidirectionalNeighbor(w33);
        w33.addBidirectionalNeighbor(w36);
        w36.addBidirectionalNeighbor(w34);
        w34.addBidirectionalNeighbor(w35);
        w35.addBidirectionalNeighbor(w20);
        w33.addBidirectionalNeighbor(w37);
        w37.addBidirectionalNeighbor(w38);
        w38.addBidirectionalNeighbor(building8);
        building8.addBidirectionalNeighbor(w39);
        w41.addBidirectionalNeighbor(w37);
        w41.addBidirectionalNeighbor(w33);
        w41.addBidirectionalNeighbor(w42);
        w42.addBidirectionalNeighbor(w40);
        w40.addBidirectionalNeighbor(building8);
        w39.addBidirectionalNeighbor(w44);
        w39.addBidirectionalNeighbor(w43);
        w43.addBidirectionalNeighbor(w44);
        building2.addBidirectionalNeighbor(w35);
        w40.addBidirectionalNeighbor(w43);
        w19.addBidirectionalNeighbor(w45);
        w44.addBidirectionalNeighbor(w45);
        w47.addBidirectionalNeighbor(w46);
        w46.addBidirectionalNeighbor(w40);
        w48.addBidirectionalNeighbor(w47);
        building47.addBidirectionalNeighbor(w48);
        w49.addBidirectionalNeighbor(w50);
        w48.addBidirectionalNeighbor(w49);
        w50.addBidirectionalNeighbor(ltbsdbld47);
        w58.addBidirectionalNeighbor(w49);
        w58.addBidirectionalNeighbor(w57);
        w57.addBidirectionalNeighbor(w56);
        w56.addBidirectionalNeighbor(w40);
        w56.addBidirectionalNeighbor(w54);
        w59.addBidirectionalNeighbor(w54);
        w59.addBidirectionalNeighbor(w55);
        w45.addBidirectionalNeighbor(w55);
        w53.addBidirectionalNeighbor(w52);
        w51.addBidirectionalNeighbor(w52);
        back_gate.addBidirectionalNeighbor(w51);
        w23.addBidirectionalNeighbor(w60);
        w22.addBidirectionalNeighbor(w60);
        w60.addBidirectionalNeighbor(w19);
        w54.addBidirectionalNeighbor(w61);
        w61.addBidirectionalNeighbor(w53);
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

export {GraphDatabase};