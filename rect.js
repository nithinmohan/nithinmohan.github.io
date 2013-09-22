var canvas = document.getElementById('canvas'),
context = canvas.getContext('2d'),
gradient = context.createLinearGradient(0, 0, canvas.width, 0);
context.beginPath(); // Clear all subpaths from the
// current path
context.rect(10, 10, 100, 100); // Add a subpath with four points
context.stroke(); // Stroke the subpath containing
//context.beginPath(); // Clear all subpaths from the
// four points
context.rect(50, 50, 100, 100); // Add a second subpath with
// four points
context.stroke();