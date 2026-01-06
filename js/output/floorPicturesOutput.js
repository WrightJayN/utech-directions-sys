/**
 * FloorPicturesOutput
 * Takes a flr_t_node (floor tree node) and returns the image file path
 * associated with that floor.
 */

class FloorPicturesOutput {
    /**
     * Gets the floor picture path for a given floor tree node
     * @param {Object} flr_t_node - Floor tree node: {name, worded_direction, parent, children}
     * @returns {string|null} Image path or null if not found
     */
    static getFloorPicture(flr_t_node) {
        // Validate input
        if (!flr_t_node || !flr_t_node.name) {
            return null;
        }

        // Mapping of floors to image paths
        const floorPictures = {
            'floor1ground': 'assets/floors/floor1ground.jpg',
            'floor1a': 'assets/floors/floor1a.jpg',
            'floor1b': 'assets/floors/floor1b.jpg',
            'floor1c': 'assets/floors/floor1c.jpg',
            'floor2b': 'assets/floors/floor2b.jpg',
            'floor2a': 'assets/floors/floor2a.jpg',
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

        // Normalize and lookup
        const floorName = flr_t_node.name.toLowerCase();

        // Floor names are case-sensitive in mapping, so match directly
        return floorPictures[floorName] || null;
    }

    /**
     * Convenience wrapper matching system naming consistency
     */
    static getDestinationFloorPicture(to_flr_t_node) {
        return this.getFloorPicture(to_flr_t_node);
    }
}

export {FloorPicturesOutput};
