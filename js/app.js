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

//Module imports
import { DataCollector } from './input/dataCollector.js';
import { RoomNodeFinder } from './processing/roomNodeFinder.js';
import { BuildingFloorNodeFinder } from './processing/buildingFloorNodeFinder.js';
import { PathFinder } from './processing/pathFinder.js';
import { CampusExplorer } from './processing/Explorer.js';
import { BuildingPicturesOutput } from './output/buildingPicturesOutput.js';
import { FloorHighlightOutput } from './output/floorHighlightOutput.js';
import { FloorPicturesOutput } from './output/floorPicturesOutput.js';
import { PathDrawer } from './output/pathDrawer.js';
import { showPathLoadingAnimation } from './output/loadingAnimation.js';
import { GraphDatabase } from './storage/graphDatabase.js';
import { TreeDatabase } from './storage/treeDatabase.js';
import { AutocompleteTrie } from './storage/autoCompleteTrie.js';

document.addEventListener('DOMContentLoaded', function() {
    // Preload critical assets
    const preloadImages = [
        'assets/utech_map.webp',
        'assets/utech_crest.jpg',
        'assets/buildings/building1.jpg',
        'assets/buildings/building2.jpg',
        'assets/buildings/building5.jpg',
        'assets/buildings/building8.jpg',
        'assets/buildings/building22.jpg',
        'assets/buildings/building47.jpg',
        //'assets/buildings/walkin_gate.jpg',
        //'assets/buildings/back_gate.jpg',
        //'assets/buildings/main_gate.jpg',
        'assets/floors/floor1ground.jpg',
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

    const form = document.getElementById('directionsForm');
    const outputContainer = document.getElementById('output');
    const errorContainer = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    const loadingAnimationContainer = document.getElementById('canvasContainer');
    let isAnimationPlayed = false;
    
    // Initialize databases
    const treeDB = new TreeDatabase();
    const campusExplorer = new CampusExplorer(treeDB);
    campusExplorer.populate();
    const graphDB = new GraphDatabase();
    const roomsHashMap = treeDB.getRoomsHashMap();
    const autocompleteTrie = new AutocompleteTrie();
    autocompleteTrie.insertAll(roomsHashMap);
    // Make it available globally or attach to window for now
    window.autocompleteTrie = autocompleteTrie; // Easy access for inputs    

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
                loadingAnimationContainer.innerHTML = ''; //clears loading animation if present
                
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
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide previous outputs
        errorContainer.style.display = 'none';

        // Add fade-out for old content
        outputContainer.classList.add('fade-out');
        loadingAnimationContainer.classList.add('fade-out');
        
        // Show the beautiful path animation for 1 seconds
        if(!isAnimationPlayed){
            loadingAnimationContainer.classList.remove('fade-out');
            loadingAnimationContainer.classList.add('show');
            await showPathLoadingAnimation(loadingAnimationContainer, 1000);
            isAnimationPlayed = true;
        }

        try {      
            // Get form inputs
            const fromRoomInput = document.getElementById('fromRoom').value;
            const toRoomInput = document.getElementById('toRoom').value;

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
            
            // Show output with fade-in
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
                    
                    <!-- Desktop Inset Floor Highlight -->
                    <div class="floor-inset">
                        <h4>🎯 Floor Location</h4>
                        <div id="floorHighlightContent">
                            <canvas id="floorHighlightCanvas" width="400" height="600"></canvas>
                        </div>
                    </div>

                    <!-- Mobile Full-Width Floor Highlight (shown only on mobile) -->
                    <div class="mobile-floor-highlight">
                        <h4>🎯 Floor Location</h4>
                        <canvas id="floorHighlightCanvasMobile" width="400" height="600"></canvas>
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
        const floorCanvasMobile = document.getElementById('floorHighlightCanvasMobile');
        if (floorCanvasMobile) {
            const ctx = floorCanvasMobile.getContext('2d');
            ctx.clearRect(0, 0, floorCanvasMobile.width, floorCanvasMobile.height);
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
        const desktopCanvas = document.getElementById('floorHighlightCanvas');
        const mobileCanvas = document.getElementById('floorHighlightCanvasMobile');

        if (desktopCanvas) {
            FloorHighlightOutput.createFloorHighlight(to_flr_t_node, desktopCanvas);
        }
        if (mobileCanvas) {
            FloorHighlightOutput.createFloorHighlight(to_flr_t_node, mobileCanvas);
        }
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
    
    // Display text directions
    function displayTextDirections(from_rm_t_node, to_rm_t_node, from_bld_t_node, to_bld_t_node, from_flr_t_node, to_flr_t_node) {
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

            const suggestions = window.autocompleteTrie.getSuggestions(query, 10);

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
