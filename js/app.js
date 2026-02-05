import { ValidateInput } from './validateInput.js';
import { FindRequiredNodes } from './processing/findRequiredNode.js';
import { GetBuildingPicture } from './output/getBuildingPicture.js';
import { GetFloorPictures } from './output/getfloorPictures.js';
import { FindPath } from './processing/FindPath.js';
import { DrawPath } from './output/drawPath.js';
import { CampusExplorer } from './processing/explorer.js';
import { GraphDatabase } from './storage/graphDatabase.js';
import { TreeDataStruct } from './storage/treeDataStruct.js';
import { AutocompleteTrie } from './storage/autoCompleteTrie.js';

document.addEventListener('DOMContentLoaded', function() {
    // Preload critical assets
    const preloadImages = [
        'assets/UTECH_MAP.webp',
        'assets/UTECH_CREST.webp',
        'assets/buildings/FENC.jpg',
        'assets/buildings/SCIT.jpg',
        'assets/buildings/SOBA.jpg',
        'assets/buildings/FELS.jpg',
        'assets/buildings/COBAM.jpg',
        'assets/buildings/SHARED_FACILITIES.jpg',
        'assets/buildings/LT48.jpg',
        'assets/floors/FENC_GROUND.jpg',
        'assets/floors/FENC_1.jpg',
        'assets/floors/FENC_2.jpg',
        'assets/floors/FENC_3.jpg',
        'assets/floors/SCIT_GROUND.jpg',
        'assets/floors/SCIT_1.jpg',
        'assets/floors/SOBA_1.jpg',
        'assets/floors/FELS_GROUND.jpg',
        'assets/floors/FELS_1.jpg',
        'assets/floors/FELS_2.jpg',
        'assets/floors/SHARED_FACILITIES_GROUND.jpg',
        'assets/floors/SHARED_FACILITIES_1.jpg',
        'assets/floors/SHARED_FACILITIES_2.jpg',
        
    ];
    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    const roomForm = document.getElementById('directionsForm');
    const outputContainer = document.getElementById('output');
    const errorContainer = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    
    // Initialize databases
    const treeDB = new TreeDataStruct();
    const campusExplorer = new CampusExplorer(treeDB);
    campusExplorer.populate();
    const graphDB = new GraphDatabase();
    const roomsHashMap = treeDB.getRoomsHashMap();
    const rmAutoCompleteTrie = new AutocompleteTrie();
    rmAutoCompleteTrie.insertAll(roomsHashMap);
    
    // Make it available globally or attach to window for now
    window.rmAutoCompleteTrie = rmAutoCompleteTrie; // Easy access for inputs

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

            const sourceNode = roomsHashMap.get(validatedSource);
            const destinationNode = roomsHashMap.get(validatedDestination);
            console.log('Step 2 - Find Nodes from HashMap:', sourceNode, destinationNode);

            const requiredNodes = FindRequiredNodes.findRequiredNodes(sourceNode, destinationNode);
            const [sourceBuildingNode, sourceFloorNode, sourceRoomNode, destinationBuildingNode, destinationFloorNode, destinationRoomNode] = requiredNodes;
            console.log('Step 3 - Find Building and Floor Nodes:', requiredNodes);
 
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
            
            const sourceBuildingNodeFromGraph = graphDB.graph.get(sourceBuildingNode.name);
            const destinationBuildingNodeFromGraph = graphDB.graph.get(destinationBuildingNode.name);
            const path = FindPath.findPath(sourceBuildingNodeFromGraph, destinationBuildingNodeFromGraph, graphDB.graph);
            
            if (!path || path.length === 0) {
                console.warn('No path found between buildings');
            } else {
                console.log('Step 6: Path found:', path);
                
                await displayMapWithPath(sourceBuildingNode, destinationBuildingNode, path);
                
                console.log('Step 7: Map with path displayed');

                displayTextDirectionsForRooms(sourceBuildingNode, sourceFloorNode, sourceRoomNode, destinationBuildingNode, destinationFloorNode, destinationRoomNode);
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
            <div id="textDirections" class="output-section">
                <h3>Summary</h3>
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
    async function displayMapWithPath(sourceBuildingNode, destinationBuildingNode, path) {
        const canvas = document.getElementById('mapCanvas');
        
        // Load map image first
        await DrawPath.loadMapImage('assets/utech_map.webp', canvas);

        // Create complete map with path
        DrawPath.createMapWithPath(
            sourceBuildingNode,
            destinationBuildingNode,
            path,
            canvas
        );
    }

    function goingToRoomInDifferentBuilding(sourceBuildingNode, destinationBuildingNode, destinationFloorNode, destinationRoomNode){
        return `
            <div class="direction-instructions">
                <h4>Directions:</h4>
                <ol>
                    <li>Exit ${sourceBuildingNode.name}</li>
                    <li>Follow the yellow path on the map to ${destinationBuildingNode.name}</li>
                    <li>Enter ${destinationBuildingNode.name}</li>
                    <li>Navigate to ${destinationFloorNode.name}</li>
                    <li>Find ${destinationRoomNode.name}</li>
                </ol>
            </div>
        `;
    }

    function goingToFloorInDifferentBuilding(sourceBuildingNode, destinationBuildingNode, destinationFloorNode){
        return `
            <div class="direction-instructions">
                <h4>Instructions:</h4>
                <ol>
                    <li>Exit ${sourceBuildingNode.name}</li>
                    <li>Follow the yellow path on the map to ${destinationBuildingNode.name}</li>
                    <li>Enter ${destinationBuildingNode.name}</li>
                    <li>Navigate to ${destinationFloorNode.name}</li>
                </ol>
            </div>
        `;
    }

    function goingToBuildingInDifferentBuilding(sourceBuildingNode, destinationBuildingNode){
        return `
            <div class="direction-instructions">
                <h4>Instructions:</h4>
                <ol>
                    <li>Exit ${sourceBuildingNode.name}</li>
                    <li>Follow the yellow path on the map to ${destinationBuildingNode.name}</li>
                    <li>Enter ${destinationBuildingNode.name}</li>
                </ol>
            </div>
        `;
    }

    
    // Display text directions from room to room
    function displayTextDirectionsForRooms(sourceBuildingNode, sourceFloorNode, sourceRoomNode, destinationBuildingNode, destinationFloorNode, destinationRoomNode) {
        const content = document.getElementById('textDirectionsContent');

        // Edits html tags to indicate source and destination buildings and/or floors
        let html = `<div class="direction-row">`;
        if(sourceRoomNode === null && sourceFloorNode === null){
            html = `
                <div class="direction-step">
                <p><strong>From:</strong> ${sourceBuildingNode.name}</p>
                </div>
            `;
        }else{
            html = `
                <div class="direction-step">
                <p><strong>From:</strong> ${sourceBuildingNode.name} · ${sourceFloorNode.name}</p>
                </div>
            `;
        }        
        html = `
                <div class="direction-arrow">→</div>
        `;
        if(destinationRoomNode === null && destinationFloorNode === null){
            html = `
                    <div class="direction-step">
                    <p><strong>To:</strong> ${destinationBuildingNode.name}</p>
                    </div>
            `;
        }else{
            html = `
                    <div class="direction-step">
                    <p><strong>To:</strong> ${destinationBuildingNode.name} · ${destinationFloorNode.name}</p>
                    </div>
            `;
        }
        html = `
            </div>
        `;
        

        if(sourceRoomNode !== null && destinationRoomNode !== null){ // source is room and destination is room
            if (sourceBuildingNode.name !== destinationBuildingNode.name) { // different buildings
                html += goingToRoomInDifferentBuilding(sourceBuildingNode, destinationBuildingNode, destinationFloorNode, destinationRoomNode);
            } else if (sourceFloorNode.name !== destinationFloorNode.name) { // different floors
                html += `
                    <div class="direction-instructions">
                        <h4>Directions:</h4>
                        <ol>
                            <li>You are in ${sourceBuildingNode.name}</li>
                            <li>Navigate from ${sourceFloorNode.name} to ${destinationFloorNode.name}</li>
                            <li>Find ${destinationRoomNode.name}</li>
                        </ol>
                    </div>
                `;
            } else if(sourceRoomNode.name !== destinationRoomNode.name){ // different rooms
                html += `
                    <div class="direction-instructions">
                        <h4>Directions:</h4>
                        <p>Both rooms are on ${destinationFloorNode.name} in ${destinationBuildingNode.name}. \nSimply navigate along the corridor to find ${destinationRoomNode.name}.</p>
                    </div>
                `;
            }else if(sourceRoomNode.name === destinationRoomNode.name){ // same rooms
                html += ``;
            }

        }else if(sourceFloorNode !== null && destinationFloorNode !== null){ // source is floor and destination is floor
            if (sourceBuildingNode.name !== destinationBuildingNode.name) { // different buildings
                html += goingToFloorInDifferentBuilding(sourceBuildingNode, destinationBuildingNode, destinationFloorNode);
            } else if (sourceFloorNode.name !== destinationFloorNode.name) { // different floors
                html += `
                    <div class="direction-instructions">
                        <h4>Instructions:</h4>
                        <ol>
                            <li>You are in ${sourceBuildingNode.name}</li>
                            <li>Navigate from ${sourceFloorNode.name} to ${destinationFloorNode.name}</li>
                        </ol>
                    </div>
                `;
            } else if (sourceFloorNode.name === sourceFloorNode.name){
                html += ``;
            }
        }else if(sourceBuildingNode !== null && destinationBuildingNode !== null){ // source is building and destination is building
            if (sourceBuildingNode.name !== destinationBuildingNode.name) { // different buildings
                html += goingToBuildingInDifferentBuilding(sourceBuildingNode, destinationBuildingNode);
            }else if(sourceBuildingNode.name === destinationBuildingNode.name){
                html += ``;
            }
        }else if(sourceRoomNode !== null && destinationRoomNode === null){ // source is room but destination is not  
            if(destinationFloorNode !== null){ // destination is floor
                if(sourceBuildingNode.name !== destinationBuildingNode.name){ // different buildings
                    html += goingToFloorInDifferentBuilding(sourceBuildingNode, destinationBuildingNode, destinationFloorNode);
                }else if(sourceFloorNode.name !== destinationFloorNode.name){ // different floors
                    html += ``;
                }else if(sourceFloorNode.name === destinationFloorNode.name){ // same floors
                    html += ``;
                }
            }else if(destinationBuildingNode !== null){ // destination is building
                if(sourceBuildingNode.name !== destinationBuildingNode.name){ // different buildings
                    html += goingToBuildingInDifferentBuilding(sourceBuildingNode, destinationBuildingNode);
                }else if(sourceBuildingNode.name === destinationBuildingNode.name){ // same buildings
                    html += ``;
                }
            }
        }else if(sourceFloorNode !== null && destinationFloorNode === null){ // source is floor but destination is not
            if(destinationRoomNode !== null){ // destination is room
               if(sourceBuildingNode.name !== destinationBuildingNode.name){ // different buildings
                    html += goingToRoomInDifferentBuilding(sourceBuildingNode, destinationBuildingNode, destinationFloorNode, destinationRoomNode);
                }else if(sourceFloorNode.name !== destinationFloorNode.name){ // different floors
                    html += ``;
                }else if(sourceFloorNode.name === destinationFloorNode.name){ // same floors
                    html += ``;
                }
            }else if(destinationBuildingNode !== null){ // destination is building
                if(sourceBuildingNode.name !== destinationBuildingNode.name){ // different buildings
                    html += goingToBuildingInDifferentBuilding(sourceBuildingNode, destinationBuildingNode);
                }else if(sourceBuildingNode.name === destinationBuildingNode.name){ // same buildings
                    html += ``;
                }
            }
        }else if(sourceBuildingNode !== null && destinationBuildingNode === null){ // source is building but destination is not
            if(destinationRoomNode !== null){ // destination is room
                if(sourceBuildingNode.name !== destinationBuildingNode.name){ // different buildings
                    html += goingToRoomInDifferentBuilding(sourceBuildingNode, destinationBuildingNode,destinationFloorNode, destinationRoomNode);
                }else if(sourceBuildingNode.name === destinationBuildingNode.name){ // same buildings
                    html += ``;
                }
            }else if(destinationFloorNode !== null){ // destination is floor
                if(sourceBuildingNode.name !== destinationBuildingNode.name){ // different buildings
                    html += goingToFloorInDifferentBuilding(sourceBuildingNode, destinationBuildingNode, destinationFloorNode);
                }else if(sourceBuildingNode.name === destinationBuildingNode.name){ // same buildings
                    html += ``;
                }
            }
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