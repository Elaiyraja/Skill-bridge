import React from 'react';

export const SkillMateFAB = ({ setPage }) => (
  <button
    className="skillmate-fab"
    onClick={() => setPage("ai")}
    aria-label="Open SkillMate AI Assistant"
  >
    <span style={{ fontSize: 18 }}>🤖</span>
    <span>Ask SkillMate</span>
  </button>
);
