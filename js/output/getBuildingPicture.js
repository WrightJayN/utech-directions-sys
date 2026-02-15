class GetBuildingPicture {

    static getBuildingPicture(node) {
        const buildingPictures = {
            'Faculty of Engineering and Computing': 'assets/buildings/FENC.webp',
            'School of Computing and Information Technology': 'assets/buildings/SCIT.webp',
            'building8': 'assets/buildings/building8.webp',
            'building22': 'assets/buildings/building22.webp',
            'building5': 'assets/buildings/building5.webp',
            'building47': 'assets/buildings/building47.webp',
            'building4': 'assets/buildings/building4.webp',
            // 'ltbsdbld8': 'assets/buildings/ltbsdbld8.webp',
            'ltbsdbld47': 'assets/buildings/ltbsdbld47.webp',
            'walkin gate': 'assets/buildings/walkin_gate.webp',
            'back gate': 'assets/buildings/back_gate.webp',
            'main gate': 'assets/buildings/main_gate.webp',
        };
        const buildingName = node.name;
        return buildingPictures[buildingName];
    }

}

export { GetBuildingPicture };
