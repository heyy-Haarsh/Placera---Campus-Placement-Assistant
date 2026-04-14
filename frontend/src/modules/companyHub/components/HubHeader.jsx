import React from 'react';

const TABS = [
    { id: 'community', label: 'Community' },
    { id: 'insights', label: 'Insights' },
    { id: 'resources', label: 'Resources' },
    { id: 'mock', label: 'Mock Arena' },
    { id: 'ama', label: 'AMA' },
];

// Channel sidebar is 220px — company block must match to align tabs with chat
const CHANNEL_SIDEBAR_W = 220;

const HubHeader = ({ companyData, activeTab, setActiveTab, t }) => {
    return (
        <div style={{
            background: t.surface,
            borderBottom: `1px solid ${t.border}`,
            display: 'flex', alignItems: 'center',
            height: 60, flexShrink: 0,
        }}>
            {/* Company Identity — exactly 220px wide to match channel sidebar */}
            <div style={{
                width: CHANNEL_SIDEBAR_W, flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0 14px',
                borderRight: `1px solid ${t.border}`,
                height: '100%',
            }}>
                <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: companyData.bg, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, flexShrink: 0,
                }}>
                    {companyData.label}
                </div>
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: t.textPrimary, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {companyData.name}
                    </div>
                    <div style={{ fontSize: 10, color: t.textMuted, whiteSpace: 'nowrap' }}>
                        {companyData.members.toLocaleString()} · {companyData.online} online
                    </div>
                </div>
            </div>

            {/* Module Tabs — start exactly where the chat window begins */}
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', paddingLeft: 4 }}>
                {TABS.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                height: '100%', padding: '0 16px',
                                background: 'none', border: 'none',
                                color: isActive ? t.cyan : t.textMuted,
                                fontWeight: isActive ? 700 : 400,
                                fontSize: 13, cursor: 'pointer',
                                fontFamily: "'Sora', sans-serif",
                                position: 'relative',
                                transition: 'color 0.2s',
                                whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = t.textSecondary; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = t.textMuted; }}
                        >
                            {tab.label}
                            {isActive && (
                                <div style={{
                                    position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                                    width: '60%', height: 3, borderRadius: '4px 4px 0 0',
                                    background: t.cyan,
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default HubHeader;
