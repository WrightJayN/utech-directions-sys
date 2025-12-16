/**
 * Main application logic - Integrated UTech Directions System
 * Handles complete flow from user input to final outputs
 * 
 * Flow:
 * 1. User enters from/to rooms
 * 2. DataCollector converts to lowercase strings
 * 3. RoomNodeFinder finds room tree nodes from Rooms Hash Map
 * 4. BuildingFloorNodeFinder finds building/floor tree nodes
 * 5. BuildingPicturesOutput displays destination building picture
 * 6. FloorPicturesOutput displays destination floor picture
 * 7. FloorHighlightOutput highlights destination floor
 * 8. PathFinder finds shortest path between buildings
 * 9. PathDrawer displays map with path drawn
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('directionsForm');
    const outputContainer = document.getElementById('output');
    const errorContainer = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    
    // Initialize databases
    const treeDB = new TreeDatabase();
    const graphDB = new GraphDatabase();
    const roomsHashMap = treeDB.getRoomsHashMap();
    const buildingGraph = graphDB.getBuildingGraph();
    
    // Create output sections dynamically
    createOutputSections();
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide previous outputs
        outputContainer.style.display = 'none';
        errorContainer.style.display = 'none';
        clearOutputs();
        
        // Get form inputs
        const fromRoomInput = document.getElementById('fromRoom').value;
        const toRoomInput = document.getElementById('toRoom').value;
        
        try {
            // STEP 1 & 2: Data Collector - Convert inputs to lowercase strings
            const fromRoom = fromRoomInput.trim() === "" ? null : fromRoomInput;
            const toRoom = toRoomInput.trim() === "" ? null : toRoomInput;
            
            const processed = DataCollector.processRoomInputs(fromRoom, toRoom);
            
            console.log('Step 1-2: Processed inputs:', processed);
            
            // STEP 3: Room Node Finder - Find room tree nodes using Rooms Hash Map
            const [from_rm_t_node, to_rm_t_node] = RoomNodeFinder.findRoomNodes(
                processed.fromRoom,
                processed.toRoom,
                roomsHashMap
            );
            
            if (!from_rm_t_node) {
                throw new Error(`From room "${processed.fromRoom}" not found`);
            }
            if (!to_rm_t_node) {
                throw new Error(`To room "${processed.toRoom}" not found`);
            }
            
            console.log('Step 3: Found room nodes:', from_rm_t_node, to_rm_t_node);
            
            // Check if same room
            if (from_rm_t_node === to_rm_t_node) {
                throw new Error("These are the same rooms; no directions needed");
            }
            
            // STEP 4: Building/Floor Node Finder - Find building and floor tree nodes
            const result = BuildingFloorNodeFinder.findBuildingAndFloorNodes(
                from_rm_t_node,
                to_rm_t_node
            );
            
            const { from_bld_t_node, from_flr_t_node, to_bld_t_node, to_flr_t_node } = result;
            
            console.log('Step 4: Found building/floor nodes:', result);
            
            // STEP 5: Building Pictures Output - Display destination building picture
            const buildingPicture = BuildingPicturesOutput.getBuildingPicture(to_bld_t_node);
            if (buildingPicture) {
                displayBuildingPicture(buildingPicture, to_bld_t_node.name);
            }
            
            console.log('Step 5: Building picture:', buildingPicture);
            
            // STEP 6: Floor Pictures Output - Display destination floor picture
            const floorPicture = FloorPicturesOutput.getFloorPicture(to_flr_t_node);
            if (floorPicture) {
                displayFloorPicture(floorPicture, to_flr_t_node.name);
            }
            
            console.log('Step 6: Floor picture:', floorPicture);
            
            // STEP 7: Floor Highlight Output - Highlight destination floor
            displayFloorHighlight(to_flr_t_node);
            
            console.log('Step 7: Floor highlight created');
            
            // STEP 8: PathFinder - Find shortest path between buildings
            const path = PathFinder.findPathFromTreeNodes(
                from_bld_t_node,
                to_bld_t_node,
                graphDB
            );
            
            if (!path || path.length === 0) {
                console.warn('No path found between buildings');
                displayTextDirections(from_rm_t_node, to_rm_t_node, from_bld_t_node, to_bld_t_node, from_flr_t_node, to_flr_t_node);
            } else {
                console.log('Step 8: Path found:', path);
                
                // STEP 9: PathDrawer - Draw map with path
                await displayMapWithPath(from_bld_t_node, to_bld_t_node, path);
                
                console.log('Step 9: Map with path displayed');
                
                // Display text directions as well
                displayTextDirections(from_rm_t_node, to_rm_t_node, from_bld_t_node, to_bld_t_node, from_flr_t_node, to_flr_t_node);
            }
            
            // Show output container
            outputContainer.style.display = 'block';
            
        } catch (error) {
            // Display error
            console.error('Error:', error);
            errorMessage.textContent = error.message;
            errorContainer.style.display = 'block';
        }
    });
    
    // Helper function to create output sections
    function createOutputSections() {
        outputContainer.innerHTML = `
            <h2>Directions</h2>
            
            <div id="textDirections" class="output-section">
                <h3>📍 Summary</h3>
                <div id="textDirectionsContent"></div>
            </div>
            
            <div id="buildingPictureSection" class="output-section">
                <h3>🏢 Destination Building</h3>
                <div id="buildingPictureContent"></div>
            </div>
            
            <div id="floorPictureSection" class="output-section">
                <h3>🔢 Destination Floor</h3>
                <div id="floorPictureContent"></div>
            </div>
            
            <div id="floorHighlightSection" class="output-section">
                <h3>🎯 Floor Location</h3>
                <div id="floorHighlightContent">
                    <canvas id="floorHighlightCanvas" width="400" height="600"></canvas>
                </div>
            </div>
            
            <div id="mapSection" class="output-section">
                <h3>🗺️ Campus Map with Route</h3>
                <div id="mapContent">
                    <canvas id="mapCanvas"></canvas>
                </div>
            </div>
        `;
    }
    
    // Helper function to clear outputs
    function clearOutputs() {
        document.getElementById('textDirectionsContent').innerHTML = '';
        document.getElementById('buildingPictureContent').innerHTML = '';
        document.getElementById('floorPictureContent').innerHTML = '';
        const floorCanvas = document.getElementById('floorHighlightCanvas');
        if (floorCanvas) {
            const ctx = floorCanvas.getContext('2d');
            ctx.clearRect(0, 0, floorCanvas.width, floorCanvas.height);
        }
        const mapCanvas = document.getElementById('mapCanvas');
        if (mapCanvas) {
            const ctx = mapCanvas.getContext('2d');
            ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
        }
    }
    
    // Display building picture
    function displayBuildingPicture(picturePath, buildingName) {
        const content = document.getElementById('buildingPictureContent');
        content.innerHTML = `
            <p><strong>Building:</strong> ${buildingName}</p>
            <img src="${picturePath}" alt="${buildingName}" class="output-image" 
                 onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\'%3E%3Crect fill=\'%23ddd\' width=\'400\' height=\'300\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'18\' fill=\'%23666\'%3EBuilding Image Not Available%3C/text%3E%3C/svg%3E';">
        `;
    }
    
    // Display floor picture
    function displayFloorPicture(picturePath, floorName) {
        const content = document.getElementById('floorPictureContent');
        content.innerHTML = `
            <p><strong>Floor:</strong> ${floorName}</p>
            <img src="${picturePath}" alt="${floorName}" class="output-image"
                 onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\'%3E%3Crect fill=\'%23ddd\' width=\'400\' height=\'300\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'18\' fill=\'%23666\'%3EFloor Image Not Available%3C/text%3E%3C/svg%3E';">
        `;
    }
    
    // Display floor highlight
    function displayFloorHighlight(to_flr_t_node) {
        const canvas = document.getElementById('floorHighlightCanvas');
        FloorHighlightOutput.createFloorHighlight(to_flr_t_node, canvas);
    }
    
    // Display map with path
    async function displayMapWithPath(from_bld_t_node, to_bld_t_node, path) {
        const canvas = document.getElementById('mapCanvas');
        
        // Load map image first
        await PathDrawer.loadMapImage('assests/utech_map.png', canvas);
        
        // Get building vertices hash map
        const verticesHashMap = PathDrawer.getBuildingVerticesHashMap();
        
        // Create complete map with path
        PathDrawer.createMapWithPath(
            from_bld_t_node,
            to_bld_t_node,
            path,
            verticesHashMap,
            canvas
        );
    }
    
    // Display text directions
    function displayTextDirections(from_rm_t_node, to_rm_t_node, from_bld_t_node, to_bld_t_node, from_flr_t_node, to_flr_t_node) {
        const content = document.getElementById('textDirectionsContent');
        
        let html = `
            <div class="direction-step">
                <p><strong>From:</strong> ${from_rm_t_node.name}</p>
                <p><strong>Building:</strong> ${from_bld_t_node.name}</p>
                <p><strong>Floor:</strong> ${from_flr_t_node.name}</p>
            </div>
            <div class="direction-arrow">↓</div>
            <div class="direction-step">
                <p><strong>To:</strong> ${to_rm_t_node.name}</p>
                <p><strong>Building:</strong> ${to_bld_t_node.name}</p>
                <p><strong>Floor:</strong> ${to_flr_t_node.name}</p>
            </div>
        `;
        
        // Add building-to-building directions if different buildings
        if (from_bld_t_node.name !== to_bld_t_node.name) {
            html += `
                <div class="direction-instructions">
                    <h4>📍 Instructions:</h4>
                    <ol>
                        <li>Exit ${from_bld_t_node.name}</li>
                        <li>Follow the yellow path on the map to ${to_bld_t_node.name}</li>
                        <li>Enter ${to_bld_t_node.name}</li>
                        <li>Navigate to ${to_flr_t_node.name}</li>
                        <li>Find room ${to_rm_t_node.name}</li>
                    </ol>
                </div>
            `;
        } else if (from_flr_t_node.name !== to_flr_t_node.name) {
            html += `
                <div class="direction-instructions">
                    <h4>📍 Instructions:</h4>
                    <ol>
                        <li>You are in ${from_bld_t_node.name}</li>
                        <li>Navigate from ${from_flr_t_node.name} to ${to_flr_t_node.name}</li>
                        <li>Find room ${to_rm_t_node.name}</li>
                    </ol>
                </div>
            `;
        } else {
            html += `
                <div class="direction-instructions">
                    <h4>📍 Instructions:</h4>
                    <p>Both rooms are on the same floor (${to_flr_t_node.name}) in ${to_bld_t_node.name}. Simply navigate along the corridor to find room ${to_rm_t_node.name}.</p>
                </div>
            `;
        }
        
        content.innerHTML = html;
    }
});
