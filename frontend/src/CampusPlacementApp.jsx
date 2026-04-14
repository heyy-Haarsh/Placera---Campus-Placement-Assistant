import React, { useState, createContext, useContext } from 'react';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import ShareExperienceModal from './components/ShareExperienceModal';
import ProfileCompleteModal from './components/ProfileCompleteModal';
import HomeFeed from './pages/HomeFeed';
import ExperienceDetail from './pages/ExperienceDetail';
import Roadmap from './pages/Roadmap';
import Dashboard from './pages/Dashboard';
import Vault from './pages/Vault';
import CompanyHubs from './pages/CompanyHubs';
import Notifications from './pages/Notifications';
import ProgressTracker from './pages/ProgressTracker';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import MockArena from './pages/MockArena';
import './styles/globals.css';

export const ThemeContext = createContext({ dark: true, toggle: () => { } });
export const useTheme = () => useContext(ThemeContext);

// Single role context — the source of truth for role across the app
export const RoleContext = createContext({ role: 'student', setRole: () => { } });
export const useRole = () => useContext(RoleContext);

// Pages that DO show the right panel
const RIGHT_PANEL_PAGES = new Set(['home', 'detail']);
// Pages that auto-collapse the sidebar
const AUTO_COLLAPSE_PAGES = new Set(['hubs']);

const CampusPlacementApp = () => {
  const [activePage, setActivePage] = useState('home');
  const [dark, setDark] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [feedRefreshKey, setFeedRefreshKey] = useState(0);
  const [detailExp, setDetailExp] = useState(null);
  // Read role from localStorage — set by auth on login/register
  const [role, setRole] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.role || 'student';
    } catch { return 'student'; }
  });

  // Show profile-complete modal if user hasn't completed profile yet
  const [showProfileModal, setShowProfileModal] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      // Show if logged in but profile not yet complete
      return !!user.role && !user.profileComplete;
    } catch { return false; }
  });

  const navigate = (pageId) => {
    if (AUTO_COLLAPSE_PAGES.has(pageId)) setSidebarCollapsed(true);
    if (pageId !== 'detail') setDetailExp(null);
    setActivePage(pageId);
  };

  const openDetail = (exp) => {
    setDetailExp(exp);
    setActivePage('detail');
  };

  const t = dark
    ? {
      bg: '#000000',
      surface: '#0a0a0a',
      card: '#111111',
      elevated: '#181818',
      border: 'rgba(6,182,212,0.1)',
      borderGlow: 'rgba(6,182,212,0.3)',
      textPrimary: '#f4f4f5',
      textSecondary: '#a1a1aa',
      textMuted: '#52525b',
      cyan: '#06b6d4',
      cyanLight: '#22d3ee',
      cyanDim: 'rgba(6,182,212,0.08)',
    }
    : {
      bg: '#f1f5f9',
      surface: '#ffffff',
      card: '#ffffff',
      elevated: '#f8fafc',
      border: 'rgba(15,23,42,0.1)',
      borderGlow: 'rgba(6,182,212,0.4)',
      textPrimary: '#0f172a',
      textSecondary: '#334155',
      textMuted: '#64748b',
      cyan: '#0891b2',
      cyanLight: '#06b6d4',
      cyanDim: 'rgba(6,182,212,0.07)',
    };

  const sidebarW = sidebarCollapsed ? 64 : 240;
  const noRightPanelPages = new Set(['dashboard', 'roadmap', 'progress', 'vault', 'profile', 'settings', 'notifications', 'hubs', 'arena']);
  const showRight = RIGHT_PANEL_PAGES.has(activePage) && !noRightPanelPages.has(activePage);
  // Pages that need padding (not fullscreen or feed-style)
  const PADDED_PAGES = new Set(['dashboard', 'roadmap', 'progress', 'profile', 'settings', 'notifications', 'vault', 'arena']);

  const renderCenter = () => {
    switch (activePage) {
      case 'home':
        return <HomeFeed t={t} dark={dark} role={role} onOpenDetail={openDetail} refreshKey={feedRefreshKey} />;
      case 'detail':
        return detailExp
          ? <ExperienceDetail exp={detailExp} t={t} dark={dark} onBack={() => navigate('home')} />
          : null;
      case 'dashboard':
        return <Dashboard t={t} dark={dark} role={role} onNavigate={navigate} />;
      case 'roadmap':
        return <Roadmap t={t} dark={dark} role={role} />;
      case 'vault':
        return <Vault t={t} dark={dark} role={role} />;
      case 'hubs':
        return <CompanyHubs t={t} dark={dark} role={role} />;
      case 'notifications':
        return <Notifications t={t} dark={dark} role={role} />;
      case 'progress':
        return <ProgressTracker t={t} dark={dark} role={role} />;
      case 'profile':
        return <Profile t={t} dark={dark} role={role} />;
      case 'settings':
        return <Settings t={t} dark={dark} role={role} onThemeToggle={() => setDark(d => !d)} />;
      case 'arena':
        return <MockArena t={t} dark={dark} role={role} />;
      default:
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: t.textPrimary }}>Coming Soon</div>
            <div style={{ fontSize: 14, color: t.textMuted }}>This section is under construction</div>
          </div>
        );
    }
  };

  const isFullscreen = activePage === 'hubs';
  const noRightPanel = ['dashboard', 'roadmap', 'progress', 'vault', 'profile', 'settings', 'notifications', 'hubs'];

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d), t }}>
      <RoleContext.Provider value={{ role, setRole }}>
        <div style={{
          display: 'flex',
          minHeight: '100vh',
          background: t.bg,
          color: t.textPrimary,
          transition: 'background 0.3s, color 0.3s',
        }}>

          {/* LEFT: Sidebar */}
          <Sidebar
            activePage={activePage}
            onNavigate={navigate}
            t={t}
            dark={dark}
            role={role}
            onRoleChange={setRole}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(c => !c)}
            onThemeToggle={() => setDark(d => !d)}
          />

          {/* CENTER: Main content */}
          <main style={{
            marginLeft: sidebarW,
            flex: 1,
            ...(isFullscreen ? {
              height: '100vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            } : {
              minHeight: '100vh',
              overflowY: 'auto',
            }),
            borderRight: showRight ? `1px solid ${t.border}` : 'none',
            transition: 'margin-left 0.28s cubic-bezier(0.4,0,0.2,1)',
            maxWidth: showRight ? `calc(100% - ${sidebarW}px - 360px)` : undefined,
            padding: PADDED_PAGES.has(activePage) ? '28px 32px' : 0,
          }}>
            {renderCenter()}
          </main>

          {/* RIGHT: Panel */}
          {showRight && (
            <div style={{
              width: 360, flexShrink: 0,
              position: 'sticky', top: 0, height: '100vh',
              overflowY: 'auto',
              background: t.bg,
              paddingLeft: 16,
            }}>
              <RightPanel t={t} dark={dark} onShareClick={() => setShareOpen(true)} />
            </div>
          )}

          {/* Share Experience Modal */}
          {shareOpen && (
            <ShareExperienceModal t={t} dark={dark} onClose={() => setShareOpen(false)} onSuccess={() => setFeedRefreshKey(k => k + 1)} />
          )}

          {/* Profile Completion Modal — shown once on first login */}
          {showProfileModal && (
            <ProfileCompleteModal
              t={t}
              role={role}
              onComplete={() => setShowProfileModal(false)}
            />
          )}
        </div>
      </RoleContext.Provider>
    </ThemeContext.Provider>
  );
};

export default CampusPlacementApp;
