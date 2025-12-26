
/**
 * Building Pictures Output Component
 * Takes to_bld_t_node and outputs the destination building picture.
 * 
 * According to documentation:
 * - Takes to_bld_t_node (building tree node)
 * - Returns image URL or file path for the building
 * - Handles both regular buildings and gates
 */

class BuildingPicturesOutput {
    /**
     * Gets the building picture path for a given building tree node
     * @param {Object} bld_t_node - Building tree node with structure: {name, worded_direction, parent, children}
     * @returns {string|null} Image file path or null if not found
     */
    static getBuildingPicture(bld_t_node) {
        // Validate input
        if (!bld_t_node || !bld_t_node.name) {
            return null;
        }

        // Building pictures mapping
const buildingPictures = {
    'building1': 'assets/buildings/building1.jpg',
    'building2': 'assets/buildings/building2.jpg',
    'building4': 'assets/buildings/building4.jpg',
    'building5': 'assets/buildings/building5.jpg',
    'building8': 'assets/buildings/building8.jpg',
    'ltbsdbld8': 'assets/buildings/ltbsdbld8.jpg',
    'building22': 'assets/buildings/building22.jpg',
    'building47': 'assets/buildings/building47.jpg',
    'ltbsdbld47': 'assets/buildings/ltbsdbld47.jpg',
    'walkin gate': 'assets/buildings/walkin_gate.jpg',
    'back gate': 'assets/buildings/back_gate.jpg',
    'main gate': 'assets/buildings/main_gate.jpg',
};


        
        // Get the building name (normalize to lowercase for case-insensitive lookup)
        const buildingName = bld_t_node.name.toLowerCase();

        // Return the picture path or null if not found
        return buildingPictures[buildingName] || null;
    }

    /**
     * Gets building picture for destination building (to_bld_t_node)
     * This is a convenience method that matches the documentation terminology
     * @param {Object} to_bld_t_node - Destination building tree node
     * @returns {string|null} Image file path or null if not found
     */
    static getDestinationBuildingPicture(to_bld_t_node) {
        return this.getBuildingPicture(to_bld_t_node);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BuildingPicturesOutput;
}