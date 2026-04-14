import React, { useState } from 'react';
import {
    FiCode, FiCpu, FiDatabase, FiWifi, FiLayers,
    FiTrendingUp, FiCheckCircle, FiClock, FiTarget,
    FiBarChart2, FiCalendar, FiAlertCircle, FiUsers,
    FiStar, FiShield, FiPackage
} from 'react-icons/fi';

const RED = '#ef4444';

const ProgressBar = ({ pct, t, red = false }) => (
    <div style={{ height: 6, background: t.elevated, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: red ? RED : t.cyan, borderRadius: 10, transition: 'width 0.6s ease' }} />
    </div>
);

const RadialProgress = ({ pct, size = 76, stroke = 6, t, red = false }) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={t.elevated} strokeWidth={stroke} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={red ? RED : t.cyan} strokeWidth={stroke}
                strokeDasharray={`${(pct / 100) * circ} ${circ}`} strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.6s ease' }} />
        </svg>
    );
};

const Card = ({ children, t, style = {} }) => (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 22, ...style }}>
        {children}
    </div>
);

const SecLabel = ({ icon: Icon, label, t }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${t.border}` }}>
        <Icon size={14} style={{ color: t.cyan }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
    </div>
);

const DSA_TOPICS = [
    { label: 'Arrays & Strings', solved: 42, total: 50 },
    { label: 'Graphs', solved: 28, total: 45 },
    { label: 'Dynamic Programming', solved: 21, total: 50 },
    { label: 'Trees & BST', solved: 35, total: 40 },
    { label: 'Greedy', solved: 18, total: 30 },
];

const COMPANY_READINESS = [
    { name: 'Antigravity', pct: 72 },
    { name: 'Google', pct: 45 },
    { name: 'Microsoft', pct: 30 },
    { name: 'Amazon', pct: 55 },
];

const CORE_SUBJECTS = [
    { label: 'Operating Systems', pct: 70, icon: FiCpu },
    { label: 'DBMS', pct: 55, icon: FiDatabase },
    { label: 'Computer Networks', pct: 40, icon: FiWifi },
    { label: 'OOP Principles', pct: 85, icon: FiLayers },
];

const ROADMAP = [
    { week: 1, title: 'Arrays, Strings & Sliding Window', status: 'done', pct: 100 },
    { week: 2, title: 'Recursion & Two Pointers', status: 'done', pct: 100 },
    { week: 3, title: 'Graphs & BFS / DFS', status: 'partial', pct: 60 },
    { week: 4, title: 'Dynamic Programming', status: 'not_started', pct: 0 },
    { week: 5, title: 'System Design Fundamentals', status: 'not_started', pct: 0 },
    { week: 6, title: 'Mock Marathon', status: 'not_started', pct: 0 },
];

const MOCKS = [
    { label: 'M1', dsa: 5, sd: 4 },
    { label: 'M2', dsa: 6, sd: 5 },
    { label: 'M3', dsa: 7, sd: 7 },
    { label: 'M4', dsa: 8, sd: 7 },
    { label: 'M5', dsa: 8, sd: 9 },
];

// Senior data
const PENDING_SESSIONS = [
    { student: 'Riya Sharma', type: 'System Design + DSA', target: 'Google', slot: 'Sat, 11:00 AM' },
    { student: 'Dev Patel', type: 'DSA Focused', target: 'Antigravity', slot: 'Sun, 4:00 PM' },
];
const MENTOR_STATS = [
    { label: 'Students Mentored', val: 24 },
    { label: 'Sessions Conducted', val: 38 },
    { label: 'Resources Verified', val: 17 },
    { label: 'Avg Rating', val: '4.8' },
];

const MockChart = ({ t }) => (
    <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 80, marginBottom: 10 }}>
            {MOCKS.map((m, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', gap: 3, alignItems: 'flex-end', height: '100%' }}>
                    <div style={{ flex: 1, height: `${(m.dsa / 10) * 100}%`, background: t.cyan, borderRadius: '3px 3px 0 0', minHeight: 4 }} />
                    <div style={{ flex: 1, height: `${(m.sd / 10) * 100}%`, background: `${t.cyan}55`, borderRadius: '3px 3px 0 0', minHeight: 4 }} />
                </div>
            ))}
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
            {MOCKS.map((m, i) => <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: t.textMuted }}>{m.label}</div>)}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            {[{ c: t.cyan, l: 'DSA' }, { c: `${t.cyan}55`, l: 'System Design' }].map(l => (
                <div key={l.l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: t.textMuted }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: l.c }} /> {l.l}
                </div>
            ))}
        </div>
    </div>
);

const ProgressTracker = ({ t, role }) => {
    const isSenior = role === 'senior';
    const totalSolved = DSA_TOPICS.reduce((s, d) => s + d.solved, 0);
    const totalProblems = DSA_TOPICS.reduce((s, d) => s + d.total, 0);
    const overallPct = Math.round((totalSolved / totalProblems) * 100);

    return (
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '36px 24px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: t.textPrimary }}>
                    {isSenior ? 'Impact & Progress' : 'Progress Tracker'}
                </h1>
                {isSenior && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: t.cyanDim, color: t.cyan, border: `1px solid ${t.borderGlow}` }}>
                        Senior View
                    </span>
                )}
            </div>
            <p style={{ fontSize: 12, color: t.textMuted, marginBottom: 28 }}>
                {isSenior ? 'Your mentorship impact and personal placement stats.' : 'Your personalised placement readiness dashboard.'}
            </p>

            {/* ── SENIOR-ONLY: Impact Stats + Pending Sessions ── */}
            {isSenior && (
                <>
                    {/* Impact Stats */}
                    <Card t={t} style={{ marginBottom: 16 }}>
                        <SecLabel icon={FiUsers} label="Mentorship Impact" t={t} />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
                            {MENTOR_STATS.map(s => (
                                <div key={s.label} style={{ textAlign: 'center', padding: '14px 10px', background: t.elevated, borderRadius: 12, border: `1px solid ${t.border}` }}>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: t.cyan }}>{s.val}</div>
                                    <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                        {/* Star rating visual */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ display: 'flex', gap: 2 }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <FiStar key={i} size={14} style={{ color: i <= 4 ? t.cyan : t.elevated, fill: i <= 4 ? t.cyan : 'none' }} />
                                ))}
                            </div>
                            <span style={{ fontSize: 12, color: t.textMuted }}>4.8 average from 38 sessions</span>
                        </div>
                    </Card>

                    {/* Pending Session Requests */}
                    <Card t={t} style={{ marginBottom: 16 }}>
                        <SecLabel icon={FiCalendar} label={`Pending Session Requests (${PENDING_SESSIONS.length})`} t={t} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {PENDING_SESSIONS.map((s, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: t.elevated, borderRadius: 12, border: `1px solid ${t.borderGlow}` }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: t.cyanDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: t.cyan, flexShrink: 0 }}>
                                        {s.student[0]}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13.5, fontWeight: 700, color: t.textPrimary }}>{s.student}</div>
                                        <div style={{ fontSize: 12, color: t.textMuted }}>{s.type} · Targeting {s.target}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6 }}>{s.slot}</div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button style={{ fontSize: 11, fontWeight: 700, color: '#000', background: t.cyan, border: 'none', borderRadius: 7, padding: '4px 10px', cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>Accept</button>
                                            <button style={{ fontSize: 11, fontWeight: 600, color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, padding: '4px 10px', cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>Decline</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ flex: 1, height: 1, background: t.border }} />
                        <span style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Personal Stats (retained)</span>
                        <div style={{ flex: 1, height: 1, background: t.border }} />
                    </div>
                </>
            )}

            {/* ── ROW 1: DSA + Mock ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <Card t={t}>
                    <SecLabel icon={FiCode} label="DSA Progress" t={t} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20 }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                            <RadialProgress pct={overallPct} size={80} stroke={7} t={t} />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 17, fontWeight: 800, color: t.textPrimary }}>{totalSolved}</span>
                                <span style={{ fontSize: 9, color: t.textMuted }}>solved</span>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: 13, color: t.textSecondary }}>Total: <strong style={{ color: t.textPrimary }}>{totalSolved}/{totalProblems}</strong></div>
                            <div style={{ fontSize: 13, color: t.textSecondary, marginTop: 4 }}>LeetCode: <strong style={{ color: t.cyan }}>1824</strong></div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {DSA_TOPICS.map(d => (
                            <div key={d.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontSize: 12, color: t.textSecondary }}>{d.label}</span>
                                    <span style={{ fontSize: 11, color: t.textMuted }}>{d.solved}/{d.total}</span>
                                </div>
                                <ProgressBar pct={Math.round((d.solved / d.total) * 100)} t={t} />
                            </div>
                        ))}
                    </div>
                </Card>

                <Card t={t}>
                    <SecLabel icon={FiBarChart2} label="Mock History" t={t} />
                    <MockChart t={t} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 16 }}>
                        {[{ label: 'Mocks Taken', val: 5 }, { label: 'Avg DSA Score', val: '6.8' }, { label: 'Best Overall', val: '8.7' }].map(s => (
                            <div key={s.label} style={{ textAlign: 'center', padding: '10px 6px', background: t.elevated, borderRadius: 10, border: `1px solid ${t.border}` }}>
                                <div style={{ fontSize: 18, fontWeight: 800, color: t.cyan }}>{s.val}</div>
                                <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* ── Company Readiness ── */}
            <Card t={t} style={{ marginBottom: 16 }}>
                <SecLabel icon={FiTarget} label="Company Readiness" t={t} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                    {COMPANY_READINESS.map(co => (
                        <div key={co.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 12px', background: t.elevated, borderRadius: 14, border: `1px solid ${t.border}` }}>
                            <div style={{ position: 'relative', marginBottom: 10 }}>
                                <RadialProgress pct={co.pct} size={68} stroke={5} t={t} red={co.pct < 40} />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: 14, fontWeight: 800, color: co.pct < 40 ? RED : t.textPrimary }}>{co.pct}%</span>
                                </div>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: t.textPrimary }}>{co.name}</div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* ── ROW 3: Core + Roadmap ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Card t={t}>
                    <SecLabel icon={FiCpu} label="Core Subject Confidence" t={t} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {CORE_SUBJECTS.map(sub => (
                            <div key={sub.label}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                                    <sub.icon size={13} style={{ color: sub.pct < 50 ? RED : t.cyan }} />
                                    <span style={{ fontSize: 12, color: t.textSecondary, flex: 1 }}>{sub.label}</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: sub.pct < 50 ? RED : t.cyan }}>{sub.pct}%</span>
                                </div>
                                <ProgressBar pct={sub.pct} t={t} red={sub.pct < 50} />
                            </div>
                        ))}
                    </div>
                </Card>

                <Card t={t}>
                    <SecLabel icon={FiCalendar} label="Roadmap Tracker" t={t} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {ROADMAP.map(w => {
                            const icon = w.status === 'done' ? <FiCheckCircle size={13} /> : w.status === 'partial' ? <FiClock size={13} /> : <FiAlertCircle size={13} />;
                            const color = w.status === 'done' ? t.cyan : w.status === 'partial' ? t.cyan : t.textMuted;
                            return (
                                <div key={w.week} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: t.elevated, borderRadius: 10, border: `1px solid ${w.status === 'partial' ? t.borderGlow : t.border}` }}>
                                    <span style={{ color, flexShrink: 0 }}>{icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: t.textPrimary }}>W{w.week}: {w.title}</div>
                                        {w.status === 'partial' && <div style={{ marginTop: 4 }}><ProgressBar pct={w.pct} t={t} /></div>}
                                    </div>
                                    <span style={{ fontSize: 10, fontWeight: 700, color, flexShrink: 0 }}>
                                        {w.status === 'done' ? '100%' : w.status === 'partial' ? `${w.pct}%` : '--'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProgressTracker;
