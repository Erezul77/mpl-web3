// src/ui/components/RuleVersioningPanel.tsx
// Rule Versioning Panel for Stage 1Y

import React, { useState } from 'react';
import { useRuleVersioning } from '../state/ruleVersioning';
import type { RuleVersion, RuleSnapshot } from '../../rules/ruleVersioning';

export function RuleVersioningPanel() {
  const {
    currentVersion,
    versions,
    snapshots,
    selectedVersionId,
    searchQuery,
    selectedTags,
    createVersion,
    selectVersion,
    revertToVersion,
    compareVersions,
    deleteVersion,
    setSearchQuery,
    setSelectedTags,
    getFilteredVersions,
    exportHistory,
    importHistory,
    getStats
  } = useRuleVersioning();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionDescription, setNewVersionDescription] = useState('');
  const [newVersionTags, setNewVersionTags] = useState('');
  const [showSnapshots, setShowSnapshots] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersion1, setCompareVersion1] = useState('');
  const [compareVersion2, setCompareVersion2] = useState('');

  const filteredVersions = getFilteredVersions();
  const stats = getStats();

  const handleCreateVersion = () => {
    if (!newVersionName.trim() || !currentVersion) return;
    
    const tags = newVersionTags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    createVersion(
      currentVersion.mplCode,
      newVersionName.trim(),
      newVersionDescription.trim(),
      currentVersion.parameters || {},
      tags
    );
    
    // Reset form
    setNewVersionName('');
    setNewVersionDescription('');
    setNewVersionTags('');
    setShowCreateForm(false);
  };

  const handleRevert = (versionId: string) => {
    if (confirm('Are you sure you want to revert to this version? This will create a new version.')) {
      revertToVersion(versionId);
    }
  };

  const handleDelete = (versionId: string) => {
    if (confirm('Are you sure you want to delete this version? This action cannot be undone.')) {
      deleteVersion(versionId);
    }
  };

  const handleCompare = () => {
    if (compareVersion1 && compareVersion2) {
      compareVersions(compareVersion1, compareVersion2);
      setCompareMode(false);
      setCompareVersion1('');
      setCompareVersion2('');
    }
  };

  const handleExport = () => {
    try {
      const data = exportHistory();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mpl-version-history-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      console.log('📤 Version history exported');
    } catch (error) {
      console.error('❌ Failed to export version history:', error);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonString = e.target?.result as string;
            const success = importHistory(jsonString);
            if (success) {
              console.log('✅ Version history imported successfully');
            } else {
              console.error('❌ Failed to import version history');
            }
          } catch (error) {
            console.error('❌ Error reading version history file:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  if (versions.length === 0) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px 8px 0 0'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Rule Versioning
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: '8px 0 0 0'
          }}>
            Track and manage rule versions over time
          </p>
        </div>

        {/* No Versions Message */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px'
        }}>
          <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>No Versions Yet</p>
            <p style={{ fontSize: '14px' }}>
              Create your first version to start tracking changes
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px 8px 0 0'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0
        }}>
          Rule Versioning
        </h2>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: '8px 0 0 0'
        }}>
          {versions.length} version{versions.length !== 1 ? 's' : ''} • {stats.totalChanges} changes tracked
        </p>
        
        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '16px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.8)',
          marginTop: '12px'
        }}>
          <span>Latest: {currentVersion?.name || 'None'}</span>
          <span>Active: {versions.filter(v => v.isActive).length}</span>
          <span>Tags: {stats.uniqueTags}</span>
        </div>
      </div>

      {/* Create Version Form */}
      {showCreateForm && (
        <div style={{
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0 0 12px 0'
          }}>
            Create New Version
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '4px'
              }}>
                Version Name:
              </label>
              <input
                type="text"
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                placeholder="e.g., v1.1.0, bugfix-2024"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff'
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '4px'
              }}>
                Description:
              </label>
              <input
                type="text"
                value={newVersionDescription}
                onChange={(e) => setNewVersionDescription(e.target.value)}
                placeholder="Brief description of changes"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff'
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '4px'
              }}>
                Tags (comma-separated):
              </label>
              <input
                type="text"
                value={newVersionTags}
                onChange={(e) => setNewVersionTags(e.target.value)}
                placeholder="e.g., bugfix, performance, feature"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCreateVersion}
                disabled={!newVersionName.trim()}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(107, 114, 128, 0.8)',
                  color: 'white',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(107, 114, 128, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(107, 114, 128, 0.8)'}
              >
                Create Version
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div style={{
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Search versions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff'
            }}
          />
          
          <select
            value={selectedTags.join(',')}
            onChange={(e) => setSelectedTags(e.target.value ? e.target.value.split(',') : [])}
            style={{
              padding: '8px 12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              minWidth: '120px'
            }}
          >
            <option value="">All Tags</option>
            {Array.from(new Set(versions.flatMap(v => v.tags || []))).map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: '8px 16px',
              background: 'rgba(34, 197, 94, 0.8)',
              color: 'white',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.8)'}
          >
            {showCreateForm ? 'Cancel' : 'Create Version'}
          </button>
          
          <button
            onClick={() => setCompareMode(!compareMode)}
            style={{
              padding: '8px 16px',
              background: compareMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.1)',
              color: compareMode ? 'white' : 'rgba(255, 255, 255, 0.8)',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Compare
          </button>
          
          <button
            onClick={handleExport}
            style={{
              padding: '8px 16px',
              background: 'rgba(139, 92, 246, 0.8)',
              color: 'white',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.8)'}
          >
            Export
          </button>
          
          <button
            onClick={handleImport}
            style={{
              padding: '8px 16px',
              background: 'rgba(59, 130, 246, 0.8)',
              color: 'white',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.8)'}
          >
            Import
          </button>
        </div>
      </div>

      {/* Compare Mode */}
      {compareMode && (
        <div style={{
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0 0 12px 0'
          }}>
            Compare Versions
          </h3>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <select
              value={compareVersion1}
              onChange={(e) => setCompareVersion1(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                fontSize: '14px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff'
              }}
            >
              <option value="">Select first version</option>
              {versions.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            
            <select
              value={compareVersion2}
              onChange={(e) => setCompareVersion2(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                fontSize: '14px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff'
              }}
            >
              <option value="">Select second version</option>
              {versions.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleCompare}
            disabled={!compareVersion1 || !compareVersion2}
            style={{
              padding: '8px 16px',
              background: 'rgba(59, 130, 246, 0.8)',
              color: 'white',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.8)'}
          >
            Compare Selected Versions
          </button>
        </div>
      )}

      {/* Versions List */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        {filteredVersions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredVersions.map(version => (
              <div key={version.id} style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {/* Version Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <h3 style={{
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                    margin: 0
                  }}>
                    {version.name}
                  </h3>
                  <span style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px'
                  }}>
                    {version.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {/* Description */}
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: '0 0 8px 0',
                  lineHeight: '1.4'
                }}>
                  {version.description}
                </p>
                
                {/* Metadata */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '12px'
                }}>
                  <span>Created: {new Date(version.createdAt).toLocaleDateString()}</span>
                  <span>Changes: {version.changes?.length || 0}</span>
                  <span>Tags: {version.tags?.length || 0}</span>
                </div>
                
                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => selectVersion(version.id)}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(59, 130, 246, 0.8)',
                      color: 'white',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.9)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.8)'}
                  >
                    Select
                  </button>
                  
                  <button
                    onClick={() => handleRevert(version.id)}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(245, 158, 11, 0.8)',
                      color: 'white',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.9)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.8)'}
                  >
                    Revert
                  </button>
                  
                  <button
                    onClick={() => handleDelete(version.id)}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(239, 68, 68, 0.8)',
                      color: 'white',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)'}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '32px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>No Versions Found</p>
            <p style={{ fontSize: '14px' }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Snapshots Section */}
      {showSnapshots && (
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '0 0 8px 8px'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '16px',
              margin: '0 0 8px 0'
            }}>
              Snapshots
            </h3>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0
            }}>
              Execution state snapshots for versions
            </p>
          </div>
          
          <div style={{ padding: '16px' }}>
            {snapshots.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {snapshots.map(snapshot => (
                  <div key={snapshot.id} style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}>
                      <span style={{
                        fontWeight: '500',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px'
                      }}>
                        {snapshot.versionName}
                      </span>
                      <span style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px'
                      }}>
                        • {snapshot.gridState.activeVoxels} active voxels
                      </span>
                    </div>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px'
                    }}>
                      <span>Grid: {snapshot.gridState.size.x}×{snapshot.gridState.size.y}×{snapshot.gridState.size.z}</span>
                      <span style={{ marginLeft: '12px' }}>Rules: {snapshot.ruleCount}</span>
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginTop: '4px'
                    }}>
                      Captured: {new Date(snapshot.capturedAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '16px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📸</div>
                <p style={{ fontSize: '14px' }}>
                  No snapshots captured yet
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0 0 8px 8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setShowSnapshots(!showSnapshots)}
          style={{
            padding: '6px 12px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {showSnapshots ? 'Hide' : 'Show'} Snapshots
        </button>
        
        <div style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          {filteredVersions.length} of {versions.length} versions
        </div>
      </div>
    </div>
  );
}
