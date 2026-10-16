import React, { useState } from 'react';
import { Settings, Play, Package, Monitor, Apple, Terminal, Globe, CheckCircle2, Loader2 } from 'lucide-react';
import './BuildCenter.css';

const platforms = [
  { id: 'windows', name: 'Windows', icon: <Monitor size={20} />, format: 'NSIS Installer (.exe)' },
  { id: 'macos', name: 'macOS', icon: <Apple size={20} />, format: 'DMG (.dmg)' },
  { id: 'linux', name: 'Linux', icon: <Terminal size={20} />, format: 'AppImage' },
  { id: 'web', name: 'Web', icon: <Globe size={20} />, format: 'Static HTML/JS' },
];

export default function BuildCenter() {
  const [selected, setSelected] = useState<string[]>(['windows']);
  const [building, setBuilding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const toggle = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const startBuild = () => {
    if (selected.length === 0) return;
    setBuilding(true);
    setDone(false);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setBuilding(false);
          setDone(true);
          return 100;
        }
        return p + Math.random() * 12 + 4;
      });
    }, 400);
  };

  return (
    <div className="build-center">
      <div className="build-header">
        <Settings size={20} />
        <h2>Build Center</h2>
        <span className="build-sub">One-click cross-platform builds</span>
      </div>

      <div className="build-body">
        <div className="platform-select">
          <h3>Target Platforms</h3>
          <div className="platform-grid">
            {platforms.map((p) => (
              <button
                key={p.id}
                className={`platform-card ${selected.includes(p.id) ? 'selected' : ''}`}
                onClick={() => toggle(p.id)}
              >
                <div className="plat-icon">{p.icon}</div>
                <div className="plat-info">
                  <span className="plat-name">{p.name}</span>
                  <span className="plat-format">{p.format}</span>
                </div>
                {selected.includes(p.id) && <CheckCircle2 size={18} className="check" />}
              </button>
            ))}
          </div>
        </div>

        <div className="build-options">
          <h3>Build Options</h3>
          <label className="option">
            <input type="checkbox" defaultChecked /> Development build
          </label>
          <label className="option">
            <input type="checkbox" /> Include debug symbols
          </label>
          <label className="option">
            <input type="checkbox" defaultChecked /> Code signing (if available)
          </label>
          <label className="option">
            <input type="checkbox" /> Compress assets
          </label>
        </div>

        <div className="build-actions">
          {(building || done) && (
            <div className="progress-area">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
              <span className="progress-text">
                {done ? 'Build complete!' : `Building... ${Math.min(Math.round(progress), 100)}%`}
              </span>
            </div>
          )}
          <button
            className="build-btn"
            onClick={startBuild}
            disabled={building || selected.length === 0}
          >
            {building ? <Loader2 size={18} className="spin" /> : <Package size={18} />}
            {building ? 'Building...' : 'Build Selected Platforms'}
          </button>
          <button className="run-btn" disabled={building}>
            <Play size={16} /> Run in Editor
          </button>
        </div>
      </div>
    </div>
  );
}
