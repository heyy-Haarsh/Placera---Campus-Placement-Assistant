import React, { useMemo, useState } from 'react';
import {
    FiArrowLeft, FiArrowUp, FiArrowDown, FiMessageSquare,
    FiBookmark, FiShare2, FiUserPlus, FiCheckCircle, FiXCircle,
    FiAward, FiClock, FiMapPin, FiDollarSign, FiTarget,
    FiCode, FiMessageCircle, FiAlertCircle, FiStar
} from 'react-icons/fi';

/* Full round data per company (extended mock) */
const ROUND_DATA = {
    1: {
        description: "The process started with a recruiter screen, followed by a 45-minute phone screen focused on trees and dynamic programming. The onsite loop included 2 coding rounds, 1 system design (distributed rate limiter at scale), 1 Googleyness round, and 1 hiring committee debrief. The entire process took 3 weeks from application to offer.",
        rounds: [
            {
                name: 'Recruiter Screen', dur: '30 min',
                desc: 'High-level resume walkthrough, motivation, timeline. Very relaxed atmosphere. Standard questions about past projects and why Google now.',
                questions: [],
            },
            {
                name: 'Phone Screen — DSA', dur: '45 min',
                desc: 'Two medium/hard problems. Interviewer was friendly but expected optimal solutions.',
                questions: [
                    'Serialize and Deserialize a Binary Tree (optimal space required)',
                    'DP — Coin Change variant with additional constraints',
                ],
            },
            {
                name: 'Onsite Round 1 — Coding', dur: '60 min',
                desc: "Graph problem with follow-ups. I used Kosaraju's algorithm for SCCs — the interviewer was clearly impressed.",
                questions: [
                    'Detect cycle in a directed graph',
                    'Topological sort extension',
                    'Find all Strongly Connected Components (bonus follow-up)',
                ],
            },
            {
                name: 'Onsite Round 2 — System Design', dur: '60 min',
                desc: 'Design a distributed rate limiter at Google scale. They pushed hard on CAP theorem trade-offs and failure modes.',
                questions: [
                    'Design a distributed rate limiter at Google scale',
                    'How do you handle Redis cluster failure?',
                    'CAP theorem: what trade-offs does your design make?',
                ],
            },
            {
                name: 'Googleyness & Leadership', dur: '45 min',
                desc: 'Standard behavioral focused on Google values. Know your STAR stories cold.',
                questions: [
                    'Tell me about a time you disagreed with a technical decision',
                    'How did you handle ambiguity in a project?',
                    'Describe a time you worked across teams',
                ],
            },
        ],
        advice: [
            'Practice explaining design decisions aloud — they care as much about reasoning as the solution.',
            "Know CAP theorem cold with concrete examples (Spanner vs Bigtable trade-offs).",
            'For Googleyness, prepare 3–4 stories that map to multiple values.',
            'Ask clarifying questions in system design before jumping in — shows maturity.',
        ],
    },
    2: {
        description: "Got referred through a friend on the team. Phone screen was a LeetCode hard — a sliding window variant with a key optimization. Passed to onsite: two coding rounds, one system design (Instagram feed), and one behavioral. I was rattled after the system design round and it showed in behavioral.",
        rounds: [
            {
                name: 'Referral + Recruiter Call', dur: '20 min',
                desc: 'Referred through an IIT alumnus on the team. Recruiter explained E3 vs E4 leveling. Scheduling was fast — 1 week to phone screen.',
                questions: [],
            },
            {
                name: 'Phone Screen — LeetCode Hard', dur: '45 min',
                desc: 'A tricky sliding window problem that required prefix sums and a deque optimization. Many candidates fail here.',
                questions: [
                    'Find the minimum length subarray with sum ≥ K (with negative numbers)',
                    'Optimize using prefix sums + monotonic deque',
                ],
            },
            {
                name: 'Onsite Coding 1 — Arrays & Strings', dur: '60 min',
                desc: 'Two problems, both solved optimally. Follow-ups on time/space complexity were thorough.',
                questions: [
                    'Merge intervals extension (with weighted intervals)',
                    'Search in rotated sorted array with duplicates',
                ],
            },
            {
                name: 'Onsite Coding 2 — Graphs', dur: '60 min',
                desc: 'Two graph problems, both solved cleanly.',
                questions: [
                    'Clone a graph with random pointers',
                    'Number of islands variant with diagonal connectivity',
                ],
            },
            {
                name: 'System Design — Instagram Feed', dur: '60 min',
                desc: "My weak area. I proposed pull-based feed but didn't go deep enough on the celebrity problem for accounts with 100M followers.",
                questions: [
                    'Design Instagram feed at scale',
                    'How do you handle celebrities with 100M followers?',
                    'Hybrid push/pull architecture trade-offs',
                ],
            },
            {
                name: 'Behavioral', dur: '45 min',
                desc: "Meta values: Move Fast, Be Bold, Be Open. Had solid stories but was shaken after the SD round.",
                questions: [
                    'Tell me about a time you moved fast and broke something',
                    'How do you handle failure openly with your team?',
                ],
            },
        ],
        advice: [
            'Know the celebrity problem in feed design — hybrid push/pull is what Meta wants.',
            'LeetCode Hard is real — practice sliding window, monotonic stacks, and segment trees.',
            "Don't let one bad round affect the next — compartmentalize mentally.",
            "Read Meta engineering blog posts before interviewing — shows genuine interest.",
        ],
    },
};

