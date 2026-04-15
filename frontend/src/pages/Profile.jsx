import React, { useState, useEffect, useMemo } from 'react';
import {
    FiGithub, FiLinkedin, FiGlobe, FiEdit2, FiUpload,
    FiAward, FiCheckCircle, FiCode, FiTarget,
    FiMessageSquare, FiEye, FiEyeOff, FiShield,
    FiStar, FiUsers, FiToggleLeft, FiToggleRight, FiMapPin
} from 'react-icons/fi';

const BADGES_STUDENT = [
    { label: 'DSA Expert', icon: FiCode },
    { label: 'Helpful Reply ×10', icon: FiMessageSquare },
    { label: 'Top Contributor', icon: FiTarget },
];
const BADGES_SENIOR = [
    { label: 'Selected — Google 2024', icon: FiAward, highlight: true },
    { label: 'Verified Senior Mentor', icon: FiShield, highlight: true },
    ...BADGES_STUDENT,
];

const TECH_STACK = ['React', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Redis'];
const MENTOR_COMPANIES = ['Google', 'Antigravity', 'Amazon'];

const SKILL_SNAPSHOT = [
    { label: 'LeetCode', val: '1824 rating' },
    { label: 'Problems Solved', val: '210+' },
    { label: 'Projects', val: '6' },
    { label: 'Internships', val: '2' },
    { label: 'Codeforces', val: '1340 Pupil' },
    { label: 'Open Source PRs', val: '14' },
];

const Toggle = ({ on, onToggle, t }) => (
    <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 40, height: 22, borderRadius: 11, background: on ? t.cyanDim : t.elevated, border: `1px solid ${on ? t.borderGlow : t.border}`, position: 'relative', transition: 'all 0.2s' }}>
            <div style={{ position: 'absolute', top: 3, left: on ? 20 : 3, width: 14, height: 14, borderRadius: '50%', background: on ? t.cyan : t.textMuted, transition: 'left 0.2s' }} />
        </div>
    </button>
);

