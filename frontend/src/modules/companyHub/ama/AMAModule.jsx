import React, { useState } from 'react';
import { FiThumbsUp, FiMessageSquare, FiClock, FiRadio } from 'react-icons/fi';

const AMA_SESSIONS = [
    {
        id: 1, host: 'Sneha Kumar', hostRole: 'SDE II · Razorpay', av: 'S', avBg: 'linear-gradient(135deg,#4DB4F5,#10b981)',
        topic: 'Cracking the Antigravity System Design Round', isLive: true,
        questions: [
            { id: 1, question: 'What resources did you use for system design prep?', upvotes: 34, answered: true, answer: 'Mainly Grokking System Design + Alex Xu\'s book. Focus on trade-offs, not memorising templates.' },
            { id: 2, question: 'How important is the behavioral round for AG?', upvotes: 21, answered: false },
            { id: 3, question: 'Did they test low-level design or only high-level?', upvotes: 18, answered: false },
        ],
    },
];

const AMAModule = ({ companyData, t }) => {
    const [upvoted, setUpvoted] = useState({});
    const [newQuestion, setNewQuestion] = useState('');
    const session = AMA_SESSIONS[0];

    return (
        <div style={{ flex: 1, overflowY: 'auto', padding: 32, background: t.bg }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: t.textPrimary, marginBottom: 6 }}>AMA Sessions</h2>
            <p style={{ fontSize: 13, color: t.textMuted, marginBottom: 28 }}>Ask selected mentors and seniors anything about {companyData.name}.</p>

            {/* Active Session */}
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
                {/* Session Header */}
                <div style={{ padding: '20px 24px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: session.avBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{session.av}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary }}>{session.host}</span>
                            <span style={{ fontSize: 11, color: t.textMuted }}>{session.hostRole}</span>
                            {session.isLive && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, background: 'rgba(239,68,68,0.12)', color: '#ef4444', padding: '2px 8px', borderRadius: 20 }}>
                                    <FiRadio size={10} /> LIVE
                                </span>
                            )}
                        </div>
                        <div style={{ fontSize: 13, color: t.textSecondary }}>{session.topic}</div>
                    </div>
                </div>

                {/* Questions */}
                <div style={{ padding: '0 24px 16px' }}>
                    {session.questions.map(q => (
                        <div key={q.id} style={{ paddingTop: 20, borderBottom: `1px solid ${t.border}` }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: q.answer ? 12 : 16 }}>
                                <button
                                    onClick={() => setUpvoted(p => ({ ...p, [q.id]: !p[q.id] }))}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: '6px 10px', borderRadius: 8, border: `1px solid ${upvoted[q.id] ? t.borderGlow : t.border}`, background: upvoted[q.id] ? t.cyanDim : t.elevated, color: upvoted[q.id] ? t.cyan : t.textMuted, cursor: 'pointer', flexShrink: 0 }}>
                                    <FiThumbsUp size={13} />
                                    <span style={{ fontSize: 10, fontWeight: 700 }}>{upvoted[q.id] ? q.upvotes + 1 : q.upvotes}</span>
                                </button>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, color: t.textPrimary, fontWeight: 500 }}>{q.question}</div>
                                </div>
                            </div>
                            {q.answered && q.answer && (
                                <div style={{ marginLeft: 52, padding: '10px 14px', background: t.elevated, borderLeft: `2px solid ${t.cyan}`, borderRadius: '0 8px 8px 0', marginBottom: 16 }}>
                                    <div style={{ fontSize: 11, color: t.cyan, fontWeight: 700, marginBottom: 4 }}>Answer</div>
                                    <div style={{ fontSize: 13, color: t.textSecondary }}>{q.answer}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Ask a question */}
                <div style={{ padding: '16px 24px', borderTop: `1px solid ${t.border}`, display: 'flex', gap: 10 }}>
                    <input
                        type="text"
                        value={newQuestion}
                        onChange={e => setNewQuestion(e.target.value)}
                        placeholder="Ask a question…"
                        style={{ flex: 1, background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 10, padding: '9px 14px', color: t.textPrimary, fontSize: 13, outline: 'none', fontFamily: "'Sora', sans-serif" }}
                    />
                    <button
                        onClick={() => setNewQuestion('')}
                        style={{ padding: '9px 18px', borderRadius: 10, background: t.cyan, color: '#000', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>
                        Ask
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AMAModule;
