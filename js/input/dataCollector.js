/**
 * Data Collector Component
 * Converts room inputs into lowercase strings.
 * Handles default "main gate" for from room when null/undefined/empty.
 */

class DataCollector {
    /**
     * Converts room input to lowercase string
     * @param {string|number|null|undefined} roomInput - The room input from user
     * @param {boolean} isFrom - Whether this is the "from" input (defaults to main gate)
     * @returns {string} Lowercase string representation of the room
     * @throws {Error} If to input is empty and required
     */
    static convertToLowercaseString(Input, isFrom = false) {
        // Handle null or undefined
        if (Input === null || Input === undefined) {
            if (isFrom == true) {
                return "main gate";
            }
            throw new Error("To input cannot be empty");
        }
        
        // Convert to string first (handles numeric inputs)
        let roomString = String(Input);
        
        // Handle empty string
        if (roomString.trim() === "") {
            if (isFrom == true) {
                return "main gate";
            }
            throw new Error("To input cannot be empty");
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
    /**
     * Processes both from and to room inputs
     * @param {string|number|null|undefined} fromFloor - The "from" room input
     * @param {string|number|null|undefined} toFloor - The "to" room input
     * @returns {{fromFloor: string, toFloor: string}} Object with processed room strings
     * @throws {Error} If to room is invalid
     */
    static processFloorInputs(fromFloor, toFloor) {
        const processedFrom = this.convertToLowercaseString(fromFloor, true);
        const processedTo = this.convertToLowercaseString(toFloor, false);
        
        return {
            fromFloor: processedFrom,
            toFloor: processedTo
        };
    }
    /**
     * Processes both from and to room inputs
     * @param {string|number|null|undefined} fromBuilding - The "from" room input
     * @param {string|number|null|undefined} toBuilding - The "to" room input
     * @returns {{fromBuilding: string, toBuilding: string}} Object with processed room strings
     * @throws {Error} If to room is invalid
     */
    static processBuildingInputs(fromBuilding, toBuilding) {
        const processedFrom = this.convertToLowercaseString(fromBuilding, true);
        const processedTo = this.convertToLowercaseString(toBuilding, false);
        
        return {
            fromBuilding: processedFrom,
            toBuilding: processedTo
        };
    }

}

export {DataCollector};


