class CreateOutputSections{
    static createOutputSections(outputContainer) {
        outputContainer.innerHTML = `            
            <div id="textDirections" class="output-section">
                <div id="textDirectionsContent"></div>
            </div>
            
            <div class="output-row">
                <div id="buildingPictureSection" class="output-section.half">
                    <h3>Destination Building</h3>
                    <div id="buildingPictureContent"></div>
                </div>
                
                <div id="floorPictureSection" class="output-section.half">
                    <h3>Destination Floor</h3>
                    <div id="floorPictureContent"></div>
                </div>
            </div>

            <!-- Map section -->
            <div class="output-section" id="mapSection">
                <h3>Map with Route</h3>
                <div class="map-container">
                    <div id="mapContent">
                        <canvas id="mapCanvas"></canvas>
                    </div>
                </div>
            </div>

        `;
    }
}

export { CreateOutputSections }