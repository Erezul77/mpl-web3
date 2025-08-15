// Stage 1H Test: Objects, Property Access, and For-In Loops

// Simple object creation and property access
var point = {x: 10, y: 20};
set(point.x, point.y);
set(point.x + 5, point.y + 5);

// Object with multiple properties
var config = {size: 5, offset: 10, color: 15};
set(config.size, config.offset);
set(config.size * 2, config.offset * 2);

// For-in loop with object properties
var settings = {a: 5, b: 10, c: 15};
for (var key in settings) {
  set(settings[key], settings[key]);
}

// Nested objects
var data = {pos: {x: 10, y: 20}, size: {w: 5, h: 5}};
set(data.pos.x, data.pos.y);
set(data.pos.x + data.size.w, data.pos.y + data.size.h);

// Objects with arrays
var items = [{id: 1, val: 10}, {id: 2, val: 20}, {id: 3, val: 30}];
for (var item of items) {
  set(item.id * 5, item.val);
}

// Function that creates and returns objects
function createPoint(x, y) {
  return {x: x, y: y};
}

// Use the object function
var p1 = createPoint(5, 10);
var p2 = createPoint(15, 20);
set(p1.x, p1.y);
set(p2.x, p2.y);

// Complex object pattern
var pattern = {start: {x: 0, y: 0}, end: {x: 10, y: 10}, step: 2};
for (var i = pattern.start.x; i <= pattern.end.x; i = i + pattern.step) {
  set(i, i);
}

// Object with computed properties
var grid = {width: 8, height: 8};
for (var x = 0; x < grid.width; x = x + 1) {
  for (var y = 0; y < grid.height; y = y + 1) {
    if ((x + y) % 2 == 0) {
      set(x * 3, y * 3);
    }
  }
}
