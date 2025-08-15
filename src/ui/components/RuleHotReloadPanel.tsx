// src/ui/components/RuleHotReloadPanel.tsx
// Simple in-IDE editor panel with Validate/Apply/Discard (Stage 1S)

import React, { useState, useEffect, useCallback } from 'react';
import { ruleHotReload } from '../../engine/ruleHotReload';

export default function RuleHotReloadPanel() {
  const [draftText, setDraftText] = useState('');
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [rules, setRules] = useState<Array<{ id: string; content: string; isValid: boolean }>>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock rules for demo - in real app this would come from the engine
  useEffect(() => {
    setRules([
      { id: 'rule1', content: 'if (x > 0) { set(x, y, z, 1); }', isValid: true },
      { id: 'rule2', content: 'if (y < 10) { set(x, y+1, z, 2); }', isValid: true }
    ]);
  }, []);

  const addRule = useCallback((content: string) => {
    const newRule = {
      id: `rule${Date.now()}`,
      content,
      isValid: true
    };
    setRules(prev => [...prev, newRule]);
    setHasUnsavedChanges(true);
  }, []);

  const updateRule = useCallback((ruleId: string, content: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, content } : rule
    ));
    setHasUnsavedChanges(true);
  }, []);

  const removeRule = useCallback((ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
    setHasUnsavedChanges(true);
  }, []);

  const validateRule = useCallback((content: string) => {
    return ruleHotReload.validateSource(content);
  }, []);

  const saveChanges = useCallback(() => {
    // In real app, this would save to the engine
    setHasUnsavedChanges(false);
  }, []);

  const handleAddRule = useCallback(() => {
    if (draftText.trim()) {
      addRule(draftText);
      setDraftText('');
    }
  }, [draftText, addRule]);

  const handleUpdateRule = useCallback(() => {
    if (selectedRule && draftText.trim()) {
      updateRule(selectedRule, draftText);
      setDraftText('');
      setSelectedRule(null);
    }
  }, [selectedRule, draftText, updateRule]);

  const handleRemoveRule = useCallback((ruleId: string) => {
    removeRule(ruleId);
    if (selectedRule === ruleId) {
      setSelectedRule(null);
      setDraftText('');
    }
  }, [removeRule, selectedRule]);

  const handleRuleSelect = useCallback((ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      setSelectedRule(ruleId);
      setDraftText(rule.content);
    }
  }, [rules]);

  const hasValidRules = rules.length > 0 && rules.every(rule => rule.isValid);

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#ffffff'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Rule Hot Reload</h3>
        <button
          onClick={saveChanges}
          disabled={!hasUnsavedChanges}
          style={{
            padding: '6px 12px',
            background: !hasUnsavedChanges ? 'rgba(255, 255, 255, 0.2)' : 'rgba(23, 162, 184, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: !hasUnsavedChanges ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          Save
        </button>
      </div>

      {/* Rule Editor */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Rule Editor</h4>
        <textarea
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          placeholder="Enter rule content..."
          style={{
            width: '100%',
            height: '80px',
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#ffffff',
            fontSize: '12px',
            fontFamily: 'monospace',
            resize: 'vertical'
          }}
        />
        
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '12px'
        }}>
          {selectedRule ? (
            <>
              <button
                onClick={handleUpdateRule}
                disabled={!draftText.trim()}
                style={{
                  padding: '6px 12px',
                  background: !draftText.trim() ? 'rgba(255, 255, 255, 0.2)' : 'rgba(23, 162, 184, 0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: !draftText.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '12px'
                }}
              >
                Update
              </button>
              <button
                onClick={() => {
                  setSelectedRule(null);
                  setDraftText('');
                }}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(108, 117, 125, 0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAddRule}
              disabled={!draftText.trim()}
              style={{
                padding: '6px 12px',
                background: !draftText.trim() ? 'rgba(255, 255, 255, 0.2)' : 'rgba(23, 162, 184, 0.8)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: !draftText.trim() ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              Add Rule
            </button>
          )}
        </div>
      </div>

      {/* Rules List */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Active Rules</h4>
        {rules.length === 0 ? (
          <div style={{ opacity: 0.6, textAlign: 'center', fontSize: '12px' }}>No rules defined</div>
        ) : (
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {rules.map((rule) => (
              <div
                key={rule.id}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '4px',
                  border: selectedRule === rule.id ? '1px solid rgba(23, 162, 184, 0.8)' : '1px solid transparent',
                  cursor: 'pointer'
                }}
                onClick={() => handleRuleSelect(rule.id)}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <span style={{ fontSize: '12px', fontWeight: '500' }}>Rule {rule.id}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span style={{ 
                      color: 'rgba(255, 193, 7, 0.9)', 
                      fontSize: '10px' 
                    }}>• UNSAVED</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveRule(rule.id);
                      }}
                      style={{
                        padding: '2px 6px',
                        background: 'rgba(220, 53, 69, 0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '10px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div style={{
                  fontSize: '11px',
                  opacity: 0.8,
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}>
                  {rule.content.substring(0, 50)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px'
      }}>
        <div style={{ marginBottom: '4px' }}>
          Status: {hasValidRules ? 'Valid' : 'Invalid'}
        </div>
        <div style={{ marginBottom: '4px' }}>
          Rules: {rules.length}
        </div>
        <div>
          Changes: {hasUnsavedChanges ? 'Pending' : 'Saved'}
        </div>
      </div>
    </div>
  );
}
