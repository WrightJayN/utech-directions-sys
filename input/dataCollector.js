/**
 * Data Collector Component
 * Converts room inputs into lowercase strings.
 * Handles default "main gate" for from room when null/undefined/empty.
 */

class DataCollector {
    /**
     * Converts room input to lowercase string
     * @param {string|number|null|undefined} roomInput - The room input from user
     * @param {boolean} isFromRoom - Whether this is the "from" room (defaults to main gate)
     * @returns {string} Lowercase string representation of the room
     * @throws {Error} If to room is empty and required
     */
    static convertToLowercaseString(roomInput, isFromRoom = false) {
        // Handle null or undefined
        if (roomInput === null || roomInput === undefined) {
            if (isFromRoom) {
                return "main gate";
            }
            throw new Error("To room cannot be empty");
        }
        
        // Convert to string first (handles numeric inputs)
        let roomString = String(roomInput);
        
        // Handle empty string
        if (roomString.trim() === "") {
            if (isFromRoom) {
                return "main gate";
            }
            throw new Error("To room cannot be empty");
        }
        
        // Convert to lowercase and return
        return roomString.trim().toLowerCase();
    }
    
    /**
     * Processes both from and to room inputs
     * @param {string|number|null|undefined} fromRoom - The "from" room input
     * @param {string|number|null|undefined} toRoom - The "to" room input
     * @returns {{fromRoom: string, toRoom: string}} Object with processed room strings
     * @throws {Error} If to room is invalid
     */
    static processRoomInputs(fromRoom, toRoom) {
        const processedFrom = this.convertToLowercaseString(fromRoom, true);
        const processedTo = this.convertToLowercaseString(toRoom, false);
        
        return {
            fromRoom: processedFrom,
            toRoom: processedTo
        };
    }
}

export {DataCollector};


