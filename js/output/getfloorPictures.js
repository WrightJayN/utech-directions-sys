class GetFloorPictures {

    static getFloorPicture(node) {
        const floorPictures = {
            'FENC GROUND': 'assets/floors/FENC_GROUND.jpg',
            'floor1a': 'assets/floors/FENC_1.jpg',
            'floor1b': 'assets/floors/FENC_2.jpg',
            'floor1c': 'assets/floors/FENC_3.jpg',
            'SCIT GROUND': 'assets/floors/SCIT_GROUND.jpg',
            'floor2b': 'assets/floors/SCIT_2.jpg',
            // 'floor2c': 'assets/floors/floor2c.jpg',
            'floor8a': 'assets/floors/floor8a.jpg',
            'floor8b': 'assets/floors/floor8b.jpg',
            'floor8c': 'assets/floors/floor8c.jpg',
            'floor22b': 'assets/floors/floor22b.jpg',
            'floor22c': 'assets/floors/floor22c.jpg',
            // 'floor22a': 'assets/floors/floor22a.jpg',
            // 'floor5a': 'assets/floors/floor5a.jpg',
            'floor5b': 'assets/floors/floor5b.jpg',
            // 'floor5c': 'assets/floors/floor5c.jpg',
            'floor47a': 'assets/floors/floor47a.jpg',
            'floor47b': 'assets/floors/floor47b.jpg',
            'floor47c': 'assets/floors/floor47c.jpg',
            'basement': 'assets/floors/basement.jpg',
            'floor4a': 'assets/floors/floor4a.jpg',
            'floor4b': 'assets/floors/floor4b.jpg',
            'floor4c': 'assets/floors/floor4c.jpg',
            // 'floorltbsdbld8a': 'assets/floors/floorltbsdbld8a.jpg',
            // 'floorltbsdbld8b': 'assets/floors/floorltbsdbld8b.jpg',
            // 'floorltbsdbld8c': 'assets/floors/floorltbsdbld8c.jpg',
            // 'floorltbsdbld8d': 'assets/floors/floorltbsdbld8d.jpg',
            // 'floorltbsdbld47a': 'assets/floors/floorltbsdbld47a.jpg',
            // 'floorltbsdbld47b': 'assets/floors/floorltbsdbld47b.jpg',
        };
        const floorName = node.name;
        return floorPictures[floorName];
    }
}

export { GetFloorPictures };
