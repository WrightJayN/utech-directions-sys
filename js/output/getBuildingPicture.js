class GetBuildingPicture {

    static getBuildingPicture(node) {
        const buildingPictures = {
            'Faculty of Engineering and Computing': 'assets/buildings/FENC.jpg',
            'building2': 'assets/buildings/SCIT.jpg',
            'building8': 'assets/buildings/building8.jpg',
            'building22': 'assets/buildings/building22.jpg',
            'building5': 'assets/buildings/building5.jpg',
            'building47': 'assets/buildings/building47.jpg',
            'building4': 'assets/buildings/building4.jpg',
            // 'ltbsdbld8': 'assets/buildings/ltbsdbld8.jpg',
            'ltbsdbld47': 'assets/buildings/ltbsdbld47.jpg',
            'walkin gate': 'assets/buildings/walkin_gate.jpg',
            'back gate': 'assets/buildings/back_gate.jpg',
            'main gate': 'assets/buildings/main_gate.jpg',
        };
        const buildingName = node.name;
        return buildingPictures[buildingName];
    }

}

export { GetBuildingPicture };
