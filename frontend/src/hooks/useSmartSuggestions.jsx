import { useEffect, useState, useMemo } from 'react';
import { Engine } from 'json-rules-engine';
import smartSuggestions from '../rules/smartSuggestions';

// This hook will be used by individual nodes to get relevant smart suggestions
const useSmartSuggestions = (nodeId, nodeType, nodeData, parents) => {
  const [activeSuggestions, setActiveSuggestions] = useState([]);

  // Memoize the engine initialization to ensure it only happens once
  const engine = useMemo(() => {
    console.log(`[useSmartSuggestions-${nodeId}] Initializing rule engine.`);
    const newEngine = new Engine();
    smartSuggestions.forEach(rule => newEngine.addRule(rule));
    return newEngine;
  }, []); // Empty dependency array - ensure rules are static and engine is created once

  useEffect(() => {
    console.log(`[useSmartSuggestions-${nodeId}] useEffect triggered.`);
    const evaluate = async () => {
      const googleMeetParent = parents.find(p => p.type === 'google_meet');
      
      const facts = {
        targetNodeType: nodeType,
        targetNodeLabel: nodeData.label || '',
        hasGoogleMeetParent: !!googleMeetParent,
        meetingParent: googleMeetParent
      };
      console.log(`[useSmartSuggestions-${nodeId}] Evaluating with facts:`, facts);

      try {
        const { events } = await engine.run(facts);
        console.log(`[useSmartSuggestions-${nodeId}] Engine run completed. Events:`, events);
        const resolvedSuggestions = events.map(event => {
          let template = event.params.template;
          if (event.type === 'geminiTemplateOffer' && googleMeetParent) {
            template = template.replace('{{meetingParent.varName}}', googleMeetParent.varName);
          }
          return {
            ...event.params,
            template: template
          };
        });
        setActiveSuggestions(resolvedSuggestions);
        console.log(`[useSmartSuggestions-${nodeId}] Active suggestions set:`, resolvedSuggestions);
      } catch (error) {
        console.error(`[useSmartSuggestions-${nodeId}] Error evaluating smart suggestions:`, error);
        setActiveSuggestions([]);
      }
    };

    evaluate();
  }, [nodeId, nodeType, nodeData.label, parents, engine]); // All dependencies are stable due to useMemo and primitive types

  return activeSuggestions;
};

export default useSmartSuggestions;
