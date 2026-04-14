import React, { useState, useEffect } from 'react';
import {
    FiArrowUp, FiArrowDown, FiMessageSquare, FiBookmark,
    FiUserPlus, FiShare2, FiFilter, FiChevronDown,
    FiMapPin, FiClock, FiAward, FiCheckCircle, FiXCircle,
    FiSearch, FiBriefcase, FiDollarSign, FiTarget,
} from 'react-icons/fi';

/* ─── MOCK DATA ──────────────────────────────────────────── */
const MOCK_EXPERIENCES = [
    {
        id: 1, followed: false,
        author: 'Riya Desai', authorInit: 'R', college: 'IIT Bombay', authorGrad: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        company: 'Google', role: 'SDE II', ctc: '48 LPA', verdict: 'selected', diff: 'hard',
        type: 'placement', campus: 'oncampus', timeago: '3 days ago',
        rounds: 5, preview: "Started with a recruiter screen, then a 45-min phone screen focused on trees and dynamic programming. The onsite loop had 2 coding rounds, 1 system design (distributed rate limiter at scale), 1 Googleyness round, and 1 hiring committee debrief…",
        upvotes: 312, downvotes: 8, comments: 47, saved: true,
        companyColor: 'rgba(66,133,244,0.15)',
    },
    {
        id: 2, followed: true,
        author: 'Karan Mehta', authorInit: 'K', college: 'NIT Trichy', authorGrad: 'linear-gradient(135deg,#22d3ee,#6366f1)',
        company: 'Meta', role: 'SWE E4', ctc: '52 LPA', verdict: 'rejected', diff: 'hard',
        type: 'placement', campus: 'offcampus', timeago: '1 week ago',
        rounds: 6, preview: "Got referred through a friend on the team. Phone screen was a LeetCode hard — sliding window variant with an optimization twist. Proceeded to onsite: two coding rounds (arrays, graphs), one system design (Instagram feed), and one behavioral…",
        upvotes: 287, downvotes: 21, comments: 63, saved: false,
        companyColor: 'rgba(24,119,242,0.15)',
    },
    {
        id: 3, followed: false,
        author: 'Priya Nair', authorInit: 'P', college: 'BITS Pilani', authorGrad: 'linear-gradient(135deg,#f59e0b,#ef4444)',
        company: 'Amazon', role: 'SDE I', ctc: '28 LPA', verdict: 'selected', diff: 'med',
        type: 'placement', campus: 'oncampus', timeago: '2 weeks ago',
        rounds: 4, preview: "Amazon's process is LP-heavy. OA had 2 coding questions of medium difficulty plus a work simulation section. Virtual onsite had 2 coding rounds and 2 behavioral LP rounds. Know your Leadership Principle stories cold—they matter as much as coding…",
        upvotes: 245, downvotes: 5, comments: 38, saved: true,
        companyColor: 'rgba(255,153,0,0.15)',
    },
    {
        id: 4, followed: true,
        author: 'Saurabh K', authorInit: 'S', college: 'DTU Delhi', authorGrad: 'linear-gradient(135deg,#10b981,#6366f1)',
        company: 'Microsoft', role: 'SWE', ctc: '32 LPA', verdict: 'selected', diff: 'med',
        type: 'placement', campus: 'oncampus', timeago: '2 weeks ago',
        rounds: 4, preview: "Microsoft's process was genuinely pleasant. Three technical rounds covered string manipulation, OOP design, graph problems, and mini system design. The As-Appropriate round felt like a senior coffee chat rather than an interrogation…",
        upvotes: 198, downvotes: 3, comments: 29, saved: false,
        companyColor: 'rgba(0,120,212,0.15)',
    },
    {
        id: 5, followed: false,
        author: 'Aanya Rao', authorInit: 'A', college: 'VIT Vellore', authorGrad: 'linear-gradient(135deg,#f59e0b,#8b5cf6)',
        company: 'Flipkart', role: 'SDE Intern', ctc: '1.2L/mo', verdict: 'intern', diff: 'easy',
        type: 'internship', campus: 'oncampus', timeago: '1 month ago',
        rounds: 3, preview: "Flipkart's intern process is entry-level friendly. CodeNation test (60 min), then two technical rounds on DSA fundamentals and an HR round. The interviewers were supportive — they genuinely wanted you to succeed…",
        upvotes: 176, downvotes: 2, comments: 21, saved: false,
        companyColor: 'rgba(255,102,0,0.12)',
    },
    {
        id: 6, followed: true,
        author: 'Dev Sharma', authorInit: 'D', college: 'IIT Madras', authorGrad: 'linear-gradient(135deg,#6366f1,#22d3ee)',
        company: 'Stripe', role: 'Platform Engineer', ctc: '55 LPA', verdict: 'rejected', diff: 'hard',
        type: 'placement', campus: 'offcampus', timeago: '1 month ago',
        rounds: 6, preview: "Stripe's loop is intense — six rounds over two days. The unique Codelab round requires you to add a feature to a real-ish payments codebase and write tests. Technical bar is extremely high; culture-fit rounds are just as important…",
        upvotes: 167, downvotes: 9, comments: 33, saved: false,
        companyColor: 'rgba(99,91,255,0.15)',
    },
    {
        id: 7, followed: false,
        author: 'Meera Joshi', authorInit: 'M', college: 'IIT Delhi', authorGrad: 'linear-gradient(135deg,#f43f5e,#f97316)',
        company: 'Uber', role: 'Software Engineer', ctc: '38 LPA', verdict: 'selected', diff: 'med',
        type: 'placement', campus: 'offcampus', timeago: '5 days ago',
        rounds: 4, preview: "Uber's process moved incredibly fast — recruiter to offer in 12 days. Phone screen with a medium-level coding problem, then three technical rounds covering system design, distributed systems, and behavioral. Very collaborative interviewers…",
        upvotes: 203, downvotes: 4, comments: 18, saved: false,
        companyColor: 'rgba(0,0,0,0.4)',
    },
    {
        id: 8, followed: true,
        author: 'Rohan Verma', authorInit: 'R', college: 'IIT Kharagpur', authorGrad: 'linear-gradient(135deg,#22d3ee,#f59e0b)',
        company: 'Atlassian', role: 'Software Dev', ctc: '42 LPA', verdict: 'selected', diff: 'med',
        type: 'placement', campus: 'offcampus', timeago: '3 weeks ago',
        rounds: 3, preview: "Atlassian does a values interview (Values, Craft, Execution, Courage, Open Company) which is refreshingly concrete. The technical rounds were challenging but fair — they want to see good code structure and communication more than raw speed…",
        upvotes: 142, downvotes: 6, comments: 12, saved: false,
        companyColor: 'rgba(0,82,204,0.15)',
    },
];

