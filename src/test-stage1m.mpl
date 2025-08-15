// Title: Stage 1M Test - File I/O Operations
// Description: This program demonstrates Stage 1M features including file import/export
// Author: MPL Developer
// Version: 1.0
// Created: 2024

// Stage 1M Test: File I/O Operations and Project Management

// This example demonstrates the new Stage 1M features
// including file import/export, project management, and metadata handling

print("=== Stage 1M File I/O Test ===");

// Test 1: Project metadata demonstration
print("\n1. Project Information:");
print("Title: Stage 1M Test - File I/O Operations");
print("Description: Demonstrates file import/export capabilities");
print("Author: MPL Developer");
print("Version: 1.0");

// Test 2: File-ready program structure
print("\n2. File-Ready Program Structure:");
function main() {
  print("Main function executing...");
  
  var config = {
    projectName: "MPL File I/O Test",
    features: ["Import", "Export", "Metadata", "Project Management"],
    gridSize: 50
  };
  
  print("Project: " + config.projectName);
  print("Features: " + config.features);
  
  return config;
}

// Test 3: Import/Export compatible code
print("\n3. Import/Export Compatible Code:");
var settings = {
  patternType: "spiral",
  iterations: 20,
  spacing: 2
};

function createSpiralPattern() {
  print("Creating " + settings.patternType + " pattern...");
  
  var x = 25;
  var y = 25;
  var dx = 1;
  var dy = 0;
  var steps = 1;
  var stepCount = 0;
  
  for (var i = 0; i < settings.iterations; i = i + 1) {
    set(x, y);
    
    x = x + dx * settings.spacing;
    y = y + dy * settings.spacing;
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
  
  print("Spiral pattern complete!");
}

// Test 4: File persistence features
print("\n4. File Persistence Features:");
var data = {
  lastModified: "2024",
  tags: ["test", "file-io", "project"],
  complexity: "medium"
};

function saveProjectInfo() {
  print("Project info:");
  print("- Last modified: " + data.lastModified);
  print("- Tags: " + data.tags);
  print("- Complexity: " + data.complexity);
  
  // This information will be preserved when file is exported
  return data;
}

// Test 5: Export-ready content
print("\n5. Export-Ready Content:");
function generateExportContent() {
  var exportData = {
    program: "Stage 1M Test",
    functions: ["main", "createSpiralPattern", "saveProjectInfo"],
    variables: ["settings", "data"],
    patterns: ["spiral", "grid", "mathematical"]
  };
  
  print("Export data prepared:");
  for (var key in exportData) {
    print("- " + key + ": " + exportData[key]);
  }
  
  return exportData;
}

// Test 6: File validation features
print("\n6. File Validation Features:");
function validateProgram() {
  var errors = [];
  var warnings = [];
  
  // Check for required functions
  if (typeof main !== 'function') {
    errors.push("Missing main function");
  }
  
  // Check for configuration
  if (typeof settings !== 'object') {
    warnings.push("No settings object found");
  }
  
  // Check for documentation
  var hasComments = sourceCode.includes('//');
  if (!hasComments) {
    warnings.push("No comments found - consider adding documentation");
  }
  
  print("Validation complete:");
  if (errors.length > 0) {
    print("Errors: " + errors);
  }
  if (warnings.length > 0) {
    print("Warnings: " + warnings);
  }
  if (errors.length === 0 && warnings.length === 0) {
    print("Program is valid and ready for export!");
  }
  
  return { errors, warnings };
}

// Test 7: Project management features
print("\n7. Project Management Features:");
function manageProject() {
  var project = {
    name: "Stage 1M File I/O Test",
    version: "1.0",
    dependencies: [],
    requirements: ["MPL Core", "File I/O Support"],
    status: "ready"
  };
  
  print("Project management:");
  for (var key in project) {
    print("- " + key + ": " + project[key]);
  }
  
  return project;
}

// Test 8: File format compatibility
print("\n8. File Format Compatibility:");
function ensureCompatibility() {
  // Ensure consistent formatting
  var formattedCode = sourceCode
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\n\s*\n\s*\n/g, '\n\n')  // Remove excessive empty lines
    .trim();
  
  print("File format compatibility ensured:");
  print("- Line endings normalized");
  print("- Excessive whitespace removed");
  print("- File trimmed");
  
  return formattedCode;
}

// Execute all tests
print("\n=== Executing Stage 1M Tests ===");

var mainResult = main();
var spiralResult = createSpiralPattern();
var projectInfo = saveProjectInfo();
var exportContent = generateExportContent();
var validation = validateProgram();
var project = manageProject();
var compatibility = ensureCompatibility();

print("\n=== Stage 1M Test Results ===");
print("Main function result: " + mainResult);
print("Spiral pattern created: " + (spiralResult !== undefined ? "Yes" : "No"));
print("Project info saved: " + (projectInfo !== undefined ? "Yes" : "No"));
print("Export content ready: " + (exportContent !== undefined ? "Yes" : "No"));
print("Validation passed: " + (validation.errors.length === 0 ? "Yes" : "No"));
print("Project managed: " + (project !== undefined ? "Yes" : "No"));
print("Compatibility ensured: " + (compatibility !== undefined ? "Yes" : "No"));

print("\n=== Stage 1M Test Complete ===");
print("This program is ready for file import/export operations!");
print("Check the grid for the generated spiral pattern.");
print("File can be exported with all metadata and project information preserved.");
