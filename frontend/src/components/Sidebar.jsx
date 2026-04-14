import React, { useState } from 'react';
import {
  FiHome, FiMap, FiBriefcase, FiTarget,
  FiBell, FiTrendingUp, FiUser, FiSettings,
  FiChevronLeft, FiChevronRight, FiSun, FiMoon,
  FiCheckCircle, FiStar, FiCalendar, FiShield, FiBarChart2
} from 'react-icons/fi';
import PlaceraLogo from '../assets/Placera.png';

const NAV_MAIN = [
  { id: 'home',      icon: FiHome,       label: 'Home' },
  { id: 'dashboard', icon: FiBarChart2,  label: 'Dashboard' },
  { id: 'roadmap',   icon: FiMap,        label: 'AI Roadmap', badge: 'New' },
  { id: 'hubs',      icon: FiBriefcase,  label: 'Company Hubs' },
  { id: 'arena',     icon: FiTarget,     label: 'Mock Arena', badge: '3', badgeOrange: true },
];
const NAV_PERSONAL = [
  { id: 'notifications', icon: FiBell, label: 'Notifications', badge: '12' },
  { id: 'progress', icon: FiTrendingUp, label: 'Progress Tracker' },
  { id: 'profile', icon: FiUser, label: 'Profile' },
  { id: 'settings', icon: FiSettings, label: 'Settings' },
];
// Extra nav items only shown to seniors
const NAV_MENTOR = [
  { id: 'sessions', icon: FiCalendar, label: 'My Sessions', badge: '2', badgeCyan: true },
  { id: 'verify', icon: FiCheckCircle, label: 'Verify Resources', badge: '5', badgeCyan: true },
];