const Profile = ({ t, role }) => {
    const isSenior = role === 'senior';
    const [editBio, setEditBio] = useState(false);
    const [bio, setBio] = useState(
        isSenior
            ? 'Google SDE II (2024 batch). Mentoring juniors for DSA + System Design. Active in Antigravity and Google hubs. Open to referrals.'
            : 'SDE campus placement aspirant. Focused on DSA + system design. Active in Antigravity and Google hubs. Mentor for DSA prep.'
    );
    const [resumePublic, setResumePublic] = useState(false);
    const [viewMode, setViewMode] = useState('self');
    const [referralOpen, setReferralOpen] = useState(true);
    const [takingSessions, setTaking] = useState(true);

    // ── Real stats from API ──────────────────────────────────────
    const currentUser = useMemo(() => {
        try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
    }, []);
    const [liveStats, setLiveStats] = useState(null);
    useEffect(() => {
        const userId = currentUser?._id || currentUser?.id;
        if (!userId) return;
        const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        fetch(`${API_URL}/api/stats/${userId}`)
            .then(r => r.json())
            .then(setLiveStats)
            .catch(() => {});
    }, [currentUser?._id, currentUser?.id]);

    const BADGES = isSenior ? BADGES_SENIOR : BADGES_STUDENT;


    const STATS_STUDENT = [
        { label: 'Mocks Taken',      val: liveStats?.mockSessions       ?? 0  },
        { label: 'Problems Solved',  val: 210                                  },
        { label: 'AMA Attended',     val: 3                                    },
        { label: 'Experiences Shared', val: liveStats?.experiencesPosted ?? 0 },
    ];
    const STATS_SENIOR = [
        { label: 'Sessions Conducted', val: 38       },
        { label: 'Avg Rating',         val: '4.8'   },
        { label: 'Students Mentored',  val: 24      },
        { label: 'Resources Verified', val: 17      },
    ];
    const STATS = isSenior ? STATS_SENIOR : STATS_STUDENT;

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '36px 24px', width: '100%' }}>

            {/* View Toggle */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginBottom: 20 }}>
                {['self', 'junior', 'mentor'].map(m => (
                    <button key={m} onClick={() => setViewMode(m)} style={{ padding: '5px 14px', borderRadius: 8, border: `1px solid ${viewMode === m ? t.borderGlow : t.border}`, background: viewMode === m ? t.cyanDim : 'transparent', color: viewMode === m ? t.cyan : t.textMuted, fontSize: 12, fontWeight: viewMode === m ? 700 : 400, cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>
                        {m === 'self' ? 'My View' : `As ${m.charAt(0).toUpperCase() + m.slice(1)}`}
                    </button>
                ))}
            </div>

            {/* ── SENIOR-ONLY: Status Bar ── */}
            {isSenior && (
                <div style={{ background: t.card, border: `1px solid ${t.borderGlow}`, borderRadius: 14, padding: '14px 18px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <FiShield size={14} style={{ color: t.cyan }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: t.cyan }}>VERIFIED SENIOR</span>
                    </div>
                    <div style={{ width: 1, height: 20, background: t.border }} />
                    {/* Taking sessions toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: t.textMuted }}>Taking Sessions</span>
                        <Toggle on={takingSessions} onToggle={() => setTaking(p => !p)} t={t} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: takingSessions ? t.cyan : '#ef4444' }}>{takingSessions ? 'Open' : 'Paused'}</span>
                    </div>
                    <div style={{ width: 1, height: 20, background: t.border }} />
                    {/* Referral toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: t.textMuted }}>Referrals</span>
                        <Toggle on={referralOpen} onToggle={() => setReferralOpen(p => !p)} t={t} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: referralOpen ? t.cyan : t.textMuted }}>{referralOpen ? 'Open' : 'Closed'}</span>
                    </div>
                    {/* Mentor-for companies */}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: t.textMuted }}>Mentor for:</span>
                        {MENTOR_COMPANIES.map(c => (
                            <span key={c} style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: t.elevated, color: t.textSecondary, border: `1px solid ${t.border}` }}>{c}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Header Card */}
            <div style={{ background: t.card, border: `1px solid ${isSenior ? t.borderGlow : t.border}`, borderRadius: 18, overflow: 'hidden', marginBottom: 14 }}>
                <div style={{ height: 80, background: `linear-gradient(90deg, #000 0%, ${t.cyanDim} 60%, #000 100%)`, borderBottom: `1px solid ${t.border}` }} />

                <div style={{ padding: '0 24px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -28, marginBottom: 14 }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ width: 68, height: 68, borderRadius: 16, background: isSenior ? t.cyanDim : t.elevated, border: `3px solid ${isSenior ? t.cyan : t.card}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: t.cyan }}>A</div>
                            {isSenior && (
                                <div style={{ position: 'absolute', bottom: -2, right: -2, background: t.cyan, borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiShield size={11} color="#000" />
                                </div>
                            )}
                            {!isSenior && (
                                <div style={{ position: 'absolute', bottom: -2, right: -2, background: t.cyan, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiCheckCircle size={10} color="#000" />
                                </div>
                            )}
                        </div>
                        <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: `1px solid ${t.border}`, background: 'transparent', color: t.textMuted, fontSize: 12, cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>
                            <FiEdit2 size={11} /> Edit
                        </button>
                    </div>

                    {/* Name + bio */}
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: t.textPrimary }}>Arjun Sharma</h2>
                            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: t.cyanDim, color: t.cyan, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                                <FiShield size={9} /> Verified
                            </span>
                            {isSenior && (
                                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: `rgba(16,185,129,0.08)`, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <FiStar size={9} /> Senior
                                </span>
                            )}
                        </div>
                        <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 10 }}>
                            {isSenior ? 'Google SDE II · CSE, BITS Pilani 2024' : 'CSE · Batch 2025 · BITS Pilani'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                            {editBio
                                ? <textarea value={bio} onChange={e => setBio(e.target.value)} onBlur={() => setEditBio(false)} autoFocus rows={2} style={{ flex: 1, background: t.elevated, border: `1px solid ${t.borderGlow}`, borderRadius: 8, padding: '6px 10px', color: t.textPrimary, fontSize: 13, fontFamily: "'Sora', sans-serif", resize: 'none', outline: 'none' }} />
                                : <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.6, flex: 1 }}>{bio}</div>
                            }
                            <button onClick={() => setEditBio(b => !b)} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: 2, flexShrink: 0 }}><FiEdit2 size={12} /></button>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[{ icon: FiGithub, label: 'GitHub' }, { icon: FiLinkedin, label: 'LinkedIn' }, { icon: FiGlobe, label: 'Portfolio' }].map(l => (
                            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, border: `1px solid ${t.border}`, color: t.textMuted, fontSize: 12, cursor: 'pointer' }}
                                onMouseEnter={e => { e.currentTarget.style.color = t.cyan; e.currentTarget.style.borderColor = t.borderGlow; }}
                                onMouseLeave={e => { e.currentTarget.style.color = t.textMuted; e.currentTarget.style.borderColor = t.border; }}>
                                <l.icon size={12} /> {l.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Bar */}
                <div style={{ borderTop: `1px solid ${t.border}`, display: 'flex' }}>
                    {STATS.map((s, i) => (
                        <React.Fragment key={s.label}>
                            {i > 0 && <div style={{ width: 1, background: t.border, flexShrink: 0 }} />}
                            <div style={{ flex: 1, textAlign: 'center', padding: '14px 10px' }}>
                                <div style={{ fontSize: 20, fontWeight: 800, color: t.cyan }}>{s.val}</div>
                                <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{s.label}</div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Badges + Resume/Stack */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                {/* Badges */}
                <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
                        <FiAward size={13} style={{ color: t.cyan }} /> Badges
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {BADGES.map((b, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: b.highlight ? t.cyanDim : t.elevated, border: `1px solid ${b.highlight ? t.borderGlow : t.border}` }}>
                                <b.icon size={13} style={{ color: t.cyan, flexShrink: 0 }} />
                                <span style={{ fontSize: 13, fontWeight: b.highlight ? 700 : 600, color: b.highlight ? t.cyan : t.textPrimary }}>{b.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Tech Stack */}
                    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20, flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Tech Stack</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                            {TECH_STACK.map(s => (
                                <span key={s} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: t.elevated, color: t.textSecondary, border: `1px solid ${t.border}` }}>{s}</span>
                            ))}
                        </div>
                    </div>

                    {/* Resume */}
                    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Resume</div>
                        <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 10 }}>arjun_sharma_resume_2025.pdf · 420 KB</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <button onClick={() => setResumePublic(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: resumePublic ? t.cyan : t.textMuted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>
                                {resumePublic ? <FiEye size={12} /> : <FiEyeOff size={12} />}
                                {resumePublic ? 'Public' : 'Private'}
                            </button>
                            <button style={{ fontSize: 12, fontWeight: 600, color: t.cyan, background: 'none', border: `1px solid ${t.borderGlow}`, borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skill Snapshot */}
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Skill Snapshot</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                    {SKILL_SNAPSHOT.map(s => (
                        <div key={s.label} style={{ padding: '12px 14px', background: t.elevated, borderRadius: 12, border: `1px solid ${t.border}` }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: t.cyan, marginBottom: 3 }}>{s.val}</div>
                            <div style={{ fontSize: 11, color: t.textMuted }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
