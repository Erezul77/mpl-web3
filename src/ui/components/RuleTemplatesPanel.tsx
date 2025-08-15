// src/ui/components/RuleTemplatesPanel.tsx
// Rule Templates Panel for Stage 1W

import React from 'react';
import { useRuleTemplates } from '../state/ruleTemplates';
import type { RuleTemplate } from '../../rules/ruleTemplates';

// Individual template card component
function TemplateCard({ template }: { template: RuleTemplate }) {
  const { loadTemplate, loadTemplateWithPattern } = useRuleTemplates();

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '16px',
      transition: 'box-shadow 0.3s ease'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0
        }}>
          {template.title}
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            background: template.category === 'automata' ? 'rgba(59, 130, 246, 0.2)' :
                       template.category === 'physics' ? 'rgba(34, 197, 94, 0.2)' :
                       template.category === 'artistic' ? 'rgba(139, 92, 246, 0.2)' :
                       template.category === 'utility' ? 'rgba(107, 114, 128, 0.2)' :
                       template.category === 'experimental' ? 'rgba(245, 158, 11, 0.2)' :
                       'rgba(107, 114, 128, 0.2)',
            color: template.category === 'automata' ? 'rgba(147, 197, 253, 0.9)' :
                   template.category === 'physics' ? 'rgba(134, 239, 172, 0.9)' :
                   template.category === 'artistic' ? 'rgba(196, 181, 253, 0.9)' :
                   template.category === 'utility' ? 'rgba(156, 163, 175, 0.9)' :
                   template.category === 'experimental' ? 'rgba(252, 211, 77, 0.9)' :
                   'rgba(156, 163, 175, 0.9)'
          }}>
            {template.category}
          </span>
          <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            background: template.difficulty === 'beginner' ? 'rgba(34, 197, 94, 0.2)' :
                       template.difficulty === 'intermediate' ? 'rgba(245, 158, 11, 0.2)' :
                       template.difficulty === 'advanced' ? 'rgba(239, 68, 68, 0.2)' :
                       'rgba(107, 114, 128, 0.2)',
            color: template.difficulty === 'beginner' ? 'rgba(134, 239, 172, 0.9)' :
                   template.difficulty === 'intermediate' ? 'rgba(252, 211, 77, 0.9)' :
                   template.difficulty === 'advanced' ? 'rgba(252, 165, 165, 0.9)' :
                   'rgba(156, 163, 175, 0.9)'
          }}>
            {template.difficulty}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{ 
        color: 'rgba(255, 255, 255, 0.8)', 
        fontSize: '14px', 
        marginBottom: '12px',
        lineHeight: '1.5'
      }}>
        {template.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
        {template.tags.map(tag => (
          <span key={tag} style={{
            padding: '4px 8px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '12px',
            borderRadius: '4px'
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Suggested Pattern */}
      {template.suggestedPattern && (
        <div style={{
          marginBottom: '16px',
          padding: '8px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '4px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <p style={{ fontSize: '14px', color: 'rgba(147, 197, 253, 0.9)' }}>
            <span style={{ fontWeight: '500' }}>Suggested Pattern:</span> {template.suggestedPattern}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => loadTemplate(template)}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: 'rgba(59, 130, 246, 0.8)',
            color: 'white',
            fontSize: '14px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.9)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.8)'}
        >
          Load Template
        </button>
        
        {template.suggestedPattern && (
          <button
            onClick={() => loadTemplateWithPattern(template)}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: 'rgba(34, 197, 94, 0.8)',
              color: 'white',
              fontSize: '14px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.8)'}
          >
            Template + Pattern
          </button>
        )}
      </div>

      {/* Parameters Preview */}
      {template.parameters && template.parameters.length > 0 && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>Configurable Parameters:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {template.parameters.slice(0, 3).map(param => (
              <div key={param.name} style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                <span style={{ fontWeight: '500' }}>{param.name}:</span> {param.description}
              </div>
            ))}
            {template.parameters.length > 3 && (
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>+{template.parameters.length - 3} more...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function RuleTemplatesPanel() {
  const {
    filteredTemplates,
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    setSearchQuery,
    setCategory,
    setDifficulty
  } = useRuleTemplates();

  const categories: Array<RuleTemplate['category'] | 'all'> = ['all', 'automata', 'physics', 'artistic', 'utility', 'experimental'];
  const difficulties: Array<RuleTemplate['difficulty'] | 'all'> = ['all', 'beginner', 'intermediate', 'advanced'];

  if (filteredTemplates.length === 0) {
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
            marginBottom: '8px',
            margin: 0
          }}>
            Rule Templates
          </h2>
          <p style={{ 
            fontSize: '14px', 
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0
          }}>
            Pre-built rule templates for common patterns
          </p>
        </div>

        {/* No Templates Message */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '32px'
        }}>
          <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>No Templates Available</p>
            <p style={{ fontSize: '14px' }}>
              Rule templates will appear here when they become available
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
          marginBottom: '8px',
          margin: 0
        }}>
          Rule Templates
        </h2>
        <p style={{ 
          fontSize: '14px', 
          color: 'rgba(255, 255, 255, 0.8)',
          margin: 0
        }}>
          Pre-built rule templates for common patterns
        </p>
      </div>

      {/* Search and Filters */}
      <div style={{ 
        padding: '16px', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '12px',
        background: 'rgba(255, 255, 255, 0.05)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            fontSize: '14px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff'
          }}
        />
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setCategory(e.target.value as RuleTemplate['category'] | 'all')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff'
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setDifficulty(e.target.value as RuleTemplate['difficulty'] | 'all')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff'
            }}
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff === 'all' ? 'All Difficulties' : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates List */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        {filteredTemplates.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredTemplates.map((template: RuleTemplate) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '32px', 
            color: 'rgba(255, 255, 255, 0.7)' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>No Templates Found</p>
            <p style={{ fontSize: '14px' }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        padding: '12px', 
        background: 'rgba(255, 255, 255, 0.05)', 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0 0 8px 8px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          fontSize: '12px', 
          color: 'rgba(255, 255, 255, 0.8)',
          textAlign: 'center'
        }}>
          <span>{filteredTemplates.length} of {filteredTemplates.length} templates</span>
          <span>Click any template to load</span>
        </div>
      </div>
    </div>
  );
}