const COMPANIES = ['All', 'Google', 'Meta', 'Amazon', 'Microsoft', 'Flipkart', 'Stripe', 'Uber', 'Atlassian'];
const VERDICTS = ['All', 'Selected', 'Rejected', 'Intern'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const TYPES = ['All', 'Placement', 'Internship'];
const CAMPUS_TYPES = ['All', 'On-campus', 'Off-campus'];

/* ─── SHIMMER — uses theme colors, no hardcoded dark values ── */
function ShimmerBlock({ t, style }) {
    return (
        <div style={{
            background: `linear-gradient(90deg, ${t.elevated} 25%, ${t.card} 50%, ${t.elevated} 75%)`,
            backgroundSize: '400px 100%',
            animation: 'shimmerMove 1.4s ease infinite',
            borderRadius: 6,
            ...style,
        }} />
    );
}

function ShimmerCard({ t }) {
    return (
        <div style={{ background: t.card, borderBottom: `1px solid ${t.border}`, padding: 20 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <ShimmerBlock t={t} style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    <ShimmerBlock t={t} style={{ height: 12, width: '40%', marginBottom: 8 }} />
                    <ShimmerBlock t={t} style={{ height: 10, width: '25%' }} />
                </div>
            </div>
            <ShimmerBlock t={t} style={{ height: 14, width: '60%', marginBottom: 10 }} />
            <ShimmerBlock t={t} style={{ height: 12, width: '100%', marginBottom: 6 }} />
            <ShimmerBlock t={t} style={{ height: 12, width: '85%', marginBottom: 6 }} />
            <ShimmerBlock t={t} style={{ height: 12, width: '70%', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 16 }}>
                <ShimmerBlock t={t} style={{ height: 28, width: 60, borderRadius: 6 }} />
                <ShimmerBlock t={t} style={{ height: 28, width: 60, borderRadius: 6 }} />
                <ShimmerBlock t={t} style={{ height: 28, width: 60, borderRadius: 6 }} />
            </div>
        </div>
    );
}

function VerdictBadge({ verdict, t }) {
    const cfg = {
        selected: { bg: t.cyanDim, color: t.cyan, icon: <FiCheckCircle size={11} />, label: 'Selected' },
        rejected: { bg: 'rgba(244,63,94,0.12)', color: '#f43f5e', icon: <FiXCircle size={11} />, label: 'Rejected' },
        intern: { bg: 'rgba(249,115,22,0.12)', color: '#f97316', icon: <FiAward size={11} />, label: 'Intern' },
    }[verdict] || {};
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: cfg.bg, color: cfg.color,
            fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
        }}>
            {cfg.icon} {cfg.label}
        </span>
    );
}