function VerdictBadge({ verdict, t }) {
    const cfg = {
        selected: { bg: t.cyanDim, color: t.cyan, icon: <FiCheckCircle size={14} />, label: 'Offer Received' },
        rejected: { bg: 'rgba(244,63,94,0.12)', color: '#f43f5e', icon: <FiXCircle size={14} />, label: 'Not Selected' },
        intern: { bg: 'rgba(249,115,22,0.12)', color: '#f97316', icon: <FiAward size={14} />, label: 'Intern Offer' },
    }[verdict] || {};
    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: cfg.bg, color: cfg.color,
            padding: '8px 16px', borderRadius: 10, fontWeight: 600, fontSize: 14,
        }}>
            {cfg.icon} {cfg.label}
        </div>
    );
}

const ExperienceDetail = ({ exp, t, dark, onBack }) => {
    const [votes, setVotes] = useState({ up: false, down: false });
    const [saved, setSaved] = useState(exp.saved || false);
    const [followed, setFollowed] = useState(exp.followed || false);
    const [openRound, setOpenRound] = useState(0);
    const roundData = useMemo(() => {
        const rawRounds = Array.isArray(exp.rounds) ? exp.rounds : [];
        if (rawRounds.length) {
            const normalizedRounds = rawRounds.map((r, idx) => {
                const questionList = Array.isArray(r.questions)
                    ? r.questions.filter(Boolean)
                    : typeof r.questions === 'string'
                        ? r.questions
                            .split(/\n|;|•/g)
                            .map(s => s.trim())
                            .filter(Boolean)
                        : [];
                return {
                    name: r.name || `Round ${idx + 1}`,
                    dur: r.dur || r.duration || '45 min',
                    desc: r.desc || r.description || 'Interview round details were shared by the candidate.',
                    questions: questionList,
                };
            });

            const advice = Array.isArray(exp.advice)
                ? exp.advice.filter(Boolean)
                : typeof exp.advice === 'string'
                    ? exp.advice
                        .split(/\n|;|•/g)
                        .map(s => s.trim())
                        .filter(Boolean)
                    : [];

            const description = exp.description
                || exp.preview
                || normalizedRounds[0]?.desc
                || 'Candidate shared their interview flow and preparation insights below.';

            return { description, rounds: normalizedRounds, advice };
        }

        return ROUND_DATA[exp.id] || ROUND_DATA[1];
    }, [exp]);

    const totalUp = exp.upvotes + (votes.up ? 1 : 0) - (votes.down ? 1 : 0);
    const handleVote = (dir) => setVotes(v => ({ up: dir === 'up' ? !v.up : false, down: dir === 'down' ? !v.down : false }));

    return (
        <div style={{ animation: 'fadeUp 0.3s ease both', background: t.surface, minHeight: '100vh' }}>

            {/* Top bar */}
            <div className="glass-tab-bar" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                    onClick={onBack}
                    style={{
                        background: t.elevated, border: `1px solid ${t.border}`,
                        color: t.textPrimary, borderRadius: 10, padding: '7px 12px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = t.borderGlow}
                    onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
                >
                    <FiArrowLeft size={16} /> Back
                </button>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: t.textPrimary }}>
                    {exp.company} — {exp.role}
                </h2>
            </div>

            <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 80px' }}>

                {/* Header card */}
                <div style={{
                    background: t.card, border: `1px solid ${t.border}`, borderRadius: 16,
                    padding: 24, marginBottom: 20,
                }}>
                    {/* Author */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{
                            width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                            background: exp.authorGrad,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16, fontWeight: 700, color: '#fff',
                        }}>
                            {exp.authorInit}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary }}>{exp.author}</div>
                            <div style={{ fontSize: 12.5, color: t.textMuted }}>{exp.college} · {exp.timeago}</div>
                        </div>
                        <button
                            onClick={() => setFollowed(f => !f)}
                            style={{
                                background: followed ? t.cyanDim : 'none',
                                border: `1px solid ${followed ? t.borderGlow : t.border}`,
                                color: followed ? t.cyan : t.textSecondary,
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '7px 14px', borderRadius: 20, cursor: 'pointer',
                                fontSize: 12.5, fontWeight: 600, transition: 'all 0.2s',
                            }}
                        >
                            <FiUserPlus size={14} /> {followed ? 'Following' : 'Follow'}
                        </button>
                    </div>

                    {/* Company + verdict */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                            background: exp.companyColor,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <FiTarget size={24} color={t.textSecondary} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: t.textPrimary, marginBottom: 6 }}>
                                {exp.company}
                            </div>
                            <div style={{ fontSize: 14, color: t.textSecondary, marginBottom: 10 }}>{exp.role}</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                <VerdictBadge verdict={exp.verdict} t={t} />
                                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: t.textMuted, background: t.elevated, padding: '6px 12px', borderRadius: 8 }}>
                                    <FiTarget size={13} /> {(exp.roundsCount ?? (Array.isArray(exp.rounds) ? exp.rounds.length : exp.rounds || 0))} Rounds
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: t.textMuted, background: t.elevated, padding: '6px 12px', borderRadius: 8 }}>
                                    <FiDollarSign size={13} /> {exp.ctc}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: t.textMuted, background: t.elevated, padding: '6px 12px', borderRadius: 8 }}>
                                    <FiMapPin size={13} /> {exp.campus === 'oncampus' ? 'On-campus' : 'Off-campus'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Full description */}
                    <p style={{ fontSize: 14.5, color: t.textSecondary, lineHeight: 1.75 }}>
                        {roundData.description}
                    </p>
                </div>

                {/* Round-by-round breakdown */}
                <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.textMuted, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiTarget size={14} /> Interview Rounds
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {roundData.rounds.map((round, i) => (
                            <div
                                key={i}
                                style={{
                                    background: t.card, border: `1px solid ${openRound === i ? t.borderGlow : t.border}`,
                                    borderRadius: 12, overflow: 'hidden',
                                    transition: 'border-color 0.2s',
                                }}
                            >
                                <button
                                    onClick={() => setOpenRound(openRound === i ? -1 : i)}
                                    style={{
                                        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                                        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                                    }}
                                >
                                    <div style={{
                                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                                        background: openRound === i ? t.cyanDim : t.elevated,
                                        color: openRound === i ? t.cyan : t.textMuted,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, fontWeight: 700, transition: 'all 0.2s',
                                    }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary }}>{round.name}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: t.textMuted }}>
                                        <FiClock size={12} /> {round.dur}
                                    </div>
                                </button>
                                {openRound === i && (
                                    <div style={{ padding: '0 16px 16px', animation: 'fadeUp 0.2s ease' }}>
                                        <p style={{ fontSize: 13.5, color: t.textSecondary, lineHeight: 1.65, marginBottom: round.questions.length ? 14 : 0 }}>
                                            {round.desc}
                                        </p>
                                        {round.questions.length > 0 && (
                                            <div>
                                                <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.textMuted, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <FiCode size={12} /> Questions Asked
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                    {round.questions.map((q, j) => (
                                                        <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                                            <span style={{ color: t.cyan, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
                                                            <span style={{ fontSize: 13.5, color: t.textSecondary, lineHeight: 1.55 }}>{q}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Advice to Juniors */}
                <div style={{
                    background: t.card, border: `1px solid ${t.border}`, borderRadius: 12,
                    padding: 20, marginBottom: 20,
                }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.textMuted, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiStar size={14} /> Advice to Juniors
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {roundData.advice.map((tip, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <span style={{ color: t.cyan, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>→</span>
                                <span style={{ fontSize: 13.5, color: t.textSecondary, lineHeight: 1.65 }}>{tip}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comments placeholder */}
                <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.textMuted, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiMessageCircle size={14} /> Comments ({exp.comments})
                    </h3>
                    <div style={{
                        background: t.elevated, border: `1px solid ${t.border}`,
                        borderRadius: 10, padding: '12px 14px',
                        display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16,
                    }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg, ${t.cyan}, #6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#000', flexShrink: 0 }}>A</div>
                        <input
                            type="text" placeholder="Add a comment…"
                            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13.5, color: t.textPrimary, fontFamily: "'Sora', sans-serif" }}
                        />
                    </div>
                    <div style={{ fontSize: 13, color: t.textMuted }}>
                        No comments yet for this experience.
                    </div>
                </div>
            </div>

            {/* Sticky bottom action bar */}
            <div className="glass-tab-bar" style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
                padding: '10px 20px', display: 'flex', justifyContent: 'center',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, maxWidth: 480, width: '100%' }}>
                    <button onClick={() => handleVote('up')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: votes.up ? t.cyanDim : t.elevated, border: `1px solid ${votes.up ? t.borderGlow : t.border}`, color: votes.up ? t.cyan : t.textSecondary, padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}>
                        <FiArrowUp size={15} /> {totalUp}
                    </button>
                    <button onClick={() => handleVote('down')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: votes.down ? 'rgba(244,63,94,0.1)' : t.elevated, border: `1px solid ${votes.down ? 'rgba(244,63,94,0.3)' : t.border}`, color: votes.down ? '#f43f5e' : t.textSecondary, padding: '8px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 13, transition: 'all 0.2s' }}>
                        <FiArrowDown size={15} />
                    </button>
                    <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: t.elevated, border: `1px solid ${t.border}`, color: t.textSecondary, padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13, transition: 'all 0.2s' }}>
                        <FiMessageSquare size={15} /> {exp.comments} Comments
                    </button>
                    <button onClick={() => setSaved(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: saved ? t.cyanDim : t.elevated, border: `1px solid ${saved ? t.borderGlow : t.border}`, color: saved ? t.cyan : t.textSecondary, padding: '8px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}>
                        <FiBookmark size={15} style={{ fill: saved ? 'currentColor' : 'none' }} /> {saved ? 'Saved' : 'Save'}
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: t.elevated, border: `1px solid ${t.border}`, color: t.textSecondary, padding: '8px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 13, transition: 'all 0.2s' }}>
                        <FiShare2 size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExperienceDetail;
