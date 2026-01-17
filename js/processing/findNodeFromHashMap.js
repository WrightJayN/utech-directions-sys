class FindNodeFromHashMap {

    static findNodes(source, destination, hashmap) {
        let sourceNode = hashmap.get(source);
        let destinationNode = hashmap.get(destination);

        return [sourceNode, destinationNode];
    }
}

export { FindNodeFromHashMap };

