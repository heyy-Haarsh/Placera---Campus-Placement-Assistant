import React from 'react';
import { FiCalendar, FiUser, FiClock, FiStar } from 'react-icons/fi';

const MOCK_MENTORS = [
    { name: 'Riya Desai', role: 'SDE II · Google', av: 'R', avBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', slots: 2 },
    { name: 'Priya Nair', role: 'Mentor · Flipkart', av: 'P', avBg: 'linear-gradient(135deg,#10b981,#4DB4F5)', slots: 3 },
    { name: 'Arjun Sharma', role: 'SDE III · Microsoft', av: 'A', avBg: 'linear-gradient(135deg,#f59e0b,#8b5cf6)', slots: 1 },
];

const MockModule = ({ companyData, t }) => (
    <div style={{ flex: 1, overflowY: 'auto', padding: 32, background: t.bg }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: t.textPrimary, marginBottom: 6 }}>Mock Arena</h2>
        <p style={{ fontSize: 13, color: t.textMuted, marginBottom: 28 }}>Book 1:1 mock interviews with verified mentors for {companyData.name}.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {MOCK_MENTORS.map((mentor, i) => (
                <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20 }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: mentor.avBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff' }}>{mentor.av}</div>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary }}>{mentor.name}</div>
                            <div style={{ fontSize: 11, color: t.textMuted }}>{mentor.role}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: t.textSecondary, marginBottom: 16 }}>
                        <FiClock size={13} style={{ color: t.cyan }} />
                        <span>{mentor.slots} slots available this week</span>
                    </div>
                    <button style={{ width: '100%', padding: '9px 0', border: 'none', borderRadius: 10, background: t.cyanDim, color: t.cyan, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'Sora', sans-serif", border: `1px solid ${t.borderGlow}` }}>
                        Book Session
                    </button>
                </div>
            ))}
        </div>
    </div>
);

export default MockModule;
