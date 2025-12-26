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

		// building1
		const building1 = new TreeNode('building1', 'Go to Engineering Building (Building 1)');
		this.root.addChild(building1);

		const floor1ground = new TreeNode('floor1ground', 'Go to Ground Floor');
		building1.addChild(floor1ground);

		const floor1groundRooms = [
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
			['1a1', 'Go to room 1A1'],
		];

		floor1groundRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor1ground.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor1a = new TreeNode('floor1a', 'Go to 1st Floor (Floor A)');
		building1.addChild(floor1a);

		const floor1aRooms = [
			['fenc student affair', 'Go to FENC Student Affairs'],
			['1a58', 'Go to room 1A58'],
			['1a68', 'Go to room 1A68'],
			['1a67', 'Go to room 1A67'],
			['1a59', 'Go to room 1A59'],
			['1a66', 'Go to room 1A66'],
			['1a65', 'Go to room 1A65'],
			['1a60', 'Go to room 1A60'],
			['1a64', 'Go to room 1A64'],
			['1a61', 'Go to room 1A61'],
		];

		floor1aRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor1a.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor1b = new TreeNode('floor1b', 'Go to 2nd Floor (Floor B)');
		building1.addChild(floor1b);

		const floor1bRooms = [
			['1b6', 'Go to room 1B6'],
			['1b4', 'Go to room 1B4'],
			['1b7', 'Go to room 1B7'],
			['1b3', 'Go to room 1B3'],
			['1b8', 'Go to room 1B8'],
			['1b2', 'Go to room 1B2'],
			['1b9', 'Go to room 1B9'],
		];

		floor1bRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor1b.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor1c = new TreeNode('floor1c', 'Go to 3rd Floor (Floor C)');
		building1.addChild(floor1c);

		const floor1cRooms = [
			['1c13', 'Go to room 1C13'],
			['1c2', 'Go to room 1C2'],
			['1c11', 'Go to room 1C11'],
			['1c4', 'Go to room 1C4'],
			['1c10', 'Go to room 1C10'],
			['1c5', 'Go to room 1C5'],
			['1c6', 'Go to room 1C6'],
		];

		floor1cRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor1c.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		// building2
		const building2 = new TreeNode('building2', 'Go to SCIT Lab (Building 2)');
		this.root.addChild(building2);

		const floor2b = new TreeNode('floor2b', 'Go to 2nd Floor (Floor B)');
		building2.addChild(floor2b);

		const floor2bRooms = [
			['2b8', 'Go to room 2B8'],
			['2b7', 'Go to room 2B7'],
			['2b6', 'Go to room 2B6'],
			['2b5', 'Go to room 2B5'],
			['2b4', 'Go to room 2B4'],
			['2b3', 'Go to room 2B3'],
		];

		floor2bRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor2b.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor2a = new TreeNode('floor2a', 'Go to 1st Floor (Floor A)');
		building2.addChild(floor2a);

		const floor2aRooms = [
		];

		floor2aRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor2a.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor2c = new TreeNode('floor2c', 'Go to 3rd Floor (Floor C)');
		building2.addChild(floor2c);

		const floor2cRooms = [
		];

		floor2cRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor2c.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		// building8
		const building8 = new TreeNode('building8', 'Go to FELS (Building 8)');
		this.root.addChild(building8);

		const floor8a = new TreeNode('floor8a', 'Go to 1st Floor (Floor A)');
		building8.addChild(floor8a);

		const floor8aRooms = [
			['8a2 computer lab', 'Go to room 8A2 Computer Lab'],
			['8a3', 'Go to room 8A3'],
			['8a1b', 'Go to room 8A1B'],
			['8a1a', 'Go to room 8A1A'],
			['8a4', 'Go to room 8A4'],
			['8a6', 'Go to room 8A6'],
			['lt 9', 'Go to Lecture Theatre 9'],
			['lt 10', 'Go to Lecture Theatre 10'],
		];

		floor8aRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor8a.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor8b = new TreeNode('floor8b', 'Go to 2nd Floor (Floor B)');
		building8.addChild(floor8b);

		const floor8bRooms = [
			['8b1a', 'Go to room 8B1A'],
			['8b1b', 'Go to room 8B1B'],
			['8b5', 'Go to room 8B5'],
			['8b2', 'Go to room 8B2'],
			['lt10b', 'Go to Lecture Theatre 10B'],
		];

		floor8bRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor8b.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor8c = new TreeNode('floor8c', 'Go to 3rd Floor (Floor C)');
		building8.addChild(floor8c);

		const floor8cRooms = [
			['8c7a', 'Go to room 8C7A'],
			['8c6a', 'Go to room 8C6A'],
			['8c3', 'Go to room 8C3'],
			['8c2 computer lab', 'Go to room 8C2 Computer Lab'],
			['8c11', 'Go to room 8C11'],
			['8c2', 'Go to room 8C2'],
			['8c1', 'Go to room 8C1'],
			['lt9b', 'Go to Lecture Theatre 9B'],
		];

		floor8cRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor8c.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		// building22
		const building22 = new TreeNode('building22', 'Go to COBAM (Building 22)');
		this.root.addChild(building22);

		const floor22b = new TreeNode('floor22b', 'Go to 2nd Floor (Floor B)');
		building22.addChild(floor22b);

		const floor22bRooms = [
			['22b1', 'Go to room 22B1'],
			['22b2', 'Go to room 22B2'],
			['22b3 computer lab', 'Go to room 22B3 Computer Lab'],
			['22b4 computer lab', 'Go to room 22B4 Computer Lab'],
		];

		floor22bRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor22b.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor22c = new TreeNode('floor22c', 'Go to 3rd Floor (Floor C)');
		building22.addChild(floor22c);

		const floor22cRooms = [
			['22c2 computer lab', 'Go to room 22C2 Computer Lab'],
		];

		floor22cRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor22c.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor22a = new TreeNode('floor22a', 'Go to 1st Floor (Floor A)');
		building22.addChild(floor22a);

		const floor22aRooms = [
		];

		floor22aRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor22a.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		// building5
		const building5 = new TreeNode('building5', 'Go to SOBA (Building 5)');
		this.root.addChild(building5);

		const floor5a = new TreeNode('floor5a', 'Go to 1st Floor (Floor A)');
		building5.addChild(floor5a);

		const floor5aRooms = [
			['5a6', 'Go to room 5A6'],
			['5a5', 'Go to room 5A5'],
			['5a4', 'Go to room 5A4'],
			['5a3', 'Go to room 5A3'],
			['5a2', 'Go to room 5A2'],
			['5a1', 'Go to room 5A1'],
		];

		floor5aRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor5a.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor5b = new TreeNode('floor5b', 'Go to 2nd Floor (Floor B)');
		building5.addChild(floor5b);

		const floor5bRooms = [
			['5b1', 'Go to room 5B1'],
			['5b2', 'Go to room 5B2'],
			['5b3', 'Go to room 5B3'],
			['5b4', 'Go to room 5B4'],
			['5b5', 'Go to room 5B5'],
			['5b6', 'Go to room 5B6'],
			['5b8', 'Go to room 5B8'],
		];

		floor5bRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor5b.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor5c = new TreeNode('floor5c', 'Go to 3rd Floor (Floor C)');
		building5.addChild(floor5c);

		const floor5cRooms = [
		];

		floor5cRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor5c.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		// building47
		const building47 = new TreeNode('building47', 'Go to Shared Facilities (Building 47)');
		this.root.addChild(building47);

		const floor47a = new TreeNode('floor47a', 'Go to 1st Floor (Floor A)');
		building47.addChild(floor47a);

		const floor47aRooms = [
			['47a1', 'Go to room 47A1'],
			['47a2', 'Go to room 47A2'],
			['47a3', 'Go to room 47A3'],
			['47a4', 'Go to room 47A4'],
			['47a5', 'Go to room 47A5'],
			['47a6', 'Go to room 47A6'],
			['47a7', 'Go to room 47A7'],
			['47a8', 'Go to room 47A8'],
		];

		floor47aRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor47a.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor47b = new TreeNode('floor47b', 'Go to 2nd Floor (Floor B)');
		building47.addChild(floor47b);

		const floor47bRooms = [
			['47b1', 'Go to room 47B1'],
			['47b2 computer lab', 'Go to room 47B2 Computer Lab'],
			['47b3 computer lab', 'Go to room 47B3 Computer Lab'],
			['47b4', 'Go to room 47B4'],
			['47b5', 'Go to room 47B5'],
			['47b6', 'Go to room 47B6'],
			['47b7', 'Go to room 47B7'],
			['47b8', 'Go to room 47B8'],
		];

		floor47bRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor47b.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor47c = new TreeNode('floor47c', 'Go to 3rd Floor (Floor C)');
		building47.addChild(floor47c);

		const floor47cRooms = [
			['47c1', 'Go to room 47C1'],
			['47c2', 'Go to room 47C2'],
			['47c3', 'Go to room 47C3'],
			['47c4', 'Go to room 47C4'],
		];

		floor47cRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor47c.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		// building4
		const building4 = new TreeNode('building4', 'Go to FOBE (Building 4)');
		this.root.addChild(building4);

		const basement = new TreeNode('basement', 'Go to Basement Floor');
		building4.addChild(basement);

		const basementRooms = [
			['lt4', 'Go to room LT4'],
		];

		basementRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			basement.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor4a = new TreeNode('floor4a', 'Go to 1st Floor (Floor A)');
		building4.addChild(floor4a);

		const floor4aRooms = [
			['4a2', 'Go to room 4A2'],
			['4a3', 'Go to room 4A3'],
			['4a4', 'Go to room 4A4'],
			['4a5', 'Go to room 4A5'],
			['4a6 soil mechanics laboratory', 'Go to 4A6 Soil Mechanics Laboratory'],
			['4a7', 'Go to room 4A7'],
			['4a8', 'Go to room 4A8'],
			['4a9 concrete lab', 'Go to 4A9 Concrete Lab'],
			['4a10', 'Go to room 4A10'],
			['4a11', 'Go to room 4A11'],
			['4a12', 'Go to room 4A12'],
			['4a16a', 'Go to room 4A16A'],
			['4a16b', 'Go to room 4A16B'],
			['4a17', 'Go to room 4A17'],
		];

		floor4aRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor4a.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor4b = new TreeNode('floor4b', 'Go to 2nd Floor (Floor B)');
		building4.addChild(floor4b);

		const floor4bRooms = [
			['4b6 computer lab', 'Go to 4B6 Computer Lab'],
			['4b4 sblm office', 'Go to 4B4 SBLM Office'],
			['4b3 reference room', 'Go to 4B3 Reference Room'],
			['4b5 conference room', 'Go to 4B5 Conference Room'],
			['4b2 csa administration', 'Go to 4B2 CSA Administration'],
			['4b9', 'Go to room 4B9'],
			['4b10', 'Go to room 4B10'],
			['4b11 computer lab', 'Go to 4B11 Computer Lab'],
			['4b12', 'Go to room 4B12'],
			['4b16', 'Go to room 4B16'],
		];

		floor4bRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor4b.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor4c = new TreeNode('floor4c', 'Go to 3rd Floor (Floor C)');
		building4.addChild(floor4c);

		const floor4cRooms = [
			['4c17', 'Go to room 4C17'],
			['4c14', 'Go to room 4C14'],
			['4c14a', 'Go to room 4C14A'],
			['4c13', 'Go to room 4C13'],
			['4c12', 'Go to room 4C12'],
			['4c9', 'Go to room 4C9'],
			['4c8 computer lab', 'Go to 4C8 Computer Lab'],
			['4c7 computer lab', 'Go to 4C7 Computer Lab'],
			['4c6', 'Go to room 4C6'],
			['4c5', 'Go to room 4C5'],
		];

		floor4cRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floor4c.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		// buildingltbsdbld8
		const ltbsdbld8 = new TreeNode('ltbsdbld8', 'Go to Lecture Theatre beside FELS (building 8)');
		this.root.addChild(ltbsdbld8);

		const floorltbsdbld8a = new TreeNode('floorltbsdbld8a', 'Go to 1st Floor (Basement)');
		ltbsdbld8.addChild(floorltbsdbld8a);

		const floorltbsdbld8aRooms = [
			['lt10a', 'Go to room LT10A'],
		];

		floorltbsdbld8aRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floorltbsdbld8a.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floorltbsdbld8b = new TreeNode('floorltbsdbld8b', 'Go to 2nd Floor (Ground)');
		ltbsdbld8.addChild(floorltbsdbld8b);

		const floorltbsdbld8bRooms = [
			['lt9', 'Go to room LT9'],
		];

		floorltbsdbld8bRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floorltbsdbld8b.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floorltbsdbld8c = new TreeNode('floorltbsdbld8c', 'Go to 3rd Floor (Floor A)');
		ltbsdbld8.addChild(floorltbsdbld8c);

		const floorltbsdbld8cRooms = [
			['lt10b', 'Go to room LT10B'],
		];

		floorltbsdbld8cRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floorltbsdbld8c.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floorltbsdbld8d = new TreeNode('floorltbsdbld8d', 'Go to 3rd Floor (Floor B)');
		ltbsdbld8.addChild(floorltbsdbld8d);

		const floorltbsdbld8dRooms = [
			['lt9b', 'Go to room LT9B'],
		];

		floorltbsdbld8dRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floorltbsdbld8d.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		// buildingltbsdbld47
		const ltbsdbld47 = new TreeNode('ltbsdbld47', 'Go to Lecture Theatre beside Shared Facilities (building 47)');
		this.root.addChild(ltbsdbld47);

		const floorltbsdbld47a = new TreeNode('floorltbsdbld47a', 'Go to 1st floor (Floor A)');
		ltbsdbld47.addChild(floorltbsdbld47a);

		const floorltbsdbld47aRooms = [
			['lt49', 'Go to LT49'],
			['lt50', 'Go to LT50'],
		];

		floorltbsdbld47aRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floorltbsdbld47a.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floorltbsdbld47b = new TreeNode('floorltbsdbld47b', 'Go to 2nd floor (Floor B)');
		ltbsdbld47.addChild(floorltbsdbld47b);

		const floorltbsdbld47bRooms = [
		];

		floorltbsdbld47bRooms.forEach(([roomName, direction]) => {
			const roomNode = new TreeNode(roomName, direction);
			floorltbsdbld47b.addChild(roomNode);
			this.roomsHashMap.set(roomName.toLowerCase(), roomNode);
		});

		//Gates
		const walkin_gate = new TreeNode('walkin gate', 'Go to Walk-In Gate');
		this.root.addChild(walkin_gate);
		this.roomsHashMap.set('walkin gate', walkin_gate);

		const back_gate = new TreeNode('back gate', 'Go to Back Gate');
		this.root.addChild(back_gate);
		this.roomsHashMap.set('back gate', back_gate);

		const main_gate = new TreeNode('main gate', 'Go to Main Gate');
		this.root.addChild(main_gate);
		this.roomsHashMap.set('main gate', main_gate);

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
