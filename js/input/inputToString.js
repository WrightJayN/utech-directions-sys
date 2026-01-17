class inputToString {

    static isInputDefined(input){return input === null || input === undefined}
    static isEmpty(output){return output === ""}

    static turnInputIntoString(input, isSource = false) {

        if (this.isInputDefined(input)) {
            if (isSource === true) {
                return "main gate";
            }
            throw new Error("Destination is undefined");
        }
        
        let output = String(input).trim().toLowerCase();

        if (this.isEmpty(output)) {
            if (isSource === true) {
                return "main gate";
            }
            throw new Error("Destination is empty");
        }
        
        return output;
    }
    
    static turnRoomInputsIntoStrings(sourceRoom, destinationRoom) {
        const source = this.turnInputIntoString(sourceRoom, true);
        const destination = this.turnInputIntoString(destinationRoom, false);
        
        return {
            Source: source,
            Destination: destination
        };
    }

    static turnFloorInputsIntoStrings(sourceFloor, destinationFloor) {
        const source = this.turnInputIntoString(sourceFloor, true);
        const destination = this.turnInputIntoString(destinationFloor, false);
        
        return {
            Source: source,
            Destination: destination
        };
    }

    static processBuildingInputs(sourceBuilding, destinationBuilding) {
        const source = this.turnInputIntoString(sourceBuilding, true);
        const destination = this.turnInputIntoString(destinationBuilding, false);
        
        return {
            Source: source,
            Destination: destination
        };
    }

}

export {inputToString};