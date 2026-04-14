import React from 'react';
import { FiTrendingUp, FiUsers, FiCheckCircle, FiBarChart2 } from 'react-icons/fi';

const InsightsModule = ({ companyData, t }) => {
    const stats = companyData.stats || { totalAppeared: 0, totalSelected: 0, avgRounds: 0 };
    const selectionRate = stats.totalAppeared > 0
        ? ((stats.totalSelected / stats.totalAppeared) * 100).toFixed(1)
        : 0;

    const StatCard = ({ label, value, icon, accent }) => (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: '20px 24px', flex: 1, minWidth: 160 }}>
            <div style={{ color: accent || t.cyan, marginBottom: 10 }}>{icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: t.textPrimary }}>{value}</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>{label}</div>
        </div>
    );

    return (
        <div style={{ flex: 1, overflowY: 'auto', padding: 32, background: t.bg }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: t.textPrimary, marginBottom: 6 }}>{companyData.name} — Insights</h2>
            <p style={{ fontSize: 13, color: t.textMuted, marginBottom: 28 }}>{companyData.description}</p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
                <StatCard label="Total Appeared" value={stats.totalAppeared} icon={<FiUsers size={20} />} />
                <StatCard label="Total Selected" value={stats.totalSelected} icon={<FiCheckCircle size={20} />} accent="#10b981" />
                <StatCard label="Selection Rate" value={`${selectionRate}%`} icon={<FiTrendingUp size={20} />} />
                <StatCard label="Avg Rounds" value={stats.avgRounds} icon={<FiBarChart2 size={20} />} />
            </div>

            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary, marginBottom: 16 }}>Selection Funnel</div>
                {[
                    { label: 'Applied', pct: 100 },
                    { label: 'OA Cleared', pct: 60 },
                    { label: 'Interviews', pct: 35 },
                    { label: 'Offer', pct: Math.round(selectionRate) },
                ].map(({ label, pct }) => (
                    <div key={label} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: 12, color: t.textSecondary }}>{label}</span>
                            <span style={{ fontSize: 12, color: t.cyan, fontWeight: 700 }}>{pct}%</span>
                        </div>
                        <div style={{ height: 6, background: t.elevated, borderRadius: 10, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: t.cyan, borderRadius: 10, transition: 'width 0.5s ease' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InsightsModule;
