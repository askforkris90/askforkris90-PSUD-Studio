import React, { useState } from 'react';
import { Box, Layers, Move, RotateCcw, Maximize2, Eye, EyeOff, Plus, Trash2, Copy } from 'lucide-react';
import './SceneEditor.css';

interface SceneObject {
  id: string;
  name: string;
  type: 'sprite' | 'camera' | 'light' | 'empty' | 'mesh';
  visible: boolean;
  children?: SceneObject[];
}

const initialHierarchy: SceneObject[] = [
  {
    id: '1',
    name: 'Main Camera',
    type: 'camera',
    visible: true,
  },
  {
    id: '2',
    name: 'Directional Light',
    type: 'light',
    visible: true,
  },
  {
    id: '3',
    name: 'Player',
    type: 'sprite',
    visible: true,
    children: [
      { id: '3a', name: 'Sprite Renderer', type: 'empty', visible: true },
      { id: '3b', name: 'Collider2D', type: 'empty', visible: true },
    ],
  },
  {
    id: '4',
    name: 'Environment',
    type: 'empty',
    visible: true,
    children: [
      { id: '4a', name: 'Ground', type: 'mesh', visible: true },
      { id: '4b', name: 'Background', type: 'sprite', visible: true },
      { id: '4c', name: 'Platform_01', type: 'mesh', visible: true },
      { id: '4d', name: 'Platform_02', type: 'mesh', visible: false },
    ],
  },
];

const typeIcons: Record<string, React.ReactNode> = {
  camera: '📷',
  light: '💡',
  sprite: '🖼️',
  mesh: '🧊',
  empty: '📦',
};

export default function SceneEditor() {
  const [hierarchy, setHierarchy] = useState(initialHierarchy);
  const [selected, setSelected] = useState<string | null>('3');
  const [showGrid, setShowGrid] = useState(true);

  const toggleVisibility = (id: string, nodes: SceneObject[] = hierarchy): SceneObject[] => {
    return nodes.map((node) => {
      if (node.id === id) {
        return { ...node, visible: !node.visible };
      }
      if (node.children) {
        return { ...node, children: toggleVisibility(id, node.children) };
      }
      return node;
    });
  };

  const renderNode = (node: SceneObject, depth = 0) => (
    <div key={node.id}>
      <div
        className={`hierarchy-item ${selected === node.id ? 'selected' : ''}`}
        style={{ paddingLeft: 12 + depth * 16 }}
        onClick={() => setSelected(node.id)}
      >
        <span className="obj-icon">{typeIcons[node.type] || '📦'}</span>
        <span className="obj-name">{node.name}</span>
        <button
          className="vis-btn"
          onClick={(e) => {
            e.stopPropagation();
            setHierarchy(toggleVisibility(node.id));
          }}
          title={node.visible ? 'Hide' : 'Show'}
        >
          {node.visible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>
      {node.children?.map((child) => renderNode(child, depth + 1))}
    </div>
  );

  return (
    <div className="scene-editor">
      <div className="scene-toolbar">
        <div className="tool-group">
          <button className="tool-btn active" title="Select">
            <Move size={16} />
          </button>
          <button className="tool-btn" title="Rotate">
            <RotateCcw size={16} />
          </button>
          <button className="tool-btn" title="Scale">
            <Maximize2 size={16} />
          </button>
        </div>
        <div className="tool-group">
          <button className={`tool-btn ${showGrid ? 'active' : ''}`} onClick={() => setShowGrid(!showGrid)}>
            Grid
          </button>
        </div>
        <div className="tool-group right">
          <button className="tool-btn" title="Add Object">
            <Plus size={16} />
          </button>
          <button className="tool-btn" title="Duplicate">
            <Copy size={16} />
          </button>
          <button className="tool-btn danger" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="scene-body">
        <div className="hierarchy-panel">
          <div className="panel-label">
            <Layers size={14} /> Hierarchy
          </div>
          <div className="hierarchy-list">{hierarchy.map((n) => renderNode(n))}</div>
        </div>

        <div className="viewport">
          <div className={`viewport-canvas ${showGrid ? 'with-grid' : ''}`}>
            <div className="viewport-placeholder">
              <Box size={48} strokeWidth={1.5} />
              <p>Scene Viewport</p>
              <span className="muted">3D / 2D rendering surface</span>
              <span className="muted">Select objects in the hierarchy to inspect</span>
            </div>
          </div>
          <div className="viewport-status">
            <span>Perspective</span>
            <span>•</span>
            <span>Objects: 9</span>
            <span>•</span>
            <span>Selected: {selected ? hierarchy.flatMap(function find(n): string[] {
              if (n.id === selected) return [n.name];
              return n.children ? n.children.flatMap(find) : [];
            }).join('') || 'None' : 'None'}</span>
          </div>
        </div>

        <div className="inspector-panel">
          <div className="panel-label">Inspector</div>
          {selected ? (
            <div className="inspector-content">
              <div className="prop-group">
                <label>Name</label>
                <input type="text" defaultValue="Player" className="prop-input" />
              </div>
              <div className="prop-group">
                <label>Tag</label>
                <select className="prop-input">
                  <option>Untagged</option>
                  <option>Player</option>
                  <option>Enemy</option>
                  <option>Environment</option>
                </select>
              </div>
              <div className="prop-section">Transform</div>
              <div className="prop-row">
                <span>Position</span>
                <input type="number" defaultValue={0} className="prop-num" />
                <input type="number" defaultValue={1.5} className="prop-num" />
                <input type="number" defaultValue={0} className="prop-num" />
              </div>
              <div className="prop-row">
                <span>Rotation</span>
                <input type="number" defaultValue={0} className="prop-num" />
                <input type="number" defaultValue={0} className="prop-num" />
                <input type="number" defaultValue={0} className="prop-num" />
              </div>
              <div className="prop-row">
                <span>Scale</span>
                <input type="number" defaultValue={1} className="prop-num" />
                <input type="number" defaultValue={1} className="prop-num" />
                <input type="number" defaultValue={1} className="prop-num" />
              </div>
              <div className="prop-section">Components</div>
              <div className="component-card">
                <div className="comp-header">Sprite Renderer</div>
                <div className="prop-group">
                  <label>Sprite</label>
                  <div className="asset-ref">player_idle.png</div>
                </div>
                <div className="prop-group">
                  <label>Color</label>
                  <input type="color" defaultValue="#ffffff" className="prop-color" />
                </div>
              </div>
              <div className="component-card">
                <div className="comp-header">Box Collider 2D</div>
                <div className="prop-group">
                  <label>Size</label>
                  <div className="prop-row compact">
                    <input type="number" defaultValue={1} className="prop-num" />
                    <input type="number" defaultValue={1.8} className="prop-num" />
                  </div>
                </div>
              </div>
              <button className="add-comp-btn">+ Add Component</button>
            </div>
          ) : (
            <div className="inspector-empty">Select an object to inspect</div>
          )}
        </div>
      </div>
    </div>
  );
}
