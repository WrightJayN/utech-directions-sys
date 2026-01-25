class ValidateInput {

    static isNotEmpty(input) {return !(input == "")}
    static isInHashMap(input, hashmap) {return hashmap.has(input)}; 

    static validateSource(source, hashmap){
        let sourceLowerCase = String(source).trim().toUpperCase();

        if (this.isNotEmpty(sourceLowerCase) == true && this.isInHashMap(sourceLowerCase, hashmap) == true){
            return sourceLowerCase;
        }else if (this.isNotEmpty(sourceLowerCase) == true && this.isInHashMap(sourceLowerCase, hashmap) == false){
            throw new Error(`Couldn't find: ${sourceLowerCase}`);
        }else if (this.isNotEmpty(sourceLowerCase) == false){
            return "main gate";
        }
    }

    static validateDestination(destination, hashmap){
        let destinationLowerCase = String(destination).trim().toUpperCase();

        if(this.isNotEmpty(destinationLowerCase) == true && this.isInHashMap(destinationLowerCase, hashmap) == true){
            return destinationLowerCase;
        }else if (this.isNotEmpty(destinationLowerCase) == true && this.isInHashMap(destinationLowerCase, hashmap) == false){
            throw new Error(`Couldn't find: ${destinationLowerCase}`);
        }else if (this.isNotEmpty(destinationLowerCase) == false){
            throw new Error(`Destination can't be empty`);
        }
    }

    static validateInputs(source, destination, hashmap){
        let validatedSource = this.validateSource(source, hashmap);
        let validatedDestination = this.validateDestination(destination, hashmap);

        if(validatedSource == validatedDestination){
            throw new Error("You are already at your destination");
        }
        
        return [validatedSource,validatedDestination];
    }

}

export { ValidateInput };