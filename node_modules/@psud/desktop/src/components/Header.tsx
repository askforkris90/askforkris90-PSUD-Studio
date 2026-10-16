import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">
          <span className="psud">PSUD</span>
          <span className="studio"> STUDIO</span>
        </h1>
        <p className="tagline">BUILD GAMES WITHOUT LIMITS.</p>
      </div>
      <div className="header-right">
        <div className="nav-links">
          <span>ENGINE</span>
          <span className="dot">|</span>
          <span>EDITOR</span>
          <span className="dot">|</span>
          <span>TOOLS</span>
        </div>
        <div className="nav-links secondary">
          <span>AI ASSISTANT</span>
          <span className="dot">|</span>
          <span>PLUGINS</span>
          <span className="dot">|</span>
          <span>BUILD CENTER</span>
          <span className="dot">|</span>
          <span>MORE</span>
        </div>
      </div>
    </header>
  );
}
