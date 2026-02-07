import { ValidateInput } from './processing/validateInput.js';
import { FindRequiredNodes } from './processing/findRequiredNode.js';
import { GetBuildingPicture } from './output/getBuildingPicture.js';
import { GetFloorPictures } from './output/getfloorPictures.js';
import { FindPath } from './processing/FindPath.js';
import { DrawPath } from './output/drawPath.js';
import { DisplayTextDirections } from './processing/displayTextDirections.js';
import { CampusExplorer } from './processing/explorer.js';
import { GraphDatabase } from './storage/graphDatabase.js';
import { TreeDataStruct } from './storage/treeDataStruct.js';

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
    const roomsHashMap = treeDB.getHashMap();

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
            const source = document.getElementById('sourceInput').value;
            const destination = document.getElementById('destinationInput').value;
            
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

            if(destinationFloorNode){
                const floorPicture = GetFloorPictures.getFloorPicture(destinationFloorNode);
                if (floorPicture) {
                    displayFloorPicture(floorPicture, destinationFloorNode.name);
                }            
                console.log('Step 5: Floor picture:', floorPicture);
            }else {
                document.getElementById('floorPictureSection').style.display = 'none'; //Hide floor output when destination input is a building
            }
            
            const sourceBuildingNodeFromGraph = graphDB.graph.get(sourceBuildingNode.name);
            const destinationBuildingNodeFromGraph = graphDB.graph.get(destinationBuildingNode.name);
            const path = FindPath.findPath(sourceBuildingNodeFromGraph, destinationBuildingNodeFromGraph, graphDB.graph);
            
            if (!path || path.length === 0) {
                console.warn('No path found between buildings');
            } else {
                console.log('Step 6: Path found:', path);
                
                await displayMapWithPath(sourceBuildingNode, destinationBuildingNode, path);
                
                console.log('Step 7: Map with path displayed');

                DisplayTextDirections.displayTextDirections(sourceBuildingNode, sourceFloorNode, sourceRoomNode, destinationBuildingNode, destinationFloorNode, destinationRoomNode);
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
});