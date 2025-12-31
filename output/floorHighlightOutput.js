/**
 * Floor Highlight Output Component - Enhanced for Inset Readability
 * - Floor names replaced with sequential numbers (Ground = 1, then 2, 3...)
 * - Larger, bolder fonts
 * - Building name at top
 */

class FloorHighlightOutput {
    static createFloorHighlight(to_flr_t_node, canvas) {
        if (!to_flr_t_node || !canvas) return null;

        const building = to_flr_t_node.parent;
        if (!building || !building.children || building.children.length === 0) return null;

        const floors = building.children; // All floor nodes under the building
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const floorCount = floors.length;
        const floorHeight = canvas.height / floorCount;

        // Dynamic font sizes that work well even in the small inset
        const titleFontSize = Math.min(30, canvas.width * 0.07);
        const numberFontSize = Math.max(28, Math.min(40, canvas.width * 0.09));
        const arrowFontSize   = Math.max(36, Math.min(56, canvas.width * 0.13));
        const labelFontSize   = Math.max(18, Math.min(26, canvas.width * 0.06));

        // Draw building name at the very top
        ctx.font = `bold ${titleFontSize}px Arial, sans-serif`;
        ctx.fillStyle = '#333333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(building.name, canvas.width / 2, 30);

        // Draw floors from bottom (lowest = 1) to top
        for (let i = floorCount - 1; i >= 0; i--) {
            const floorIndexFromBottom = floorCount - i; // 1 = lowest
            const floorNode = floors[i];
            const isDestination = floorNode.name === to_flr_t_node.name;

            const y = i * floorHeight;

            // Background
            ctx.fillStyle = isDestination ? '#4CAF50' : '#E0E0E0';
            ctx.fillRect(0, y, canvas.width, floorHeight);

            // Thick white separator lines
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 4;
            ctx.strokeRect(0, y, canvas.width, floorHeight);

            // Floor number (large, bold)
            ctx.font = `bold ${numberFontSize}px Arial, sans-serif`;
            ctx.fillStyle = isDestination ? '#FFFFFF' : '#333333';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(floorIndexFromBottom, 20, y + floorHeight / 2);

            // Destination highlight
            if (isDestination) {
                // Large right-pointing arrow
                ctx.font = `bold ${arrowFontSize}px Arial Black, sans-serif`;
                ctx.fillStyle = '#FFFFFF';
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 3;
                ctx.textAlign = 'right';
                ctx.strokeText('➜', canvas.width - 20, y + floorHeight / 2);
                ctx.fillText('➜', canvas.width - 20, y + floorHeight / 2);

                // "YOU ARE HERE" label
                ctx.font = `bold ${labelFontSize}px Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText('YOU ARE HERE', canvas.width / 2, y + floorHeight / 2 + 8);
            }
        }

        return canvas;
    }

    
    // ... (rest of the class methods remain unchanged)
    static createDestinationFloorHighlight(to_flr_t_node, canvas) {
        return this.createFloorHighlight(to_flr_t_node, canvas);
    }

    static createFloorHighlightCanvas(to_flr_t_node, width = 400, height = 600) {
        if (!to_flr_t_node || typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
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