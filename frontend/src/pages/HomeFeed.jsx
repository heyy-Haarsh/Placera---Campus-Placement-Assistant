import React, { useState, useEffect, useCallback } from 'react';
import {
    FiArrowUp, FiArrowDown, FiMessageSquare, FiBookmark,
    FiUserPlus, FiShare2, FiFilter, FiChevronDown,
    FiMapPin, FiClock, FiAward, FiCheckCircle, FiXCircle,
    FiSearch, FiBriefcase, FiDollarSign, FiTarget,
} from 'react-icons/fi';
import { fetchExperiences, voteExperience } from '../services/experienceApi';

const COMPANIES = ['All', 'Google', 'Meta', 'Amazon', 'Microsoft', 'Flipkart', 'Stripe', 'Uber', 'Atlassian', 'Barclays', 'TCS', 'Infosys', 'Wipro', 'Persistent', 'Cognizant'];
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

    const roundsCount = exp.roundsCount ?? (Array.isArray(exp.rounds) ? exp.rounds.length : Number(exp.rounds) || 0);

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
                        <span style={{ fontSize: 11, color: t.textMuted, display: 'flex', alignItems: 'center', gap: 3 }}><FiTarget size={11} /> {roundsCount} rounds</span>
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
    const [companySearch, setCompanySearch] = useState('');

    const ALL_COMPANIES = ['All', 'Google', 'Meta', 'Amazon', 'Microsoft', 'Flipkart', 'Stripe', 'Uber',
        'Atlassian', 'Barclays', 'HSBC', 'Deutsche Bank', 'TCS', 'Infosys', 'Wipro',
        'Persistent Systems', 'Persistent', 'Cognizant', 'Accenture', 'Goldman Sachs', 'JPMorgan',
        'Adobe', 'Walmart', 'NVIDIA', 'Qualcomm', 'Samsung', 'Cisco', 'Oracle'];

    const filteredCompanies = companySearch.trim()
        ? ALL_COMPANIES.filter(c => c.toLowerCase().includes(companySearch.toLowerCase()))
        : ALL_COMPANIES;

    // Searchable company pill
    const CompanyPill = () => {
        const active = filters.company !== 'All';
        return (
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => { setOpen(open === 'company' ? false : 'company'); setCompanySearch(''); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: active ? t.cyanDim : t.elevated, border: `1px solid ${active ? t.borderGlow : t.border}`, color: active ? t.cyan : t.textSecondary, padding: '6px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                >
                    🏢 Company: <span style={{ fontWeight: 700 }}>{filters.company}</span>
                    <FiChevronDown size={12} style={{ transform: open === 'company' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {open === 'company' && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 100, background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.4)', width: 220, animation: 'fadeUp 0.15s ease' }}>
                        {/* Search box */}
                        <div style={{ padding: '8px 8px 4px', borderBottom: `1px solid ${t.border}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: `1px solid ${t.border}`, borderRadius: 8, padding: '5px 10px' }}>
                                <FiSearch size={12} color={t.textMuted} />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search company…"
                                    value={companySearch}
                                    onChange={e => setCompanySearch(e.target.value)}
                                    style={{ background: 'none', border: 'none', outline: 'none', color: t.textPrimary, fontSize: 12, fontFamily: "'Sora', sans-serif", flex: 1, width: '100%' }}
                                />
                                {companySearch && (
                                    <button onClick={() => setCompanySearch('')} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: 11, padding: 0 }}>✕</button>
                                )}
                            </div>
                        </div>
                        {/* Options list */}
                        <div style={{ maxHeight: 220, overflowY: 'auto', padding: '4px' }}>
                            {filteredCompanies.length === 0 ? (
                                <div style={{ padding: '10px', fontSize: 12, color: t.textMuted, textAlign: 'center' }}>No match</div>
                            ) : filteredCompanies.map(opt => (
                                <button key={opt} onClick={() => { setFilters(f => ({ ...f, company: opt })); setOpen(false); setCompanySearch(''); }}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', textAlign: 'left', background: filters.company === opt ? t.cyanDim : 'none', color: filters.company === opt ? t.cyan : t.textSecondary, border: 'none', padding: '7px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 12.5, fontFamily: "'Sora', sans-serif" }}>
                                    {opt}
                                    {filters.company === opt && <span style={{ fontSize: 10 }}>✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

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

    // Close dropdown when clicking outside
    const ref = React.useRef();
    React.useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '10px 16px', borderBottom: `1px solid ${t.border}`, background: t.surface }}>
            <FiFilter size={14} color={t.textMuted} />
            <CompanyPill />
            <Pill label="Verdict" options={VERDICTS} key2="verdict" />
            <Pill label="Difficulty" options={DIFFICULTIES} key2="diff" />
            <Pill label="Type" options={TYPES} key2="type" />
            <Pill label="Campus" options={CAMPUS_TYPES} key2="campus" />
            {(filters.company !== 'All' || filters.verdict !== 'All' || filters.diff !== 'All' || filters.type !== 'All' || filters.campus !== 'All') && (
                <button onClick={() => setFilters({ company: 'All', verdict: 'All', diff: 'All', type: 'All', campus: 'All' })}
                    style={{ fontSize: 11, color: '#f43f5e', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 20, padding: '4px 10px', cursor: 'pointer' }}>
                    ✕ Clear filters
                </button>
            )}
        </div>
    );
}

/* ─── HOME FEED ──────────────────────────────────────────── */
const HomeFeed = ({ t, dark, onOpenDetail, refreshKey = 0 }) => {
    const [tab, setTab] = useState('foryou');
    const [loading, setLoading] = useState(true);
    const [experiences, setExperiences] = useState([]);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({ company: 'All', verdict: 'All', diff: 'All', type: 'All', campus: 'All' });
    const [error, setError] = useState('');

    // Normalize API doc → card shape
    const normalize = (exp) => ({
        id: exp._id,
        _id: exp._id,
        author: exp.author || 'Anonymous',
        authorInit: exp.authorInit || 'A',
        authorGrad: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        college: exp.college || '',
        company: exp.company,
        role: exp.role,
        ctc: exp.ctc || '',
        verdict: exp.verdict,
        diff: exp.diff,
        type: exp.type,
        campus: exp.campus,
        timeago: exp.createdAt ? new Date(exp.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '',
        advice: exp.advice || '',
        description: exp.description || '',
        rounds: Array.isArray(exp.rounds) ? exp.rounds : [],
        roundsCount: exp.rounds?.length || 0,
        preview: exp.advice || (exp.rounds?.[0]?.desc) || '',
        upvotes: exp.upvotes || 0,
        downvotes: exp.downvotes || 0,
        comments: exp.comments || 0,
        saved: false,
        followed: false,
        companyColor: 'rgba(6,182,212,0.15)',
    });

    const loadExperiences = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const apiFilters = {};
            if (filters.company !== 'All') apiFilters.company = filters.company;
            if (filters.verdict !== 'All') apiFilters.verdict = filters.verdict;
            if (filters.diff !== 'All') apiFilters.diff = filters.diff;
            if (filters.type !== 'All') apiFilters.type = filters.type;
            if (filters.campus !== 'All') apiFilters.campus = filters.campus;
            const data = await fetchExperiences(apiFilters);
            setExperiences((data.experiences || []).map(normalize));
            setTotal(data.total || 0);
        } catch (err) {
            setError('Could not load experiences. Is the server running?');
        } finally {
            setLoading(false);
        }
    }, [filters, refreshKey]);

    useEffect(() => { loadExperiences(); }, [loadExperiences]);

    const displayed = tab === 'following' ? experiences.filter(e => e.followed) : experiences;

    const handleSave = (id) => setExperiences(prev => prev.map(e => e.id === id ? { ...e, saved: !e.saved } : e));
    const handleFollow = (id) => setExperiences(prev => prev.map(e => e.id === id ? { ...e, followed: !e.followed } : e));
    const handleVoteResult = (id, result) => {
        setExperiences(prev => prev.map(e => e.id === id ? { ...e, upvotes: result.upvotes, downvotes: result.downvotes } : e));
    };

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

            {/* Error */}
            {error && (
                <div style={{ padding: '10px 20px', background: 'rgba(244,63,94,0.1)', borderBottom: `1px solid rgba(244,63,94,0.2)`, color: '#f43f5e', fontSize: 13 }}>
                    ⚠ {error}
                </div>
            )}

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
                <>
                    <div style={{ padding: '8px 20px', fontSize: 12, color: t.textMuted, borderBottom: `1px solid ${t.border}` }}>
                        {total} experience{total !== 1 ? 's' : ''} · showing {displayed.length}
                    </div>
                    {displayed.map(exp => (
                        <ExperienceCard key={exp.id} exp={exp} t={t} dark={dark} onOpen={onOpenDetail} onSave={handleSave} onFollow={handleFollow} onVoteResult={handleVoteResult} />
                    ))}
                </>
            )}
        </div>
    );
};

export default HomeFeed;
