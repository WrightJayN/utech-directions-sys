/**
 * Floor Highlight Output Component
 * Takes to_flr_t_node and outputs a canvas showing all floors with the destination floor highlighted.
 * 
 * According to documentation:
 * - Takes to_flr_t_node (floor tree node)
 * - Creates canvas showing all floors in the building
 * - Highlights the destination floor
 * - Other floors are shown in gray
 */

class FloorHighlightOutput {
    /**
     * Creates a canvas with all floors of the building, highlighting the destination floor
     * @param {Object} to_flr_t_node - Destination floor tree node with structure: {name, worded_direction, parent, children}
     * @param {HTMLCanvasElement} canvas - Canvas element to draw on
     * @returns {HTMLCanvasElement|null} The canvas with floor highlight or null if invalid input
     */
    static createFloorHighlight(to_flr_t_node, canvas) {
        // Validate inputs
        if (!to_flr_t_node || !canvas) {
            return null;
        }

        // Get the parent building
        const building = to_flr_t_node.parent;
        
        if (!building || !building.children || building.children.length === 0) {
            return null;
        }

        // Get all floors in the building
        const floors = building.children;
        
        // Get canvas context
        const context = canvas.getContext('2d');
        
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate height for each floor
        const floorHeight = canvas.height / floors.length;
        
        // Set font for labels
        context.font = '16px Arial';
        context.textAlign = 'left';
        context.textBaseline = 'middle';
        
        // Draw each floor
        floors.forEach((floor, index) => {
            const y = index * floorHeight;
            
            // Determine if this is the destination floor
            const isDestination = floor.name === to_flr_t_node.name;
            
            // Set fill color
            if (isDestination) {
                context.fillStyle = '#4CAF50'; // Green highlight for destination
            } else {
                context.fillStyle = '#E0E0E0'; // Gray for other floors
            }
            
            // Draw floor rectangle
            context.fillRect(0, y, canvas.width, floorHeight);
            
            // Draw border between floors
            context.strokeStyle = '#FFFFFF';
            context.lineWidth = 2;
            context.strokeRect(0, y, canvas.width, floorHeight);
            
            // Draw floor label
            context.fillStyle = isDestination ? '#FFFFFF' : '#000000';
            context.fillText(floor.name, 20, y + floorHeight / 2);
            
            // Add arrow or indicator for destination floor
            if (isDestination) {
                context.fillStyle = '#FFFFFF';
                context.font = 'bold 18px Arial';
                context.textAlign = 'right';
                context.fillText('→', canvas.width - 20, y + floorHeight / 2);
                
                // Reset text alignment
                context.textAlign = 'left';
                context.font = '16px Arial';
            }
        });
        
        return canvas;
    }

    /**
     * Creates a floor highlight canvas for destination floor (convenience method)
     * @param {Object} to_flr_t_node - Destination floor tree node
     * @param {HTMLCanvasElement} canvas - Canvas element to draw on
     * @returns {HTMLCanvasElement|null} The canvas with floor highlight or null if invalid input
     */
    static createDestinationFloorHighlight(to_flr_t_node, canvas) {
        return this.createFloorHighlight(to_flr_t_node, canvas);
    }

    /**
     * Creates a new canvas element with floor highlight (for use in browser)
     * @param {Object} to_flr_t_node - Destination floor tree node
     * @param {number} width - Canvas width in pixels (default: 400)
     * @param {number} height - Canvas height in pixels (default: 600)
     * @returns {HTMLCanvasElement|null} New canvas element with floor highlight or null if invalid input
     */
    static createFloorHighlightCanvas(to_flr_t_node, width = 400, height = 600) {
        // Validate input
        if (!to_flr_t_node) {
            return null;
        }

        // Check if we're in a browser environment
        if (typeof document === 'undefined') {
            return null;
        }

        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // Create floor highlight on the canvas
        return this.createFloorHighlight(to_flr_t_node, canvas);
    }

    /**
     * Gets the number of floors in the building containing the floor node
     * @param {Object} flr_t_node - Floor tree node
     * @returns {number} Number of floors in the building, or 0 if invalid
     */
    static getFloorCount(flr_t_node) {
        if (!flr_t_node || !flr_t_node.parent) {
            return 0;
        }

        const building = flr_t_node.parent;
        
        if (!building.children || !Array.isArray(building.children)) {
            return 0;
        }

        return building.children.length;
    }

    /**
     * Gets the index of the floor within its building (0-based)
     * @param {Object} flr_t_node - Floor tree node
     * @returns {number} Floor index, or -1 if not found
     */
    static getFloorIndex(flr_t_node) {
        if (!flr_t_node || !flr_t_node.parent) {
            return -1;
        }

        const building = flr_t_node.parent;
        
        if (!building.children || !Array.isArray(building.children)) {
            return -1;
        }

        return building.children.findIndex(floor => floor.name === flr_t_node.name);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FloorHighlightOutput;
}
