class FindBuildingAndFloorNodes {

    static findBuildingNode(roomNode) {
        let floorNode = roomNode.parent;
        let buildingNode = floorNode.parent;
        return buildingNode;
    }

    static findFloorNode(roomNode) {
        let floorNode = roomNode.parent;
        return floorNode;
    }

    static findBuildingAndFloorNodes(sourceRoomNode, destinationRoomNode) {
        const sourceBuildingNode = this.findBuildingNode(sourceRoomNode);
        const sourceFloorNode = this.findFloorNode(sourceRoomNode);
        const destinationBuildingNode = this.findBuildingNode(destinationRoomNode);
        const destinationFloorNode = this.findFloorNode(destinationRoomNode);

        return[sourceBuildingNode, sourceFloorNode, destinationBuildingNode, destinationFloorNode];
    }
}

export { FindBuildingAndFloorNodes };