import React, { useState, useRef } from 'react';
import {
    FiVolume2, FiSearch, FiPaperclip, FiUsers, FiSettings,
    FiSmile, FiMessageCircle, FiThumbsUp, FiCornerUpLeft,
    FiPlus, FiMic, FiHeadphones, FiMessageSquare,
    FiTrendingUp, FiFileText, FiBook, FiTarget, FiTool, FiZap,
    FiStar, FiActivity, FiAward, FiCheckCircle, FiVideo, FiDownload,
    FiShield, FiX, FiBookmark
} from 'react-icons/fi';

// ─── CHANNEL DATA ─────────────────────────────────────────────────────────────
const CHANNELS_MAP = {
    antigravity: [
        { id: 'announcements', icon: <FiVolume2 size={14} />, label: 'announcements', unread: 0, locked: true },
        { id: 'general', icon: <FiMessageSquare size={14} />, label: 'general', unread: 3 },
        { id: 'interview-prep', icon: <FiTrendingUp size={14} />, label: 'interview-prep', unread: 12 },
        { id: 'experiences', icon: <FiFileText size={14} />, label: 'experiences', unread: 0 },
        { id: 'dsa-focus', icon: <FiTarget size={14} />, label: 'dsa-focus', unread: 7 },
        { id: 'mock-discussion', icon: <FiVideo size={14} />, label: 'mock-discussion', unread: 0 },
    ],
    google: [
        { id: 'announcements', icon: <FiVolume2 size={14} />, label: 'announcements', unread: 0, locked: true },
        { id: 'general', icon: <FiMessageSquare size={14} />, label: 'general', unread: 5 },
        { id: 'interview-prep', icon: <FiTrendingUp size={14} />, label: 'interview-prep', unread: 24 },
        { id: 'system-design', icon: <FiTool size={14} />, label: 'system-design', unread: 8 },
        { id: 'oa-discussion', icon: <FiZap size={14} />, label: 'oa-discussion', unread: 2 },
    ],
    microsoft: [
        { id: 'announcements', icon: <FiVolume2 size={14} />, label: 'announcements', unread: 0, locked: true },
        { id: 'general', icon: <FiMessageSquare size={14} />, label: 'general', unread: 1 },
        { id: 'interview-prep', icon: <FiTrendingUp size={14} />, label: 'interview-prep', unread: 6 },
        { id: 'lld-focus', icon: <FiTool size={14} />, label: 'lld-focus', unread: 3 },
    ],
    amazon: [
        { id: 'announcements', icon: <FiVolume2 size={14} />, label: 'announcements', unread: 0, locked: true },
        { id: 'general', icon: <FiMessageSquare size={14} />, label: 'general', unread: 9 },
        { id: 'lp-prep', icon: <FiStar size={14} />, label: 'lp-prep', unread: 14 },
        { id: 'bar-raiser', icon: <FiActivity size={14} />, label: 'bar-raiser', unread: 0 },
    ],
    meta: [
        { id: 'announcements', icon: <FiVolume2 size={14} />, label: 'announcements', unread: 0, locked: true },
        { id: 'general', icon: <FiMessageSquare size={14} />, label: 'general', unread: 4 },
        { id: 'interview-prep', icon: <FiTrendingUp size={14} />, label: 'interview-prep', unread: 11 },
        { id: 'infra-systems', icon: <FiSettings size={14} />, label: 'infra-systems', unread: 5 },
    ],
};