function DiffBadge({ diff }) {
    const cfg = {
        easy: { color: '#10b981', label: 'Easy' },
        med: { color: '#f59e0b', label: 'Medium' },
        hard: { color: '#f43f5e', label: 'Hard' },
    }[diff] || { color: '#a1a1aa', label: diff };
    return <span style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>;
}

function ExperienceCard({ exp, t, onOpen, onSave, onFollow }) {
    const [votes, setVotes] = useState({ up: false, down: false });
    const handleVote = (dir) => setVotes(v => ({ up: dir === 'up' ? !v.up : false, down: dir === 'down' ? !v.down : false }));
    const totalUp = exp.upvotes + (votes.up ? 1 : 0) - (votes.down ? 1 : 0);

    return (
        <article
            onClick={() => onOpen(exp)}
            style={{ background: t.card, borderBottom: `1px solid ${t.border}`, padding: '18px 20px', cursor: 'pointer', transition: 'background 0.18s', animation: 'fadeUp 0.3s ease both' }}
            onMouseEnter={e => e.currentTarget.style.background = t.elevated}
            onMouseLeave={e => e.currentTarget.style.background = t.card}
        >
            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: exp.authorGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>
                    {exp.authorInit}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary }}>{exp.author}</span>
                        <span style={{ fontSize: 12, color: t.textMuted }}>{exp.college}</span>
                        <span style={{ fontSize: 11, color: t.textMuted, marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <FiClock size={11} /> {exp.timeago}
                        </span>
                    </div>
                </div>
                <button
                    onClick={e => { e.stopPropagation(); onFollow(exp.id); }}
                    style={{ background: exp.followed ? t.cyanDim : 'none', border: `1px solid ${exp.followed ? t.borderGlow : t.border}`, color: exp.followed ? t.cyan : t.textMuted, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s', flexShrink: 0 }}
                >
                    <FiUserPlus size={12} /> {exp.followed ? 'Following' : 'Follow'}
                </button>
            </div>

            {/* Company */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: exp.companyColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FiBriefcase size={16} color={t.textMuted} />
                </div>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: t.textPrimary, lineHeight: 1.2 }}>{exp.company} — {exp.role}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                        <VerdictBadge verdict={exp.verdict} t={t} />
                        <DiffBadge diff={exp.diff} />
                        <span style={{ fontSize: 11, color: t.textMuted, display: 'flex', alignItems: 'center', gap: 3 }}><FiTarget size={11} /> {exp.rounds} rounds</span>
                        <span style={{ fontSize: 11, color: t.textMuted, display: 'flex', alignItems: 'center', gap: 3 }}><FiDollarSign size={11} /> {exp.ctc}</span>
                        <span style={{ fontSize: 11, color: t.textMuted, display: 'flex', alignItems: 'center', gap: 3 }}><FiMapPin size={11} /> {exp.campus === 'oncampus' ? 'On-campus' : 'Off-campus'}</span>
                    </div>
                </div>
            </div>

            {/* Preview */}
            <p style={{ fontSize: 13.5, color: t.textSecondary, lineHeight: 1.65, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {exp.preview}
            </p>
            <span style={{ fontSize: 12, color: t.cyan, fontWeight: 500 }}>Read full experience →</span>

            {/* Actions */}
            <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
                <button onClick={() => handleVote('up')} style={{ display: 'flex', alignItems: 'center', gap: 5, background: votes.up ? t.cyanDim : 'transparent', border: `1px solid ${votes.up ? t.borderGlow : 'transparent'}`, color: votes.up ? t.cyan : t.textMuted, padding: '5px 10px', borderRadius: 20, cursor: 'pointer', fontSize: 12.5, fontWeight: 500, transition: 'all 0.15s' }}
                    onMouseEnter={e => { if (!votes.up) e.currentTarget.style.background = t.cyanDim; }}
                    onMouseLeave={e => { if (!votes.up) e.currentTarget.style.background = 'transparent'; }}>
                    <FiArrowUp size={14} /> {totalUp}
                </button>
                <button onClick={() => handleVote('down')} style={{ display: 'flex', alignItems: 'center', gap: 5, background: votes.down ? 'rgba(244,63,94,0.1)' : 'transparent', border: `1px solid ${votes.down ? 'rgba(244,63,94,0.3)' : 'transparent'}`, color: votes.down ? '#f43f5e' : t.textMuted, padding: '5px 8px', borderRadius: 20, cursor: 'pointer', fontSize: 12.5, transition: 'all 0.15s' }}>
                    <FiArrowDown size={14} />
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'transparent', border: '1px solid transparent', color: t.textMuted, padding: '5px 10px', borderRadius: 20, cursor: 'pointer', fontSize: 12.5, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = t.cyanDim; e.currentTarget.style.color = t.cyan; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.textMuted; }}>
                    <FiMessageSquare size={14} /> {exp.comments}
                </button>
                <button onClick={() => onSave(exp.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: exp.saved ? t.cyanDim : 'transparent', border: `1px solid ${exp.saved ? t.borderGlow : 'transparent'}`, color: exp.saved ? t.cyan : t.textMuted, padding: '5px 10px', borderRadius: 20, cursor: 'pointer', fontSize: 12.5, transition: 'all 0.15s', marginLeft: 'auto' }}>
                    <FiBookmark size={14} style={{ fill: exp.saved ? 'currentColor' : 'none' }} />
                    {exp.saved ? 'Saved' : 'Save'}
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'transparent', border: '1px solid transparent', color: t.textMuted, padding: '5px 8px', borderRadius: 20, cursor: 'pointer', fontSize: 12.5, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = t.cyanDim; e.currentTarget.style.color = t.cyan; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.textMuted; }}>
                    <FiShare2 size={14} />
                </button>
            </div>
        </article>
    );
}

