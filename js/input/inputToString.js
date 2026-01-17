class inputToString {

    static isInputUndefined(input) {return input === null || input === undefined}
    static isEmpty(output) {return output === ""}
    static isSource(isSource) {if(isSource === true) return "main gate"};

    static turnInputIntoString(input, isSource = false) {

        if (this.isInputUndefined(input)) {
            this.isSource(isSource);
            throw new Error("Destination is undefined");
        }
        
        let output = String(input).trim().toLowerCase();

        if (this.isEmpty(output)) {
            this.isSource(isSource);
            throw new Error("Destination is empty");
        }
        
        return output;
    }
    
    static turnRoomInputsIntoStrings(sourceRoom, destinationRoom) {
        const source = this.turnInputIntoString(sourceRoom, true);
        const destination = this.turnInputIntoString(destinationRoom, false);
        
        return {
            source: source,
            destination: destination
        };
    }

    static turnFloorInputsIntoStrings(sourceFloor, destinationFloor) {
        const source = this.turnInputIntoString(sourceFloor, true);
        const destination = this.turnInputIntoString(destinationFloor, false);
        
        return {
            source: source,
            Destination: destination
        };
    }

    static processBuildingInputs(sourceBuilding, destinationBuilding) {
        const source = this.turnInputIntoString(sourceBuilding, true);
        const destination = this.turnInputIntoString(destinationBuilding, false);
        
        return {
            source: source,
            Destination: destination
        };
    }
}

export { inputToString };