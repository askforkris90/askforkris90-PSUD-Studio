import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProjectStructure from './components/ProjectStructure';
import KeyFeatures from './components/KeyFeatures';
import EmblemPanel from './components/EmblemPanel';
import WelcomeView from './components/WelcomeView';
import SceneEditor from './components/SceneEditor';
import AssetBrowser from './components/AssetBrowser';
import AIAssistant from './components/AIAssistant';
import BuildCenter from './components/BuildCenter';
import './App.css';

export type View = 'welcome' | 'project' | 'scene' | 'assets' | 'plugins' | 'ai' | 'build' | 'docs';

export default function App() {
  const [activeView, setActiveView] = useState<View>('welcome');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="main-area">
        <Header />
        <div className="content">
          {activeView === 'welcome' && <WelcomeView onNavigate={setActiveView} />}
          {activeView === 'project' && (
            <div className="dashboard-grid">
              <ProjectStructure />
              <div className="side-panels">
                <EmblemPanel />
                <KeyFeatures />
              </div>
            </div>
          )}
          {activeView === 'scene' && <SceneEditor />}
          {activeView === 'assets' && <AssetBrowser />}
          {activeView === 'ai' && <AIAssistant />}
          {activeView === 'build' && <BuildCenter />}
          {(activeView === 'plugins' || activeView === 'docs') && (
            <div className="placeholder-view">
              <div className="placeholder-card">
                <h2>{viewTitle(activeView)}</h2>
                <p>This module is part of the PSUD Studio suite.</p>
                <p className="muted">Coming soon in the full release.</p>
              </div>
            </div>
          )}
        </div>
        <footer className="app-footer">
          <span>PSUD STUDIO</span>
          <span className="sep">|</span>
          <span>THE FUTURE OF GAME DEVELOPMENT</span>
        </footer>
      </div>
    </div>
  );
}

function viewTitle(view: View): string {
  const titles: Record<View, string> = {
    welcome: 'Welcome',
    project: 'Project Structure',
    scene: 'Scene Editor',
    assets: 'Asset Browser',
    plugins: 'Plugin Manager',
    ai: 'AI Assistant',
    build: 'Build Center',
    docs: 'Documentation',
  };
  return titles[view];
}
