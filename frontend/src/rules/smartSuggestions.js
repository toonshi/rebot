const smartSuggestions = [
  {
    // Rule for auto-filling Gemini summary template
    conditions: {
      all: [
        {
          fact: 'targetNodeType',
          operator: 'equal',
          value: 'gemini'
        },
        {
          fact: 'targetNodeLabel',
          operator: 'equal',
          value: ''
        },
        {
          fact: 'hasGoogleMeetParent',
          operator: 'equal',
          value: true
        }
      ]
    },
    event: {
      type: 'geminiTemplateOffer',
      params: {
        text: '✨ Auto-fill summary template?',
        template: 'Summarize this meeting transcript: {{meetingParent.id}}.transcript and list the action items.',
        targetField: 'label' // The field in the target node to update
      }
    }
  }
];

export default smartSuggestions;
