/**
 * Building/Floor Node Finder Component
 * Uses tree structure to find corresponding bld_t_nodes and flr_t_nodes from rm_t_nodes.
 * 
 * According to documentation:
 * - Takes rm_t_node (room tree node) from Room Node Finder
 * - Traverses tree structure (Root -> Building -> Floor -> Room)
 * - Returns bld_t_node (building tree node) and flr_t_node (floor tree node)
 */

class BuildingFloorNodeFinder {
    /**
     * Finds bld_t_node (building tree node) from rm_t_node by traversing parent chain
     * @param {Object} rm_t_node - Room tree node with structure: {name, worded_direction, parent, children}
     * @returns {Object|null} The bld_t_node object or null if not found
     * @throws {Error} If rm_t_node is null or undefined
     */
    static findBuildingNode(rm_t_node) {
        // Validate input
        if (rm_t_node === null || rm_t_node === undefined) {
            throw new Error("rm_t_node cannot be null or undefined");
        }

        // Traverse up the tree to find the building node
        // Tree hierarchy: Room -> Floor -> Building -> Root
        let currentNode = rm_t_node;
        
        // Room's parent is Floor, Floor's parent is Building
        // We need to go up 2 levels to reach Building
        if (currentNode.parent) { // Floor node
            currentNode = currentNode.parent;
            if (currentNode.parent) { // Building node
                currentNode = currentNode.parent;
                // At this point, currentNode should be the building node
                // It should have a parent (root) to be valid
                if (currentNode.parent) {
                    return currentNode;
                }
            }
        }
        
        // If we couldn't traverse up 2 levels with valid parents, return null
        return null;
    }

    /**
     * Finds flr_t_node (floor tree node) from rm_t_node by traversing parent chain
     * @param {Object} rm_t_node - Room tree node with structure: {name, worded_direction, parent, children}
     * @returns {Object|null} The flr_t_node object or null if not found
     * @throws {Error} If rm_t_node is null or undefined
     */
    static findFloorNode(rm_t_node) {
        // Validate input
        if (rm_t_node === null || rm_t_node === undefined) {
            throw new Error("rm_t_node cannot be null or undefined");
        }

        // Traverse up the tree to find the floor node
        // Tree hierarchy: Room -> Floor -> Building -> Root
        // Room's parent is Floor
        if (rm_t_node.parent) {
            return rm_t_node.parent;
        }
        
        // If room has no parent, return null
        return null;
    }

    /**
     * Finds both bld_t_node and flr_t_node from a single rm_t_node
     * @param {Object} rm_t_node - Room tree node
     * @param {Object} [second_rm_t_node] - Optional second room tree node for processing both from and to rooms
     * @returns {Object} Object containing bld_t_node and flr_t_node, or if two nodes provided: from_bld_t_node, from_flr_t_node, to_bld_t_node, to_flr_t_node
     */
    static findBuildingAndFloorNodes(rm_t_node, second_rm_t_node) {
        // If two nodes are provided, process both from and to rooms
        if (second_rm_t_node) {
            const from_bld_t_node = this.findBuildingNode(rm_t_node);
            const from_flr_t_node = this.findFloorNode(rm_t_node);
            const to_bld_t_node = this.findBuildingNode(second_rm_t_node);
            const to_flr_t_node = this.findFloorNode(second_rm_t_node);

            return {
                from_bld_t_node,
                from_flr_t_node,
                to_bld_t_node,
                to_flr_t_node
            };
        }

        // Single node - return bld_t_node and flr_t_node
        const bld_t_node = this.findBuildingNode(rm_t_node);
        const flr_t_node = this.findFloorNode(rm_t_node);

        return {
            bld_t_node,
            flr_t_node
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BuildingFloorNodeFinder;
}
