/**
 * PathFinder Component
 * Implements Dijkstra's algorithm to find shortest path between buildings
 * Uses pixel distance as edge weights
 * 
 * Algorithm: Dijkstra's shortest path with priority queue
 * Edge weights: Euclidean distance between node coordinates
 */

class PathFinder {
    /**
     * Calculates Euclidean distance between two nodes
     * @param {Object} node1 - First node with x_coor and y_coor
     * @param {Object} node2 - Second node with x_coor and y_coor
     * @returns {number} Euclidean distance in pixels
     */
    static calculateDistance(node1, node2) {
        if (!node1 || !node2) return Infinity;
        
        const dx = node2.x_coor - node1.x_coor;
        const dy = node2.y_coor - node1.y_coor;
        
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Finds shortest path using Dijkstra's algorithm with weighted edges
     * @param {Object} startNode - Starting graph node
     * @param {Object} endNode - Destination graph node
     * @param {Map} graph - Graph containing all nodes
     * @returns {Array|null} Array of nodes representing the path, or null if no path exists
     */
    static findPath(startNode, endNode, graph) {
        // Handle null or undefined inputs
        if (!startNode || !endNode || !graph) {
            return null;
        }

        // Handle same start and end node
        if (startNode === endNode) {
            return [startNode];
        }

        // Initialize data structures for Dijkstra's algorithm
        const distances = new Map(); // Distance from start to each node
        const previous = new Map();  // Previous node in optimal path
        const unvisited = new Set(); // Set of unvisited nodes

        // Initialize all nodes
        for (const [nodeName, node] of graph) {
            distances.set(node, Infinity);
            previous.set(node, null);
            unvisited.add(node);
        }

        // Distance to start node is 0
        distances.set(startNode, 0);

        // Dijkstra's algorithm main loop
        while (unvisited.size > 0) {
            // Find unvisited node with minimum distance
            let currentNode = null;
            let minDistance = Infinity;

            for (const node of unvisited) {
                const distance = distances.get(node);
                if (distance < minDistance) {
                    minDistance = distance;
                    currentNode = node;
                }
            }

            // If no reachable unvisited nodes remain, break
            if (currentNode === null || minDistance === Infinity) {
                break;
            }

            // If we reached the end node, we can stop
            if (currentNode === endNode) {
                break;
            }

            // Mark current node as visited
            unvisited.delete(currentNode);

            // Check all neighbors of current node
            if (currentNode.neighbors && Array.isArray(currentNode.neighbors)) {
                for (const neighbor of currentNode.neighbors) {
                    // Only process unvisited neighbors
                    if (!unvisited.has(neighbor)) {
                        continue;
                    }

                    // Calculate distance to neighbor through current node
                    const edgeWeight = this.calculateDistance(currentNode, neighbor);
                    const distanceThroughCurrent = distances.get(currentNode) + edgeWeight;

                    // If this path is shorter, update it
                    if (distanceThroughCurrent < distances.get(neighbor)) {
                        distances.set(neighbor, distanceThroughCurrent);
                        previous.set(neighbor, currentNode);
                    }
                }
            }
        }

        // Reconstruct path from end to start
        const path = [];
        let current = endNode;

        // Check if a path was found
        if (previous.get(endNode) === null && endNode !== startNode) {
            return null; // No path exists
        }

        // Build path by following previous pointers
        while (current !== null) {
            path.unshift(current); // Add to front of array
            current = previous.get(current);
        }

        // Verify path starts with startNode
        if (path.length > 0 && path[0] === startNode) {
            return path;
        }

        return null; // Path not found
    }

    /**
     * Converts tree nodes (bld_t_nodes) to graph nodes (bld_g_nodes) and finds path
     * @param {Object} fromBldTNode - Building tree node (from)
     * @param {Object} toBldTNode - Building tree node (to)
     * @param {Object} graphDB - GraphDatabase instance
     * @returns {Array|null} Array of graph nodes representing the path
     */
    static findPathFromTreeNodes(fromBldTNode, toBldTNode, graphDB) {
        if (!fromBldTNode || !toBldTNode || !graphDB) {
            return null;
        }

        // Get the building graph from GraphDatabase
        const buildingGraph = graphDB.getBuildingGraph();
        if (!buildingGraph) {
            return null;
        }

        // Convert tree node names to graph node keys
        // Tree nodes have lowercase names, graph nodes use these as keys
        const fromNodeName = this.convertTreeNodeToGraphKey(fromBldTNode);
        const toNodeName = this.convertTreeNodeToGraphKey(toBldTNode);

        // Find corresponding graph nodes
        const fromGNode = buildingGraph.get(fromNodeName);
        const toGNode = buildingGraph.get(toNodeName);

        if (!fromGNode || !toGNode) {
            return null;
        }

        // Find path using graph nodes
        return this.findPath(fromGNode, toGNode, buildingGraph);
    }

    /**
     * Converts tree node name to graph node key
     * @param {Object} treeNode - Tree node
     * @returns {string} Graph node key
     */
    static convertTreeNodeToGraphKey(treeNode) {
        if (!treeNode || !treeNode.name) {
            return null;
        }

        const nodeName = treeNode.name.toLowerCase();

        // Handle gates - they use the same name in both structures
        if (nodeName === 'main gate' || nodeName === 'walkin gate' || nodeName === 'back gate') {
            return nodeName;
        }

        // Handle buildings - map tree building names to graph building names
        // Tree: "building1", "building2", etc.
        // Graph: "building1", "building2", etc. (same)
        if (nodeName.startsWith('building')) {
            return nodeName;
        }

        // If it's not a building or gate, return null (shouldn't happen for bld_t_nodes)
        return null;
    }

    /**
     * Priority Queue implementation for more efficient Dijkstra's algorithm
     * (Optional optimization - basic implementation above works but is O(V²))
     */
    static findPathOptimized(startNode, endNode, graph) {
        // This would use a MinHeap/PriorityQueue for O((V + E) log V) complexity
        // For now, the basic implementation above is sufficient
        return this.findPath(startNode, endNode, graph);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PathFinder;
}
