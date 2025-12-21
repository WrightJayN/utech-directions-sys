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
