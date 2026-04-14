import React, { useState } from 'react';
import {
    FiBriefcase, FiTarget, FiCalendar, FiAward, FiAtSign,
    FiThumbsUp, FiCheckCircle, FiAlertCircle, FiClock,
    FiTrendingUp, FiStar, FiArrowRight, FiBell, FiFileText,
    FiShield, FiUserCheck, FiPackage
} from 'react-icons/fi';

// ─── SHARED DATA ──────────────────────────────────────────────────────────────
const STUDENT_NOTIFS = [
    { id: 1, category: 'company', icon: FiFileText, label: 'Antigravity', title: 'New experience shared — Antigravity Hub', body: 'Priya Nair shared her Antigravity SDE II interview experience — Round 2 deep dive.', time: '5 min ago', action: 'View', unread: true },
    { id: 2, category: 'company', icon: FiCalendar, label: 'Google', title: 'AMA scheduled in Google Hub', body: 'Sneha Kumar (Google L5) is hosting an AMA on Friday 7 PM. Limited seats.', time: '22 min ago', action: 'Join', unread: true },
    { id: 3, category: 'company', icon: FiCheckCircle, label: 'Amazon', title: 'Resource verified — Amazon Hub', body: '"LP Prep Guide 2025" was verified by Arjun Sharma (selected, Amazon SDE II).', time: '1 hr ago', action: 'View', unread: true },
    { id: 4, category: 'company', icon: FiAlertCircle, label: 'Microsoft', title: 'OA pattern updated — Microsoft 2025', body: 'New pattern: 2 DSA + 1 debugging + Behavioral MCQs.', time: '3 hr ago', action: 'View', unread: false, warn: true },
    { id: 5, category: 'mock', icon: FiCheckCircle, label: 'Mock', title: 'Mock session confirmed', body: 'Your mock with Riya Desai is confirmed for Saturday 11:00 AM.', time: '2 hr ago', action: 'View', unread: true },
    { id: 6, category: 'mock', icon: FiStar, label: 'Feedback', title: 'Mock feedback available', body: 'Priya Nair left feedback on your System Design mock. DSA: 8/10, SD: 7/10.', time: 'Yesterday', action: 'View', unread: false },
    { id: 7, category: 'mock', icon: FiClock, label: 'Reminder', title: 'Mock starts in 1 hour', body: 'Your Google-style mock with Dev Patel starts at 3:00 PM today.', time: 'Today 2PM', action: 'Prepare', unread: false },
    { id: 8, category: 'mentions', icon: FiAtSign, label: 'Mention', title: 'Priya Nair mentioned you in #interview-prep', body: '"@arjun_s shared the best breakdown I\'ve seen — read his post!"', time: '45 min ago', action: 'View', unread: true },
    { id: 9, category: 'mentions', icon: FiThumbsUp, label: 'Upvote', title: 'Your reply was upvoted 10 times', body: 'Your answer on "AG System Design Round" is trending.', time: '3 hr ago', action: 'View', unread: false },
    { id: 10, category: 'achievements', icon: FiAward, label: 'Badge', title: 'You earned DSA Expert badge', body: '150+ problems solved and 8+ in 3 DSA mocks. Badge unlocked!', time: '1 day ago', action: 'View', unread: false },
    { id: 11, category: 'achievements', icon: FiTrendingUp, label: 'Progress', title: 'DSA Readiness jumped to 78%', body: 'Up from 65% last week. Graph and DP are your next focus.', time: '2 days ago', action: 'View', unread: false },
    { id: 12, category: 'achievements', icon: FiAlertCircle, label: 'Alert', title: 'You are 2 weeks behind your roadmap', body: 'Week 3 (System Design Fundamentals) is incomplete.', time: '2 days ago', action: 'Catch Up', unread: true, warn: true },
];

// Senior-specific notifications (appended on top of student ones)
const SENIOR_NOTIFS = [
    { id: 101, category: 'requests', icon: FiUserCheck, label: 'Booking', title: 'Mock booking request from Riya Sharma', body: 'Riya wants a 60-min System Design + DSA session. She\'s targeting Google Summer 2025.', time: '10 min ago', action: 'Accept', unread: true, senior: true },
    { id: 102, category: 'requests', icon: FiUserCheck, label: 'Booking', title: 'Mock booking request from Dev Patel', body: 'Dev is targeting Antigravity SDE I. Wants a 45-min DSA-focused session.', time: '1 hr ago', action: 'Accept', unread: true, senior: true },
    { id: 103, category: 'verify', icon: FiPackage, label: 'Verify', title: '5 resources awaiting your verification', body: '3 in Antigravity Hub, 2 in Google Hub. Students marked them as helpful.', time: '2 hr ago', action: 'Review', unread: true, senior: true },
    { id: 104, category: 'verify', icon: FiShield, label: 'Resolve', title: 'Unanswered query trending in #general', body: '"What\'s the pattern for AG\'s System Design round?" — 18 upvotes, no senior answer yet.', time: '3 hr ago', action: 'Answer', unread: true, senior: true },
    { id: 105, category: 'ama', icon: FiCalendar, label: 'AMA', title: 'AMA hosting slot confirmed — Antigravity Hub', body: 'You\'re confirmed as host for Friday 7 PM AMA. 24 students signed up already.', time: 'Yesterday', action: 'Prepare', unread: false, senior: true },
];

