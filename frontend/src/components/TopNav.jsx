import React from 'react';
import { FiSearch, FiBell, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../CampusPlacementApp';

const TopNav = ({ t, dark }) => {
  const { toggle } = useTheme();

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 'var(--sidebar-w)', right: 0,
      height: 'var(--nav-h)',
      background: dark ? 'rgba(0,0,0,0.85)' : 'rgba(241,245,249,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'center',
      padding: '0 28px',
      gap: 14,
      zIndex: 90,
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 8, padding: '7px 13px', flex: 1, maxWidth: 360, cursor: 'text' }}>
        <FiSearch size={14} style={{ color: t.textMuted, flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search experiences, companies, topics…"
          style={{ background: 'none', border: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: t.textPrimary, flex: 1, width: '100%' }}
        />
        <span style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 4, fontSize: 10, color: t.textMuted, padding: '2px 6px', fontFamily: 'monospace' }}>⌘K</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Company target */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: t.cyanDim, border: `1px solid ${t.borderGlow}`, borderRadius: 20, padding: '6px 14px', fontSize: 12.5, fontWeight: 600, color: t.cyan, cursor: 'pointer' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.cyan, boxShadow: `0 0 6px ${t.cyan}`, animation: 'pulse 2s infinite', display: 'inline-block' }} />
        Google — SDE II
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        style={{ width: 38, height: 38, borderRadius: 8, background: t.elevated, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.textSecondary, transition: 'all 0.2s', flexShrink: 0 }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = t.cyan; e.currentTarget.style.color = t.cyan; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
        title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
      </button>

      {/* Notifications */}
      <div style={{ width: 38, height: 38, borderRadius: 8, background: t.elevated, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', color: t.textSecondary }}>
        <FiBell size={16} />
        <div style={{ position: 'absolute', top: 7, right: 8, width: 7, height: 7, borderRadius: '50%', background: '#f43f5e', border: `2px solid ${t.surface}` }} />
      </div>

      {/* Avatar */}
      <div style={{ width: 38, height: 38, borderRadius: 8, background: t.cyanDim, border: `1px solid ${t.borderGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: t.cyan }}>
        A
      </div>
    </header>
  );
};

export default TopNav;
