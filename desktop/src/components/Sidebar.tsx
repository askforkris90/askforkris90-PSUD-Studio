import React from 'react';
import {
  Gamepad2,
  Code2,
  Box,
  FolderOpen,
  Puzzle,
  Bot,
  Settings,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { View } from '../App';
import './Sidebar.css';

interface Props {
  activeView: View;
  onViewChange: (view: View) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'welcome', label: 'Game Engine', icon: <Gamepad2 size={20} /> },
  { id: 'project', label: 'Scrollforge IDE', icon: <Code2 size={20} /> },
  { id: 'scene', label: 'Scene Editor', icon: <Box size={20} /> },
  { id: 'assets', label: 'Asset Browser', icon: <FolderOpen size={20} /> },
  { id: 'plugins', label: 'Plugin Manager', icon: <Puzzle size={20} /> },
  { id: 'ai', label: 'AI Assistant', icon: <Bot size={20} /> },
  { id: 'build', label: 'Build Center', icon: <Settings size={20} /> },
  { id: 'docs', label: 'Documentation', icon: <BookOpen size={20} /> },
];

export default function Sidebar({ activeView, onViewChange, collapsed, onToggle }: Props) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-mark">
          <svg viewBox="0 0 64 64" className="logo-svg">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#0066ff" />
              </linearGradient>
            </defs>
            <polygon
              points="32,4 56,18 56,46 32,60 8,46 8,18"
              fill="none"
              stroke="url(#logoGrad)"
              strokeWidth="2.5"
            />
            <polygon
              points="32,14 48,24 48,40 32,50 16,40 16,24"
              fill="url(#logoGrad)"
              opacity="0.25"
            />
            <circle cx="32" cy="32" r="8" fill="url(#logoGrad)" />
          </svg>
        </div>
        {!collapsed && (
          <div className="logo-text">
            <span className="logo-title">PSUD</span>
            <span className="logo-sub">STUDIO</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <button className="collapse-btn" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