const Sidebar = ({ activePage, onNavigate, t, dark, role, onRoleChange, collapsed, onToggle, onThemeToggle }) => {
  const w = collapsed ? 64 : 240;
  const isSenior = role === 'senior';

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = activePage === item.id;
    return (
      <button
        onClick={() => onNavigate(item.id)}
        title={collapsed ? item.label : ''}
        style={{
          display: 'flex', alignItems: 'center',
          gap: collapsed ? 0 : 12,
          padding: collapsed ? '10px 0' : '10px 12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderRadius: 10, cursor: 'pointer',
          transition: 'all 0.2s ease', marginBottom: 2,
          width: '100%', position: 'relative',
          fontSize: 13.5, fontWeight: isActive ? 600 : 400,
          color: isActive ? t.cyan : t.textSecondary,
          background: isActive ? t.cyanDim : 'transparent',
          border: 'none', textAlign: 'left',
          fontFamily: "'Sora', sans-serif",
        }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = t.cyanDim; e.currentTarget.style.color = t.textPrimary; } }}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.textSecondary; } }}
      >
        {isActive && <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, borderRadius: '0 3px 3px 0', background: t.cyan }} />}
        <Icon size={18} style={{ flexShrink: 0 }} />
        {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{item.label}</span>}
        {!collapsed && item.badge && (
          <span style={{ marginLeft: 'auto', background: item.badgeOrange ? 'rgba(249,115,22,0.15)' : t.cyanDim, color: item.badgeOrange ? '#f97316' : t.cyan, fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20, border: `1px solid ${item.badgeOrange ? 'rgba(249,115,22,0.3)' : t.border}` }}>
            {item.badge}
          </span>
        )}
        {collapsed && item.badge && <span style={{ position: 'absolute', top: 6, right: 8, width: 7, height: 7, borderRadius: '50%', background: item.badgeOrange ? '#f97316' : t.cyan }} />}
      </button>
    );
  };

  const SectionLabel = ({ label }) => !collapsed
    ? <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.textMuted, padding: '0 4px', marginBottom: 4, marginTop: 16 }}>{label}</div>
    : <div style={{ marginTop: 12, borderTop: `1px solid ${t.border}` }} />;

  return (
    <aside style={{ position: 'fixed', left: 0, top: 0, width: w, height: '100vh', background: t.surface, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', zIndex: 200, transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden' }}>

      {/* Glow orb */}
      <div style={{ position: 'absolute', top: -80, left: -60, width: 200, height: 200, background: `radial-gradient(circle, ${t.cyanDim} 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: collapsed ? '18px 0' : '18px 12px 16px', borderBottom: `1px solid ${t.border}`, flexShrink: 0, minHeight: 62 }}>
        {!collapsed && <img src={PlaceraLogo} alt="Placera" style={{ height: 26, objectFit: 'contain', filter: dark ? 'none' : 'invert(1)' }} />}
        <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, borderRadius: 6, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = t.cyan}
          onMouseLeave={e => e.currentTarget.style.color = t.textMuted}>
          {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>

      {/* Role Badge — shown below header when expanded */}
      {!collapsed && (
        <div style={{ padding: '10px 12px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, background: isSenior ? t.cyanDim : t.elevated, border: `1px solid ${isSenior ? t.borderGlow : t.border}` }}>
            {isSenior ? <FiShield size={12} style={{ color: t.cyan }} /> : <FiUser size={12} style={{ color: t.textMuted }} />}
            <span style={{ fontSize: 11, fontWeight: 700, color: isSenior ? t.cyan : t.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', flex: 1 }}>
              {isSenior ? 'Verified Senior' : 'Student'}
            </span>
            {/* Role toggle — simulates upgrade/downgrade for now */}
            <button
              onClick={() => onRoleChange(isSenior ? 'student' : 'senior')}
              title="Switch role (demo)"
              style={{ fontSize: 9, fontWeight: 700, color: isSenior ? t.textMuted : t.cyan, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Sora', sans-serif", padding: '1px 4px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {isSenior ? '← Student' : 'Senior →'}
            </button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: collapsed ? '8px 6px' : '8px 10px' }}>
        <SectionLabel label="Main" />
        {NAV_MAIN.map(item => <NavItem key={item.id} item={item} />)}

        <SectionLabel label="Personal" />
        {NAV_PERSONAL.map(item => <NavItem key={item.id} item={item} />)}

        {/* Senior-only Mentor Tools section */}
        {isSenior && (
          <>
            <SectionLabel label="Mentor Tools" />
            {NAV_MENTOR.map(item => <NavItem key={item.id} item={item} />)}
          </>
        )}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
        {/* Theme toggle */}
        <div style={{ padding: collapsed ? '10px 0' : '10px 12px' }}>
          <button
            onClick={onThemeToggle}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start', width: '100%', background: 'none', border: `1px solid ${t.border}`, borderRadius: 10, padding: collapsed ? '8px 0' : '8px 12px', cursor: 'pointer', color: t.textSecondary, fontSize: 13, fontFamily: "'Sora', sans-serif", transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.borderGlow; e.currentTarget.style.color = t.cyan; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}>
            {dark ? <FiSun size={16} style={{ flexShrink: 0 }} /> : <FiMoon size={16} style={{ flexShrink: 0 }} />}
            {!collapsed && <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>

        {/* User */}
        <div style={{ padding: collapsed ? '6px 0 10px' : '0 12px 10px', borderTop: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start', padding: '8px 4px', borderRadius: 8, cursor: 'pointer' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: isSenior ? `linear-gradient(135deg, ${t.cyan}, ${t.cyan}88)` : `linear-gradient(135deg, ${t.elevated}, ${t.cyan}55)`, border: `2px solid ${isSenior ? t.cyan : t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: isSenior ? '#000' : t.cyan }}>
              A
            </div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Arjun Sharma {isSenior && <FiStar size={10} style={{ color: t.cyan, marginLeft: 3 }} />}
                </div>
                <div style={{ fontSize: 11, color: isSenior ? t.cyan : t.textMuted }}>{isSenior ? 'Senior · Google SDE II' : '@arjun_s'}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
