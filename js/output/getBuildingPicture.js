class GetBuildingPicture {

    static getBuildingPicture(node) {
        const buildingPictures = {
            'Faculty of Engineering and Computing': 'assets/buildings/FENC.webp',
            'School of Computing and Information Technology': 'assets/buildings/SCIT.webp',
            'Faculty of Education and Liberal Studies': 'assets/buildings/FELS.webp',
            'College of Business and Management': 'assets/buildings/COBAM.webp',
            'School of Business Administration': 'assets/buildings/SOBA.webp',
            'Shared Facilities': 'assets/buildings/SHARED_FACILITIES.webp',
            'Faculty of Built Environment': 'assets/buildings/FOBE.webp',
            'LT48': 'assets/buildings/LT48.webp',
            'walkin gate': 'assets/buildings/walkin_gate.webp',
            'back gate': 'assets/buildings/back_gate.webp',
            'main gate': 'assets/buildings/main_gate.webp',
        };
        const buildingName = node.name;
        return buildingPictures[buildingName];
    }

}

export { GetBuildingPicture };
