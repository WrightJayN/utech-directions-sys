/**
 * PathFinder Component
 * Implements optimized Dijkstra's algorithm to find shortest path between buildings
 * Uses pixel distance as edge weights
 * 
 * Algorithm: Dijkstra's shortest path with MinHeap/Priority Queue
 * Edge weights: Euclidean distance between node coordinates
 */

/**
 * MinHeap/Priority Queue Implementation
 * A binary tree where parent is always smaller than children
 * Used to efficiently get the minimum element
 */
class MinHeap {
    constructor() {
        this.heap = [];
    }

    /**
     * Get size of heap
     */
    size() {
        return this.heap.length;
    }

    /**
     * Check if heap is empty
     */
    isEmpty() {
        return this.heap.length === 0;
    }

    /**
     * Add element to heap and maintain heap property
     * Time Complexity: O(log V)
     */
    insert(node, priority) {
        this.heap.push({ node, priority });
        this.bubbleUp(this.heap.length - 1);
    }

    /**
     * Remove and return element with minimum priority
     * Time Complexity: O(log V)
     */
    extractMin() {
        if (this.isEmpty()) return null;
        
        if (this.heap.length === 1) {
            return this.heap.pop();
        }

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        
        return min;
    }

    /**
     * Move element up to maintain heap property
     * Called after insertion
     */
    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            
            if (this.heap[parentIndex].priority <= this.heap[index].priority) {
                break;
            }
            
            // Swap with parent
            [this.heap[parentIndex], this.heap[index]] = 
            [this.heap[index], this.heap[parentIndex]];
            
            index = parentIndex;
        }
    }

    /**
     * Move element down to maintain heap property
     * Called after extraction
     */
    bubbleDown(index) {
        while (true) {
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            let smallest = index;

            if (leftChild < this.heap.length && 
                this.heap[leftChild].priority < this.heap[smallest].priority) {
                smallest = leftChild;
            }

            if (rightChild < this.heap.length && 
                this.heap[rightChild].priority < this.heap[smallest].priority) {
                smallest = rightChild;
            }

            if (smallest === index) break;

            // Swap with smallest child
            [this.heap[index], this.heap[smallest]] = 
            [this.heap[smallest], this.heap[index]];
            
            index = smallest;
        }
    }
}

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
     * Finds shortest path using OPTIMIZED Dijkstra's algorithm with MinHeap
     * 
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
        const visited = new Set();   // Set of visited nodes
        const minHeap = new MinHeap(); // Priority queue for efficient minimum finding

        // Initialize all nodes with infinite distance
        for (const [nodeName, node] of graph) {
            distances.set(node, Infinity);
            previous.set(node, null);
        }

        // Distance to start node is 0
        distances.set(startNode, 0);
        
        // Add start node to priority queue
        minHeap.insert(startNode, 0);

        // Dijkstra's algorithm main loop with MinHeap optimization
        while (!minHeap.isEmpty()) {
            // OPTIMIZATION: MinHeap gives us minimum distance node in O(log V) time
            const { node: currentNode, priority: currentDistance } = minHeap.extractMin();

            // Skip if already visited (can happen with duplicate entries in heap)
            if (visited.has(currentNode)) {
                continue;
            }

            // Mark current node as visited
            visited.add(currentNode);

            // If we reached the end node, we can stop early
            if (currentNode === endNode) {
                break;
            }

            // CRITICAL FIX: Skip if this node is unreachable (prevents infinite loop)
            // If the current node has infinite distance, no path exists to any remaining nodes
            if (currentDistance === Infinity) {
                break;
            }

            // Check all neighbors of current node
            if (currentNode.neighbors && Array.isArray(currentNode.neighbors)) {
                for (const neighbor of currentNode.neighbors) {
                    // Skip visited neighbors
                    if (visited.has(neighbor)) {
                        continue;
                    }

                    // CRITICAL FIX: Verify neighbor exists in the graph
                    // This prevents issues with disconnected or malformed graph structures
                    if (!distances.has(neighbor)) {
                        continue;
                    }

                    // Calculate distance to neighbor through current node
                    const edgeWeight = this.calculateDistance(currentNode, neighbor);
                    
                    // Skip if edge weight is invalid
                    if (edgeWeight === Infinity || isNaN(edgeWeight)) {
                        continue;
                    }

                    const distanceThroughCurrent = distances.get(currentNode) + edgeWeight;

                    // If this path is shorter, update it
                    if (distanceThroughCurrent < distances.get(neighbor)) {
                        distances.set(neighbor, distanceThroughCurrent);
                        previous.set(neighbor, currentNode);
                        
                        // OPTIMIZATION: Add to heap with new distance
                        // Heap will automatically keep smallest distances at top
                        minHeap.insert(neighbor, distanceThroughCurrent);
                    }
                }
            }
        }

        // Check if end node was reached
        if (!visited.has(endNode)) {
            // End node was never visited, meaning no path exists
            return null;
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

        // Verify path starts with startNode and ends with endNode
        if (path.length > 0 && path[0] === startNode && path[path.length - 1] === endNode) {
            return path;
        }

        return null; // Path not found or invalid
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
        const fromNodeName = this.convertTreeNodeToGraphKey(fromBldTNode);
        const toNodeName = this.convertTreeNodeToGraphKey(toBldTNode);

        if (!fromNodeName || !toNodeName) {
            return null;
        }

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
        if (nodeName.startsWith('building')) {
            return nodeName;
        }

        return null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PathFinder;
}