// ─── MESSAGE DATA (emoji-free) ─────────────────────────────────────────────────
const MESSAGES = {
    'interview-prep': [
        { id: 1, user: 'Riya Desai', av: 'R', avBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', role: 'SDE II · Google', time: 'Today at 10:12 AM', verified: true, text: "Just cleared the Antigravity phone screen! Key tip: communicate your approach **before** you code. They care more about your thinking than raw speed.", reactions: [{ e: <FiStar size={12} />, n: 24 }, { e: <FiThumbsUp size={12} />, n: 12 }], replies: 7 },
        { id: 2, user: 'Karan Mehta', av: 'K', avBg: 'linear-gradient(135deg,#4DB4F5,#6366f1)', role: 'SDE I · Amazon', time: 'Today at 10:28 AM', text: "Can anyone share recent AG Round 2 experiences? I have my loop next Thursday. Are they expecting full DB schema + API design or just high-level?", reactions: [{ e: <FiMessageSquare size={12} />, n: 6 }], replies: 14 },
        { id: 3, user: 'Priya Nair', av: 'P', avBg: 'linear-gradient(135deg,#10b981,#4DB4F5)', role: 'SDE Intern · Flipkart', time: 'Today at 10:41 AM', mentor: true, text: "Replying to @Karan_M — start with high-level clarity, then drill into one component. Candidates were asked about the **notification service** specifically. Cover pub-sub + retry logic + idempotency.\n\nI pinned the detailed breakdown in resources — check it out!", reactions: [{ e: <FiAward size={12} />, n: 18 }, { e: <FiStar size={12} />, n: 9 }], replies: 3, attachment: { name: 'ag_system_design_notes.pdf', size: '2.4 MB' } },
        { id: 4, user: 'Arjun Sharma', av: 'A', avBg: 'linear-gradient(135deg,#f59e0b,#8b5cf6)', role: 'SDE III · Microsoft', time: 'Today at 11:05 AM', text: 'AG Offer breakdown SDE II Bangalore 2025: Base ₹58L + RSU ₹48L/yr (4yr vest) + Perf Bonus ~18% = **Total Comp ~₹114-120L**. Happy to answer questions on negotiation strategy.', reactions: [{ e: <FiThumbsUp size={12} />, n: 67 }], replies: 31 },
        { id: 5, user: 'Sneha Kumar', av: 'S', avBg: 'linear-gradient(135deg,#4DB4F5,#10b981)', role: 'SDE II · Razorpay', time: 'Today at 12:03 PM', text: '@Karan_M I went through the AG loop last month. Round 2 — they gave me a 45-min system design for a real-time leaderboard. I nailed it with: Redis sorted sets → websocket fanout → eventual consistency tradeoffs. Got the offer!', reactions: [{ e: <FiCheckCircle size={12} />, n: 29 }, { e: <FiThumbsUp size={12} />, n: 14 }], replies: 8 },
    ],
    'general': [
        { id: 1, user: 'Tanvi Patel', av: 'T', avBg: 'linear-gradient(135deg,#8b5cf6,#6366f1)', role: 'SDE I · Zepto', time: 'Today at 9:00 AM', text: "Good morning Antigravity hub! Placement season is heating up. Who else is prepping for the Oct/Nov hiring wave?", reactions: [{ e: <FiThumbsUp size={12} />, n: 42 }, { e: <FiActivity size={12} />, n: 28 }], replies: 19 },
        { id: 2, user: 'Mihir Shah', av: 'M', avBg: 'linear-gradient(135deg,#f59e0b,#ef4444)', role: 'SDE · Flipkart', time: 'Today at 9:45 AM', text: "Anyone know if Antigravity is doing off-campus referrals this season? I have a contact in their Cloud infra team. DM me if interested.", reactions: [{ e: <FiThumbsUp size={12} />, n: 8 }], replies: 23 },
    ],
};

const ONLINE_MEMBERS = [
    { name: 'Riya Desai', av: 'R', avBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', role: 'SDE II · Google', status: 'online', verified: true },
    { name: 'Priya Nair', av: 'P', avBg: 'linear-gradient(135deg,#10b981,#4DB4F5)', role: 'Mentor · Flipkart', status: 'online', mentor: true },
    { name: 'Arjun Sharma', av: 'A', avBg: 'linear-gradient(135deg,#f59e0b,#8b5cf6)', role: 'SDE III · Microsoft', status: 'online' },
    { name: 'Karan Mehta', av: 'K', avBg: 'linear-gradient(135deg,#4DB4F5,#6366f1)', role: 'SDE I · Amazon', status: 'online' },
    { name: 'Dev Patel', av: 'D', avBg: 'linear-gradient(135deg,#f43f5e,#8b5cf6)', role: 'SDE · Atlassian', status: 'idle' },
    { name: 'Sneha Kumar', av: 'S', avBg: 'linear-gradient(135deg,#4DB4F5,#10b981)', role: 'SDE II · Razorpay', status: 'online' },
    { name: 'Tanvi Patel', av: 'T', avBg: 'linear-gradient(135deg,#8b5cf6,#6366f1)', role: 'SDE I · Zepto', status: 'dnd' },
    { name: 'Mihir Shah', av: 'M', avBg: 'linear-gradient(135deg,#f59e0b,#ef4444)', role: 'SDE · Flipkart', status: 'online' },
    { name: 'Leela Rao', av: 'L', avBg: 'linear-gradient(135deg,#10b981,#6366f1)', role: 'SDE II · Stripe', status: 'offline' },
];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
const StatusDot = ({ status, size = 10, t }) => {
    const colors = { online: t.cyan, idle: '#f59e0b', dnd: '#f43f5e', offline: t.textSecondary };
    return <div style={{ width: size, height: size, borderRadius: '50%', background: colors[status] || colors.offline, border: `2px solid ${t.surface}`, flexShrink: 0 }} />;
};

const Avatar = ({ label, bg, size = 36 }) => (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{label}</div>
);

const Reaction = ({ e, n, t }) => {
    const [active, setActive] = useState(false);
    return (
        <button onClick={() => setActive(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, border: `1px solid ${active ? t.borderGlow : t.border}`, background: active ? t.cyanDim : t.elevated, cursor: 'pointer', fontSize: 13, color: active ? t.cyan : t.textMuted, transition: 'all 0.15s', fontFamily: 'inherit' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>{e}</span>
            <span style={{ fontSize: 11, fontWeight: 600 }}>{active ? n + 1 : n}</span>
        </button>
    );
};

const Message = ({ msg, isFirst = true, t, dark, role }) => {
    const [hover, setHover] = useState(false);
    const [verified, setVerified] = useState(false);
    const [resolved, setResolved] = useState(false);
    const [pinned, setPinned] = useState(false);
    const isSenior = role === 'senior';
    const renderText = (text) => text.split(/(\*\*[^*]+\*\*|@\w+|\n)/g).map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} style={{ color: t.textPrimary }}>{p.slice(2, -2)}</strong>;
        if (p.startsWith('@')) return <span key={i} style={{ color: t.cyan, fontWeight: 600, background: t.cyanDim, padding: '0 3px', borderRadius: 4, cursor: 'pointer' }}>{p}</span>;
        if (p === '\n') return <br key={i} />;
        return p;
    });

    return (
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            style={{ display: 'flex', gap: 14, padding: '6px 20px 4px', background: hover ? t.elevated : 'transparent', transition: 'background 0.1s', position: 'relative', borderRadius: 6, borderLeft: pinned ? `2px solid ${t.cyan}` : '2px solid transparent' }}>
            {isFirst ? <Avatar label={msg.av} bg={msg.avBg} size={38} /> : <div style={{ width: 38, flexShrink: 0 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
                {isFirst && (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 14.5, color: t.textPrimary }}>{msg.user}</span>
                        {msg.verified && <span style={{ fontSize: 10, background: t.cyanDim, color: t.cyan, padding: '1px 6px', borderRadius: 20, fontWeight: 600 }}>✓ Verified</span>}
                        {msg.mentor && <span style={{ fontSize: 10, background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '1px 6px', borderRadius: 20, fontWeight: 600 }}>Mentor</span>}
                        {resolved && <span style={{ fontSize: 10, background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '1px 6px', borderRadius: 20, fontWeight: 600 }}>✓ Resolved</span>}
                        {verified && <span style={{ fontSize: 10, background: t.cyanDim, color: t.cyan, padding: '1px 6px', borderRadius: 20, fontWeight: 600 }}>✓ Senior Verified</span>}
                        {pinned && <span style={{ fontSize: 10, background: t.cyanDim, color: t.cyan, padding: '1px 6px', borderRadius: 20, fontWeight: 600 }}>Pinned</span>}
                        <span style={{ fontSize: 11, color: t.textMuted }}>{msg.role}</span>
                        <span style={{ fontSize: 11, color: t.textMuted, marginLeft: 4 }}>{msg.time}</span>
                    </div>
                )}
                <div style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.6 }}>{renderText(msg.text)}</div>
                {msg.attachment && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 8, padding: '10px 14px', background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 10, cursor: 'pointer' }}>
                        <FiPaperclip size={18} style={{ color: t.textMuted }} />
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: t.cyan }}>{msg.attachment.name}</div>
                            <div style={{ fontSize: 11, color: t.textMuted }}>{msg.attachment.size}</div>
                        </div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: t.textSecondary, marginLeft: 8 }}><FiDownload size={12} /> Download</span>
                    </div>
                )}
                {(msg.reactions?.length > 0 || msg.replies > 0) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                        {msg.reactions?.map((r, i) => <Reaction key={i} {...r} t={t} />)}
                        {msg.replies > 0 && (
                            <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: t.cyan, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 6px' }}>
                                <FiMessageCircle size={12} /> {msg.replies} {msg.replies === 1 ? 'reply' : 'replies'}
                            </button>
                        )}
                    </div>
                )}
            </div>
            {/* Hover toolbar — senior gets extra Verify / Resolve / Pin actions */}
            {hover && (
                <div style={{ position: 'absolute', top: -16, right: 20, display: 'flex', gap: 2, background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: '2px 4px' }}>
                    {[<FiThumbsUp size={14} />, <FiCornerUpLeft size={14} />].map((a, i) => (
                        <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 5, color: t.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a}</button>
                    ))}
                    {/* Senior-only mod actions */}
                    {isSenior && [
                        { icon: <FiCheckCircle size={13} />, label: 'Verify', action: () => setVerified(p => !p), active: verified },
                        { icon: <FiShield size={13} />, label: 'Resolve', action: () => setResolved(p => !p), active: resolved },
                        { icon: <FiBookmark size={13} />, label: 'Pin', action: () => setPinned(p => !p), active: pinned },
                    ].map((btn, i) => (
                        <button key={`mod-${i}`} onClick={btn.action} title={btn.label}
                            style={{ background: btn.active ? t.cyanDim : 'none', border: 'none', cursor: 'pointer', padding: '4px 7px', borderRadius: 5, color: btn.active ? t.cyan : t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                            {btn.icon}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── MAIN COMMUNITY MODULE ────────────────────────────────────────────────────
const CommunityModule = ({ companyData, t, dark, role }) => {
    const isSenior = role === 'senior';
    const companyId = companyData.id;
    const channels = CHANNELS_MAP[companyId] || CHANNELS_MAP.antigravity;
    const [activeChannel, setActiveChannel] = useState(channels[1]?.id || channels[0]?.id);
    const [showMembers, setShowMembers] = useState(true);
    const [msgInput, setMsgInput] = useState('');

    const channel = channels.find(c => c.id === activeChannel) || channels[0];
    const messages = MESSAGES[activeChannel] || MESSAGES['general'] || [];
    const onlineMembers = ONLINE_MEMBERS.filter(m => m.status !== 'offline');
    const offlineMembers = ONLINE_MEMBERS.filter(m => m.status === 'offline');

    return (
        <div style={{ display: 'flex', flex: 1, width: '100%', overflow: 'hidden' }}>

            {/* ── CHANNEL LIST ── */}
            <div style={{ width: 220, borderRight: `1px solid ${t.border}`, background: t.surface, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ padding: '12px 14px', borderBottom: `1px solid ${t.border}`, display: 'flex', gap: 16 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: t.cyan }}>{companyData.members.toLocaleString()}</div>
                        <div style={{ fontSize: 10, color: t.textMuted }}>Members</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: t.cyanLight }}>{onlineMembers.length}</div>
                        <div style={{ fontSize: 10, color: t.textMuted }}>Online</div>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.textMuted, padding: '6px 8px 4px' }}>Channels</div>
                    {channels.map(ch => {
                        const isActive = activeChannel === ch.id;
                        return (
                            <button key={ch.id} onClick={() => setActiveChannel(ch.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px', borderRadius: 6, background: isActive ? t.cyanDim : 'transparent', border: `1px solid ${isActive ? t.borderGlow : 'transparent'}`, cursor: 'pointer', color: isActive ? t.textPrimary : ch.unread ? t.textSecondary : t.textMuted, fontSize: 13.5, fontWeight: isActive || ch.unread ? 600 : 400, textAlign: 'left', marginBottom: 1, fontFamily: "'Sora', sans-serif" }}>
                                <span style={{ display: 'flex', alignItems: 'center', color: isActive ? t.cyan : t.textMuted, flexShrink: 0 }}>{ch.icon}</span>
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.label}</span>
                                {ch.unread > 0 && <span style={{ background: t.cyan, color: '#000', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 10, flexShrink: 0 }}>{ch.unread}</span>}
                            </button>
                        );
                    })}
                </div>

                {/* User bar */}
                <div style={{ padding: '10px 12px', borderTop: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 8, background: t.elevated }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <Avatar label="A" bg="linear-gradient(135deg,#6366f1,#8b5cf6)" size={30} />
                        <div style={{ position: 'absolute', bottom: -1, right: -1 }}><StatusDot status="online" size={9} t={t} /></div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: t.textPrimary }}>{isSenior ? 'Arjun Sharma' : 'Arjun Sharma'}</div>
                        <div style={{ fontSize: 10, color: isSenior ? t.cyan : t.textMuted }}>{isSenior ? 'Senior · Moderator' : 'SDE · Campus ʼ25'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 1 }}>
                        {[<FiMic size={14} />, <FiHeadphones size={14} />, <FiSettings size={14} />].map((ic, i) => (
                            <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: t.textMuted, display: 'flex', alignItems: 'center' }}>{ic}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CHAT WINDOW ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: t.bg }}>
                {/* Top Bar */}
                <div style={{ height: 52, borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, flexShrink: 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center', color: t.cyan }}>{channel?.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 15, color: t.textPrimary, fontFamily: "'Sora', sans-serif" }}>{channel?.label}</span>
                    {/* Senior moderator badge in channel header */}
                    {isSenior && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: t.cyanDim, color: t.cyan, border: `1px solid ${t.borderGlow}`, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <FiShield size={9} /> Moderator
                        </span>
                    )}
                    <div style={{ width: 1, height: 20, background: t.border, marginLeft: 4 }} />
                    <span style={{ fontSize: 12, color: t.textMuted }}>{onlineMembers.length} online · {companyData.members.toLocaleString()} members</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: t.textMuted, display: 'flex', borderRadius: 6 }}><FiSearch size={16} /></button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: t.textMuted, display: 'flex', borderRadius: 6 }}><FiPaperclip size={16} /></button>
                        <button onClick={() => setShowMembers(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: showMembers ? t.cyan : t.textMuted, display: 'flex', borderRadius: 6 }}><FiUsers size={16} /></button>
                    </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
                    <div style={{ padding: '0 20px', marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${t.border}` }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: t.elevated, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.cyan, marginBottom: 12 }}>{channel?.icon}</div>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: t.textPrimary, marginBottom: 6 }}>Welcome to #{channel?.label}!</h2>
                        <p style={{ fontSize: 14, color: t.textSecondary }}>This is the start of the <span style={{ color: t.cyan, fontWeight: 700 }}>#{channel?.label}</span> channel for <strong>{companyData.name}</strong>.</p>
                    </div>
                    {messages.map((msg, i) => {
                        const isFirst = i === 0 || messages[i - 1].user !== msg.user;
                        return <Message key={msg.id} msg={msg} isFirst={isFirst} t={t} dark={dark} role={role} />;
                    })}
                </div>

                {/* Typing indicator */}
                <div style={{ padding: '2px 20px 4px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: t.textMuted }}>
                    <div style={{ display: 'flex', gap: 3 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: t.textMuted, animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}</div>
                    <span>Karan Mehta is typing...</span>
                    <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-4px)}}`}</style>
                </div>

                {/* Message Input */}
                <div style={{ padding: '0 16px 16px' }}>
                    <div style={{ background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', padding: '0 14px', minHeight: 46 }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, display: 'flex', marginRight: 10 }}><FiPlus size={20} /></button>
                        <input
                            type="text"
                            value={msgInput}
                            onChange={e => setMsgInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') setMsgInput(''); }}
                            placeholder={`Message #${channel?.label || 'channel'}`}
                            style={{ flex: 1, background: 'transparent', border: 'none', color: t.textPrimary, fontSize: 14, outline: 'none', fontFamily: "'Sora', sans-serif" }}
                        />
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, display: 'flex', padding: 4 }}><FiSmile size={18} /></button>
                    </div>
                </div>
            </div>

            {/* ── MEMBERS LIST ── */}
            {showMembers && (
                <div style={{ width: 220, borderLeft: `1px solid ${t.border}`, background: t.surface, overflowY: 'auto', padding: '14px 8px', flexShrink: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, paddingLeft: 8 }}>Online — {onlineMembers.length}</div>
                    {onlineMembers.map((m, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 8, cursor: 'pointer', marginBottom: 2 }}
                            onMouseEnter={e => e.currentTarget.style.background = t.elevated}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <div style={{ position: 'relative' }}>
                                <Avatar label={m.av} bg={m.avBg} size={32} />
                                <div style={{ position: 'absolute', bottom: -2, right: -2 }}><StatusDot status={m.status} size={9} t={t} /></div>
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                                    {m.verified && <FiCheckCircle size={10} style={{ color: t.cyan, flexShrink: 0 }} />}
                                    {m.mentor && <FiStar size={10} style={{ color: '#818cf8', flexShrink: 0 }} />}
                                </div>
                                <div style={{ fontSize: 11, color: t.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.role}</div>
                            </div>
                        </div>
                    ))}
                    <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, marginTop: 16, paddingLeft: 8 }}>Offline — {offlineMembers.length}</div>
                    {offlineMembers.map((m, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 8, cursor: 'pointer', marginBottom: 2, opacity: 0.45 }}>
                            <div style={{ position: 'relative' }}>
                                <Avatar label={m.av} bg={m.avBg} size={32} />
                                <div style={{ position: 'absolute', bottom: -2, right: -2 }}><StatusDot status="offline" size={9} t={t} /></div>
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: t.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                                <div style={{ fontSize: 11, color: t.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommunityModule;