/* ─── FILTER BAR ─────────────────────────────────────────── */
function FilterBar({ filters, setFilters, t }) {
    const [open, setOpen] = useState(false);

    const Pill = ({ label, options, key2 }) => (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(open === key2 ? false : key2)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: filters[key2] !== 'All' ? t.cyanDim : t.elevated, border: `1px solid ${filters[key2] !== 'All' ? t.borderGlow : t.border}`, color: filters[key2] !== 'All' ? t.cyan : t.textSecondary, padding: '6px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', transition: 'all 0.2s' }}
            >
                {label}: <span style={{ fontWeight: 700 }}>{filters[key2]}</span>
                <FiChevronDown size={12} style={{ transform: open === key2 ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {open === key2 && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 50, background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 10, padding: '6px 4px', minWidth: 140, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', animation: 'fadeUp 0.15s ease' }}>
                    {options.map(opt => (
                        <button key={opt} onClick={() => { setFilters(f => ({ ...f, [key2]: opt })); setOpen(false); }}
                            style={{ display: 'block', width: '100%', textAlign: 'left', background: filters[key2] === opt ? t.cyanDim : 'none', color: filters[key2] === opt ? t.cyan : t.textSecondary, border: 'none', padding: '7px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 12.5, fontFamily: "'Sora', sans-serif" }}>
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '10px 16px', borderBottom: `1px solid ${t.border}`, background: t.surface }}>
            <FiFilter size={14} color={t.textMuted} />
            <Pill label="Company" options={COMPANIES} key2="company" />
            <Pill label="Verdict" options={VERDICTS} key2="verdict" />
            <Pill label="Difficulty" options={DIFFICULTIES} key2="diff" />
            <Pill label="Type" options={TYPES} key2="type" />
            <Pill label="Campus" options={CAMPUS_TYPES} key2="campus" />
        </div>
    );
}

/* ─── HOME FEED ──────────────────────────────────────────── */
const HomeFeed = ({ t, dark, onOpenDetail }) => {
    const [tab, setTab] = useState('foryou');
    const [loading, setLoading] = useState(true);
    const [experiences, setExperiences] = useState(MOCK_EXPERIENCES);
    const [filters, setFilters] = useState({ company: 'All', verdict: 'All', diff: 'All', type: 'All', campus: 'All' });

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(timer);
    }, [tab]);

    const displayed = (tab === 'following' ? experiences.filter(e => e.followed) : experiences).filter(e => {
        if (filters.company !== 'All' && e.company !== filters.company) return false;
        if (filters.verdict !== 'All' && e.verdict !== filters.verdict.toLowerCase()) return false;
        if (filters.diff !== 'All') { const map = { Easy: 'easy', Medium: 'med', Hard: 'hard' }; if (e.diff !== map[filters.diff]) return false; }
        if (filters.type !== 'All' && e.type !== filters.type.toLowerCase()) return false;
        if (filters.campus !== 'All') { const map = { 'On-campus': 'oncampus', 'Off-campus': 'offcampus' }; if (e.campus !== map[filters.campus]) return false; }
        return true;
    });

    const handleSave = (id) => setExperiences(prev => prev.map(e => e.id === id ? { ...e, saved: !e.saved } : e));
    const handleFollow = (id) => setExperiences(prev => prev.map(e => e.id === id ? { ...e, followed: !e.followed } : e));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: t.surface }}>

            {/* Sticky header — uses t.surface so it's white in light mode, dark in dark mode */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: t.surface,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: `1px solid ${t.border}`,
            }}>
                <div style={{ padding: '14px 20px 0' }}>
                    <h1 style={{ fontSize: 20, fontWeight: 800, color: t.textPrimary, marginBottom: 12 }}>Home</h1>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 0 }}>
                        {[['foryou', 'For You'], ['following', 'Following']].map(([id, label]) => (
                            <button key={id} onClick={() => setTab(id)} style={{ background: 'none', border: 'none', color: tab === id ? t.textPrimary : t.textMuted, fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: tab === id ? 700 : 400, padding: '0 20px 12px', cursor: 'pointer', position: 'relative', transition: 'color 0.2s' }}>
                                {label}
                                {tab === id && (
                                    <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 40, height: 3, borderRadius: 2, background: t.cyan, boxShadow: `0 0 10px ${t.cyan}` }} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <FilterBar filters={filters} setFilters={setFilters} t={t} />
            </div>

            {/* Feed */}
            {loading ? (
                <div>{[1, 2, 3].map(i => <ShimmerCard key={i} t={t} />)}</div>
            ) : displayed.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ color: t.textMuted, marginBottom: 8 }}><FiSearch size={40} style={{ opacity: 0.4 }} /></div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: t.textPrimary }}>{tab === 'following' ? 'No experiences from people you follow' : 'No experiences found'}</div>
                    <div style={{ fontSize: 13, color: t.textMuted, marginTop: 6 }}>Try adjusting your filters</div>
                </div>
            ) : (
                displayed.map(exp => (
                    <ExperienceCard key={exp.id} exp={exp} t={t} dark={dark} onOpen={onOpenDetail} onSave={handleSave} onFollow={handleFollow} />
                ))
            )}
        </div>
    );
};

export default HomeFeed;
