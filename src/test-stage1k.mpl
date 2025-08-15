// Stage 1K Test: Standard Library Functions and Constants

// This example demonstrates the new Stage 1K features
// including math functions, constants, and utility functions

// Using mathematical constants
print("Mathematical Constants:");
print("PI = " + PI);
print("E = " + E);
print("TAU = " + TAU);
print("Grid dimensions: " + GRID_WIDTH + "x" + GRID_HEIGHT);

// Using math functions
print("\nMath Functions:");
var x = 3.7;
var y = -2.3;
print("x = " + x + ", y = " + y);
print("floor(x) = " + math.floor(x));
print("ceil(y) = " + math.ceil(y));
print("abs(y) = " + math.abs(y));
print("round(x) = " + math.round(x));
print("2^3 = " + math.pow(2, 3));
print("sqrt(16) = " + math.sqrt(16));

// Using trigonometric functions
print("\nTrigonometric Functions:");
for (var angle = 0; angle < 360; angle = angle + 45) {
  var rad = angle * PI / 180;
  var x = math.cos(rad) * 20 + 25;
  var y = math.sin(rad) * 20 + 25;
  set(math.round(x), math.round(y));
  print("Angle " + angle + "°: (" + math.round(x) + ", " + math.round(y) + ")");
}

// Using string utility functions
print("\nString Functions:");
var text = "  Hello MPL World  ";
print("Original: [" + text + "]");
print("Trimmed: [" + string.trim(text) + "]");
print("Upper: " + string.toUpperCase(text));
print("Lower: " + string.toLowerCase(text));
print("Length: " + string.length(text));
print("Substring(5, 10): " + string.substring(text, 5, 10));

// Using array utility functions
print("\nArray Functions:");
var arr = [1, 2, 3];
print("Original array: " + arr);
print("Array length: " + array.length(arr));

arr = array.push(arr, 4);
print("After push(4): " + arr);

arr = array.push(arr, 5);
print("After push(5): " + arr);

arr = array.pop(arr);
print("After pop(): " + arr);

var sliced = array.slice(arr, 1, 3);
print("Slice(1, 3): " + sliced);

// Using random function for pattern generation
print("\nRandom Pattern Generation:");
for (var i = 0; i < 15; i = i + 1) {
  var x = math.floor(math.random() * GRID_WIDTH);
  var y = math.floor(math.random() * GRID_HEIGHT);
  set(x, y);
  print("Random point " + (i + 1) + ": (" + x + ", " + y + ")");
}

// Using min/max functions
print("\nMin/Max Functions:");
var numbers = [3, 7, 1, 9, 4, 6];
print("Numbers: " + numbers);
print("Min: " + math.min(...numbers));
print("Max: " + math.max(...numbers));

// Using I/O functions
print("\nI/O Functions:");
io.log("This is a log message");
io.warn("This is a warning message");
io.error("This is an error message");

// Complex mathematical pattern
print("\nComplex Mathematical Pattern:");
for (var i = 0; i < 20; i = i + 1) {
  var t = i * 0.5;
  var x = math.round(25 + 15 * math.cos(t));
  var y = math.round(25 + 15 * math.sin(t));
  set(x, y);
  
  // Add some variation
  var offset = math.floor(math.random() * 3) - 1;
  set(x + offset, y + offset);
}

print("Stage 1K test complete! Check the grid for patterns.");
