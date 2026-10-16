import React from 'react';
import { Check } from 'lucide-react';
import './KeyFeatures.css';

const features = [
  'Complete game development suite',
  'Integrated AI assistant',
  'Powerful scene editor',
  'Flexible plugin system',
  'Built-in asset pipeline',
  'Cross-platform builds',
  'Professional installer',
  'Active community support',
];

export default function KeyFeatures() {
  return (
    <div className="key-features">
      <h3 className="panel-title">KEY FEATURES</h3>
      <ul className="features-list">
        {features.map((f) => (
          <li key={f}>
            <span className="check">
              <Check size={14} strokeWidth={3} />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="cta">
        <p className="cta-text">Build Something Amazing</p>
        <div className="cta-icons">
          <span>🎮</span>
          <span>&lt;/&gt;</span>
          <span>📦</span>
          <span>⚙️</span>
          <span>☁️</span>
        </div>
        <p className="cta-brand">PSUD STUDIO</p>
      </div>
    </div>
  );
}
