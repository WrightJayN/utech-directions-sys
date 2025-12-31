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

        const floors = building.children; // Assumed ordered from lowest to highest
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        const floorHeight = canvas.height / floors.length;

        // Dynamic large fonts
        const baseFontSize = Math.max(24, Math.min(36, canvas.width * 0.07)); // 24-36px
        const titleFontSize = Math.max(20, Math.min(30, canvas.width * 0.06));
        const arrowFontSize = Math.max(32, Math.min(48, canvas.width * 0.10));

        // Sort floors by name to determine correct order (common patterns: Ground, 1, 2... or 1, 2, 3...)
        // Simple heuristic: assume "Ground" or "G" is lowest, then numeric
        const sortedFloors = [...floors].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA.includes('ground') || nameA === 'g') return -1;
            if (nameB.includes('ground') || nameB === 'g') return 1;
            return parseInt(a.name) - parseInt(b.name) || a.name.localeCompare(b.name);
        });

        // Find destination index in sorted list
        const destIndexInSorted = sortedFloors.findIndex(f => f.name === to_flr_t_node.name);
        const destDisplayNumber = destIndexInSorted + 1; // 1-based

        // Draw building name at top
        context.font = `bold ${titleFontSize}px Arial, sans-serif`;
        context.fillStyle = '#333333';
        context.textAlign = 'center';
        context.fillText(building.name, canvas.width / 2, 30);
        context.textAlign = 'left';

        // Draw floors from bottom (lowest) to top (highest)
        for (let index = floors.length - 1; index >= 0; index--) {
            const floor = sortedFloors[floors.length - index - 1];
            const displayNumber = floors.length - index; // 1 at bottom, increasing upward
            const y = index * floorHeight;

            const isDestination = floor.name === to_flr_t_node.name;

            // Background
            context.fillStyle = isDestination ? '#4CAF50' : '#E0E0E0';
            context.fillRect(0, y, canvas.width, floorHeight);

            // Thick white border
            context.strokeStyle = '#FFFFFF';
            context.lineWidth = 4;
            context.strokeRect(0, y, canvas.width, floorHeight);

            // Floor number (large bold)
            context.font = `bold ${baseFontSize}px Arial, sans-serif`;
            context.fillStyle = isDestination ? '#FFFFFF' : '#333333';
            context.fillText(displayNumber, 30, y + floorHeight / 2);

            // Destination indicator
            if (isDestination) {
                // Large arrow
                context.font = `bold ${arrowFontSize}px Arial Black, sans-serif`;
                context.fillStyle = '#FFFFFF';
                context.strokeStyle = '#000000';
                context.lineWidth = 3;
                context.textAlign = 'right';
                context.strokeText('➜', canvas.width - 30, y + floorHeight / 2);
                context.fillText('➜', canvas.width - 30, y + floorHeight / 2);

                // Optional: add "You Are Here" or just the number is enough
                context.font = `bold ${baseFontSize - 4}px Arial, sans-serif`;
                context.textAlign = 'center';
                context.fillText('YOU ARE HERE', canvas.width / 2, y + floorHeight / 2 + 4);
                
                context.textAlign = 'left';
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

    // getFloorCount and getFloorIndex unchanged...
}