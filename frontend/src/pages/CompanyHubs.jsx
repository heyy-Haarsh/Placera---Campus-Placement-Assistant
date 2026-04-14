import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import { FiHash, FiPlus, FiSend, FiSmile, FiPaperclip, FiUsers, FiSearch, FiChevronDown } from 'react-icons/fi';

// ── Config ────────────────────────────────────────────────────────
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// ── Company "servers" ─────────────────────────────────────────────
const COMPANIES = [
  { id: 'google',      label: 'G',  name: 'Google',          bg: 'linear-gradient(135deg,#4285f4,#34a8eb)', color: '#4285f4',  members: 2410 },
  { id: 'microsoft',   label: 'M',  name: 'Microsoft',       bg: 'linear-gradient(135deg,#0078d4,#00bcf2)', color: '#0078d4',  members: 1720 },
  { id: 'amazon',      label: 'A',  name: 'Amazon',          bg: 'linear-gradient(135deg,#ff9900,#f59e0b)', color: '#ff9900',  members: 3100 },
  { id: 'meta',        label: 'Mc', name: 'Meta',            bg: 'linear-gradient(135deg,#1877f2,#6366f1)', color: '#1877f2',  members: 1900 },
  { id: 'barclays',    label: 'B',  name: 'Barclays',        bg: 'linear-gradient(135deg,#00aeef,#004e98)', color: '#00aeef',  members: 980  },
  { id: 'tcs',         label: 'T',  name: 'TCS',             bg: 'linear-gradient(135deg,#4b088a,#6a0dad)', color: '#6a0dad',  members: 4200 },
  { id: 'infosys',     label: 'I',  name: 'Infosys',         bg: 'linear-gradient(135deg,#007cc3,#00b0f0)', color: '#007cc3',  members: 3800 },
  { id: 'persistent',  label: 'Ps', name: 'Persistent',      bg: 'linear-gradient(135deg,#e31837,#c0392b)', color: '#e31837',  members: 1200 },
  { id: 'cognizant',   label: 'Cg', name: 'Cognizant',       bg: 'linear-gradient(135deg,#0033a0,#003d99)', color: '#0033a0',  members: 2100 },
  { id: 'flipkart',    label: 'F',  name: 'Flipkart',        bg: 'linear-gradient(135deg,#f74040,#f97316)', color: '#f74040',  members: 1500 },
];

// ── Channels per company ──────────────────────────────────────────
const CHANNELS = [
  { id: 'general',       icon: '💬', label: 'general',          desc: 'General discussion' },
  { id: 'interview-prep', icon: '📚', label: 'interview-prep',   desc: 'Interview tips & resources' },
  { id: 'oa-discussion',  icon: '💻', label: 'oa-discussion',     desc: 'Online Assessment patterns' },
  { id: 'offers',         icon: '🎉', label: 'offers',            desc: 'Share your offer & celebrate!' },
  { id: 'resources',      icon: '📎', label: 'resources',         desc: 'Useful links and materials' },
  { id: 'questions',      icon: '❓', label: 'questions',          desc: 'Ask anything' },
];

