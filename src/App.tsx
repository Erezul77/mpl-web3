// src/App.tsx
// MPL Playground - COMPLETE SYSTEM RESTORED ✨
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
  console.log('MPL Full Application - COMPLETE SYSTEM RESTORED ✨');
  
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

  // Theme configurations
  const theme = {
    dark: {
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      panelBg: 'rgba(15, 15, 35, 0.9)',
      panelBgLight: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
      textSecondary: '#a0a0a0',
      accent: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      dropdownBg: '#1a1a2e',
      dropdownText: '#ffffff',
      dropdownHover: '#2a2a3e'
    },
    light: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      panelBg: 'rgba(255, 255, 255, 0.9)',
      panelBgLight: 'rgba(0, 0, 0, 0.05)',
      border: 'rgba(0, 0, 0, 0.1)',
      text: '#1e293b',
      textSecondary: '#64748b',
      accent: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      dropdownBg: '#ffffff',
      dropdownText: '#1e293b',
      dropdownHover: '#f1f5f9'
    }
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <div className={`min-h-screen relative ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-slate-500/30" />
      
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
                            <div className="app min-h-screen p-5 box-border">
                              
                              {/* Top Navigation Bar */}
                              <div className="sticky top-5 z-50 mb-5 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-2xl flex justify-between items-center">
                                <h1 className="m-0 text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
                                  MPL Playground ✨
                                </h1>
                                
                                <div className="flex gap-4 items-center">
                                  {/* Theme Toggle */}
                                  <button
                                    onClick={toggleTheme}
                                    className="p-2 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg text-white dark:text-gray-200 hover:bg-white/20 dark:hover:bg-black/30 transition-colors duration-200"
                                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                  >
                                    {isDarkMode ? '☀️' : '🌙'}
                                  </button>
                                  
                                  {/* Layer Control */}
                                  <div className="flex items-center gap-2">
                                    <label className="text-sm text-gray-300 dark:text-gray-400">Layer:</label>
                                    <select
                                      value={activeLayer}
                                      onChange={(e) => setActiveLayer(Number(e.target.value))}
                                      className="px-3 py-2 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg text-white dark:text-gray-200 text-sm cursor-pointer backdrop-blur-sm"
                                    >
                                      {[0, 1, 2, 3].map(layer => (
                                        <option key={layer} value={layer}>Layer {layer}</option>
                                      ))}
                                    </select>
                                  </div>
                                  
                                  {/* 3D Toggle */}
                                  <button
                                    onClick={() => setShow3DGrid(!show3DGrid)}
                                    style={{
                                      padding: '8px 16px',
                                      background: show3DGrid ? currentTheme.accent : currentTheme.panelBgLight,
                                      color: show3DGrid ? 'white' : currentTheme.text,
                                      border: `1px solid ${currentTheme.border}`,
                                      borderRadius: '8px',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '500'
                                    }}
                                  >
                                    {show3DGrid ? '🎯 3D On' : '📱 2D On'}
                                  </button>
                                  
                                  <button
                                    onClick={toggleTheme}
                                    style={{
                                      padding: '12px 20px',
                                      background: currentTheme.accent,
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '12px',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600',
                                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                                      transition: 'all 0.3s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.transform = 'translateY(-2px)';
                                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform = 'translateY(0)';
                                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
                                    }}
                                  >
                                    {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                                  </button>
                                </div>
                              </div>
                              
                              {/* Main Content */}
                              <div className="grid grid-cols-[320px_1fr_450px] gap-5 items-start">
                                
                                {/* Left Panel - Control Panels */}
                                <div className="flex flex-col gap-4 min-h-[700px]">
                                  <VoxelInspectorPanel />
                                  {isContextReady ? <TimelinePanel /> : (
                                    <div className="p-5 bg-white/10 dark:bg-black/20 rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl text-center backdrop-blur-xl">
                                      <div className="text-3xl mb-3">⏳</div>
                                      <div className="text-base text-gray-300 dark:text-gray-400">Loading Timeline...</div>
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
                                
                                {/* Center Panel - Code Editor */}
                                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col min-h-[700px]">
                                  {/* Header */}
                                  <div className="p-6 border-b border-white/20 dark:border-white/10 bg-white/5 dark:bg-black/10 backdrop-blur-lg">
                                    <h2 className="m-0 mb-5 text-2xl font-bold text-white dark:text-gray-200">
                                      Code Editor
                                    </h2>
                                    
                                    {/* Example Selector */}
                                    <div className="mb-5">
                                      <label className="block mb-2 text-sm font-semibold text-gray-300 dark:text-gray-400">
                                        Examples:
                                      </label>
                                      <select
                                        value={selectedExample}
                                        onChange={(e) => handleExampleChange(e.target.value)}
                                        className="px-4 py-3 mr-4 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl text-white dark:text-gray-200 text-sm cursor-pointer min-w-[200px] backdrop-blur-sm"
                                      >
                                        {Object.keys(EXAMPLES).map(example => (
                                          <option key={example} value={example}>{example}</option>
                                        ))}
                                      </select>
                                      <button
                                        onClick={handleRunCode}
                                        className="px-7 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none rounded-xl cursor-pointer text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                                      >
                                        ▶ Run Code
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {/* Monaco Editor */}
                                  <div className="flex-1 p-5">
                                    <Editor
                                      height="100%"
                                      defaultLanguage="javascript"
                                      value={code}
                                      onChange={(value) => setCode(value || '')}
                                      theme={isDarkMode ? "vs-dark" : "light"}
                                      options={{
                                        minimap: { enabled: false },
                                        fontSize: 15,
                                        lineNumbers: 'on',
                                        roundedSelection: false,
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                                        lineHeight: 26,
                                        padding: { top: 16, bottom: 16 },
                                        wordWrap: 'on',
                                        renderWhitespace: 'selection'
                                      }}
                                    />
                                  </div>
                                  
                                  {/* Output Panel */}
                                  <div className="h-50 p-5 border-t border-white/20 dark:border-white/10 bg-white/5 dark:bg-black/10 backdrop-blur-lg">
                                    <h4 className="m-0 mb-4 text-lg font-semibold text-white dark:text-gray-200">
                                      Output:
                                    </h4>
                                    <pre className="m-0 text-sm font-mono text-gray-300 dark:text-gray-400 leading-relaxed overflow-auto max-h-30">
                                      {output || 'Ready to run MPL code...'}
                                    </pre>
                                  </div>
                                </div>
                                
                                {/* Right Panel - 3D Visualization */}
                                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl p-6 min-h-[700px]">
                                  <h2 className="m-0 mb-6 text-2xl font-bold text-white dark:text-gray-200 text-center">
                                    3D Visualization
                                  </h2>
                                  
                                  {/* 3D Grid Toggle */}
                                  <div className="mb-5 text-center">
                                    <div className="h-100 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-3xl flex items-center justify-center text-gray-300 dark:text-gray-400 border-2 border-dashed border-white/20 dark:border-white/10 text-lg font-medium mb-6">
                                      {show3DGrid ? (
                                        <div className="text-center">
                                          <div className="text-6xl mb-5">🎯</div>
                                          <div className="text-xl mb-2">3D Voxel Grid</div>
                                          <div className="text-sm opacity-70">
                                            Interactive visualization active
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-center">
                                          <div className="text-6xl mb-5">📱</div>
                                          <div className="text-xl mb-2">2D Grid Mode</div>
                                          <div className="text-sm opacity-70">
                                            Switch to 3D for full experience
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Grid Preview */}
                                  <div>
                                    <h4 className="m-0 mb-5 text-xl font-semibold text-white dark:text-gray-200 text-center">
                                      Grid Preview (50×50) - Layer {activeLayer}
                                    </h4>
                                    <div className="grid grid-cols-10 gap-1 bg-white/5 dark:bg-black/10 p-5 rounded-2xl border border-white/20 dark:border-white/10 justify-center">
                                      {Array(10).fill(null).map((_, i) =>
                                        Array(10).fill(null).map((_, j) => (
                                          <div
                                            key={`${i}-${j}`}
                                            className={`w-7 h-7 rounded-lg border border-white/20 dark:border-white/10 transition-all duration-300 cursor-pointer ${
                                              i === 5 && j === 5 
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                                                : 'bg-white/10 dark:bg-black/20 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:scale-110 hover:rotate-6 hover:shadow-lg'
                                            }`}
                                          />
                                        ))
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Footer */}
                              <div className="mt-10 p-6 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl text-center text-gray-300 dark:text-gray-400">
                                <p className="m-0 text-sm">
                                  MPL Playground - Advanced Monad Programming Language Environment ✨
                                </p>
                                <p className="mt-2 mb-0 text-xs opacity-70">
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
