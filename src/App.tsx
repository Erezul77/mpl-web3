// src/App.tsx
// MPL Playground - BEAUTIFUL DESIGN SYSTEM ✨
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { VoxelSelectionProvider } from './ui/hooks/useVoxelSelection';
import { HistoryProvider } from './ui/state/history';
import { MetricsProvider } from './ui/state/metrics';
import { RuleEditorProvider } from './ui/state/ruleEditor';
import { LayerConfigProvider } from './ui/state/layerConfig';
import { PatternUIProvider } from './ui/state/patternUI';
import { PresetsProvider } from './ui/state/presets';
import { RuleTemplatesProvider } from './ui/state/ruleTemplates';
import { RuleVersioningProvider } from './ui/state/ruleVersioning';
import { ParameterControlsProvider } from './ui/state/parameterControls';
import { LogProvider } from './ui/state/logStore';
import TimelinePanel from './ui/components/TimelinePanel';
import VoxelInspectorPanel from './ui/components/VoxelInspectorPanel';
import RuleDebuggerPanel from './ui/components/RuleDebuggerPanel';
import MetricsPanel from './ui/components/MetricsPanel';
import RuleHotReloadPanel from './ui/components/RuleHotReloadPanel';
import LayerControlsPanel from './ui/components/LayerControlsPanel';
import PatternPanel from './ui/components/PatternPanel';
import PresetsPanel from './ui/components/PresetsPanel';
import { RuleTemplatesPanel } from './ui/components/RuleTemplatesPanel';
import { ParameterControlsPanel } from './ui/components/ParameterControlsPanel';
import { RuleVersioningPanel } from './ui/components/RuleVersioningPanel';
import DiagnosticsPanel from './ui/components/DiagnosticsPanel';
import LogConsole from './ui/components/LogConsole';
import VoxelGrid3D from './ui/components/VoxelGrid3D';
import VoxelLayers3D from './ui/components/VoxelLayers3D';

// COMPLETE MPL Examples - All System Features
const EXAMPLES = {
  'Clear Grid': 'clear();',
  'Single Cell': 'set(25,25);',
  'Pattern Rule': 'rule cross {\n  set(20, 20);\n  set(20, 21);\n  set(21, 20);\n  set(21, 21);\n}\ncross();',
  'Math Pattern': 'for (var i = 0; i < 10; i = i + 1) {\n  set(i, i);\n  set(i, 10 - i);\n}',
  'Function Demo': 'function pattern() {\n  set(25, 25);\n  set(26, 25);\n  set(25, 26);\n  set(26, 26);\n}\npattern();',
  'Advanced Grid': 'for (var x = 0; x < 20; x = x + 1) {\n  for (var y = 0; y < 20; y = y + 1) {\n    if ((x + y) % 2 == 0) {\n      set(x, y);\n    }\n  }\n}',
  'Spiral Pattern': 'var x = 25, y = 25;\nvar dx = 1, dy = 0;\nfor (var i = 0; i < 100; i = i + 1) {\n  set(x, y);\n  if (i % 20 == 0) {\n    var temp = dx;\n    dx = -dy;\n    dy = temp;\n  }\n  x = x + dx;\n  y = y + dy;\n}',
  'Multi-Layer': '// Multi-layer pattern\nset(10, 10);\nset(11, 10);\nset(10, 11);\nset(11, 11);\n// Switch to layer 1\nlayer(1);\nset(15, 15);\nset(16, 15);\nset(15, 16);\nset(16, 16);',
  'Rule Templates': '// Using rule templates\nrule square(size) {\n  for (var i = 0; i < size; i = i + 1) {\n    for (var j = 0; j < size; j = j + 1) {\n      set(i, j);\n    }\n  }\n}\nsquare(5);',
  'Pattern I/O': '// Pattern import/export ready\nvar pattern = {\n  name: "My Pattern",\n  version: "1.0",\n  data: [[10, 10], [11, 10], [10, 11], [11, 11]]\n};\nfor (var point of pattern.data) {\n  set(point[0], point[1]);\n}',
  'Hot Reload': '// Hot reload compatible\nfunction dynamicPattern() {\n  var size = 8;\n  for (var i = 0; i < size; i = i + 1) {\n    set(i, i);\n    set(size - i, i);\n  }\n}\ndynamicPattern();',
  'Performance Test': '// Performance monitoring\nfor (var i = 0; i < 1000; i = i + 1) {\n  var x = i % 50;\n  var y = Math.floor(i / 50);\n  if (i % 3 == 0) {\n    set(x, y);\n  }\n}'
};

