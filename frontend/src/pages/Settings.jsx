import React, { useState } from 'react';
import {
    FiLock, FiMail, FiShield, FiTrash2, FiBell, FiEye,
    FiSun, FiMoon, FiLayout, FiUser, FiAlertCircle, FiChevronRight,
    FiCalendar, FiTarget, FiClock
} from 'react-icons/fi';

const Toggle = ({ on, onToggle, t }) => (
    <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <div style={{ width: 44, height: 24, borderRadius: 12, background: on ? t.cyanDim : t.elevated, border: `1px solid ${on ? t.borderGlow : t.border}`, position: 'relative', transition: 'all 0.2s' }}>
            <div style={{ position: 'absolute', top: 3, left: on ? 22 : 3, width: 16, height: 16, borderRadius: '50%', background: on ? t.cyan : t.textMuted, transition: 'left 0.2s' }} />
        </div>
    </button>
);

const Row = ({ label, sub, control, t, danger }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ paddingRight: 16 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: danger ? '#ef4444' : t.textPrimary }}>{label}</div>
            {sub && <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 2 }}>{sub}</div>}
        </div>
        <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
);

const Section = ({ title, icon: Icon, children, t, highlight }) => (
    <div style={{ background: t.card, border: `1px solid ${highlight ? t.borderGlow : t.border}`, borderRadius: 16, padding: '4px 20px 8px', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 0 12px', borderBottom: `1px solid ${t.border}` }}>
            <Icon size={14} style={{ color: t.cyan }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</span>
            {highlight && <span style={{ marginLeft: 4, fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10, background: t.cyanDim, color: t.cyan, border: `1px solid ${t.borderGlow}` }}>SENIOR ONLY</span>}
        </div>
        {children}
    </div>
);

const ActionBtn = ({ label, icon: Icon, t, danger, onClick }) => (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 12px', borderRadius: 10, background: danger ? 'rgba(239,68,68,0.05)' : t.elevated, border: `1px solid ${danger ? 'rgba(239,68,68,0.2)' : t.border}`, color: danger ? '#ef4444' : t.textSecondary, fontSize: 13, cursor: 'pointer', fontFamily: "'Sora', sans-serif", marginBottom: 6, transition: 'border-color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = danger ? '#ef4444' : t.borderGlow}
        onMouseLeave={e => e.currentTarget.style.borderColor = danger ? 'rgba(239,68,68,0.2)' : t.border}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon size={13} /> {label}</span>
        <FiChevronRight size={12} style={{ opacity: 0.5 }} />
    </button>
);

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SESSION_TYPES = ['DSA', 'System Design', 'HR', 'Full Mock'];

const Settings = ({ t, dark, role, onThemeToggle }) => {
    const isSenior = role === 'senior';

    const [notif, setNotif] = useState({ mockReminders: true, amaAlerts: true, companyUpdates: true, badgeUpdates: true, mentionsOnly: false });
    const [priv, setPriv] = useState({ showMockScores: false, showResume: false, anonymousAma: false, hideFromJuniors: false });
    const [compact, setCompact] = useState(false);
    const [defTab, setDefTab] = useState('community');

    // Senior-specific
    const [maxSessions, setMaxSessions] = useState(4);
    const [sessionTypes, setSessionTypes] = useState({ DSA: true, 'System Design': true, HR: false, 'Full Mock': true });
    const [duration, setDuration] = useState('60');
    const [availDays, setAvailDays] = useState({ Mon: false, Tue: false, Wed: true, Thu: false, Fri: true, Sat: true, Sun: false });
    const [autoAccept, setAutoAccept] = useState(false);

    const togN = key => setNotif(p => ({ ...p, [key]: !p[key] }));
    const togP = key => setPriv(p => ({ ...p, [key]: !p[key] }));

    return (
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '36px 24px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: t.textPrimary }}>Settings</h1>
                {isSenior && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: t.cyanDim, color: t.cyan, border: `1px solid ${t.borderGlow}` }}>
                        Senior View
                    </span>
                )}
            </div>
            <p style={{ fontSize: 12, color: t.textMuted, marginBottom: 28 }}>Manage your account, notifications, and privacy.</p>

            {/* Account */}
            <Section title="Account" icon={FiUser} t={t}>
                <Row t={t} label="Email" sub="arjun.sharma@bits-pilani.ac.in" control={<span style={{ fontSize: 11, color: t.cyan, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}><FiShield size={10} /> Verified</span>} />
                <Row t={t} label="College" sub="BITS Pilani, CSE 2025" control={<span style={{ fontSize: 11, color: t.cyan, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}><FiShield size={10} /> Verified</span>} />
                {isSenior && (
                    <Row t={t} label="Senior Status" sub="Verified by admin · Placed at Google SDE II" control={<span style={{ fontSize: 11, color: t.cyan, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}><FiShield size={10} /> Active</span>} />
                )}
                <div style={{ paddingTop: 10 }}>
                    <ActionBtn label="Change Password" icon={FiLock} t={t} />
                    <ActionBtn label="Update Email" icon={FiMail} t={t} />
                    <ActionBtn label="Delete Account" icon={FiTrash2} t={t} danger />
                </div>
            </Section>

            {/* ── SENIOR-ONLY: Mentor Settings ── */}
            {isSenior && (
                <Section title="Mentor Settings" icon={FiCalendar} t={t} highlight>
                    {/* Max sessions */}
                    <Row t={t} label="Max Sessions per Week" sub="Limits how many new requests you can accept"
                        control={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <button onClick={() => setMaxSessions(n => Math.max(1, n - 1))} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${t.border}`, background: t.elevated, color: t.textPrimary, cursor: 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                <span style={{ fontSize: 14, fontWeight: 700, color: t.cyan, minWidth: 20, textAlign: 'center' }}>{maxSessions}</span>
                                <button onClick={() => setMaxSessions(n => Math.min(10, n + 1))} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${t.border}`, background: t.elevated, color: t.textPrimary, cursor: 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                        }
                    />

                    {/* Session types */}
                    <Row t={t} label="Session Types Offered" sub="Students will only see enabled types when booking"
                        control={
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxWidth: 240 }}>
                                {SESSION_TYPES.map(st => (
                                    <button key={st} onClick={() => setSessionTypes(p => ({ ...p, [st]: !p[st] }))}
                                        style={{ padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora', sans-serif", border: `1px solid ${sessionTypes[st] ? t.borderGlow : t.border}`, background: sessionTypes[st] ? t.cyanDim : t.elevated, color: sessionTypes[st] ? t.cyan : t.textMuted, transition: 'all 0.15s' }}>
                                        {st}
                                    </button>
                                ))}
                            </div>
                        }
                    />

                    {/* Duration */}
                    <Row t={t} label="Session Duration" sub="Default duration shown to students"
                        control={
                            <select value={duration} onChange={e => setDuration(e.target.value)}
                                style={{ background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: '5px 10px', color: t.textPrimary, fontSize: 12, fontFamily: "'Sora', sans-serif", outline: 'none', cursor: 'pointer' }}>
                                {['30', '45', '60', '90'].map(d => <option key={d} value={d} style={{ background: t.elevated }}>{d} min</option>)}
                            </select>
                        }
                    />

                    {/* Availability days */}
                    <Row t={t} label="Availability Days" sub="Toggle the days you are available for sessions"
                        control={
                            <div style={{ display: 'flex', gap: 4 }}>
                                {DAYS.map(day => (
                                    <button key={day} onClick={() => setAvailDays(p => ({ ...p, [day]: !p[day] }))}
                                        style={{ width: 30, height: 28, borderRadius: 6, border: `1px solid ${availDays[day] ? t.borderGlow : t.border}`, background: availDays[day] ? t.cyanDim : t.elevated, color: availDays[day] ? t.cyan : t.textMuted, fontSize: 9, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>
                                        {day}
                                    </button>
                                ))}
                            </div>
                        }
                    />

                    {/* Auto accept */}
                    <Row t={t} label="Auto-Accept Bookings" sub="Automatically confirm new session requests within your availability"
                        control={<Toggle on={autoAccept} onToggle={() => setAutoAccept(p => !p)} t={t} />}
                    />
                </Section>
            )}

            {/* Notifications */}
            <Section title="Notification Preferences" icon={FiBell} t={t}>
                <Row t={t} label="Mock Reminders" sub="Get notified 1 hour before your session" control={<Toggle on={notif.mockReminders} onToggle={() => togN('mockReminders')} t={t} />} />
                <Row t={t} label="AMA Session Alerts" sub="New AMA events in your hubs" control={<Toggle on={notif.amaAlerts} onToggle={() => togN('amaAlerts')} t={t} />} />
                <Row t={t} label="Company Hub Updates" sub="New experiences, OA patterns, resources" control={<Toggle on={notif.companyUpdates} onToggle={() => togN('companyUpdates')} t={t} />} />
                <Row t={t} label="Badge & Achievement Updates" sub="When you unlock new badges" control={<Toggle on={notif.badgeUpdates} onToggle={() => togN('badgeUpdates')} t={t} />} />
                <Row t={t} label="Mentions Only Mode" sub="Only notify when someone @mentions you" control={<Toggle on={notif.mentionsOnly} onToggle={() => togN('mentionsOnly')} t={t} />} />
            </Section>

            {/* Privacy */}
            <Section title="Privacy" icon={FiEye} t={t}>
                <Row t={t} label="Show mock scores publicly" sub="Other students can see your performance" control={<Toggle on={priv.showMockScores} onToggle={() => togP('showMockScores')} t={t} />} />
                <Row t={t} label="Resume publicly visible" sub="Mentors and seniors can view your resume" control={<Toggle on={priv.showResume} onToggle={() => togP('showResume')} t={t} />} />
                <Row t={t} label="Anonymous in AMA sessions" sub="Your identity is hidden when asking questions" control={<Toggle on={priv.anonymousAma} onToggle={() => togP('anonymousAma')} t={t} />} />
                <Row t={t} label="Hide profile from juniors" sub="Juniors cannot view your full profile" control={<Toggle on={priv.hideFromJuniors} onToggle={() => togP('hideFromJuniors')} t={t} />} />
            </Section>

            {/* UI Preferences */}
            <Section title="UI Preferences" icon={FiLayout} t={t}>
                <Row t={t} label="Theme" sub="Switch between dark and light mode"
                    control={<button onClick={onThemeToggle} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 8, background: t.elevated, border: `1px solid ${t.border}`, cursor: 'pointer', color: t.textSecondary, fontSize: 12, fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>
                        {dark ? <FiSun size={13} style={{ color: t.cyan }} /> : <FiMoon size={13} style={{ color: t.cyan }} />}
                        {dark ? 'Light Mode' : 'Dark Mode'}
                    </button>}
                />
                <Row t={t} label="Compact View" sub="Reduced padding and smaller card sizes" control={<Toggle on={compact} onToggle={() => setCompact(p => !p)} t={t} />} />
                <Row t={t} label="Default Hub Tab" sub="What opens when you enter a company hub"
                    control={<select value={defTab} onChange={e => setDefTab(e.target.value)} style={{ background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: '5px 10px', color: t.textPrimary, fontSize: 12, fontFamily: "'Sora', sans-serif", outline: 'none' }}>
                        {['community', 'resources', 'insights', 'mock', 'ama'].map(tab => <option key={tab} value={tab} style={{ background: t.elevated }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</option>)}
                    </select>}
                />
            </Section>

            {/* Coming soon */}
            <div style={{ border: `1px solid ${t.border}`, borderLeft: `3px solid ${t.cyan}`, borderRadius: 12, padding: '14px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <FiAlertCircle size={12} style={{ color: t.cyan }} /> Coming Soon
                </div>
                {['Mentor Premium Subscription', 'Priority Mock Booking', 'Advanced Analytics & Insights'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: t.textMuted, marginBottom: 6 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: t.cyan, flexShrink: 0 }} /> {f}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Settings;
