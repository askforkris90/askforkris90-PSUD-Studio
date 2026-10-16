import React from 'react';
import './EmblemPanel.css';

export default function EmblemPanel() {
  return (
    <div className="emblem-panel">
      <h3 className="panel-title">THE PSUD EMBLEM</h3>
      <div className="emblem-display">
        <svg viewBox="0 0 140 140" className="emblem-svg">
          <defs>
            <linearGradient id="embGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="50%" stopColor="#4da6ff" />
              <stop offset="100%" stopColor="#0066ff" />
            </linearGradient>
            <filter id="embGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Outer triangle */}
          <polygon
            points="70,10 120,40 120,100 70,130 20,100 20,40"
            fill="none"
            stroke="url(#embGrad)"
            strokeWidth="3.5"
            filter="url(#embGlow)"
          />
          {/* Inner triangle */}
          <polygon
            points="70,32 100,50 100,90 70,108 40,90 40,50"
            fill="url(#embGrad)"
            opacity="0.18"
          />
          {/* Core */}
          <circle cx="70" cy="70" r="18" fill="url(#embGrad)" filter="url(#embGlow)" opacity="0.9" />
          <circle cx="70" cy="70" r="8" fill="#0a1020" />
          <circle cx="70" cy="70" r="4" fill="url(#embGrad)" />
        </svg>
      </div>
      <p className="emblem-desc">
        The PSUD emblem represents creativity, power, and infinite possibilities. It's more than a
        logo — it's a symbol of your journey as a game creator.
      </p>
    </div>
  );
}
