import React, { useState } from 'react';
import {
    FiUploadCloud, FiThumbsUp, FiExternalLink, FiStar,
    FiCheckCircle, FiSearch, FiFilter, FiBook,
    FiCode, FiLayout, FiFileText, FiLink
} from 'react-icons/fi';

// Structured mock data matching the CompanyResource schema
const RESOURCES = [
    {
        id: 1, category: 'System Design', title: 'AG System Design Breakdown 2025',
        link: '#', uploadedBy: 'Priya Nair', uploadedByRole: 'Mentor · Flipkart',
        upvotes: 112, tags: ['System Design', 'Round 2', 'Must Read'],
        verified: true, isPinned: true,
    },
    {
        id: 2, category: 'DSA', title: 'AG DSA Pattern Analysis — Top 5 Patterns',
        link: '#', uploadedBy: 'Dev Patel', uploadedByRole: 'SDE · Atlassian',
        upvotes: 89, tags: ['DSA', 'Graphs', 'DP'],
        verified: true, isPinned: false,
    },
    {
        id: 3, category: 'Behavioral', title: 'Culture Fit & Behavioral Round Guide',
        link: '#', uploadedBy: 'Arjun Sharma', uploadedByRole: 'SDE III · Microsoft',
        upvotes: 64, tags: ['Behavioral', 'Round 3', 'Culture'],
        verified: false, isPinned: false,
    },
    {
        id: 4, category: 'OA', title: 'AG Online Assessment — Previous Questions (2024)',
        link: '#', uploadedBy: 'Riya Desai', uploadedByRole: 'SDE II · Google',
        upvotes: 201, tags: ['OA', 'Questions', 'Practice'],
        verified: true, isPinned: false,
    },
    {
        id: 5, category: 'System Design', title: 'Real-Time Leaderboard — Full Design Doc',
        link: '#', uploadedBy: 'Sneha Kumar', uploadedByRole: 'SDE II · Razorpay',
        upvotes: 78, tags: ['System Design', 'Redis', 'Websockets'],
        verified: false, isPinned: false,
    },
];

const CATEGORIES = ['All', 'System Design', 'DSA', 'Behavioral', 'OA'];
const CATEGORY_ICONS = {
    'System Design': <FiLayout size={14} />,
    DSA: <FiCode size={14} />,
    Behavioral: <FiBook size={14} />,
    OA: <FiFileText size={14} />,
};

