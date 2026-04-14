import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import HubLayout from '../modules/companyHub/components/HubLayout';

// Company data structures matching the Company backend schema
const COMPANIES = [
    {
        id: 'antigravity', label: 'AG', name: 'Antigravity',
        color: '#06b6d4', bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        members: 1240, online: 8,
        stats: { totalAppeared: 320, totalSelected: 48, avgRounds: 3.5 },
        description: 'AI-first deep tech company. Focused on DSA, system design, and culture fit.',
    },
    {
        id: 'google', label: 'G', name: 'Google',
        color: '#4285f4', bg: 'linear-gradient(135deg,#4285f4,#34a8eb)',
        members: 2410, online: 8,
        stats: { totalAppeared: 580, totalSelected: 61, avgRounds: 5 },
        description: 'Search giant. Rigorous OA + 4-5 rounds including System Design and Behavioral.',
    },
    {
        id: 'microsoft', label: 'M', name: 'Microsoft',
        color: '#0078d4', bg: 'linear-gradient(135deg,#0078d4,#00bcf2)',
        members: 1720, online: 5,
        stats: { totalAppeared: 410, totalSelected: 72, avgRounds: 4 },
        description: 'Azure-first. Focus on LLD, OOP principles, and cross-team collaboration culture.',
    },
    {
        id: 'amazon', label: 'A', name: 'Amazon',
        color: '#ff9900', bg: 'linear-gradient(135deg,#ff9900,#f59e0b)',
        members: 3100, online: 11,
        stats: { totalAppeared: 720, totalSelected: 89, avgRounds: 5 },
        description: 'LP-heavy. Leadership Principles are non-negotiable. Bar Raiser round involved.',
    },
    {
        id: 'meta', label: 'M', name: 'Meta',
        color: '#1877f2', bg: 'linear-gradient(135deg,#1877f2,#6366f1)',
        members: 1900, online: 7,
        stats: { totalAppeared: 385, totalSelected: 54, avgRounds: 4 },
        description: 'Product-focused. Emphasis on scalable infra systems and ML-aware coding.',
    },
];

const CompanyHubs = ({ t, dark, role }) => {
    const [activeCompanyId, setActiveCompanyId] = useState('antigravity');
    const activeCompany = COMPANIES.find(c => c.id === activeCompanyId) || COMPANIES[0];

    return (
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            {/* ── COMPANY SERVER SIDEBAR (far left) ── */}
            <div style={{
                width: 68, flexShrink: 0,
                background: t.elevated, borderRight: `1px solid ${t.border}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '14px 0', gap: 6, overflowY: 'auto',
            }}>
                <div style={{ width: 36, height: 2, background: t.border, borderRadius: 2, marginBottom: 6 }} />

                {COMPANIES.map(co => {
                    const isActive = activeCompanyId === co.id;
                    return (
                        <div key={co.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            {isActive && (
                                <div style={{
                                    position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)',
                                    width: 3, height: 28, background: t.textPrimary, borderRadius: '0 3px 3px 0',
                                }} />
                            )}
                            <button
                                onClick={() => setActiveCompanyId(co.id)}
                                title={co.name}
                                style={{
                                    width: 44, height: 44,
                                    borderRadius: isActive ? 14 : '50%',
                                    background: co.bg, border: 'none', cursor: 'pointer',
                                    fontSize: 14, fontWeight: 800, color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    boxShadow: isActive ? `0 0 0 2px ${t.cyan}` : 'none',
                                    fontFamily: "'Sora', sans-serif",
                                }}
                            >
                                {co.label}
                            </button>
                        </div>
                    );
                })}

                <div style={{ width: 36, height: 1, background: t.border, margin: '4px 0' }} />

                <button
                    title="Add Company Hub"
                    style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'transparent',
                        border: `2px dashed ${t.border}`,
                        cursor: 'pointer', color: t.textMuted,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = t.cyan; e.currentTarget.style.color = t.cyan; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}
                >
                    <FiPlus size={20} />
                </button>
            </div>

            {/* ── HUB LAYOUT (rest of the screen) ── */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <HubLayout
                    key={activeCompanyId}
                    companyId={activeCompanyId}
                    companyData={activeCompany}
                    t={t}
                    dark={dark}
                    role={role}
                />
            </div>
        </div>
    );
};

export default CompanyHubs;
