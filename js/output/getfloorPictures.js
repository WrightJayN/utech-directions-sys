class GetFloorPictures {

    static getFloorPicture(node) {
        const floorPictures = {
            'FENC GROUND': 'assets/floors/FENC_GROUND.webp',
            'FENC 1': 'assets/floors/FENC_1.webp',
            'FENC 2': 'assets/floors/FENC_2.webp',
            'FENC 3': 'assets/floors/FENC_3.webp',
            'SCIT GROUND': 'assets/floors/SCIT_GROUND.webp',
            'SCIT 1': 'assets/floors/SCIT_1.webp',
            'SCIT 2': 'assets/floors/SCIT_2.webp',
            'FELS GROUND': 'assets/floors/FELS_GROUND.webp',
            'FELS 1': 'assets/floors/FELS_1.webp',
            'FELS 2': 'assets/floors/FELS_2.webp',
            'COBAM 1': 'assets/floors/COBAM_1.webp',
            'COBAM 2': 'assets/floors/COBAM_2.webp',
            'SOBA 1': 'assets/floors/SOBA_1.webp',
            'SHARED FACILITES GROUND': 'assets/floors/SHARED_FACILITIES_GROUND.webp',
            'SHARED FACILITIES 1': 'assets/floors/SHARED_FACILITIES_1.webp',
            'SHARED FACILITIES 2': 'assets/floors/SHARED_FACILITIES_2.webp',
            'FOBE BASEMENT': 'assets/floors/FOBE_BASEMENT.webp',
            'FOBE GROUND': 'assets/floors/FOBE_GROUND.webp',
            'FOBE 1': 'assets/floors/FOBE_1.webp',
            'FOBE 2': 'assets/floors/FOBE_2.webp',
            'FOBE 3': 'assets/floors/FOBE_3.webp',
        };
        const floorName = node.name;
        return floorPictures[floorName];
    }
}

export { GetFloorPictures };
