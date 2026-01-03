// loadingAnimation.js

/**
 * Shows a canvas-based loading animation with a growing yellow zigzag path
 * from a red circle to a blue circle.
 * 
 * @param {HTMLElement} container - The element to insert the canvas into (e.g. canvasContainer)
 * @param {number} duration - Animation duration in milliseconds (default: 3000)
 * @returns {Promise} Resolves when animation finishes and canvas is removed
 */
function showPathLoadingAnimation(container, duration = 3000) {
    return new Promise((resolve) => {
        // Clear any previous canvas
        container.innerHTML = '';

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 200;
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        canvas.style.margin = '40px auto';
        canvas.style.display = 'block';
        canvas.style.borderRadius = '16px';
        canvas.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        canvas.style.background = '#ffffff';
        canvas.style.border = '1px solid #eee';

        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        // Animation parameters
        const startX = 80;
        const startY = 100;
        const endX = canvas.width - 80;
        const segmentCount = 5; // left-up-left-up-left
        const segmentDistance = (endX - startX) / segmentCount;
        const upHeight = 50;

        // Define zigzag points
        const points = [
            { x: startX, y: startY },
            { x: startX + segmentDistance, y: startY - upHeight },
            { x: startX + 2 * segmentDistance, y: startY },
            { x: startX + 3 * segmentDistance, y: startY - upHeight },
            { x: startX + 4 * segmentDistance, y: startY },
            { x: endX, y: startY }
        ];

        function drawCircle(x, y, color) {
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 12;
            ctx.shadowOffsetY = 6;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }

        let startTime = null;

        function animate(time) {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw circles
            drawCircle(points[0].x, points[0].y, '#d32f2f');        // Red start
            drawCircle(points[points.length - 1].x, points[points.length - 1].y, '#1976d2'); // Blue end

            // Draw growing yellow path
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 12;
            ctx.lineCap = 'round';
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 20;

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            const totalSegments = points.length - 1;
            const currentSegment = Math.floor(progress * totalSegments);
            const segmentProgress = (progress * totalSegments) - currentSegment;

            // Draw complete segments
            for (let i = 1; i <= currentSegment; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }

            // Draw partial current segment
            if (currentSegment < totalSegments && progress < 1) {
                const nextX = points[currentSegment].x + 
                              (points[currentSegment + 1].x - points[currentSegment].x) * segmentProgress;
                const nextY = points[currentSegment].y + 
                              (points[currentSegment + 1].y - points[currentSegment].y) * segmentProgress;
                ctx.lineTo(nextX, nextY);
            }

            ctx.stroke();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                setTimeout(() => {
                    container.innerHTML = ''; // remove canvas
                    resolve(); // resolve promise so main code can continue
                }, 400); // small pause for nice finish
            }
        }

        requestAnimationFrame(animate);
    });
}

export { showPathLoadingAnimation };