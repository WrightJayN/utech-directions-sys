class Node {
	constructor(name, parent, type) {
		this.name = name;
		this.parent = parent;
		this.children = [];
		this.type = type; // "room" "floor" "building"
	}
}

class TreeDataStruct {
	constructor() {
		this.root = null;
		this.hashMap = new Map();
		this.buildTree();
	}

	buildTree() {
		this.root = new Node('root', null, null);

		const FENC = new Node('Faculty of Engineering and Computing', this.root, 'building');
		this.hashMap.set(FENC.name.toUpperCase(), FENC);


		const FENC_GROUND = new Node('FENC GROUND', FENC, 'floor');
		this.hashMap.set(FENC_GROUND.name.toUpperCase(), FENC_GROUND);

		const FENC_GROUND_ROOMS = [
			['engineering tuck shop'],
			['1a37'],
			['1a36'],
			['1a32'],
			['1a35'],
			['1a27'],
			['1a31'],
			['1a30'],
			['1a28'],
			['1a29'],
			['1a34'],
			['1a25'],
			['1a24'],
			['1a23'],
			['1a21'],
			['1a22'],
			['1a20'],
			['1a19'],
			['1a17'],
			['1a16'],
			['1a15'],
			['1a14b'],
			['1a14a'],
			['1a10'],
			['1a12'],
			['1ax'],
			['1a11'],
			['1a9'],
			['1a8b'],
			['1a8a'],
			['1a7b'],
			['1a7a'],
			['1a5'],
			['1a6'],
			['1a3'],
			['1a4'],
			['1a2a'],
			['1a1']
		];

		FENC_GROUND_ROOMS.forEach(([roomName]) => {
			const roomNode = new Node(roomName, FENC_GROUND, 'room');
			this.hashMap.set(roomName.toUpperCase(), roomNode);
		});

		const FENC_1 = new Node('FENC 1', FENC, 'floor');
		this.hashMap.set(FENC_1.name.toUpperCase(), FENC_1);

		const FENC_1_ROOMS = [
			['FENC STUDENT AFFAIR'],
			['1a58'],
			['1a68'],
			['1a67'],
			['1a59'],
			['1a66'],
			['1a65'],
			['1a60'],
			['1a64'],
			['1a61'],
		];

		FENC_1_ROOMS.forEach(([roomName]) => {
			const roomNode = new Node(roomName, FENC_1, 'room');
			this.hashMap.set(roomName.toUpperCase(), roomNode);
		});

		const SCIT = new Node('School of Computing and Information Technology', this.root, 'building');
		this.hashMap.set(SCIT.name.toUpperCase(), SCIT);

		const SCIT_GROUND = new Node('SCIT GROUND', SCIT, 'floor');
		this.hashMap.set(SCIT_GROUND.name.toUpperCase(), SCIT_GROUND);

		const SCIT_GROUND_ROOMS = [
			['Lab A'],
			['Lab B'],
			['Lab C']
		];

		SCIT_GROUND_ROOMS.forEach(([roomName]) => {
			const roomNode = new Node(roomName, SCIT_GROUND, 'room');
			this.hashMap.set(roomName.toUpperCase(), roomNode);
		});

		const SCIT_1 = new Node('SCIT 1', SCIT, 'floor');
		this.hashMap.set(SCIT_1.name.toUpperCase(), SCIT_1);
		const SCIT_1_ROOMS = [
			['2b8'],
			['2b7'],
			['2b6'],
			['2b5'],
			['2b4'],
			['2b3'],
		];

		SCIT_1_ROOMS.forEach(([roomName]) => {
			const roomNode = new Node(roomName, SCIT_1, 'room');
			this.hashMap.set(roomName.toUpperCase(), roomNode);
		});


		/*
		

		const floor1b = new Node('floor1b');
		const floor1bRooms = [
			['1b6'],
			['1b4'],
			['1b7'],
			['1b3'],
			['1b8'],
			['1b2'],
			['1b9'],
		];

		floor1bRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor1c = new Node('floor1c');
		const floor1cRooms = [
			['1c13'],
			['1c2'],
			['1c11'],
			['1c4'],
			['1c10'],
			['1c5'],
			['1c6'],
		];

		floor1cRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		
		

		

		const floor2c = new Node('floor2c');
		const floor2cRooms = [
		];

		floor2cRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		// building4
		const building4 = new Node('building4'uilding 4)');
		const floorbasement = new Node('basement');
		const floorbasementRooms = [
			['lt4'		];

		floorbasementRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor4a = new Node('floor4a');
		const floor4aRooms = [
			['4a2'],
			['4a3'],
			['4a4'],
			['4a5'],
			['4a6 soil mechanics laboratory'Mechanics Laboratory'],
			['4a7'],
			['4a8'],
			['4a9 concrete lab'Lab'],
			['4a10'],
			['4a11'],
			['4a12'],
			['4a16a'],
			['4a16b'],
			['4a17'],
		];

		floor4aRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor4b = new Node('floor4b');


		const floor4bRooms = [
			['4b6 computer lab'Lab'],
			['4b4 sblm office'Office'],
			['4b3 reference room'Room'],
			['4b5 conference room'Room'],
			['4b2 csa administration'Administration'],
			['4b9'],
			['4b10'],
			['4b11 computer lab'Lab'],
			['4b12'],
			['4b16'],
		];

		floor4bRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor4c = new Node('floor4c');
		const floor4cRooms = [
			['4c17'],
			['4c14'],
			['4c14a'],
			['4c13'],
			['4c12'],
			['4c9'],
			['4c8 computer lab'Lab'],
			['4c7 computer lab'Lab'],
			['4c6'],
			['4c5'],
		];

		floor4cRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		// building5
		const building5 = new Node('building5'uilding 5)');
		
		const floor5a = new Node('floor5a');
		const floor5aRooms = [
			['5a6'],
			['5a5'],
			['5a4'],
			['5a3'],
			['5a2'],
			['5a1'],
		];

		floor5aRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor5b = new Node('floor5b');
		const floor5bRooms = [
			['5b1'],
			['5b2'],
			['5b3'],
			['5b4'],
			['5b5'],
			['5b6'],
			['5b8'],
		];

		floor5bRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor5c = new Node('floor5c');
		const floor5cRooms = [
		];

		floor5cRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		// building8
		const building8 = new Node('building8'uilding 8)');
		const floor8a = new Node('floor8a');
		const floor8aRooms = [
			['8a2 computer lab'Computer Lab'],
			['8a3'],
			['8a1b'],
			['8a1a'],
			['8a4'],
			['8a6'],
			['lt 9'9'],
			['lt 10'10'],
		];

		floor8aRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor8b = new Node('floor8b');
		const floor8bRooms = [
			['8b1a'],
			['8b1b'],
			['8b5'],
			['8b2'],
			['lt10b'10B'],
		];

		floor8bRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor8c = new Node('floor8c');
		const floor8cRooms = [
			['8c7a'],
			['8c6a'],
			['8c3'],
			['8c2 computer lab'Computer Lab'],
			['8c11'],
			['8c2'],
			['8c1'],
			['lt9b'9B'],
		];

		floor8cRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		// buildingltbsdbld8
		const ltbsdbld8 = new Node('ltbsdbld8'beside FELS (building 8)');
		const floorltbsdbld8a = new Node('floorltbsdbld8a'(Basement)');
		const floorltbsdbld8aRooms = [
			['lt10a'],
		];

		floorltbsdbld8aRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floorltbsdbld8b = new Node('floorltbsdbld8b'(Ground)');
		const floorltbsdbld8bRooms = [
			['lt9'],
		];

		floorltbsdbld8bRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floorltbsdbld8c = new Node('floorltbsdbld8c');
		
		const floorltbsdbld8cRooms = [
			['lt10b'],
		];

		floorltbsdbld8cRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floorltbsdbld8d = new Node('floorltbsdbld8d');
		const floorltbsdbld8dRooms = [
			['lt9b'],
		];

		floorltbsdbld8dRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		// building22
		const building22 = new Node('building22'uilding 22)');
		const floor22a = new Node('floor22a');
		const floor22aRooms = [
		];

		floor22aRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor22b = new Node('floor22b');
		const floor22bRooms = [
			['22b1'],
			['22b2'],
			['22b3 computer lab'Computer Lab'],
			['22b4 computer lab'Computer Lab'],
		];

		floor22bRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor22c = new Node('floor22c');
		const floor22cRooms = [
			['22c2 computer lab'Computer Lab'],
		];

		floor22cRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		// building47
		const building47 = new Node('building47'(Building 47)');
		const floor47a = new Node('floor47a');
			const floor47aRooms = [
			['47a1'],
			['47a2'],
			['47a3'],
			['47a4'],
			['47a5'],
			['47a6'],
			['47a7'],
			['47a8'],
		];

		floor47aRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor47b = new Node('floor47b');
			const floor47bRooms = [
			['47b1'],
			['47b2 computer lab'Computer Lab'],
			['47b3 computer lab'Computer Lab'],
			['47b4'],
			['47b5'],
			['47b6'],
			['47b7'],
			['47b8'],
		];

		floor47bRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floor47c = new Node('floor47c');
		const floor47cRooms = [
			['47c1'],
			['47c2'],
			['47c3'],
			['47c4'],
		];

		floor47cRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		// buildingltbsdbld47
		const ltbsdbld47 = new Node('ltbsdbld47'beside Shared Facilities (building 47)');
		const floorltbsdbld47a = new Node('floorltbsdbld47a');
		const floorltbsdbld47aRooms = [
			['lt49'			['lt50'		];

		floorltbsdbld47aRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		const floorltbsdbld47b = new Node('floorltbsdbld47b');
		const floorltbsdbld47bRooms = [
		];

		floorltbsdbld47bRooms.forEach(([roomName]) => {
			const roomNode = new Node(roomName);
			this.hashMap.set(roomName.toLowerCase(), roomNode);
		});

		//Gates
		const walkin_gate = new Node('walkin gate'n Gate');
		his.hashMap.set('walkin gate', walkin_gate);

		const back_gate = new Node('back gate');
		his.hashMap.set('back gate', back_gate);

		const main_gate = new Node('main gate');
		his.hashMap.set('main gate', main_gate);
		*/
	}

	getHashMap() {
		return this.hashMap;
	}
}

export {TreeDataStruct};