const STUDENT_TABS = ['All', 'Company', 'Mock', 'Mentions', 'Achievements'];
const SENIOR_TABS = ['All', 'Requests', 'Verify', 'Company', 'Mock', 'Mentions', 'Achievements'];

const Notifications = ({ t, role }) => {
    const isSenior = role === 'senior';
    const TABS = isSenior ? SENIOR_TABS : STUDENT_TABS;
    const ALL_NOTIFS = isSenior ? [...SENIOR_NOTIFS, ...STUDENT_NOTIFS] : STUDENT_NOTIFS;

    const [activeTab, setActiveTab] = useState('All');
    const [read, setRead] = useState({});

    const filtered = ALL_NOTIFS.filter(n =>
        activeTab === 'All' ? true : n.category === activeTab.toLowerCase()
    );
    const unreadCount = ALL_NOTIFS.filter(n => n.unread && !read[n.id]).length;

    return (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px', width: '100%' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <FiBell size={22} style={{ color: t.cyan }} />
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <h1 style={{ fontSize: 24, fontWeight: 800, color: t.textPrimary }}>Notifications</h1>
                            {isSenior && (
                                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: t.cyanDim, color: t.cyan, border: `1px solid ${t.borderGlow}`, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <FiShield size={9} /> Senior View
                                </span>
                            )}
                        </div>
                        <p style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <button onClick={() => { const m = {}; ALL_NOTIFS.forEach(n => { m[n.id] = true; }); setRead(m); }}
                        style={{ fontSize: 12, color: t.cyan, background: 'none', border: `1px solid ${t.borderGlow}`, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>
                        Mark all read
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: `1px solid ${t.border}`, overflowX: 'auto', paddingBottom: 0 }}>
                {TABS.map(tab => {
                    const isActive = activeTab === tab;
                    const cnt = tab === 'All' ? unreadCount : ALL_NOTIFS.filter(n => n.category === tab.toLowerCase() && n.unread && !read[n.id]).length;
                    return (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 14px', background: 'none', border: 'none', borderBottom: `2px solid ${isActive ? t.cyan : 'transparent'}`, color: isActive ? t.cyan : t.textMuted, fontWeight: isActive ? 700 : 400, fontSize: 12.5, cursor: 'pointer', fontFamily: "'Sora', sans-serif", transition: 'all 0.15s', marginBottom: -1, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                            {tab}
                            {cnt > 0 && <span style={{ background: t.cyan, color: '#000', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 10, minWidth: 16, textAlign: 'center' }}>{cnt}</span>}
                        </button>
                    );
                })}
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map(n => {
                    const isUnread = n.unread && !read[n.id];
                    const Icon = n.icon;
                    const accentColor = n.warn ? '#ef4444' : t.cyan;
                    return (
                        <div key={n.id} onClick={() => setRead(p => ({ ...p, [n.id]: true }))}
                            style={{ background: t.surface, border: `1px solid ${isUnread ? t.borderGlow : t.border}`, borderLeft: `3px solid ${isUnread ? accentColor : 'transparent'}`, borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 14, cursor: 'pointer', transition: 'border-color 0.15s', position: 'relative' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = t.borderGlow}
                            onMouseLeave={e => e.currentTarget.style.borderColor = isUnread ? t.borderGlow : t.border}>

                            <div style={{ width: 38, height: 38, borderRadius: 10, background: t.elevated, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: accentColor }}>
                                <Icon size={16} />
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: 13.5, fontWeight: 700, color: t.textPrimary }}>{n.title}</span>
                                    <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 10, background: n.senior ? t.cyanDim : t.elevated, color: n.senior ? t.cyan : t.textMuted, border: `1px solid ${n.senior ? t.borderGlow : t.border}`, flexShrink: 0 }}>{n.label}</span>
                                    {isUnread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: accentColor, flexShrink: 0, marginLeft: 'auto' }} />}
                                </div>
                                <p style={{ fontSize: 12.5, color: t.textSecondary, lineHeight: 1.55, marginBottom: 8 }}>{n.body}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: 11, color: t.textMuted }}>{n.time}</span>
                                    <button style={{ fontSize: 12, fontWeight: 600, color: t.cyan, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, padding: 0, fontFamily: "'Sora', sans-serif" }}>
                                        {n.action} <FiArrowRight size={10} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Notifications;