// ── Time format ───────────────────────────────────────────────────
function fmtTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
function fmtDate(date) {
  const d = new Date(date);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Avatar component ──────────────────────────────────────────────
function Avatar({ init, role, size = 36 }) {
  const bg = role === 'senior' ? 'linear-gradient(135deg,#06b6d4,#6366f1)' : 'linear-gradient(135deg,#8b5cf6,#6366f1)';
  return (
    <div style={{ width: size, height: size, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 800, color: '#fff', flexShrink: 0, fontFamily: "'Sora',sans-serif" }}>
      {init}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
const CompanyHubs = ({ t, dark, role }) => {
  const [activeCompany, setActiveCompany]   = useState(COMPANIES[0]);
  const [activeChannel, setActiveChannel]   = useState(CHANNELS[0]);
  const [messages, setMessages]             = useState([]);
  const [inputText, setInputText]           = useState('');
  const [connected, setConnected]           = useState(false);
  const [onlineCount, setOnlineCount]       = useState(1);
  const [memberSearch, setMemberSearch]     = useState('');

  const socketRef   = useRef(null);
  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);

  // Read user from localStorage
  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  }, []);
  const myUsername  = currentUser?.name || currentUser?.username || 'You';
  const myInit      = (myUsername[0] || 'Y').toUpperCase();
  const myRole      = currentUser?.role || role || 'student';
  const myUserId    = currentUser?._id || currentUser?.id || 'anon';

  const roomId = `${activeCompany.id}-${activeChannel.id}`;

  // ── Socket connection ─────────────────────────────────────────
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => { setConnected(true); });
    socket.on('disconnect', () => { setConnected(false); });

    socket.on('history', (msgs) => {
      setMessages(msgs);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });

    socket.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 30);
    });

    socket.on('user_joined', ({ username }) => {
      setOnlineCount(c => c + 1);
    });

    return () => { socket.disconnect(); };
  }, []);

  // ── Join room when company/channel changes ────────────────────
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !connected) return;
    setMessages([]);
    socket.emit('join_room', {
      room: roomId,
      username: myUsername,
      userInit: myInit,
      role: myRole,
      userId: myUserId,
    });
  }, [roomId, connected]);

  // ── Send message ──────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    const text = inputText.trim();
    if (!text || !socketRef.current) return;
    socketRef.current.emit('send_message', { room: roomId, text });
    setInputText('');
    inputRef.current?.focus();
  }, [inputText, roomId]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Group messages by date + consecutive sender ───────────────
  const grouped = useMemo(() => {
    const out = [];
    let lastDate = null;
    let lastSender = null;
    messages.forEach((msg) => {
      const dateLabel = fmtDate(msg.createdAt);
      if (dateLabel !== lastDate) {
        out.push({ type: 'divider', label: dateLabel });
        lastDate = dateLabel;
        lastSender = null;
      }
      const showHeader = msg.username !== lastSender;
      out.push({ ...msg, showHeader });
      lastSender = msg.username;
    });
    return out;
  }, [messages]);

  // ── Styles ────────────────────────────────────────────────────
  const S = {
    root:          { display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'DM Sans',sans-serif" },
    // Company sidebar (far left, Discord-style icon rail)
    companySidebar:{ width: 72, background: dark ? '#000' : '#e3e5e8', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: 4, overflowY: 'auto', flexShrink: 0 },
    // Channel list sidebar
    channelSidebar:{ width: 240, background: dark ? '#0a0a0a' : '#f2f3f5', display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: `1px solid ${t.border}` },
    // Chat area
    chatMain:      { flex: 1, display: 'flex', flexDirection: 'column', background: dark ? '#111111' : '#ffffff', overflow: 'hidden' },
    // Members sidebar
    membersSidebar:{ width: 240, background: dark ? '#0a0a0a' : '#f2f3f5', display: 'flex', flexDirection: 'column', flexShrink: 0, borderLeft: `1px solid ${t.border}` },
  };

  return (
    <div style={S.root}>

      {/* ── COMPANY ICON RAIL (Discord server list) ── */}
      <div style={S.companySidebar}>
        <div style={{ width: 32, height: 2, background: t.border, borderRadius: 2, marginBottom: 6 }} />
        {COMPANIES.map(co => {
          const isActive = activeCompany.id === co.id;
          return (
            <div key={co.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              {isActive && (
                <div style={{ position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', width: 4, height: isActive ? 40 : 8, background: dark ? '#fff' : '#000', borderRadius: '0 4px 4px 0', transition: 'height 0.2s' }} />
              )}
              <button
                onClick={() => { setActiveCompany(co); setActiveChannel(CHANNELS[0]); }}
                title={co.name}
                style={{ width: 48, height: 48, borderRadius: isActive ? 16 : '50%', background: co.bg, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-radius 0.2s, box-shadow 0.2s', fontFamily: "'Sora',sans-serif", boxShadow: isActive ? `0 0 0 3px ${co.color}55` : 'none' }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderRadius = '16px'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderRadius = '50%'; } }}
              >{co.label}</button>
            </div>
          );
        })}
        <div style={{ width: 32, height: 1, background: t.border, margin: '4px 0' }} />
        <button title="Browse more companies" style={{ width: 48, height: 48, borderRadius: '50%', background: 'transparent', border: `2px dashed ${t.border}`, cursor: 'pointer', color: t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderRadius = '16px'; e.currentTarget.style.borderColor = t.cyan; e.currentTarget.style.color = t.cyan; }}
          onMouseLeave={e => { e.currentTarget.style.borderRadius = '50%'; e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}>
          <FiPlus size={20} />
        </button>
      </div>

      {/* ── CHANNEL SIDEBAR ── */}
      <div style={S.channelSidebar}>
        {/* Server header */}
        <div style={{ padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.border}`, boxShadow: '0 1px 0 rgba(0,0,0,0.2)', cursor: 'pointer', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary, lineHeight: 1.2 }}>{activeCompany.name}</div>
            <div style={{ fontSize: 10, color: t.textMuted }}>{activeCompany.members.toLocaleString()} members</div>
          </div>
          <FiChevronDown size={16} color={t.textMuted} />
        </div>

        {/* Channels list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          <div style={{ padding: '12px 12px 4px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
            <FiChevronDown size={12} /> Text Channels
          </div>
          {CHANNELS.map(ch => {
            const isActive = activeChannel.id === ch.id;
            return (
              <button key={ch.id}
                onClick={() => setActiveChannel(ch)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px 5px 12px', borderRadius: 4, background: isActive ? (dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)') : 'transparent', border: 'none', cursor: 'pointer', color: isActive ? t.textPrimary : t.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: isActive ? 600 : 400, transition: 'background 0.1s, color 0.1s', textAlign: 'left', margin: '1px 8px', boxSizing: 'border-box' }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = t.textSecondary; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.textMuted; } }}>
                <FiHash size={15} style={{ flexShrink: 0 }} />
                {ch.label}
              </button>
            );
          })}
        </div>

        {/* User card at bottom */}
        <div style={{ padding: '8px 12px', background: dark ? '#0a0a0a' : '#e3e5e8', borderTop: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar init={myInit} role={myRole} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{myUsername}</div>
            <div style={{ fontSize: 10, color: connected ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: connected ? '#22c55e' : '#ef4444' }} />
              {connected ? 'Online' : 'Connecting…'}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CHAT AREA ── */}
      <div style={S.chatMain}>
        {/* Chat header */}
        <div style={{ height: 52, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${t.border}`, boxShadow: '0 1px 0 rgba(0,0,0,0.2)', flexShrink: 0 }}>
          <FiHash size={18} color={t.textMuted} />
          <div>
            <span style={{ fontWeight: 700, color: t.textPrimary, fontSize: 15 }}>{activeChannel.label}</span>
            <span style={{ fontSize: 12, color: t.textMuted, marginLeft: 10 }}>{activeChannel.desc}</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: t.textMuted }}>
            <FiUsers size={14} />
            {onlineCount} online
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column' }}>
          {/* Welcome message when empty */}
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 40px', color: t.textMuted }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: activeCompany.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 auto 16px', fontFamily: "'Sora',sans-serif" }}>{activeCompany.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: t.textPrimary, marginBottom: 6 }}>Welcome to #{activeChannel.label}</div>
              <div style={{ fontSize: 14, color: t.textSecondary }}>This is the beginning of {activeCompany.name}'s #{activeChannel.label} channel.</div>
            </div>
          )}

          {grouped.map((item, idx) => {
            if (item.type === 'divider') {
              return (
                <div key={`divider-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', margin: '8px 0' }}>
                  <div style={{ flex: 1, height: 1, background: t.border }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, whiteSpace: 'nowrap' }}>{item.label}</span>
                  <div style={{ flex: 1, height: 1, background: t.border }} />
                </div>
              );
            }
            const isMe = item.userId === myUserId || item.username === myUsername;
            return (
              <div key={item._id || idx}
                style={{ padding: item.showHeader ? '8px 16px 2px' : '1px 16px 1px', display: 'flex', gap: 12, alignItems: 'flex-start' }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {/* Avatar — only on first message of sequence */}
                <div style={{ width: 40, flexShrink: 0 }}>
                  {item.showHeader && <Avatar init={item.userInit} role={item.role} size={40} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {item.showHeader && (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: isMe ? t.cyan : t.textPrimary }}>{item.username}</span>
                      {item.role === 'senior' && (
                        <span style={{ fontSize: 10, background: 'rgba(6,182,212,0.15)', color: t.cyan, padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>Senior</span>
                      )}
                      <span style={{ fontSize: 11, color: t.textMuted }}>{fmtTime(item.createdAt)}</span>
                    </div>
                  )}
                  <div style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.5, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {item.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Message input */}
        <div style={{ padding: '0 16px 16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: dark ? '#1e1e1e' : '#eaecef', borderRadius: 12, padding: '8px 14px', border: `1px solid ${t.border}` }}>
            <FiPaperclip size={18} color={t.textMuted} style={{ cursor: 'pointer', flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              placeholder={`Message #${activeChannel.label}`}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKey}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: t.textPrimary, fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}
            />
            <FiSmile size={18} color={t.textMuted} style={{ cursor: 'pointer', flexShrink: 0 }} />
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || !connected}
              style={{ width: 34, height: 34, borderRadius: 8, background: inputText.trim() && connected ? t.cyan : t.elevated, border: 'none', cursor: inputText.trim() && connected ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', flexShrink: 0 }}>
              <FiSend size={15} color={inputText.trim() && connected ? '#000' : t.textMuted} />
            </button>
          </div>
          <div style={{ textAlign: 'center', fontSize: 10.5, color: t.textMuted, marginTop: 4 }}>
            Press <strong>Enter</strong> to send · {connected ? '🟢 Connected' : '🔴 Reconnecting…'}
          </div>
        </div>
      </div>

      {/* ── MEMBERS SIDEBAR ── */}
      <div style={S.membersSidebar}>
        <div style={{ padding: '12px 12px 8px', borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: dark ? '#1e1e1e' : '#e3e5e8', borderRadius: 6, padding: '5px 10px' }}>
            <FiSearch size={12} color={t.textMuted} />
            <input value={memberSearch} onChange={e => setMemberSearch(e.target.value)} placeholder="Search members" style={{ background: 'none', border: 'none', outline: 'none', color: t.textPrimary, fontSize: 12, fontFamily: "'DM Sans',sans-serif", flex: 1 }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {/* Derived from messages — unique senders */}
          {(() => {
            const seen = new Set();
            const members = [];
            [...messages].reverse().forEach(m => {
              if (!seen.has(m.username)) { seen.add(m.username); members.push(m); }
            });
            if (!seen.has(myUsername)) members.unshift({ username: myUsername, userInit: myInit, role: myRole, userId: myUserId });
            return members
              .filter(m => !memberSearch || m.username.toLowerCase().includes(memberSearch.toLowerCase()))
              .map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px', borderRadius: 4, cursor: 'pointer', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ position: 'relative' }}>
                    <Avatar init={m.userInit || (m.username[0] || '?').toUpperCase()} role={m.role} size={32} />
                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderRadius: '50%', background: '#22c55e', border: `2px solid ${dark ? '#0a0a0a' : '#f2f3f5'}` }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.username}</div>
                    {m.role === 'senior' && <div style={{ fontSize: 10, color: t.cyan, fontWeight: 600 }}>Senior</div>}
                  </div>
                </div>
              ));
          })()}
          {messages.length === 0 && (
            <div style={{ padding: '20px 12px', fontSize: 12, color: t.textMuted, textAlign: 'center' }}>
              Be the first to chat!<br />Members will appear here as they message.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyHubs;
