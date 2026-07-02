import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { createStompClient, sendMessage } from '../api/classroom';
import type { ChatMessage } from '../api/classroom';
import { useAuth } from '../context/AuthContext';

const Classroom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const clientRef = useRef<Client | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const client = createStompClient(
      roomId,
      (msg) => setMessages(prev => [...prev, msg]),
      () => {
        setConnected(true);
        setConnecting(false);
        // Send join notification
        sendMessage(client, roomId, {
          sender: user?.email || 'Anonymous',
          content: `${user?.email} joined the room`,
          timestamp: '',
          type: 'JOIN',
        });
      }
    );

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current?.active) {
        sendMessage(clientRef.current, roomId, {
          sender: user?.email || 'Anonymous',
          content: `${user?.email} left the room`,
          timestamp: '',
          type: 'LEAVE',
        });
        clientRef.current.deactivate();
      }
    };
  }, [roomId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !clientRef.current?.active || !roomId) return;
    sendMessage(clientRef.current, roomId, {
      sender: user?.email || 'Anonymous',
      content: input.trim(),
      timestamp: '',
      type: 'CHAT',
    });
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="classroom-container">
      {/* Header */}
      <div className="glass-panel classroom-header">
        <div>
          <h2>🎙️ Live Classroom</h2>
          <p className="text-muted">Room: <code>{roomId}</code></p>
        </div>
        <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          {connecting ? 'Connecting...' : connected ? 'Live' : 'Disconnected'}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages glass-panel">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>🎉 You're the first one here! Messages will appear here.</p>
          </div>
        )}
        {messages.map((msg, idx) => {
          const isOwn = msg.sender === user?.email;
          const isSystem = msg.type === 'JOIN' || msg.type === 'LEAVE';

          if (isSystem) {
            return (
              <div key={idx} className="chat-system-msg">
                {msg.content}
              </div>
            );
          }

          return (
            <div key={idx} className={`chat-bubble-row ${isOwn ? 'own' : ''}`}>
              {!isOwn && <div className="chat-avatar">{msg.sender[0]?.toUpperCase()}</div>}
              <div className={`chat-bubble ${isOwn ? 'bubble-own' : 'bubble-other'}`}>
                {!isOwn && <div className="bubble-sender">{msg.sender}</div>}
                <div className="bubble-content">{msg.content}</div>
                <div className="bubble-time">{msg.timestamp}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="glass-panel chat-input-bar">
        <input
          type="text"
          className="input-field chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          disabled={!connected}
        />
        <button
          className="btn-primary send-btn"
          onClick={handleSend}
          disabled={!connected || !input.trim()}
        >
          Send ✈️
        </button>
      </div>
    </div>
  );
};

export default Classroom;
