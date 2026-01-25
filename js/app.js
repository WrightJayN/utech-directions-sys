import { ValidateInput } from './validateInput.js';
import { FindBuildingAndFloorNodes } from './processing/findBuildingAndFloorNodes.js';
import { GetBuildingPicture } from './output/getBuildingPicture.js';
import { GetFloorPictures } from './output/getfloorPictures.js';
import { FindPath } from './processing/FindPath.js';
import { PathDrawer } from './output/pathDrawer.js';
import { CampusExplorer } from './processing/explorer.js';
import { GraphDatabase } from './storage/graphDatabase.js';
import { TreeDataStruct } from './storage/treeDataStruct.js';
import { AutocompleteTrie } from './storage/autoCompleteTrie.js';

document.addEventListener('DOMContentLoaded', function() {
    // Preload critical assets
    const preloadImages = [
        'assets/utech_map.webp',
        'assets/utech_crest.webp',
        'assets/buildings/FENC.jpg',
        'assets/buildings/building2.jpg',
        'assets/buildings/building5.jpg',
        'assets/buildings/building8.jpg',
        'assets/buildings/building22.jpg',
        'assets/buildings/building47.jpg',
        //'assets/buildings/walkin_gate.jpg',
        //'assets/buildings/back_gate.jpg',
        //'assets/buildings/main_gate.jpg',
        'assets/floors/FENC_GROUND.jpg',
        'assets/floors/floor1a.jpg',
        'assets/floors/floor1b.jpg',
        'assets/floors/floor1c.jpg',
        'assets/floors/floor2a.jpg',
        'assets/floors/floor2b.jpg',
        //'assets/floors/floor2c.jpg',
        //'assets/floors/floor5a.jpg',
        'assets/floors/floor5b.jpg',
        //'assets/floors/floor5c.jpg',
        'assets/floors/floor8a.jpg',
        'assets/floors/floor8b.jpg',
        'assets/floors/floor8c.jpg',
        'assets/floors/floor47a.jpg',
        'assets/floors/floor47b.jpg',
        'assets/floors/floor47c.jpg',
        //'assets/floors/floorltbsdbld47a.jpg',
        //'assets/floors/floorltbsdbld47b.jpg',
    ];
    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    const roomForm = document.getElementById('directionsForm');
    const floorForm = document.getElementById('floorsForm');
    const buildingForm = document.getElementById('buildingsForm');
    const outputContainer = document.getElementById('output');
    const errorContainer = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    
    // Initialize databases
    const treeDB = new TreeDataStruct();
    const campusExplorer = new CampusExplorer(treeDB);
    campusExplorer.populate();
    const graphDB = new GraphDatabase();
    const roomsHashMap = treeDB.getRoomsHashMap();
    const floorHashMap = treeDB.getFloorHashMap();
    const buildingHashMap = treeDB.getBuildingHashMap();
    const rmAutoCompleteTrie = new AutocompleteTrie();
    rmAutoCompleteTrie.insertAll(roomsHashMap);
    const flrAutoCompleteTrie = new AutocompleteTrie();
    flrAutoCompleteTrie.insertAll(floorHashMap);
    const bldAutoCompleteTrie = new AutocompleteTrie();
    bldAutoCompleteTrie.insertAll(buildingHashMap);
    
    // Make it available globally or attach to window for now
    window.rmAutoCompleteTrie = rmAutoCompleteTrie; // Easy access for inputs    
    window.flrAutoCompleteTrie = flrAutoCompleteTrie;
    window.bldAutoCompleteTrie = bldAutoCompleteTrie;

    // Navbar navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');
    let currentView = 'explorer'; // Track current view

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetView = btn.getAttribute('data-view');

            // Only clear outputs if switching to a DIFFERENT view
            if (targetView !== currentView) {
                outputContainer.style.display = 'none';
                errorContainer.style.display = 'none';
                clearOutputs();
                
                if (targetView === 'explorer') {
                    campusExplorer.populate();
                }
            }

            // Update active states
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            views.forEach(v => v.classList.remove('active'));
            document.getElementById(`${targetView}-view`).classList.add('active');

            // Update current view tracker
            currentView = targetView;
        });
    });

    // Create output sections dynamically
    createOutputSections();
    
    roomForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide previous outputs
        errorContainer.style.display = 'none';

        // Add fade-out for old content
        outputContainer.classList.add('fade-out');

        try {     
            const source = document.getElementById('fromRoom').value;
            const destination = document.getElementById('toRoom').value;
            
            const [validatedSource, validatedDestination] = ValidateInput.validateInputs(source, destination, roomsHashMap);
            console.log('Step 1 - Validate Inputs:', [validatedSource, validatedDestination]);

            let sourceRoomNode = roomsHashMap.get(validatedSource);
            let destinationRoomNode = roomsHashMap.get(validatedDestination);
            console.log('Step 2 - Find Nodes from HashMap:', sourceRoomNode, destinationRoomNode);

            const buildingAndFloorNodes = FindBuildingAndFloorNodes.findBuildingAndFloorNodes(sourceRoomNode, destinationRoomNode);
            const [sourceBuildingNode, sourceFloorNode, destinationBuildingNode, destinationFloorNode] = buildingAndFloorNodes;
            console.log('Step 3 - Find Building and Floor Nodes:', buildingAndFloorNodes);

            const buildingPicture = GetBuildingPicture.getBuildingPicture(destinationBuildingNode);
            if (buildingPicture) {
                displayBuildingPicture(buildingPicture, destinationBuildingNode.name);
            }            
            console.log('Step 4: Building picture:', buildingPicture);

            const floorPicture = GetFloorPictures.getFloorPicture(destinationFloorNode);
            if (floorPicture) {
                displayFloorPicture(floorPicture, destinationFloorNode.name);
            }            
            console.log('Step 5: Floor picture:', floorPicture);
            
            const sourceBuildingNodeForGraph = graphDB.graph.get(sourceBuildingNode.name);
            const destinationBuildingNodeForGraph = graphDB.graph.get(destinationBuildingNode.name);
            const path = FindPath.findPath(sourceBuildingNodeForGraph, destinationBuildingNodeForGraph, graphDB.graph);
            
            if (!path || path.length === 0) {
                console.warn('No path found between buildings');
            } else {
                console.log('Step 6: Path found:', path);
                
                await displayMapWithPath(sourceBuildingNode, destinationBuildingNode, path);
                
                console.log('Step 7: Map with path displayed');
                
                // Display text directions as well
                displayTextDirectionsForRooms(destinationRoomNode, sourceBuildingNode, destinationBuildingNode, sourceFloorNode, destinationFloorNode);
            }            
            outputContainer.style.display = 'block';           // Make it visible
            outputContainer.classList.remove('fade-out');     // In case it was fading out
            outputContainer.classList.add('show');            // Triggers smooth fade-in
                
        } catch (error) {
            // Display error
            console.error('Error:', error);
            errorMessage.textContent = error.message;
            errorContainer.style.display = 'block';
        }
    });

    floorForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide previous outputs
        errorContainer.style.display = 'none';

        // Add fade-out for old content
        outputContainer.classList.add('fade-out');
        
        try {     
            // Get form inputs
            const fromFloorInput = document.getElementById('fromFloor').value;
            const toFloorInput = document.getElementById('toFloor').value;

            // STEP 1 & 2: Data Collector - Convert inputs to lowercase strings
            const fromFloor = fromFloorInput.trim() === "" ? null : fromFloorInput;
            const toFloor = toFloorInput.trim() === "" ? null : toFloorInput;
            
            const processedFloor = DataCollector.processFloorInputs(fromFloor, toFloor);
            
            console.log('Step 1-2: Processed inputs:', processedFloor);

            //STEP 3 & 4: Find floor and building node
            let from_flr_t_node = floorHashMap.get(processedFloor.fromFloor) ?? null;
            let to_flr_t_node = floorHashMap.get(processedFloor.toFloor) ?? null;
            let from_bld_t_node = null;
            let to_bld_t_node = null;
            if (!from_flr_t_node) {
                throw new Error(`From floor "${processedFloor.fromFloor}" not found`);
            }
            if (!to_flr_t_node) {
                throw new Error(`To floor "${processedFloor.toFloor}" not found`);
            }
            if(from_flr_t_node === to_flr_t_node){
                throw new Error("These are the same floor; no directions needed");
            }
            if(from_flr_t_node.name == "main gate" || from_flr_t_node.name == "back gate" || from_flr_t_node.name == "walkin gate"){
                from_bld_t_node = buildingHashMap.get(from_flr_t_node.name);
            }else{
                from_bld_t_node = from_flr_t_node.parent;
            }
            if(to_flr_t_node.name == "main gate" || to_flr_t_node.name == "back gate" || to_flr_t_node.name == "walkin gate"){
                to_bld_t_node = buildingHashMap.get(to_flr_t_node.name);
            }else{
                to_bld_t_node = to_flr_t_node.parent;
            }

            // STEP 5: Building Pictures Output - Display destination building picture
            const buildingPicture = GetBuildingPicture.getBuildingPicture(to_bld_t_node);
            if (buildingPicture) {
                displayBuildingPicture(buildingPicture, to_bld_t_node.name);
            }

            // STEP 6: Floor Pictures Output - Display destination floor picture
            const floorPicture = FloorPicturesOutput.getFloorPicture(to_flr_t_node);
            if (floorPicture) {
                displayFloorPicture(floorPicture, to_flr_t_node.name);
            }

            // STEP 7: PathFinder - Find shortest path between buildings
            const path = FindPath.findPathFromTreeNodes(
                from_bld_t_node,
                to_bld_t_node,
                graphDB
            );
            
            if (!path || path.length === 0) {
                console.warn('No path found between buildings');
            } else {
                console.log('Step 7: Path found:', path);
                
                // STEP 8: PathDrawer - Draw map with path
                await displayMapWithPath(from_bld_t_node, to_bld_t_node, path);
                
                console.log('Step 8: Map with path displayed');
                
                // Display text directions as well
                displayTextDirectionsForFloors(from_bld_t_node, to_bld_t_node, from_flr_t_node, to_flr_t_node);
            }

            outputContainer.style.display = 'block';           // Make it visible
            outputContainer.classList.remove('fade-out');     // In case it was fading out
            outputContainer.classList.add('show');            // Triggers smooth fade-in
                
        } catch (error) {
            // Display error
            console.error('Error:', error);
            errorMessage.textContent = error.message;
            errorContainer.style.display = 'block';
        }
    });
    
    buildingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide previous outputs
        errorContainer.style.display = 'none';

        // Add fade-out for old content
        outputContainer.classList.add('fade-out');

        try {     
            // Get form inputs
            const fromBuildingInput = document.getElementById('fromBuilding').value;
            const toBuildingInput = document.getElementById('toBuilding').value;

            // STEP 1 & 2: Data Collector - Convert inputs to lowercase strings
            const fromBuilding = fromBuildingInput.trim() === "" ? null : fromBuildingInput;
            const toBuilding = toBuildingInput.trim() === "" ? null : toBuildingInput;
            
            const processedBuilding = DataCollector.processBuildingInputs(fromBuilding, toBuilding);
            
            console.log('Step 1-2: Processed inputs:', processedBuilding);

            //STEP 3 & 4: Find floor and building node;
            let from_bld_t_node = buildingHashMap.get(processedBuilding.fromBuilding);
            let to_bld_t_node = buildingHashMap.get(processedBuilding.toBuilding);
            if (!from_bld_t_node) {
                throw new Error(`From floor "${processedBuilding.fromBuilding}" not found`);
            }
            if (!to_bld_t_node) {
                throw new Error(`To floor "${processedBuilding.toBuilding}" not found`);
            }
            if(from_bld_t_node === to_bld_t_node){
                throw new Error("These are the same building; no directions needed");
            }

            // STEP 5: Building Pictures Output - Display destination building picture
            const buildingPicture = GetBuildingPicture.getBuildingPicture(to_bld_t_node);
            if (buildingPicture) {
                displayBuildingPicture(buildingPicture, to_bld_t_node.name);
            }

            // STEP 6: PathFinder - Find shortest path between buildings
            const path = FindPath.findPathFromTreeNodes(
                from_bld_t_node,
                to_bld_t_node,
                graphDB
            );
            
            if (!path || path.length === 0) {
                console.warn('No path found between buildings');
            } else {
                console.log('Step 6: Path found:', path);
                
                // STEP 7: PathDrawer - Draw map with path
                await displayMapWithPath(from_bld_t_node, to_bld_t_node, path);
                
                console.log('Step 7: Map with path displayed');
                
                // Display text directions as well
                displayTextDirectionsForBuildings(from_bld_t_node, to_bld_t_node);
            }

            outputContainer.style.display = 'block';           // Make it visible
            outputContainer.classList.remove('fade-out');     // In case it was fading out
            outputContainer.classList.add('show');            // Triggers smooth fade-in
                
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
            
            <div class="output-row">
                <div id="buildingPictureSection" class="output-section.half">
                    <h3>🏢 Destination Building</h3>
                    <div id="buildingPictureContent"></div>
                </div>
                
                <div id="floorPictureSection" class="output-section.half">
                    <h3>🔢 Destination Floor</h3>
                    <div id="floorPictureContent"></div>
                </div>
            </div>

            <!-- Map section with inset floor highlight -->
            <div class="output-section" id="mapSection">
                <h3>🗺️ Campus Map with Route</h3>
                <div class="map-container">
                    <div id="mapContent">
                        <canvas id="mapCanvas"></canvas>
                    </div>
                </div>
            </div>

        `;
    }
    
    // Helper function to clear outputs
    function clearOutputs() {
        document.getElementById('textDirectionsContent').innerHTML = '';
        document.getElementById('buildingPictureContent').innerHTML = '';
        document.getElementById('floorPictureContent').innerHTML = '';
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
    
    // Display map with path
    async function displayMapWithPath(from_bld_t_node, to_bld_t_node, path) {
        const canvas = document.getElementById('mapCanvas');
        
        // Load map image first
        await PathDrawer.loadMapImage('assets/utech_map.webp', canvas);
        
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
    
    // Display text directions from room to room
    function displayTextDirectionsForRooms(destinationRoomNode, from_bld_t_node, to_bld_t_node, from_flr_t_node, to_flr_t_node) {
        const content = document.getElementById('textDirectionsContent');
        
        let html = `
            <div class="direction-row">
                <div class="direction-step">
                <p><strong>From:</strong> ${from_bld_t_node.name} · ${from_flr_t_node.name}</p>
                </div>
                <div class="direction-arrow">→</div>
                <div class="direction-step">
                <p><strong>To:</strong> ${to_bld_t_node.name} · ${to_flr_t_node.name}</p>
                </div>
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
                        <li>Find room ${destinationRoomNode.name}</li>
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
                        <li>Find room ${destinationRoomNode.name}</li>
                    </ol>
                </div>
            `;
        } else {
            html += `
                <div class="direction-instructions">
                    <h4>📍 Instructions:</h4>
                    <p>Both rooms are on the same floor (${to_flr_t_node.name}) in ${to_bld_t_node.name}. Simply navigate along the corridor to find room ${destinationRoomNode.name}.</p>
                </div>
            `;
        }
        
        content.innerHTML = html;
    }

    // Display text directions from floor to floor
    function displayTextDirectionsForFloors(from_bld_t_node, to_bld_t_node, from_flr_t_node, to_flr_t_node) {
        const content = document.getElementById('textDirectionsContent');
        
        let html = `
            <div class="direction-row">
                <div class="direction-step">
                <p><strong>From:</strong> ${from_bld_t_node.name} · ${from_flr_t_node.name}</p>
                </div>
                <div class="direction-arrow">→</div>
                <div class="direction-step">
                <p><strong>To:</strong> ${to_bld_t_node.name} · ${to_flr_t_node.name}</p>
                </div>
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
                    </ol>
                </div>
            `;
        }
        
        content.innerHTML = html;
    }
    // Display text directions from building to building
    function displayTextDirectionsForBuildings(from_bld_t_node, to_bld_t_node) {
        const content = document.getElementById('textDirectionsContent');
        
        let html = `
            <div class="direction-row">
                <div class="direction-step">
                <p><strong>From:</strong> ${from_bld_t_node.name}</p>
                </div>
                <div class="direction-arrow">→</div>
                <div class="direction-step">
                <p><strong>To:</strong> ${to_bld_t_node.name}</p>
                </div>
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
                    </ol>
                </div>
            `;
        }
        
        content.innerHTML = html;
    }
    


    // Autocomplete function for any input
    function setupAutocomplete(inputId, suggestionsId) {
        const input = document.getElementById(inputId);
        const suggestionsBox = document.getElementById(suggestionsId);

        input.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            suggestionsBox.innerHTML = '';

            if (query.length === 0) {
                suggestionsBox.style.display = 'none';
                return;
            }

            const suggestions = window.rmAutoCompleteTrie.getSuggestions(query, 10);

            if (suggestions.length === 0) {
                suggestionsBox.style.display = 'none';
                return;
            }

            suggestions.forEach(suggestion => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';

                const highlightStart = suggestion.toLowerCase().indexOf(query);
                const highlightEnd = highlightStart + query.length;

                const beforeMatch = suggestion.slice(0, highlightStart);
                const match = suggestion.slice(highlightStart, highlightEnd);
                const afterMatch = suggestion.slice(highlightEnd);

                item.innerHTML = `${beforeMatch}<strong>${match}</strong>${afterMatch}`;

                item.addEventListener('click', () => {
                    input.value = suggestion;
                    suggestionsBox.style.display = 'none';
                });
                suggestionsBox.appendChild(item);
            });

            suggestionsBox.style.display = 'block';
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.style.display = 'none';
            }
        });
    }

    // Setup autocomplete for both inputs
    setupAutocomplete('fromRoom', 'fromRoomSuggestions');
    setupAutocomplete('toRoom', 'toRoomSuggestions');
});
