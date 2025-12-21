/**
 * Tree Database
 * Creates the tree structure for UTech campus navigation
 * Hierarchy: Root -> Building -> Floor -> Room
 * 
 * Tree Node Structure:
 * - name: string
 * - worded_direction: string
 * - parent: t_node
 * - children: t_node[]
 */

class TreeNode {
    constructor(name, worded_direction, parent = null) {
        this.name = name;
        this.worded_direction = worded_direction;
        this.parent = parent;
        this.children = [];
    }

    addChild(childNode) {
        this.children.push(childNode);
        childNode.parent = this;
    }
}

class TreeDatabase {
    constructor() {
        this.root = null;
        this.roomsHashMap = new Map();
        this.buildTree();
    }

    buildTree() {
        
    }

    getRoomsHashMap() {
        return this.roomsHashMap;
    }

    getRoot() {
        return this.root;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TreeDatabase;
}
