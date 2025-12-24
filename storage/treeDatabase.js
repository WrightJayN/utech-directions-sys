/**
 * Tree Database
 * Creates the tree structure for UTech campus navigation
 * Hierarchy: Root -> Building -> Floor -> Room
 * 
 * Tree Node Structure:
 * - name: string
 * - worded_direction: string
 * - parent: t_node
 * - children: t_node[]
 */

class TreeNode {
    constructor(name, worded_direction, parent = null) {
        this.name = name;
        this.worded_direction = worded_direction;
        this.parent = parent;
        this.children = [];
    }

    addChild(childNode) {
        this.children.push(childNode);
        childNode.parent = this;
    }
}

class TreeDatabase {
    constructor() {
        this.root = null;
        this.roomsHashMap = new Map();
        this.buildTree();
    }

    buildTree() {
        // Create Root Node
        this.root = new TreeNode('root', 'Starting point');

        // Building 1 - Engineering
        const building1 = new TreeNode('building1', 'Go to Engineering Building (Building 1)');
        this.root.addChild(building1);

        // Building 1 - Ground Floor
        const floor1Ground = new TreeNode('floor1ground', 'Go to Ground Floor');
        building1.addChild(floor1Ground);

        const floor1GroundRooms = [
            ['engineering tuck shop', 'Go to Engineering tuck shop'],
            ['1a37', 'Go to room 1A37'],
            ['1a36', 'Go to room 1A36'],
            ['1a32', 'Go to room 1A32'],
            ['1a35', 'Go to room 1A35'],
            ['1a27', 'Go to room 1A27'],
            ['1a31', 'Go to room 1A31'],
            ['1a30', 'Go to room 1A30'],
            ['1a28', 'Go to room 1A28'],
            ['1a29', 'Go to room 1A29'],
            ['1a34', 'Go to room 1A34'],
            ['1a25', 'Go to room 1A25'],
            ['1a24', 'Go to room 1A24'],
            ['1a23', 'Go to room 1A23'],
            ['1a21', 'Go to room 1A21'],
            ['1a22', 'Go to room 1A22'],
            ['1a20', 'Go to room 1A20'],
            ['1a19', 'Go to room 1A19'],
            ['1a17', 'Go to room 1A17'],
            ['1a16', 'Go to room 1A16'],
            ['1a15', 'Go to room 1A15'],
            ['1a14b', 'Go to room 1A14B'],
            ['1a14a', 'Go to room 1A14A'],
            ['1a10', 'Go to room 1A10'],
            ['1a12', 'Go to room 1A12'],
            ['1ax', 'Go to room 1AX'],
            ['1a11', 'Go to room 1A11'],
            ['1a9', 'Go to room 1A9'],
            ['1a8b', 'Go to room 1A8B'],
            ['1a8a', 'Go to room 1A8A'],
            ['1a7b', 'Go to room 1A7B'],
            ['1a7a', 'Go to room 1A7A'],
            ['1a5', 'Go to room 1A5'],
            ['1a6', 'Go to room 1A6'],
            ['1a3', 'Go to room 1A3'],
            ['1a4', 'Go to room 1A4'],
            ['1a2a', 'Go to room 1A2A'],
            ['1a1', 'Go to room 1A1']
        ];

        floor1GroundRooms.forEach(([roomName, direction]) => {
            const roomNode = new TreeNode(roomName, direction);
            floor1Ground.addChild(roomNode);
            this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
        });

        // Building 1 - 1st Floor A
        const floor1A = new TreeNode('floor1a', 'Go to 1st Floor (Floor A)');
        building1.addChild(floor1A);

        const floor1ARooms = [
            ['fenc student affair', 'Go to FENC Student Affairs'],
            ['1a58', 'Go to room 1A58'],
            ['1a68', 'Go to room 1A68'],
            ['1a67', 'Go to room 1A67'],
            ['1a59', 'Go to room 1A59'],
            ['1a66', 'Go to room 1A66'],
            ['1a65', 'Go to room 1A65'],
            ['1a60', 'Go to room 1A60'],
            ['1a64', 'Go to room 1A64'],
            ['1a61', 'Go to room 1A61']
        ];

        floor1ARooms.forEach(([roomName, direction]) => {
            const roomNode = new TreeNode(roomName, direction);
            floor1A.addChild(roomNode);
            this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
        });

        // Building 1 - 2nd Floor B
        const floor1B = new TreeNode('floor1b', 'Go to 2nd Floor (Floor B)');
        building1.addChild(floor1B);

        const floor1BRooms = [
            ['1b6', 'Go to room 1B6'],
            ['1b4', 'Go to room 1B4'],
            ['1b7', 'Go to room 1B7'],
            ['1b3', 'Go to room 1B3'],
            ['1b8', 'Go to room 1B8'],
            ['1b2', 'Go to room 1B2'],
            ['1b9', 'Go to room 1B9']
        ];

        floor1BRooms.forEach(([roomName, direction]) => {
            const roomNode = new TreeNode(roomName, direction);
            floor1B.addChild(roomNode);
            this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
        });

        // Building 1 - 3rd Floor C
        const floor1C = new TreeNode('floor1c', 'Go to 3rd Floor (Floor C)');
        building1.addChild(floor1C);

        const floor1CRooms = [
            ['1c13', 'Go to room 1C13'],
            ['1c2', 'Go to room 1C2'],
            ['1c11', 'Go to room 1C11'],
            ['1c4', 'Go to room 1C4'],
            ['1c10', 'Go to room 1C10'],
            ['1c5', 'Go to room 1C5'],
            ['1c6', 'Go to room 1C6']
        ];

        floor1CRooms.forEach(([roomName, direction]) => {
            const roomNode = new TreeNode(roomName, direction);
            floor1C.addChild(roomNode);
            this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
        });

        // Building 2 - SCIT Lab
        const building2 = new TreeNode('building2', 'Go to SCIT Lab (Building 2)');
        this.root.addChild(building2);

        // Building 2 - 2nd Floor B
        const floor2B = new TreeNode('floor2b', 'Go to 2nd Floor (Floor B)');
        building2.addChild(floor2B);

        const floor2BRooms = [
            ['2b8', 'Go to room 2B8'],
            ['2b7', 'Go to room 2B7'],
            ['2b6', 'Go to room 2B6'],
            ['2b5', 'Go to room 2B5'],
            ['2b4', 'Go to room 2B4'],
            ['2b3', 'Go to room 2B3']
        ];

        floor2BRooms.forEach(([roomName, direction]) => {
            const roomNode = new TreeNode(roomName, direction);
            floor2B.addChild(roomNode);
            this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
        });

        // Building 8 - FELS
        const building8 = new TreeNode('building8', 'Go to FELS (Building 8)');
        this.root.addChild(building8);

        // Building 8 - 1st Floor A
        const floor8A = new TreeNode('floor8a', 'Go to 1st Floor (Floor A)');
        building8.addChild(floor8A);

        const floor8ARooms = [
            ['8a2 lab', 'Go to room 8A2 Lab'],
            ['8a3', 'Go to room 8A3'],
            ['8a1b', 'Go to room 8A1B'],
            ['8a1a', 'Go to room 8A1A'],
            ['8a4', 'Go to room 8A4'],
            ['8a6', 'Go to room 8A6'],
            ['lt 9', 'Go to Lecture Theatre 9'],
            ['lt 10', 'Go to Lecture Theatre 10']
        ];

        floor8ARooms.forEach(([roomName, direction]) => {
            const roomNode = new TreeNode(roomName, direction);
            floor8A.addChild(roomNode);
            this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
        });

        // Building 8 - 2nd Floor B
        const floor8B = new TreeNode('floor8b', 'Go to 2nd Floor (Floor B)');
        building8.addChild(floor8B);

        const floor8BRooms = [
            ['8b1a', 'Go to room 8B1A'],
            ['8b1b', 'Go to room 8B1B'],
            ['8b5', 'Go to room 8B5'],
            ['8b2', 'Go to room 8B2'],
            ['lt10b', 'Go to Lecture Theatre 10B']
        ];

        floor8BRooms.forEach(([roomName, direction]) => {
            const roomNode = new TreeNode(roomName, direction);
            floor8B.addChild(roomNode);
            this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
        });

        // Building 8 - 3rd Floor C
        const floor8C = new TreeNode('floor8c', 'Go to 3rd Floor (Floor C)');
        building8.addChild(floor8C);

        const floor8CRooms = [
            ['8c7a', 'Go to room 8C7A'],
            ['8c6a', 'Go to room 8C6A'],
            ['8c3', 'Go to room 8C3'],
            ['8c2 lab', 'Go to room 8C2 Lab'],
            ['8c11', 'Go to room 8C11'],
            ['8c2', 'Go to room 8C2'],
            ['8c1', 'Go to room 8C1'],
            ['lt9b', 'Go to Lecture Theatre 9B']
        ];

        floor8CRooms.forEach(([roomName, direction]) => {
            const roomNode = new TreeNode(roomName, direction);
            floor8C.addChild(roomNode);
            this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
        });

        // Building 22 - COBAM
        const building22 = new TreeNode('building22', 'Go to COBAM (Building 22)');
        this.root.addChild(building22);

        // Building 22 - 2nd Floor B
        const floor22B = new TreeNode('floor22b', 'Go to 2nd Floor (Floor B)');
        building22.addChild(floor22B);

        const floor22BRooms = [
            ['22b1', 'Go to room 22B1'],
            ['22b2', 'Go to room 22B2'],
            ['22b3 lab', 'Go to room 22B3 Lab'],
            ['22b4 lab', 'Go to room 22B4 Lab']
        ];

        floor22BRooms.forEach(([roomName, direction]) => {
            const roomNode = new TreeNode(roomName, direction);
            floor22B.addChild(roomNode);
            this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
        });

        // Building 22 - 3rd Floor C
        const floor22C = new TreeNode('floor22c', 'Go to 3rd Floor (Floor C)');
        building22.addChild(floor22C);

        const floor22CRooms = [
            ['22c2', 'Go to room 22C2']
        ];

        floor22CRooms.forEach(([roomName, direction]) => {
            const roomNode = new TreeNode(roomName, direction);
            floor22C.addChild(roomNode);
            this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
        });

        // Building 5 - SOBA
        const building5 = new TreeNode('building5', 'Go to SOBA (Building 5)');
        this.root.addChild(building5);

        // Building 5 - 1st Floor A
        const floor5A = new TreeNode('floor5a', 'Go to 1st Floor (Floor A)');
        building5.addChild(floor5A);

        const floor5ARooms = [
            ['5a6', 'Go to room 5A6'],
            ['5a5', 'Go to room 5A5'],
            ['5a4', 'Go to room 5A4'],
            ['5a3', 'Go to room 5A3'],
            ['5a2', 'Go to room 5A2'],
            ['5a1', 'Go to room 5A1']
        ];

        floor5ARooms.forEach(([roomName, direction]) => {
            const roomNode = new TreeNode(roomName, direction);
            floor5A.addChild(roomNode);
            this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
        });

        // Building 5 - 2nd Floor B
        const floor5B = new TreeNode('floor5b', 'Go to 2nd Floor (Floor B)');
        building5.addChild(floor5B);

        const floor5BRooms = [
            ['5b1', 'Go to room 5B1'],
            ['5b2', 'Go to room 5B2'],
            ['5b3', 'Go to room 5B3']
        ];

        floor5BRooms.forEach(([roomName, direction]) => {
            const roomNode = new TreeNode(roomName, direction);
            floor5B.addChild(roomNode);
            this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
        });

        // Add gates as direct children of root (no floors, no rooms under them)
        const mainGate = new TreeNode('main gate', 'Start at Main Gate');
        this.root.addChild(mainGate);
        this.roomsHashMap.set('main gate', mainGate);

        const walkInGate = new TreeNode('walkin gate', 'Start at Walk-In Gate');
        this.root.addChild(walkInGate);
        this.roomsHashMap.set('walkin gate', walkInGate);

        const backGate = new TreeNode('back gate', 'Start at Back Gate');
        this.root.addChild(backGate);
        this.roomsHashMap.set('back gate', backGate); 
    }

    getRoomsHashMap() {
        return this.roomsHashMap;
    }

    getRoot() {
        return this.root;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TreeDatabase;
}