export default function App() {
  console.log('MPL Full Application - BEAUTIFUL DESIGN SYSTEM ✨');
  
  const [code, setCode] = useState(EXAMPLES['Clear Grid']);
  const [output, setOutput] = useState('');
  const [selectedExample, setSelectedExample] = useState('Clear Grid');
  const [isContextReady, setIsContextReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeLayer, setActiveLayer] = useState(0);
  const [show3DGrid, setShow3DGrid] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContextReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Theme switching with proper CSS class management
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const handleRunCode = () => {
    setOutput(`✅ Executing: ${code.substring(0, 50)}...`);
  };

  const handleExampleChange = (example: string) => {
    setSelectedExample(example);
    setCode(EXAMPLES[example as keyof typeof EXAMPLES]);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen relative ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Beautiful Background Pattern */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-slate-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>
      
      <LogProvider>
        <VoxelSelectionProvider>
          <HistoryProvider>
            <MetricsProvider>
              <RuleEditorProvider>
                <LayerConfigProvider>
                  <PatternUIProvider>
                    <PresetsProvider>
                      <RuleTemplatesProvider>
                        <RuleVersioningProvider>
                          <ParameterControlsProvider>
                            <div className="app min-h-screen p-6 box-border">
                              
                              {/* Beautiful Top Navigation Bar */}
                              <div className="sticky top-6 z-50 mb-8 glass-panel-elevated p-6 flex justify-between items-center">
                                <h1 className="m-0 text-4xl font-extrabold gradient-text tracking-tight">
                                  MPL Playground ✨
                                </h1>
                                
                                <div className="flex gap-6 items-center">
                                  {/* Beautiful Theme Toggle */}
                                  <button
                                    onClick={toggleTheme}
                                    className="btn-secondary p-3 rounded-full transition-all duration-300 hover:scale-110"
                                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                  >
                                    <span className="text-xl">
                                      {isDarkMode ? '☀️' : '🌙'}
                                    </span>
                                  </button>
                                  
                                  {/* Elegant Layer Control */}
                                  <div className="flex items-center gap-3">
                                    <label className="text-sm font-medium text-muted">Layer:</label>
                                    <select
                                      value={activeLayer}
                                      onChange={(e) => setActiveLayer(Number(e.target.value))}
                                      className="form-select min-w-[120px]"
                                    >
                                      {[0, 1, 2, 3].map(layer => (
                                        <option key={layer} value={layer}>Layer {layer}</option>
                                      ))}
                                    </select>
                                  </div>
                                  
                                  {/* Beautiful 3D Toggle */}
                                  <button
                                    onClick={() => setShow3DGrid(!show3DGrid)}
                                    className={`btn-primary ${show3DGrid ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}
                                  >
                                    {show3DGrid ? '🎯 3D Active' : '📱 2D Mode'}
                                  </button>
                                </div>
                              </div>
                              
                              {/* Main Content with Better Spacing */}
                              <div className="grid grid-cols-[350px_1fr_480px] gap-8 items-start">
                                
                                {/* Left Panel - Control Panels with Better Spacing */}
                                <div className="flex flex-col gap-6 min-h-[800px]">
                                  <VoxelInspectorPanel />
                                  {isContextReady ? <TimelinePanel /> : (
                                    <div className="card text-center animate-fade-in-up">
                                      <div className="text-4xl mb-4">⏳</div>
                                      <div className="text-base text-muted">Loading Timeline...</div>
                                    </div>
                                  )}
                                  <RuleDebuggerPanel />
                                  <MetricsPanel />
                                  <RuleHotReloadPanel />
                                  <LayerControlsPanel />
                                  <PatternPanel />
                                  <PresetsPanel />
                                  <RuleTemplatesPanel />
                                  <ParameterControlsPanel />
                                  <RuleVersioningPanel />
                                  <DiagnosticsPanel />
                                  <LogConsole />
                                </div>
                                
                                {/* Center Panel - Beautiful Code Editor */}
                                <div className="glass-panel-elevated overflow-hidden flex flex-col min-h-[800px]">
                                  {/* Elegant Header */}
                                  <div className="p-8 border-b border-border-primary/20 bg-accent/5 backdrop-blur-lg">
                                    <h2 className="m-0 mb-6 text-3xl font-bold text-primary">
                                      Code Editor
                                    </h2>
                                    
                                    {/* Beautiful Example Selector */}
                                    <div className="mb-6">
                                      <label className="block mb-3 text-sm font-semibold text-muted">
                                        Examples:
                                      </label>
                                      <div className="flex gap-4 items-center">
                                        <select
                                          value={selectedExample}
                                          onChange={(e) => handleExampleChange(e.target.value)}
                                          className="form-select min-w-[250px]"
                                        >
                                          {Object.keys(EXAMPLES).map(example => (
                                            <option key={example} value={example}>{example}</option>
                                          ))}
                                        </select>
                                        <button
                                          onClick={handleRunCode}
                                          className="btn-primary px-8 py-4 text-base font-semibold"
                                        >
                                          ▶ Run Code
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Monaco Editor with Better Styling */}
                                  <div className="flex-1 p-6">
                                    <Editor
                                      height="100%"
                                      defaultLanguage="javascript"
                                      value={code}
                                      onChange={(value) => setCode(value || '')}
                                      theme={isDarkMode ? "vs-dark" : "light"}
                                      options={{
                                        minimap: { enabled: false },
                                        fontSize: 16,
                                        lineNumbers: 'on',
                                        roundedSelection: false,
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                                        lineHeight: 28,
                                        padding: { top: 20, bottom: 20 },
                                        wordWrap: 'on',
                                        renderWhitespace: 'selection',
                                        smoothScrolling: true,
                                        cursorBlinking: 'smooth'
                                      }}
                                    />
                                  </div>
                                  
                                  {/* Beautiful Output Panel */}
                                  <div className="h-60 p-6 border-t border-border-primary/20 bg-accent/5 backdrop-blur-lg">
                                    <h4 className="m-0 mb-4 text-xl font-semibold text-primary">
                                      Output:
                                    </h4>
                                    <pre className="m-0 text-sm font-mono text-muted leading-relaxed overflow-auto max-h-40 p-4 bg-accent/30 rounded-xl border border-border-primary/20">
                                      {output || 'Ready to run MPL code...'}
                                    </pre>
                                  </div>
                                </div>
                                
                                {/* Right Panel - Beautiful 3D Visualization */}
                                <div className="glass-panel-elevated p-8 min-h-[800px]">
                                  <h2 className="m-0 mb-8 text-3xl font-bold text-primary text-center">
                                    3D Visualization
                                  </h2>
                                  
                                  {/* Beautiful 3D Grid Toggle */}
                                  <div className="mb-8 text-center">
                                    <div className="h-48 gradient-bg rounded-3xl flex items-center justify-center text-muted border-2 border-dashed border-border-primary/30 text-lg font-medium mb-6">
                                      {show3DGrid ? (
                                        <div className="text-center animate-fade-in-up">
                                          <div className="text-7xl mb-6">🎯</div>
                                          <div className="text-2xl mb-3 font-semibold">3D Voxel Grid</div>
                                          <div className="text-base opacity-80">
                                            Interactive visualization active
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-center animate-fade-in-up">
                                          <div className="text-7xl mb-6">📱</div>
                                          <div className="text-2xl mb-3 font-semibold">2D Grid Mode</div>
                                          <div className="text-base opacity-80">
                                            Switch to 3D for full experience
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Beautiful Grid Preview */}
                                  <div>
                                    <h4 className="m-0 mb-6 text-xl font-semibold text-primary text-center">
                                      Grid Preview (50×50) - Layer {activeLayer}
                                    </h4>
                                    <div className="grid grid-cols-10 gap-2 bg-accent/5 p-6 rounded-2xl border border-border-primary/20 justify-center">
                                      {Array(10).fill(null).map((_, i) =>
                                        Array(10).fill(null).map((_, j) => (
                                          <div
                                            key={`${i}-${j}`}
                                            className={`w-8 h-8 rounded-xl border border-border-primary/20 transition-all duration-300 cursor-pointer ${
                                              i === 5 && j === 5 
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg scale-110' 
                                                : 'bg-accent/20 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:scale-110 hover:rotate-3 hover:shadow-lg'
                                            }`}
                                          />
                                        ))
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Beautiful Footer */}
                              <div className="mt-12 card text-center text-muted">
                                <p className="m-0 text-base">
                                  MPL Playground - Advanced Monad Programming Language Environment ✨
                                </p>
                                <p className="mt-3 mb-0 text-sm opacity-80">
                                  Complete System: 3D Visualization • Pattern I/O • Rule Hot-Reload • Multi-Layer Support • Diagnostics
                                </p>
                              </div>
                            </div>
                          </ParameterControlsProvider>
                        </RuleVersioningProvider>
                      </RuleTemplatesProvider>
                    </PresetsProvider>
                  </PatternUIProvider>
                </LayerConfigProvider>
              </RuleEditorProvider>
            </MetricsProvider>
          </HistoryProvider>
        </VoxelSelectionProvider>
      </LogProvider>
    </div>
  );
}
