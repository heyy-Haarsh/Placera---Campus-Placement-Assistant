import React, { useState } from 'react';
import {
    FiEdit3, FiUserPlus, FiBookmark, FiAlertCircle,
    FiBriefcase, FiCheckCircle, FiXCircle, FiAward
} from 'react-icons/fi';

const SUGGESTED_USERS = [
    { init: 'V', name: 'Vikram Singh', college: 'IIT Bombay', grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)', companies: 'Google · Meta' },
    { init: 'N', name: 'Neha Gupta', college: 'NIT Trichy', grad: 'linear-gradient(135deg,#22d3ee,#6366f1)', companies: 'Amazon · Stripe' },
    { init: 'P', name: 'Prithvi Kumar', college: 'BITS Pilani', grad: 'linear-gradient(135deg,#f59e0b,#ef4444)', companies: 'Microsoft · Uber' },
];

const BOOKMARKS = [
    { company: 'Google', role: 'SDE II', verdict: 'selected', rounds: 5, diff: 'Hard' },
    { company: 'Amazon', role: 'SDE I', verdict: 'selected', rounds: 4, diff: 'Medium' },
    { company: 'Meta', role: 'SWE E4', verdict: 'rejected', rounds: 6, diff: 'Hard' },
];

function VerdictDot({ verdict }) {
    const c = { selected: '#06b6d4', rejected: '#f43f5e', intern: '#f97316' }[verdict] || '#a1a1aa';
    return <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, display: 'inline-block', flexShrink: 0 }} />;
}

const RightPanel = ({ t, dark, onShareClick }) => {
    const [followed, setFollowed] = useState({});

    return (
        <aside style={{
            width: 'var(--right-w)', minWidth: 'var(--right-w)',
            display: 'flex', flexDirection: 'column', gap: 14,
            padding: '20px 16px 20px 0',
        }}>

            {/* Share Experience CTA */}
            <div style={{
                background: `linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(99,102,241,0.06) 100%)`,
                border: `1px solid ${t.borderGlow}`,
                borderRadius: 14, padding: '18px 16px', textAlign: 'center',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* glow orb */}
                <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, background: `radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.cyanDim, border: `1.5px solid ${t.borderGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: t.cyan }}>
                    <FiEdit3 size={20} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary, marginBottom: 6 }}>Share Your Story</div>
                <div style={{ fontSize: 12.5, color: t.textSecondary, lineHeight: 1.55, marginBottom: 14 }}>
                    Finished an interview? Help juniors prepare and earn <span style={{ color: t.cyan, fontWeight: 700 }}>+500 XP</span>
                </div>
                <button
                    onClick={onShareClick}
                    style={{
                        width: '100%', background: t.cyan, border: 'none', borderRadius: 10,
                        color: '#000', fontSize: 13.5, fontWeight: 700, padding: '10px 0',
                        cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                        boxShadow: `0 4px 20px rgba(6,182,212,0.4)`,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 28px rgba(6,182,212,0.6)`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 4px 20px rgba(6,182,212,0.4)`; e.currentTarget.style.transform = 'none'; }}
                >
                    Write Experience
                </button>
            </div>

            {/* Who to Follow */}
            <div style={{
                background: t.card, border: `1px solid ${t.border}`,
                borderRadius: 14, padding: '16px 16px',
            }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiUserPlus size={16} color={t.cyan} /> Who to Follow
                </div>
                {SUGGESTED_USERS.map((user, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: user.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                            {user.init}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                            <div style={{ fontSize: 11, color: t.textMuted }}>{user.college}</div>
                            <div style={{ fontSize: 10.5, color: t.cyan, marginTop: 1 }}>{user.companies}</div>
                        </div>
                        <button
                            onClick={() => setFollowed(f => ({ ...f, [i]: !f[i] }))}
                            style={{
                                background: followed[i] ? t.cyanDim : 'none',
                                border: `1px solid ${followed[i] ? t.borderGlow : t.border}`,
                                color: followed[i] ? t.cyan : t.textSecondary,
                                fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s',
                            }}
                        >
                            {followed[i] ? 'Following' : 'Follow'}
                        </button>
                    </div>
                ))}
            </div>

            {/* My Bookmarks */}
            <div style={{
                background: t.card, border: `1px solid ${t.border}`,
                borderRadius: 14, padding: '16px 16px',
            }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiBookmark size={16} color={t.cyan} /> My Bookmarks
                </div>
                {BOOKMARKS.map((bm, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: t.elevated, marginBottom: 8, cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = t.borderGlow}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, background: t.cyanDim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiBriefcase size={14} color={t.cyan} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: t.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bm.company} — {bm.role}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                <VerdictDot verdict={bm.verdict} />
                                <span style={{ fontSize: 11, color: t.textMuted }}>{bm.rounds} rounds · {bm.diff}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <button style={{ width: '100%', textAlign: 'center', background: 'none', border: 'none', fontSize: 12, color: t.cyan, cursor: 'pointer', paddingTop: 4, fontFamily: "'Sora', sans-serif" }}>
                    View all bookmarks →
                </button>
            </div>

            {/* Disclaimer */}
            <div style={{
                background: `rgba(249,115,22,0.05)`,
                border: `1px solid rgba(249,115,22,0.15)`,
                borderRadius: 10, padding: '12px 14px',
            }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <FiAlertCircle size={14} color="#f97316" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: 11.5, color: t.textMuted, lineHeight: 1.6 }}>
                        Experiences on Placera are shared by students and are not verified. Use them as reference only. Company hiring processes may change.
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default RightPanel;
