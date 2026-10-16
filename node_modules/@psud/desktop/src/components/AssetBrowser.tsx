import React, { useState } from 'react';
import { Folder, FolderOpen, FileImage, FileAudio, FileCode, Search, Upload, Grid, List, MoreHorizontal } from 'lucide-react';
import './AssetBrowser.css';

interface Asset {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'audio' | 'script' | 'prefab' | 'material';
  size?: string;
  children?: Asset[];
}

const assets: Asset[] = [
  {
    id: 'textures',
    name: 'Textures',
    type: 'folder',
    children: [
      { id: 't1', name: 'player_idle.png', type: 'image', size: '128 KB' },
      { id: 't2', name: 'player_run.png', type: 'image', size: '256 KB' },
      { id: 't3', name: 'tileset_forest.png', type: 'image', size: '512 KB' },
      { id: 't4', name: 'sky_bg.png', type: 'image', size: '1.2 MB' },
    ],
  },
  {
    id: 'audio',
    name: 'Audio',
    type: 'folder',
    children: [
      { id: 'a1', name: 'jump.wav', type: 'audio', size: '48 KB' },
      { id: 'a2', name: 'coin.wav', type: 'audio', size: '32 KB' },
      { id: 'a3', name: 'bgm_level1.ogg', type: 'audio', size: '3.4 MB' },
    ],
  },
  {
    id: 'scripts',
    name: 'Scripts',
    type: 'folder',
    children: [
      { id: 's1', name: 'PlayerController.ts', type: 'script', size: '4 KB' },
      { id: 's2', name: 'EnemyAI.ts', type: 'script', size: '6 KB' },
      { id: 's3', name: 'GameManager.ts', type: 'script', size: '3 KB' },
    ],
  },
  {
    id: 'prefabs',
    name: 'Prefabs',
    type: 'folder',
    children: [
      { id: 'p1', name: 'Player.prefab', type: 'prefab', size: '2 KB' },
      { id: 'p2', name: 'Enemy.prefab', type: 'prefab', size: '2 KB' },
      { id: 'p3', name: 'Coin.prefab', type: 'prefab', size: '1 KB' },
    ],
  },
  {
    id: 'materials',
    name: 'Materials',
    type: 'folder',
    children: [
      { id: 'm1', name: 'Default.mat', type: 'material', size: '1 KB' },
      { id: 'm2', name: 'Water.mat', type: 'material', size: '1 KB' },
    ],
  },
];

const typeIcon = (type: string) => {
  switch (type) {
    case 'folder': return <Folder size={18} />;
    case 'image': return <FileImage size={18} />;
    case 'audio': return <FileAudio size={18} />;
    case 'script': return <FileCode size={18} />;
    default: return <FileCode size={18} />;
  }
};

const typeColor: Record<string, string> = {
  folder: '#4da6ff',
  image: '#00e676',
  audio: '#ffab00',
  script: '#b388ff',
  prefab: '#ff80ab',
  material: '#80d8ff',
};

export default function AssetBrowser() {
  const [selectedFolder, setSelectedFolder] = useState<Asset | null>(assets[0]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const items = selectedFolder?.children || [];
  const filtered = search
    ? items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <div className="asset-browser">
      <div className="asset-toolbar">
        <div className="search-box">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar-actions">
          <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
            <Grid size={16} />
          </button>
          <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
            <List size={16} />
          </button>
          <button className="upload-btn">
            <Upload size={14} /> Import
          </button>
        </div>
      </div>

      <div className="asset-body">
        <div className="folder-tree">
          <div className="tree-label">Project Assets</div>
          {assets.map((folder) => (
            <button
              key={folder.id}
              className={`folder-item ${selectedFolder?.id === folder.id ? 'active' : ''}`}
              onClick={() => setSelectedFolder(folder)}
            >
              {selectedFolder?.id === folder.id ? <FolderOpen size={16} /> : <Folder size={16} />}
              <span>{folder.name}</span>
              <span className="count">{folder.children?.length || 0}</span>
            </button>
          ))}
        </div>

        <div className="asset-content">
          <div className="breadcrumb">
            Assets / {selectedFolder?.name || 'Root'}
          </div>

          {viewMode === 'grid' ? (
            <div className="asset-grid">
              {filtered.map((item) => (
                <div key={item.id} className="asset-card">
                  <div className="asset-preview" style={{ color: typeColor[item.type] }}>
                    {typeIcon(item.type)}
                  </div>
                  <div className="asset-info">
                    <span className="asset-name">{item.name}</span>
                    <span className="asset-size">{item.size}</span>
                  </div>
                  <button className="asset-more"><MoreHorizontal size={14} /></button>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="empty-state">No assets found</div>
              )}
            </div>
          ) : (
            <div className="asset-list">
              <div className="list-header">
                <span>Name</span>
                <span>Type</span>
                <span>Size</span>
              </div>
              {filtered.map((item) => (
                <div key={item.id} className="list-row">
                  <span className="list-name" style={{ color: typeColor[item.type] }}>
                    {typeIcon(item.type)}
                    {item.name}
                  </span>
                  <span className="list-type">{item.type}</span>
                  <span className="list-size">{item.size}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
