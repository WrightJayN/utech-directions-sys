/**
 * Main application logic
 * Handles form submission and UI updates
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('directionsForm');
    const outputContainer = document.getElementById('output');
    const errorContainer = document.getElementById('error');
    const outputFrom = document.getElementById('outputFrom');
    const outputTo = document.getElementById('outputTo');
    const errorMessage = document.getElementById('errorMessage');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Hide previous outputs
        outputContainer.style.display = 'none';
        errorContainer.style.display = 'none';
        
        // Get form inputs
        const fromRoomInput = document.getElementById('fromRoom').value;
        const toRoomInput = document.getElementById('toRoom').value;
        
        try {
            // Process inputs using Data Collector
            // Convert empty string to null for fromRoom (to trigger default)
            const fromRoom = fromRoomInput.trim() === "" ? null : fromRoomInput;
            const toRoom = toRoomInput.trim() === "" ? null : toRoomInput;
            
            const processed = DataCollector.processRoomInputs(fromRoom, toRoom);
            
            // Display results
            outputFrom.textContent = processed.fromRoom;
            outputTo.textContent = processed.toRoom;
            outputContainer.style.display = 'block';
            
        } catch (error) {
            // Display error
            errorMessage.textContent = error.message;
            errorContainer.style.display = 'block';
        }
    });
});

