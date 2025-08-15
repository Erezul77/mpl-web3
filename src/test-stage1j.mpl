// Stage 1J Test: Enhanced IDE Support, Better Linting, and Code Quality

// This example demonstrates good MPL coding practices
// with proper formatting, comments, and structure

// Configuration object for the pattern
var config = {
  size: 8,
  offset: 5,
  pattern: "checkerboard"
};

// Main function that orchestrates the pattern creation
function main() {
  print("Creating " + config.pattern + " pattern");
  
  if (config.pattern == "checkerboard") {
    createCheckerboard(config.size, config.offset);
  } else if (config.pattern == "spiral") {
    createSpiral(config.size, config.offset);
  }
  
  print("Pattern complete! Grid size: " + config.size);
}

// Creates a checkerboard pattern
function createCheckerboard(size, offset) {
  for (var x = 0; x < size; x = x + 1) {
    for (var y = 0; y < size; y = y + 1) {
      if ((x + y) % 2 == 0) {
        set(x + offset, y + offset);
      }
    }
  }
}

// Creates a spiral pattern
function createSpiral(size, offset) {
  var x = offset;
  var y = offset;
  var dx = 1;
  var dy = 0;
  var steps = 1;
  var stepCount = 0;
  
  for (var i = 0; i < size * size; i = i + 1) {
    set(x, y);
    
    x = x + dx;
    y = y + dy;
    stepCount = stepCount + 1;
    
    if (stepCount == steps) {
      stepCount = 0;
      // Rotate direction
      var temp = dx;
      dx = -dy;
      dy = temp;
      
      if (i % 2 == 1) {
        steps = steps + 1;
      }
    }
  }
}

// Helper function to get array length
function getArrayLength(arr) {
  return len(arr);
}

// Helper function to get object property count
function getPropertyCount(obj) {
  return len(obj);
}

// Test data structures
var testArray = [1, 2, 3, 4, 5];
var testObject = {
  name: "MPL Test",
  version: "1.0",
  features: ["arrays", "objects", "strings", "functions"]
};

// Display information about our test data
print("Test array length: " + getArrayLength(testArray));
print("Test object properties: " + getPropertyCount(testObject));

// Execute the main function
main();
