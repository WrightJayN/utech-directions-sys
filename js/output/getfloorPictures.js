class GetFloorPictures {

    static getFloorPicture(node) {
        const floorPictures = {
            'FENC GROUND': 'assets/floors/FENC_GROUND.webp',
            'floor1a': 'assets/floors/FENC_1.webp',
            'floor1b': 'assets/floors/FENC_2.webp',
            'floor1c': 'assets/floors/FENC_3.webp',
            'SCIT GROUND': 'assets/floors/SCIT_GROUND.webp',
            'SCIT_1': 'assets/floors/SCIT_1.webp',
            'SCIT_2': 'assets/floors/SCIT_2.webp',
            'floor8a': 'assets/floors/floor8a.webp',
            'floor8b': 'assets/floors/floor8b.webp',
            'floor8c': 'assets/floors/floor8c.webp',
            'floor22b': 'assets/floors/floor22b.webp',
            'floor22c': 'assets/floors/floor22c.webp',
            // 'floor22a': 'assets/floors/floor22a.webp',
            // 'floor5a': 'assets/floors/floor5a.webp',
            'floor5b': 'assets/floors/floor5b.webp',
            // 'floor5c': 'assets/floors/floor5c.webp',
            'floor47a': 'assets/floors/floor47a.webp',
            'floor47b': 'assets/floors/floor47b.webp',
            'floor47c': 'assets/floors/floor47c.webp',
            'basement': 'assets/floors/basement.webp',
            'floor4a': 'assets/floors/floor4a.webp',
            'floor4b': 'assets/floors/floor4b.webp',
            'floor4c': 'assets/floors/floor4c.webp',
            // 'floorltbsdbld8a': 'assets/floors/floorltbsdbld8a.webp',
            // 'floorltbsdbld8b': 'assets/floors/floorltbsdbld8b.webp',
            // 'floorltbsdbld8c': 'assets/floors/floorltbsdbld8c.webp',
            // 'floorltbsdbld8d': 'assets/floors/floorltbsdbld8d.webp',
            // 'floorltbsdbld47a': 'assets/floors/floorltbsdbld47a.webp',
            // 'floorltbsdbld47b': 'assets/floors/floorltbsdbld47b.webp',
        };
        const floorName = node.name;
        return floorPictures[floorName];
    }
}

export { GetFloorPictures };
