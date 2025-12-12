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
            'floor8a': 'assets/floors/floor8a.jpg',
            'floor8b': 'assets/floors/floor8b.jpg',
            'floor8c': 'assets/floors/floor8c.jpg',
            'floor22b': 'assets/floors/floor22b.jpg',
            'floor22c': 'assets/floors/floor22c.jpg',
            'floor5a': 'assets/floors/floor5a.jpg',
            'floor5b': 'assets/floors/floor5b.jpg',

            // Gate-floor special case
            'floorGateGround': 'assets/floors/gate_ground.jpg'
        };

        // Normalize and lookup
        const floorName = flr_t_node.name.toLowerCase();

        // Floor names are case-sensitive in mapping, so match directly
        return floorPictures[flr_t_node.name] || null;
    }

    /**
     * Convenience wrapper matching system naming consistency
     */
    static getDestinationFloorPicture(to_flr_t_node) {
        return this.getFloorPicture(to_flr_t_node);
    }
}

// Export for Node environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FloorPicturesOutput;
}
