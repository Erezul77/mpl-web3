// Stage 1L Test: Error Handling and Runtime Safety

// This example demonstrates the new Stage 1L features
// including custom error types, safe execution, and error recovery

print("=== Stage 1L Error Handling Test ===");

// Test 1: Safe execution with proper error handling
print("\n1. Testing safe execution:");
var arr = [1, 2, 3, 4, 5];
print("Array: " + arr);
print("Length: " + len(arr));

// This will trigger proper error handling
print("Trying to access index 10...");
var value = arr[10]; // This should show proper error handling
print("Value: " + value);

// Test 2: Type safety demonstration
print("\n2. Testing type safety:");
var text = "Hello MPL";
var number = 42;
print("Text: " + text);
print("Number: " + number);

// This will show proper error handling for type mismatches
print("Trying to use text as coordinates...");
set(text, number); // This should show proper error handling

// Test 3: Object property access safety
print("\n3. Testing object safety:");
var config = {
  size: 8,
  color: "blue"
};
print("Config: " + config);
print("Size: " + config.size);

// This will show proper error handling for missing properties
print("Trying to access missing property...");
var missing = config.missing; // This should show proper error handling
print("Missing: " + missing);

// Test 4: Array bounds checking
print("\n4. Testing array bounds:");
var smallArray = [10, 20];
print("Small array: " + smallArray);

// This will show proper error handling for out-of-bounds access
print("Trying to access out-of-bounds index...");
var outOfBounds = smallArray[5]; // This should show proper error handling
print("Out of bounds: " + outOfBounds);

// Test 5: Function call safety
print("\n5. Testing function safety:");
function testFunction(x, y) {
  return x + y;
}

// Valid function call
var result = testFunction(5, 3);
print("Valid call result: " + result);

// This will show proper error handling for undefined functions
print("Trying to call undefined function...");
var undefinedResult = undefinedFunction(); // This should show proper error handling
print("Undefined result: " + undefinedResult);

// Test 6: Error recovery demonstration
print("\n6. Testing error recovery:");
var recoveryArray = [1, 2, 3];

// Simulate an error condition
if (len(recoveryArray) > 0) {
  print("Array has elements, proceeding safely");
  for (var i = 0; i < len(recoveryArray); i = i + 1) {
    set(recoveryArray[i], recoveryArray[i]);
  }
} else {
  print("Array is empty, using fallback");
  set(10, 10);
}

// Test 7: Complex error scenarios
print("\n7. Testing complex error scenarios:");
var complexObject = {
  data: [1, 2, 3],
  metadata: {
    name: "Test",
    version: 1
  }
};

// Safe navigation through nested structures
if (complexObject && complexObject.data && len(complexObject.data) > 0) {
  print("Safe navigation successful");
  var firstElement = complexObject.data[0];
  set(firstElement, firstElement);
} else {
  print("Safe navigation failed, using fallback");
  set(15, 15);
}

// Test 8: Mathematical error handling
print("\n8. Testing mathematical error handling:");
var validNumber = 16;
var sqrtResult = math.sqrt(validNumber);
print("sqrt(" + validNumber + ") = " + sqrtResult);

// This will show proper error handling for invalid math operations
print("Trying invalid math operation...");
var invalidResult = math.sqrt(-1); // This should show proper error handling
print("Invalid result: " + invalidResult);

print("\n=== Stage 1L Test Complete ===");
print("Check the console for detailed error information");
print("The grid should show safe operations and error recovery");
