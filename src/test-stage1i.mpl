// Stage 1I Test: Strings, Built-in Functions, and String Concatenation

// Simple string creation and printing
var message = "Hello MPL!";
print(message);
var messageLen = len(message);
set(messageLen, messageLen);

// String concatenation
var part1 = "Hello";
var part2 = " World";
var full = part1 + part2;
print(full);
set(len(full), len(full));

// String with numbers
var name = "MPL";
var version = 1;
var info = name + " v" + version;
print(info);
set(len(info), len(info));

// Array and object lengths
var arr = [1, 2, 3, 4, 5];
var obj = {a: 1, b: 2, c: 3};
print("Array length: " + len(arr));
print("Object keys: " + len(obj));
set(len(arr), len(obj));

// Function that returns strings
function greet(name) {
  return "Hello " + name + "!";
}
var msg = greet("MPL");
print(msg);
set(len(msg), len(msg));

// Complex string operations
var coords = [10, 20];
var point = {x: 15, y: 25};
var info = "Coords: " + coords + ", Point: " + point;
print(info);
set(len(info) % 20, len(info) % 20);

// String in loops
var words = ["Hello", "MPL", "World"];
for (var word of words) {
  print("Word: " + word + ", Length: " + len(word));
  set(len(word), len(word));
}

// Object with string properties
var config = {name: "MPL", version: "1.0", type: "Language"};
for (var key in config) {
  var value = config[key];
  print(key + ": " + value);
  set(len(key), len(value));
}
