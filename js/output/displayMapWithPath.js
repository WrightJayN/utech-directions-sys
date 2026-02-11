import { DrawPath } from './drawPath.js';
class DisplayMapWithPath{
    // Display map with path
    static async displayMapWithPath(sourceBuildingNode, destinationBuildingNode, path) {
        const canvas = document.getElementById('mapCanvas');
        
        // Load map image first
        await DrawPath.loadMapImage('assets/utech_map.webp', canvas);

        // Create complete map with path
        DrawPath.createMapWithPath(
            sourceBuildingNode,
            destinationBuildingNode,
            path,
            canvas
        );
    }
}

export { DisplayMapWithPath }