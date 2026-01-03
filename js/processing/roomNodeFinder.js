/**
 * Room Node Finder Component
 * Uses Rooms Hash Map to find corresponding rm_t_nodes (room tree nodes) from the input strings.
 * 
 * According to documentation:
 * - Takes lowercase room strings from Data Collector
 * - Searches Rooms Hash Map to find rm_t_nodes
 * - Returns rm_t_node or null if not found
 */

class RoomNodeFinder {
    /**
     * Finds rm_t_node (room tree node) from Rooms Hash Map using room string
     * @param {string} roomString - Lowercase room string (e.g., "a101")
     * @param {Map} roomsHashMap - Rooms Hash Map where key is room string and value is rm_t_node
     * @returns {Object|null} The rm_t_node object or null if room not found
     */
    static findRoomNode(roomString, roomsHashMap) {
        // Validate inputs
        if (!roomString || typeof roomString !== 'string') {
            return null;
        }

        if (!roomsHashMap || !(roomsHashMap instanceof Map)) {
            return null;
        }

        // Ensure room string is lowercase (defensive programming)
        const normalizedRoomString = roomString.trim().toLowerCase();

        // Search Rooms Hash Map for the room string
        const roomNode = roomsHashMap.get(normalizedRoomString);

        // Return the rm_t_node if found, otherwise return null
        return roomNode || null;
    }

    /**
     * Finds rm_t_nodes for both from and to rooms
     * @param {string} fromRoom - Lowercase "from" room string
     * @param {string} toRoom - Lowercase "to" room string
     * @param {Map} roomsHashMap - Rooms Hash Map
     * @returns {Array} Array containing [from_rm_t_node, to_rm_t_node] or [null, null] if not found
     */
    static findRoomNodes(fromRoom, toRoom, roomsHashMap) {
        const fromNode = this.findRoomNode(fromRoom, roomsHashMap);
        const toNode = this.findRoomNode(toRoom, roomsHashMap);

        return [fromNode, toNode];
    }
}

export {RoomNodeFinder};

