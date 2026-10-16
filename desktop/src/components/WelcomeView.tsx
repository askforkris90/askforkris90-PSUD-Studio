import React from 'react';
import { Gamepad2, Code2, Box, FolderOpen, Puzzle, Bot, Settings, BookOpen, Monitor, Apple, Terminal, Globe } from 'lucide-react';
import type { View } from '../App';
import './WelcomeView.css';

interface Props {
  onNavigate: (view: View) => void;
}

const features = [
  { id: 'project' as View, icon: <Code2 size={28} />, title: 'Scrollforge IDE', desc: 'Powerful code editor with React + TypeScript' },
  { id: 'scene' as View, icon: <Box size={28} />, title: 'Scene Editor', desc: 'Visual scene composition and hierarchy' },
  { id: 'assets' as View, icon: <FolderOpen size={28} />, title: 'Asset Browser', desc: 'Built-in asset pipeline and management' },
  { id: 'plugins' as View, icon: <Puzzle size={28} />, title: 'Plugin Manager', desc: 'Flexible extensible plugin system' },
  { id: 'ai' as View, icon: <Bot size={28} />, title: 'AI Assistant', desc: 'Integrated AI to accelerate development' },
  { id: 'build' as View, icon: <Settings size={28} />, title: 'Build Center', desc: 'One-click cross-platform builds' },
];

export default function WelcomeView({ onNavigate }: Props) {
  return (
    <div className="welcome">
      <div className="hero">
        <div className="hero-emblem">
          <svg viewBox="0 0 120 120" className="big-logo">
            <defs>
              <linearGradient id="bigGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="50%" stopColor="#4da6ff" />
                <stop offset="100%" stopColor="#0066ff" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <polygon
              points="60,8 105,34 105,86 60,112 15,86 15,34"
              fill="none"
              stroke="url(#bigGrad)"
              strokeWidth="3"
              filter="url(#glow)"
            />
            <polygon
              points="60,28 88,44 88,76 60,92 32,76 32,44"
              fill="url(#bigGrad)"
              opacity="0.2"
            />
            <circle cx="60" cy="60" r="16" fill="url(#bigGrad)" filter="url(#glow)" />
          </svg>
        </div>
        <h1 className="hero-title">
          <span className="psud">PSUD</span> STUDIO
        </h1>
        <p className="hero-tagline">BUILD GAMES WITHOUT LIMITS.</p>
        <p className="hero-desc">
          A complete game development environment powered by the PSUD Engine and Scrollforge IDE.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => onNavigate('project')}>
            <Code2 size={18} />
            Open Project
          </button>
          <button className="btn-secondary" onClick={() => onNavigate('docs')}>
            <BookOpen size={18} />
            Documentation
          </button>
        </div>
      </div>

      <div className="features-grid">
        {features.map((f) => (
          <button key={f.id} className="feature-card" onClick={() => onNavigate(f.id)}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </button>
        ))}
      </div>

      <div className="platforms">
        <span className="platforms-label">CREATE / PLAY / SHARE</span>
        <div className="platform-icons">
          <div className="platform" title="Windows">
            <Monitor size={22} />
            <span>Windows</span>
          </div>
          <div className="platform" title="macOS">
            <Apple size={22} />
            <span>macOS</span>
          </div>
          <div className="platform" title="Linux">
            <Terminal size={22} />
            <span>Linux</span>
          </div>
          <div className="platform" title="Web">
            <Globe size={22} />
            <span>Web</span>
          </div>
        </div>
      </div>
    </div>
  );
}
