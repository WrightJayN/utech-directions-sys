import { ValidateInput } from './processing/validateInput.js';
import { FindRequiredNodes } from './processing/findRequiredNode.js';
import { FindPath } from './processing/FindPath.js';
import { DisplayTextDirections } from './processing/displayTextDirections.js';
import { LocationSuggest } from './processing/locationSuggest.js';
import { GetBuildingPicture } from './output/getBuildingPicture.js';
import { GetFloorPictures } from './output/getfloorPictures.js';
import { DisplayPicture } from './output/displayPicture.js';
import { CreateOutputSections } from './output/createOutputSection.js';
import { GraphDatabase } from './storage/graphDatabase.js';
import { TreeDataStruct } from './storage/treeDataStruct.js';
import { DisplayMapWithPath } from './output/displayMapWithPath.js';

document.addEventListener('DOMContentLoaded', function() {
    // Preload critical assets
    const preloadImages = [
        'assets/UTECH_MAP.webp',
        'assets/UTECH_ENTRANCE.webp',
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

    const form = document.getElementById('directions-form');
    const outputContainer = document.getElementById('output');
    const errorContainer = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    
    // Initialize data structs
    const tree = new TreeDataStruct();
    const graphDB = new GraphDatabase();
    const hashMap = tree.getHashMap();

    //Autocomplete suggestions
    const sourceInput = document.getElementById('source-input');
    const sourceSuggestions = document.getElementById('source-suggestions');
    const destinationInput = document.getElementById('destination-input');
    const destinationSuggestions = document.getElementById('destination-suggestions');
    const locations = Array.from(hashMap.keys());

    function initializeSuggestions(inputEl, suggestionsEl, allItems) {
        if (!inputEl || !suggestionsEl) return;
        // Only create once
        if (inputEl.dataset.suggestionsInitialized) return;
        
        new LocationSuggest(inputEl, suggestionsEl, allItems);
        inputEl.dataset.suggestionsInitialized = 'true';
    }

    sourceInput.addEventListener('focus', () => {
        initializeSuggestions(sourceInput, sourceSuggestions, locations);
    });

    destinationInput.addEventListener('focus', () => {
        initializeSuggestions(destinationInput, destinationSuggestions, locations);
    });

    // Create output sections dynamically
    CreateOutputSections.createOutputSections(outputContainer);
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide previous outputs
        errorContainer.style.display = 'none';

        // Add fade-out for old content
        outputContainer.classList.add('fade-out');

        try {     
            const source = document.getElementById('source-input').value;
            const destination = document.getElementById('destination-input').value;
            
            const [validatedSource, validatedDestination] = ValidateInput.validateInputs(source, destination, hashMap);
            console.log('Step 1 - Validate Inputs:', [validatedSource, validatedDestination]);

            const sourceNode = hashMap.get(validatedSource);
            const destinationNode = hashMap.get(validatedDestination);
            console.log('Step 2 - Find Nodes from HashMap:', sourceNode, destinationNode);

            const requiredNodes = FindRequiredNodes.findRequiredNodes(sourceNode, destinationNode);
            const [sourceBuildingNode, sourceFloorNode, sourceRoomNode, destinationBuildingNode, destinationFloorNode, destinationRoomNode] = requiredNodes;
            console.log('Step 3 - Find Building and Floor Nodes:', requiredNodes);
 
            const buildingPicture = GetBuildingPicture.getBuildingPicture(destinationBuildingNode);
            if (buildingPicture) {
                DisplayPicture.displayBuildingPicture(buildingPicture, destinationBuildingNode.name);
            }            
            console.log('Step 4: Building picture:', buildingPicture);

            if(destinationFloorNode){
                const floorPicture = GetFloorPictures.getFloorPicture(destinationFloorNode);
                if (floorPicture) {
                    DisplayPicture.displayFloorPicture(floorPicture, destinationFloorNode.name);
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
                
                await DisplayMapWithPath.displayMapWithPath(sourceBuildingNode, destinationBuildingNode, path);
                
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
    
    fetch('version.txt')
        .then(response => response.text())
        .then(text => {
            document.getElementById('version').innerText = text;
        })
        .catch(err => {
            console.error('Could load versions');
            document.getElementById('version').innerText = "Couldn't load version.";
        });

});