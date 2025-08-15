// src/ui/state/ruleTemplates.tsx
// State management for Rule Templates (Stage 1W)

import React, { createContext, useContext, useState, useCallback } from 'react';
import { RULE_TEMPLATES, type RuleTemplate } from '../../rules/ruleTemplates';

export type RuleTemplatesCtx = {
  // Current search and filters
  searchQuery: string;
  selectedCategory: RuleTemplate['category'] | 'all';
  selectedDifficulty: RuleTemplate['difficulty'] | 'all';
  
  // Filtered templates
  filteredTemplates: RuleTemplate[];
  
  // Actions
  setSearchQuery: (query: string) => void;
  setCategory: (category: RuleTemplate['category'] | 'all') => void;
  setDifficulty: (difficulty: RuleTemplate['difficulty'] | 'all') => void;
  loadTemplate: (template: RuleTemplate) => void;
  loadTemplateWithPattern: (template: RuleTemplate) => void;
  
  // Status
  lastLoadedTemplate?: RuleTemplate;
  lastAction: 'template' | 'template+pattern' | null;
};

const RuleTemplatesContext = createContext<RuleTemplatesCtx | null>(null);

export function RuleTemplatesProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RuleTemplate['category'] | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<RuleTemplate['difficulty'] | 'all'>('all');
  const [lastLoadedTemplate, setLastLoadedTemplate] = useState<RuleTemplate>();
  const [lastAction, setLastAction] = useState<'template' | 'template+pattern' | null>(null);

  // Filter templates based on current search and filters
  const filteredTemplates = RULE_TEMPLATES.filter(template => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesQuery = 
        template.title.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesQuery) return false;
    }
    
    // Category filter
    if (selectedCategory !== 'all' && template.category !== selectedCategory) {
      return false;
    }
    
    // Difficulty filter
    if (selectedDifficulty !== 'all' && template.difficulty !== selectedDifficulty) {
      return false;
    }
    
    return true;
  });

  // Load template into editor (placeholder for now)
  const loadTemplate = useCallback((template: RuleTemplate) => {
    console.log('🎯 Loading rule template:', template.title);
    console.log('📝 MPL Code:');
    console.log(template.mplCode);
    
    // TODO: Integrate with actual rule editor
    // This would typically:
    // 1. Set the editor content to template.mplCode
    // 2. Update any parameter sliders
    // 3. Optionally load the suggested pattern
    
    setLastLoadedTemplate(template);
    setLastAction('template');
    
    // Show success message
    console.log(`✅ Template "${template.title}" loaded successfully!`);
  }, []);

  // Load template and suggested pattern together
  const loadTemplateWithPattern = useCallback((template: RuleTemplate) => {
    console.log('🎯 Loading rule template with pattern:', template.title);
    
    if (template.suggestedPattern) {
      console.log('🎨 Suggested pattern:', template.suggestedPattern);
      console.log('📝 MPL Code:');
      console.log(template.mplCode);
      
      // TODO: Integrate with pattern system
      // This would typically:
      // 1. Load the suggested pattern from presets
      // 2. Set the editor content to template.mplCode
      // 3. Update parameter sliders
      
      setLastLoadedTemplate(template);
      setLastAction('template+pattern');
      
      console.log(`✅ Template "${template.title}" with pattern loaded successfully!`);
    } else {
      console.log('⚠️ No suggested pattern for this template');
      loadTemplate(template);
    }
  }, [loadTemplate]);

  const value: RuleTemplatesCtx = {
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    filteredTemplates,
    setSearchQuery,
    setCategory: setSelectedCategory,
    setDifficulty: setSelectedDifficulty,
    loadTemplate,
    loadTemplateWithPattern,
    lastLoadedTemplate,
    lastAction
  };

  return (
    <RuleTemplatesContext.Provider value={value}>
      {children}
    </RuleTemplatesContext.Provider>
  );
}

export function useRuleTemplates(): RuleTemplatesCtx {
  const context = useContext(RuleTemplatesContext);
  if (!context) {
    throw new Error('useRuleTemplates must be used within a RuleTemplatesProvider');
  }
  return context;
}