const ResourcesModule = ({ companyData, t }) => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [upvoted, setUpvoted] = useState({});

    const filtered = RESOURCES.filter(r => {
        const matchCat = activeCategory === 'All' || r.category === activeCategory;
        const matchQ = r.title.toLowerCase().includes(searchQuery.toLowerCase())
            || r.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCat && matchQ;
    });

    const pinned = filtered.filter(r => r.isPinned);
    const regular = filtered.filter(r => !r.isPinned);

    const toggleUpvote = (id) => setUpvoted(p => ({ ...p, [id]: !p[id] }));

    const ResourceCard = ({ resource }) => (
        <div style={{
            background: t.card, border: `1px solid ${t.border}`,
            borderRadius: 14, padding: 20,
            display: 'flex', flexDirection: 'column', gap: 12,
            transition: 'border-color 0.2s',
            ...(resource.isPinned ? { borderColor: `${t.cyanDim}`, borderWidth: 1.5 } : {}),
        }}
            onMouseEnter={e => e.currentTarget.style.borderColor = t.borderGlow}
            onMouseLeave={e => e.currentTarget.style.borderColor = resource.isPinned ? t.cyanDim : t.border}
        >
            {/* Top Row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: t.elevated, border: `1px solid ${t.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: t.cyan, flexShrink: 0,
                }}>
                    {CATEGORY_ICONS[resource.category] || <FiLink size={14} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        {resource.isPinned && (
                            <span style={{ fontSize: 10, background: t.cyanDim, color: t.cyan, padding: '2px 7px', borderRadius: 20, fontWeight: 700, letterSpacing: '0.05em' }}>
                                PINNED
                            </span>
                        )}
                        {resource.verified && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, background: 'rgba(16,185,129,0.12)', color: '#10b981', padding: '2px 7px', borderRadius: 20, fontWeight: 700 }}>
                                <FiCheckCircle size={10} /> Verified
                            </span>
                        )}
                        <span style={{ fontSize: 11, color: t.textMuted }}>{resource.category}</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, lineHeight: 1.3, marginBottom: 4 }}>{resource.title}</h3>
                    <div style={{ fontSize: 12, color: t.textMuted }}>by {resource.uploadedBy} · {resource.uploadedByRole}</div>
                </div>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {resource.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: t.elevated, color: t.textSecondary, border: `1px solid ${t.border}` }}>
                        {tag}
                    </span>
                ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <button
                    onClick={() => toggleUpvote(resource.id)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', borderRadius: 8,
                        background: upvoted[resource.id] ? t.cyanDim : t.elevated,
                        border: `1px solid ${upvoted[resource.id] ? t.borderGlow : t.border}`,
                        color: upvoted[resource.id] ? t.cyan : t.textSecondary,
                        fontWeight: 600, fontSize: 13, cursor: 'pointer',
                        fontFamily: "'Sora', sans-serif", transition: 'all 0.15s',
                    }}
                >
                    <FiThumbsUp size={13} />
                    {upvoted[resource.id] ? resource.upvotes + 1 : resource.upvotes}
                </button>

                <a
                    href={resource.link}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', borderRadius: 8,
                        background: t.cyan, color: '#000',
                        fontWeight: 700, fontSize: 13, cursor: 'pointer',
                        textDecoration: 'none', transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    <FiExternalLink size={13} /> Open
                </a>
            </div>
        </div>
    );

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.bg, overflow: 'hidden' }}>
            {/* Top Toolbar */}
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: t.surface }}>
                {/* Search */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 10, padding: '8px 14px' }}>
                    <FiSearch size={14} style={{ color: t.textMuted, flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search resources…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ background: 'none', border: 'none', outline: 'none', color: t.textPrimary, fontSize: 13, width: '100%', fontFamily: "'Sora', sans-serif" }}
                    />
                </div>

                {/* Upload button */}
                <button style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '8px 16px', borderRadius: 10,
                    background: t.cyan, color: '#000',
                    border: 'none', cursor: 'pointer',
                    fontWeight: 700, fontSize: 13, fontFamily: "'Sora', sans-serif",
                }}>
                    <FiUploadCloud size={15} /> Upload
                </button>
            </div>

            {/* Category Filters */}
            <div style={{ padding: '12px 24px', borderBottom: `1px solid ${t.border}`, display: 'flex', gap: 8, flexShrink: 0, background: t.surface }}>
                {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                        padding: '6px 14px', borderRadius: 20, border: 'none',
                        background: activeCategory === cat ? t.cyanDim : t.elevated,
                        color: activeCategory === cat ? t.cyan : t.textMuted,
                        fontWeight: activeCategory === cat ? 700 : 400,
                        fontSize: 12, cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                        display: 'flex', alignItems: 'center', gap: 5,
                        border: `1px solid ${activeCategory === cat ? t.borderGlow : t.border}`,
                        transition: 'all 0.15s',
                    }}>
                        {CATEGORY_ICONS[cat]} {cat}
                    </button>
                ))}
            </div>

            {/* Cards Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                {pinned.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <FiStar size={14} style={{ color: t.cyan }} />
                            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.textMuted }}>Pinned</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                            {pinned.map(r => <ResourceCard key={r.id} resource={r} />)}
                        </div>
                    </div>
                )}

                {regular.length > 0 && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <FiFilter size={14} style={{ color: t.textMuted }} />
                            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.textMuted }}>All Resources ({regular.length})</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                            {regular.map(r => <ResourceCard key={r.id} resource={r} />)}
                        </div>
                    </div>
                )}

                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: t.textMuted }}>
                        <FiSearch size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                        <div style={{ fontSize: 15 }}>No resources found</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourcesModule;
