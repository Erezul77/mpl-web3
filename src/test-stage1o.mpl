// Title: Stage 1O - 3D Visualization Test
// Description: Testing 3D voxel grid visualization features
// Author: MPL Developer
// Version: 1.0
// Created: 2024

// Stage 1O: 3D Grid Pattern for Visualization
function create3DPattern() {
  print("Creating 3D grid pattern...");
  for (var x = 0; x < 20; x = x + 1) {
    for (var y = 0; y < 20; y = y + 1) {
      if ((x + y) % 3 == 0) {
        set(x, y);
      }
    }
  }
  print("3D pattern ready for visualization!");
}

// Stage 1O: 3D Spiral Pattern
function createSpiral() {
  print("Creating 3D spiral...");
  var center = 25;
  for (var angle = 0; angle < 360; angle = angle + 15) {
    var rad = angle * 3.14159 / 180;
    var radius = angle / 10;
    var x = center + math.floor(math.cos(rad) * radius);
    var y = center + math.floor(math.sin(rad) * radius);
    if (x >= 0 && x < 50 && y >= 0 && y < 50) {
      set(x, y);
    }
  }
  print("3D spiral created!");
}

// Stage 1O: 3D Checkerboard Pattern
function createCheckerboard() {
  print("Creating 3D checkerboard...");
  for (var x = 0; x < 50; x = x + 2) {
    for (var y = 0; y < 50; y = y + 2) {
      set(x, y);
    }
  }
  print("3D checkerboard ready!");
}

// Stage 1O: Complex 3D Pattern
function createComplexPattern() {
  print("Creating complex 3D pattern...");
  
  // Create a flower-like pattern
  var center = 25;
  for (var i = 0; i < 8; i = i + 1) {
    var angle = i * 45;
    var rad = angle * 3.14159 / 180;
    var radius = 15;
    
    for (var r = 5; r <= radius; r = r + 2) {
      var x = center + math.floor(math.cos(rad) * r);
      var y = center + math.floor(math.sin(rad) * r);
      if (x >= 0 && x < 50 && y >= 0 && y < 50) {
        set(x, y);
      }
    }
  }
  
  // Add some random elements
  for (var i = 0; i < 20; i = i + 1) {
    var x = math.floor(math.random() * 50);
    var y = math.floor(math.random() * 50);
    set(x, y);
  }
  
  print("Complex 3D pattern created!");
}

// Stage 1O: Performance Test for 3D Visualization
function performanceTest3D() {
  print("Starting 3D performance test...");
  var startTime = Date.now();
  
  for (var i = 0; i < 1000; i = i + 1) {
    var x = i % 50;
    var y = math.floor(i / 50);
    if (y < 50) {
      set(x, y);
    }
  }
  
  var endTime = Date.now();
  var duration = endTime - startTime;
  print("3D performance test complete in " + duration + "ms!");
}

// Main execution
print("=== Stage 1O: 3D Visualization Test ===");
print("Testing 3D voxel grid visualization features...");

// Clear the grid first
clear();

// Test different patterns
create3DPattern();
print("Pattern 1 complete - check 3D viewer!");

clear();
createSpiral();
print("Pattern 2 complete - check 3D viewer!");

clear();
createCheckerboard();
print("Pattern 3 complete - check 3D viewer!");

clear();
createComplexPattern();
print("Pattern 4 complete - check 3D viewer!");

// Performance test
clear();
performanceTest3D();
print("Performance test complete - check 3D viewer!");

print("=== Stage 1O Test Complete ===");
print("All patterns created successfully!");
print("Use the 3D viewer to explore your creations!");
print("Click on voxels to inspect their properties!");
