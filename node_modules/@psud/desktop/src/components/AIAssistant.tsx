import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Code2, Lightbulb, Bug, Wand2 } from 'lucide-react';
import './AIAssistant.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestions = [
  { icon: <Code2 size={16} />, text: 'Generate a player movement script' },
  { icon: <Lightbulb size={16} />, text: 'Suggest level design ideas' },
  { icon: <Bug size={16} />, text: 'Help debug collision issues' },
  { icon: <Wand2 size={16} />, text: 'Create a simple enemy AI' },
];

const sampleResponses: Record<string, string> = {
  default: `I can help you with:

• Writing game scripts (TypeScript / C#)
• Designing levels and mechanics
• Debugging physics and collisions
• Optimizing performance
• Creating shaders and materials
• Setting up UI systems

Just describe what you're working on!`,
  movement: `Here's a basic player movement script for a 2D platformer:

\`\`\`typescript
export class PlayerController {
  speed = 5;
  jumpForce = 12;
  private rb: Rigidbody2D;

  start() {
    this.rb = this.getComponent(Rigidbody2D);
  }

  update(dt: number) {
    const input = Input.getAxis("Horizontal");
    this.rb.velocity.x = input * this.speed;

    if (Input.getKeyDown("Space") && this.isGrounded()) {
      this.rb.velocity.y = this.jumpForce;
    }
  }

  isGrounded(): boolean {
    return Physics2D.raycast(this.transform.position, Vector2.down, 0.1);
  }
}
\`\`\`

Attach this to your Player object and ensure it has a Rigidbody2D + Collider2D.`,
  enemy: `Simple patrol enemy AI:

\`\`\`typescript
export class EnemyPatrol {
  points: Vector2[] = [];
  speed = 2;
  private index = 0;

  update(dt: number) {
    if (this.points.length === 0) return;
    const target = this.points[this.index];
    const dir = target.sub(this.transform.position).normalize();
    this.transform.position = this.transform.position.add(dir.mul(this.speed * dt));

    if (this.transform.position.distance(target) < 0.1) {
      this.index = (this.index + 1) % this.points.length;
    }
  }
}
\`\`\`

Add waypoints in the inspector to define the patrol path.`,
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hello! I'm the PSUD AI Assistant. I can help you write code, design gameplay, debug issues, and more. What are you building today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text?: string) => {
    const content = (text || input).trim();
    if (!content) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      let reply = sampleResponses.default;
      const lower = content.toLowerCase();
      if (lower.includes('movement') || lower.includes('player') || lower.includes('controller')) {
        reply = sampleResponses.movement;
      } else if (lower.includes('enemy') || lower.includes('ai') || lower.includes('patrol')) {
        reply = sampleResponses.enemy;
      }

      setMessages((m) => [
        ...m,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        },
      ]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <div className="ai-avatar">
          <Bot size={22} />
        </div>
        <div>
          <h3>PSUD AI Assistant</h3>
          <span className="ai-status">Online • Ready to help</span>
        </div>
        <Sparkles size={18} className="sparkle" />
      </div>

      <div className="ai-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="msg-avatar">
                <Bot size={16} />
              </div>
            )}
            <div className="msg-bubble">
              <pre className="msg-content">{msg.content}</pre>
            </div>
          </div>
        ))}
        {typing && (
          <div className="message assistant">
            <div className="msg-avatar">
              <Bot size={16} />
            </div>
            <div className="msg-bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="suggestions">
          {suggestions.map((s) => (
            <button key={s.text} className="suggestion-chip" onClick={() => send(s.text)}>
              {s.icon}
              {s.text}
            </button>
          ))}
        </div>
      )}

      <div className="ai-input-area">
        <input
          type="text"
          placeholder="Ask anything about your game..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button className="send-btn" onClick={() => send()} disabled={!input.trim()}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
