import React, { useState } from 'react';
import { Folder, FolderOpen, FileCode, FileJson, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import './ProjectStructure.css';

interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  comment?: string;
  children?: TreeNode[];
  color?: string;
}

const projectTree: TreeNode[] = [
  {
    name: 'desktop/',
    type: 'folder',
    color: '#4da6ff',
    children: [
      {
        name: 'electron/',
        type: 'folder',
        comment: 'Electron main process',
        children: [
          { name: 'main.ts', type: 'file' },
          { name: 'preload.ts', type: 'file' },
        ],
      },
      {
        name: 'src/',
        type: 'folder',
        comment: 'React + TypeScript app',
        children: [
          { name: 'App.tsx', type: 'file' },
          { name: 'main.tsx', type: 'file' },
          { name: 'components/', type: 'folder' },
        ],
      },
      { name: 'public/', type: 'folder', comment: 'Static assets' },
      { name: 'package.json', type: 'file', comment: 'App dependencies' },
      { name: 'vite.config.ts', type: 'file', comment: 'Vite config' },
      { name: 'tsconfig.json', type: 'file', comment: 'TypeScript config' },
      { name: 'electron-builder.yml', type: 'file', comment: 'Build configuration' },
    ],
  },
  {
    name: 'packages/',
    type: 'folder',
    color: '#ffab00',
    children: [
      { name: 'engine/', type: 'folder', comment: 'PSUD Engine core' },
      { name: 'editor/', type: 'folder', comment: 'Scrollforge IDE' },
      { name: 'scene/', type: 'folder', comment: 'Scene editor' },
      { name: 'assets/', type: 'folder', comment: 'Asset management' },
      { name: 'plugins/', type: 'folder', comment: 'Plugin system' },
      { name: 'ai/', type: 'folder', comment: 'AI assistant' },
      { name: 'ui/', type: 'folder', comment: 'Shared UI components' },
      { name: 'utils/', type: 'folder', comment: 'Common utilities' },
    ],
  },
  {
    name: 'installer/',
    type: 'folder',
    color: '#00e676',
    children: [
      { name: 'windows/', type: 'folder', comment: 'Windows installer (NSIS)' },
      { name: 'icons/', type: 'folder', comment: 'App icons' },
      { name: 'scripts/', type: 'folder', comment: 'Build scripts' },
    ],
  },
  {
    name: 'docs/',
    type: 'folder',
    color: '#b388ff',
    children: [
      { name: 'guides/', type: 'folder', comment: 'User guides' },
      { name: 'api/', type: 'folder', comment: 'API reference' },
      { name: 'tutorials/', type: 'folder', comment: 'Tutorials' },
      { name: 'assets/', type: 'folder', comment: 'Documentation assets' },
    ],
  },
  {
    name: 'examples/',
    type: 'folder',
    color: '#ff80ab',
    children: [
      { name: '2d-platformer/', type: 'folder', comment: '2D platformer template' },
      { name: '3d-adventure/', type: 'folder', comment: '3D adventure template' },
      { name: 'top-down/', type: 'folder', comment: 'Top-down template' },
      { name: 'fps/', type: 'folder', comment: 'FPS template' },
    ],
  },
  {
    name: 'templates/',
    type: 'folder',
    color: '#80d8ff',
    children: [
      { name: 'blank-project/', type: 'folder', comment: 'Empty project template' },
      { name: '2d-template/', type: 'folder', comment: '2D template' },
      { name: '3d-template/', type: 'folder', comment: '3D template' },
    ],
  },
  { name: '.gitignore', type: 'file', comment: 'Git ignore' },
  { name: 'README.md', type: 'file', comment: 'Project overview' },
  { name: 'package.json', type: 'file', comment: 'Root package' },
  { name: 'LICENSE', type: 'file', comment: 'License file' },
];

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);

  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && node.children && node.children.length > 0;

  const FileIcon = () => {
    if (node.name.endsWith('.json') || node.name.endsWith('.yml')) return <FileJson size={14} />;
    if (node.name.endsWith('.md') || node.name === 'LICENSE' || node.name === '.gitignore')
      return <FileText size={14} />;
    return <FileCode size={14} />;
  };

  return (
    <div className="tree-node">
      <div
        className={`tree-row ${isFolder ? 'folder' : 'file'}`}
        style={{ paddingLeft: 12 + depth * 16 }}
        onClick={() => hasChildren && setOpen(!open)}
      >
        {isFolder ? (
          <span className="chevron">
            {hasChildren ? (open ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span style={{ width: 14 }} />}
          </span>
        ) : (
          <span className="chevron" style={{ width: 14 }} />
        )}
        <span className="tree-icon" style={node.color ? { color: node.color } : undefined}>
          {isFolder ? (open ? <FolderOpen size={15} /> : <Folder size={15} />) : <FileIcon />}
        </span>
        <span className="tree-name">{node.name}</span>
        {node.comment && <span className="tree-comment"># {node.comment}</span>}
      </div>
      {open && hasChildren && (
        <div className="tree-children">
          {node.children!.map((child) => (
            <TreeItem key={child.name} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectStructure() {
  return (
    <div className="project-structure">
      <div className="panel-header">
        <FolderOpen size={18} />
        <span>PSUD-Studio/</span>
        <span className="panel-sub">Final Project Structure</span>
      </div>
      <div className="tree-container">
        {projectTree.map((node) => (
          <TreeItem key={node.name} node={node} />
        ))}
      </div>
    </div>
  );
}
