import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  FiSearch, FiZap, FiBox, FiUsers, FiTarget, FiLayout,
  FiCode, FiEdit3, FiBookOpen, FiEye,
  FiChevronDown, FiExternalLink, FiRotateCw, FiLock,
  FiPlayCircle, FiCpu, FiLoader, FiX,
} from 'react-icons/fi';
import {
  COMPANY_PROFILES,
  generateRoadmap,
  inferCompanyProfile,
  completeTask    as engineCompleteTask,
  getAllTasks,
  calculateStreak,
  getXPLevel,
  unlockNextPhase,
  getAIInsight,
  createInitialProgress,
} from '../roadmapEngine';

// ──────────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────────

const KNOWN_COMPANIES = Object.keys(COMPANY_PROFILES);

const DIFFICULTY_STYLE = {
  Hard: { background: 'rgba(244,63,94,0.15)', color: '#f43f5e' },
  Med:  { background: 'rgba(249,115,22,0.15)', color: '#f97316' },
  Easy: { background: 'rgba(6,182,212,0.15)', color: '#06b6d4' },
};

const TYPE_META = {
  DSA:          { icon: <FiCode size={11} />,      label: 'Code',    color: '#06b6d4' },
  SystemDesign: { icon: <FiCpu size={11} />,       label: 'Design',  color: '#818cf8' },
  OOP:          { icon: <FiEdit3 size={11} />,     label: 'LLD',     color: '#a78bfa' },
  Mock:         { icon: <FiUsers size={11} />,     label: 'Mock',    color: '#f97316' },
  Read:         { icon: <FiBookOpen size={11} />,  label: 'Read',    color: '#10b981' },
  Review:       { icon: <FiEye size={11} />,       label: 'Review',  color: '#f59e0b' },
};

const PHASE_ICONS = ['📐', '⚡', '🏛️', '🤝', '🎯'];

const normalizeRoadmap = (raw) => {
  if (!raw || typeof raw !== 'object' || typeof raw.company !== 'string' || !Array.isArray(raw.phases)) {
    return null;
  }

  const phases = raw.phases.map((phase, pi) => ({
    ...phase,
    id: phase?.id || `phase_${pi + 1}`,
    title: phase?.title || `Phase ${pi + 1}`,
    weeks: Array.isArray(phase?.weeks)
      ? phase.weeks.map((week, wi) => ({
          ...week,
          id: week?.id || `p${pi + 1}_w${wi + 1}`,
          title: week?.title || `Week ${wi + 1}`,
          meta: week?.meta || '',
          tasks: Array.isArray(week?.tasks) ? week.tasks : [],
        }))
      : [],
  }));

  if (!phases.length) return null;

  return {
    ...raw,
    phases,
    focusTags: Array.isArray(raw.focusTags) ? raw.focusTags : [],
    roundStructure: Array.isArray(raw.roundStructure) ? raw.roundStructure : [],
  };
};

const normalizeProgress = (raw) => {
  const base = createInitialProgress();
  if (!raw || typeof raw !== 'object') return base;

  return {
    ...base,
    ...raw,
    completedTasks: Array.isArray(raw.completedTasks) ? raw.completedTasks : [],
    completionDates: Array.isArray(raw.completionDates) ? raw.completionDates : [],
    xp: Number.isFinite(raw.xp) ? raw.xp : 0,
    currentPhase: Number.isFinite(raw.currentPhase) ? Math.min(5, Math.max(1, raw.currentPhase)) : 1,
    currentWeek: Number.isFinite(raw.currentWeek) ? Math.max(1, raw.currentWeek) : 1,
  };
};

// ──────────────────────────────────────────────────────────────────
// WeekCard
// ──────────────────────────────────────────────────────────────────

const WeekCard = ({ week, t, dark, onToggleTask, completedTasks, defaultOpen }) => {
  const [open, setOpen] = useState(!!defaultOpen);
  const weekDone  = week.tasks.filter(tk => completedTasks.includes(tk.id)).length;
  const weekTotal = week.tasks.length;
  const isDone    = weekDone === weekTotal && weekTotal > 0;
  const isCurrent = defaultOpen && !isDone;

  return (
    <div style={{
      background: t.card,
      border: `1px solid ${open ? t.borderGlow : t.border}`,
      borderRadius: 12, marginBottom: 10, overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: open ? `0 0 14px ${t.borderGlow}40` : 'none',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 20px', cursor: 'pointer',
          background: 'transparent', border: 'none', width: '100%',
          textAlign: 'left', color: 'inherit',
        }}
      >
        {/* Number */}
        <div style={{
          width: 30, height: 30, borderRadius: 7, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11.5, fontWeight: 700,
          background: isDone ? 'rgba(6,182,212,0.12)' : isCurrent ? 'rgba(99,102,241,0.18)' : t.elevated,
          color:      isDone ? '#06b6d4' : isCurrent ? '#818cf8' : t.textMuted,
        }}>
          {isDone ? '✓' : week.id.split('_')[1]?.replace('w', '') || '?'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: t.textPrimary, display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            {week.title}
            {isCurrent && <span style={{ fontSize: 10, background: 'rgba(99,102,241,0.18)', color: '#818cf8', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>Current</span>}
          </div>
          <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{week.meta}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: isDone ? '#06b6d4' : t.textMuted }}>{weekDone}/{weekTotal}</span>
          <FiChevronDown size={14} style={{ color: t.textMuted, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
        </div>
      </button>

      {open && (
        <div style={{ padding: '0 20px 14px', borderTop: `1px solid ${t.border}` }}>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
            {week.tasks.map(task => {
              const done = completedTasks.includes(task.id);
              const tm   = TYPE_META[task.type] || TYPE_META.DSA;
              const ds   = DIFFICULTY_STYLE[task.difficulty] || DIFFICULTY_STYLE.Med;
              return (
                <li
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 13px', borderRadius: 10,
                    background: t.elevated, cursor: 'pointer',
                    border: `1px solid ${done ? 'rgba(6,182,212,0.2)' : 'transparent'}`,
                    opacity: done ? 0.68 : 1, userSelect: 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: 19, height: 19, borderRadius: 5, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, transition: 'all 0.15s',
                    background: done ? '#06b6d4' : 'transparent',
                    border: done ? '1.5px solid #06b6d4' : `1.5px solid ${t.borderGlow}`,
                    color: '#000',
                  }}>{done && '✓'}</div>

                  {/* Score dot */}
                  {task.score > 0 && (
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      background: task.score >= 0.8 ? '#f43f5e' : task.score >= 0.6 ? '#f97316' : '#06b6d4',
                      title: `Company relevance: ${Math.round(task.score * 100)}%`,
                    }} />
                  )}

                  <div style={{ flex: 1, fontSize: 13, color: t.textPrimary, textDecoration: done ? 'line-through' : 'none' }}>
                    {task.title}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                    {task.resourceUrl && (
                      <a href={task.resourceUrl} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ color: '#06b6d4', display: 'flex', lineHeight: 1 }}>
                        <FiExternalLink size={12} />
                      </a>
                    )}
                    <span style={{ ...ds, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: ds.background }}>{task.difficulty}</span>
                    <span style={{ fontSize: 10, color: tm.color, background: `${tm.color}18`, padding: '2px 7px', borderRadius: 20, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                      {tm.icon} {tm.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// CompanySearch  — the core new UI element
// ──────────────────────────────────────────────────────────────────

const CompanySearch = ({ t, dark, onSelect, currentCompany, loading }) => {
  const [query,       setQuery]       = useState('');
  const [showDrop,    setShowDrop]    = useState(false);
  const [days,        setDays]        = useState(42);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return KNOWN_COMPANIES;
    return KNOWN_COMPANIES.filter(c => c.toLowerCase().includes(q) || c.replace('_', ' ').toLowerCase().includes(q));
  }, [query]);

  const isUnknown = query.trim().length >= 2 && filtered.length === 0;

  const handleSelect = (companyKey, isAI = false) => {
    setShowDrop(false);
    setQuery('');
    onSelect(companyKey, days, isAI);
  };

  return (
    <div style={{
      background: t.card, border: `1px solid ${t.borderGlow}`,
      borderRadius: 20, padding: '28px 32px', marginBottom: 24,
      boxShadow: dark ? '0 0 40px rgba(6,182,212,0.06)' : '0 10px 40px rgba(0,0,0,0.05)',
      animation: 'fadeUp 0.35s ease both',
    }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#06b6d4', marginBottom: 6 }}>
          🧠 AI Roadmap Generator
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: t.textPrimary }}>
          Generate roadmap for →
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, alignItems: 'flex-end' }}>
        {/* Search input + dropdown */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <FiSearch size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: t.textMuted, zIndex: 1 }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setShowDrop(true); }}
              onFocus={() => setShowDrop(true)}
              onBlur={() => setTimeout(() => setShowDrop(false), 180)}
              placeholder="Search company — Google, Barclays, PhonePe, Amdocs..."
              style={{
                width: '100%', padding: '11px 14px 11px 40px', borderRadius: 12,
                background: t.elevated, border: `1.5px solid ${t.border}`,
                color: t.textPrimary, fontSize: 14, outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && filtered[0]) handleSelect(filtered[0]);
                if (e.key === 'Escape') setShowDrop(false);
              }}
            />
          </div>

          {/* Dropdown */}
          {showDrop && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
              background: t.card, border: `1px solid ${t.borderGlow}`,
              borderRadius: 12, marginTop: 6,
              boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
              maxHeight: 280, overflowY: 'auto',
            }}>
              {filtered.map(c => {
                const p = COMPANY_PROFILES[c];
                return (
                  <div
                    key={c}
                    onMouseDown={() => handleSelect(c)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 16px', cursor: 'pointer',
                      transition: 'background 0.15s',
                      borderBottom: `1px solid ${t.border}`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = t.elevated}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{p?.emoji || '🏢'}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: t.textPrimary }}>{c.replace('_', ' ')}</div>
                      <div style={{ fontSize: 11, color: t.textMuted }}>
                        {p?.focusTags?.slice(0, 2).join(' · ')} · <span style={{ color: p?.difficulty === 'hard' ? '#f43f5e' : p?.difficulty === 'medium-hard' ? '#f97316' : '#10b981' }}>{p?.difficulty}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: t.textMuted, flexShrink: 0 }}>
                      {p?.roundStructure?.length} rounds
                    </div>
                  </div>
                );
              })}

              {/* AI Inference option */}
              {isUnknown && (
                <div
                  onMouseDown={() => handleSelect(query.trim(), true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', cursor: 'pointer',
                    background: 'rgba(99,102,241,0.07)',
                    borderTop: `1px solid ${t.border}`,
                  }}
                >
                  <span style={{ fontSize: 16 }}>✦</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#818cf8' }}>
                      "{query.trim()}" — Infer profile using Gemini AI
                    </div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>Unknown company · will analyze interview pattern with AI</div>
                  </div>
                  <div style={{ fontSize: 10, background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>AI</div>
                </div>
              )}

              {!filtered.length && !isUnknown && (
                <div style={{ padding: '14px 16px', color: t.textMuted, fontSize: 13, textAlign: 'center' }}>
                  Type at least 2 characters to infer with AI
                </div>
              )}
            </div>
          )}
        </div>

        {/* Days slider */}
        <div style={{ minWidth: 200 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, marginBottom: 5 }}>
            Days to Interview — <span style={{ color: '#06b6d4', fontWeight: 700 }}>{days}d (~{Math.round(days / 7)}w)</span>
          </div>
          <input
            type="range" min={14} max={180} value={days}
            onChange={e => setDays(+e.target.value)}
            style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer' }}
          />
        </div>

        {/* Current company display */}
        {currentCompany && !loading && (
          <div style={{
            padding: '10px 16px', borderRadius: 10,
            background: `${COMPANY_PROFILES[currentCompany]?.color || '#06b6d4'}18`,
            border: `1px solid ${COMPANY_PROFILES[currentCompany]?.color || '#06b6d4'}40`,
            fontSize: 13, fontWeight: 700,
            color: COMPANY_PROFILES[currentCompany]?.color || '#06b6d4',
          }}>
            {COMPANY_PROFILES[currentCompany]?.emoji || '🏢'} {currentCompany.replace('_', ' ')}
          </div>
        )}
      </div>

      {/* Quick company chips */}
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8, fontWeight: 600 }}>Quick select:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {KNOWN_COMPANIES.map(c => {
            const p = COMPANY_PROFILES[c];
            const isActive = c === currentCompany;
            return (
              <button
                key={c}
                onClick={() => handleSelect(c)}
                disabled={loading}
                style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.18s',
                  background: isActive ? (p?.color || '#06b6d4') : t.elevated,
                  color:      isActive ? '#fff' : t.textSecondary,
                  border:     isActive ? `1.5px solid ${p?.color || '#06b6d4'}` : `1.5px solid ${t.border}`,
                  boxShadow:  isActive ? `0 0 12px ${p?.color || '#06b6d4'}50` : 'none',
                  opacity:    loading ? 0.5 : 1,
                }}
              >
                {p?.emoji} {c.replace('_', ' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{
          marginTop: 18, padding: '14px 20px', borderRadius: 12,
          background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <FiLoader size={16} style={{ color: '#818cf8', animation: 'spin 1s linear infinite' }} />
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#818cf8' }}>Inferring company profile with Gemini AI…</div>
            <div style={{ fontSize: 11.5, color: t.textMuted }}>Analyzing interview patterns, question types, and difficulty distribution</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// Main Roadmap Page
// ──────────────────────────────────────────────────────────────────

const Roadmap = ({ t, dark }) => {
  // ── Persisted state ─────────────────────────────────────────────
  const [roadmap, setRoadmap] = useState(() => {
    try { return normalizeRoadmap(JSON.parse(localStorage.getItem('placera_roadmap') || 'null')); } catch { return null; }
  });
  const [userProgress, setUserProgress] = useState(() => {
    try { return normalizeProgress(JSON.parse(localStorage.getItem('placera_progress') || 'null')); } catch { return createInitialProgress(); }
  });

  // ── UI state ────────────────────────────────────────────────────
  const [viewPhase,  setViewPhase]  = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [hasCelebratedCompletion, setHasCelebratedCompletion] = useState(false);

  // Persist
  useEffect(() => { if (roadmap) localStorage.setItem('placera_roadmap', JSON.stringify(roadmap)); }, [roadmap]);
  useEffect(() => { localStorage.setItem('placera_progress', JSON.stringify(userProgress)); }, [userProgress]);
  useEffect(() => { if (roadmap) setViewPhase(userProgress.currentPhase - 1); }, []); // eslint-disable-line

  // ── Engine data ─────────────────────────────────────────────────
  const allTasks     = useMemo(() => getAllTasks(roadmap), [roadmap]);
  const completedIds = userProgress.completedTasks;
  const completedCount = useMemo(
    () => completedIds.filter(id => allTasks.some(t => t.id === id)).length,
    [completedIds, allTasks],
  );
  const totalCount  = allTasks.length;
  const overallPct  = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const levelInfo   = useMemo(() => getXPLevel(userProgress.xp), [userProgress.xp]);
  const streak      = useMemo(() => calculateStreak(userProgress.completionDates), [userProgress.completionDates]);
  const aiInsight   = useMemo(() => getAIInsight(userProgress, roadmap), [userProgress, roadmap]);

  // Phase progress
  const phaseProgress = useMemo(() => {
    if (!roadmap) return [];
    return roadmap.phases.map((ph, i) => {
      const tasks = ph.weeks.flatMap(w => w.tasks);
      const done  = tasks.filter(t => completedIds.includes(t.id)).length;
      const pct   = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
      return {
        ...ph,
        done, total: tasks.length, pct,
        isActive: i + 1 === userProgress.currentPhase,
        isDone:   i + 1 < userProgress.currentPhase || pct === 100,
        isLocked: i + 1 > userProgress.currentPhase,
      };
    });
  }, [roadmap, completedIds, userProgress.currentPhase]);

  const isRoadmapComplete = phaseProgress.length > 0 && phaseProgress.every(ph => ph.pct === 100);

  useEffect(() => {
    if (isRoadmapComplete && !hasCelebratedCompletion) {
      setHasCelebratedCompletion(true);
      setViewPhase(Math.max(0, phaseProgress.length - 1));
    }
  }, [isRoadmapComplete, hasCelebratedCompletion, phaseProgress.length]);

  // Last 7 days for streak calendar
  const last7Days = useMemo(() => {
    const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0, 0, 0, 0);
      return { label: labels[d.getDay()], isToday: i === 6, active: userProgress.completionDates.includes(d.toDateString()) };
    });
  }, [userProgress.completionDates]);

  // Circular ring
  const R = 55, CIRC = 2 * Math.PI * R;
  const strokeOffset = CIRC - (overallPct / 100) * CIRC;

  // Company accent color
  const companyColor = roadmap ? (COMPANY_PROFILES[roadmap.company]?.color || '#06b6d4') : '#06b6d4';
  const companyEmoji = roadmap ? (COMPANY_PROFILES[roadmap.company]?.emoji || '🏢') : '';

  // ── Handlers ────────────────────────────────────────────────────
  const handleSelectCompany = useCallback(async (companyKey, days, isAI = false) => {
    setError(null);
    try {
      let profile = COMPANY_PROFILES[companyKey];

      if (!profile || isAI) {
        setLoading(true);
        profile = await inferCompanyProfile(companyKey);
        setLoading(false);
      }

      const newRoadmap = generateRoadmap(profile, days, companyKey);
      setRoadmap(newRoadmap);
      setUserProgress(createInitialProgress());
      setViewPhase(0);
      setHasCelebratedCompletion(false);
    } catch (err) {
      setLoading(false);
      setError(`Failed to infer profile for "${companyKey}": ${err.message}`);
    }
  }, []);

  const handleToggleTask = useCallback((taskId) => {
    setUserProgress(prev => {
      if (!roadmap) return prev;
      let upd = engineCompleteTask(taskId, prev, roadmap);
      upd     = unlockNextPhase(upd, roadmap);
      return upd;
    });
  }, [roadmap]);

  // ── Render ──────────────────────────────────────────────────────
  const activePhase = roadmap?.phases?.[viewPhase];

  return (
    <div style={{ animation: 'fadeUp 0.35s ease both' }}>

      {/* ── COMPANY SEARCH (always shown) ── */}
      <CompanySearch
        t={t} dark={dark}
        onSelect={handleSelectCompany}
        currentCompany={roadmap?.company}
        loading={loading}
      />

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 12, padding: '12px 18px', marginBottom: 16, color: '#f43f5e', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
          ⚠️ {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}><FiX size={14} /></button>
        </div>
      )}

      {/* ── NO ROADMAP YET ── */}
      {!roadmap && !loading && (
        <div style={{
          background: t.card, border: `1px solid ${t.border}`,
          borderRadius: 16, padding: '40px 32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🗺️</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: t.textPrimary, marginBottom: 10 }}>
            Company-Aware Roadmap Engine Ready
          </div>
          <div style={{ fontSize: 13.5, color: t.textSecondary, lineHeight: 1.7, maxWidth: 460, margin: '0 auto', marginBottom: 24 }}>
            Each company has a unique weight profile. Questions are scored and ranked before building your roadmap — no two companies get the same plan.
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Google → graph-heavy DSA + distributed SD', 'Barclays → SQL + security + fintech SD', 'Amdocs → OOP/LLD + telecom billing', 'PhonePe → payments + concurrency + UPI scale'].map(hint => (
              <div key={hint} style={{ fontSize: 12, color: t.textMuted, background: t.elevated, border: `1px solid ${t.border}`, padding: '8px 14px', borderRadius: 24 }}>
                {hint}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FULL ROADMAP ── */}
      {roadmap && (
        <>
          {isRoadmapComplete && (
            <div style={{
              background: dark ? 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(129,140,248,0.2))' : 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(129,140,248,0.12))',
              border: `1px solid ${companyColor}55`,
              borderRadius: 16,
              padding: '16px 20px',
              marginBottom: 16,
              position: 'relative',
              overflow: 'hidden',
              animation: hasCelebratedCompletion ? 'roadmapPulse 0.7s ease 2' : 'none',
            }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: t.textPrimary, marginBottom: 4 }}>
                🎉 Congrats! You completed the full roadmap.
              </div>
              <div style={{ fontSize: 12.5, color: t.textSecondary }}>
                Every phase is done for <strong>{roadmap.company.replace('_', ' ')}</strong>. You are interview-ready.
              </div>
              <div aria-hidden style={{ position: 'absolute', right: 12, top: 8, display: 'flex', gap: 6, fontSize: 16 }}>
                {['✨', '🎊', '🚀', '🏆', '✨'].map((em, i) => (
                  <span key={`${em}_${i}`} style={{ animation: `confettiFloat 1.4s ease-in-out ${i * 0.12}s infinite` }}>{em}</span>
                ))}
              </div>
            </div>
          )}

          {/* HERO */}
          <div style={{
            background: t.card, border: `1px solid ${t.border}`,
            borderRadius: 20, padding: '26px 34px', marginBottom: 20,
            position: 'relative', overflow: 'hidden',
            boxShadow: dark ? `0 0 40px ${companyColor}12` : '0 10px 30px rgba(15,23,42,0.05)',
          }}>
            {/* Glow blob */}
            <div style={{
              position: 'absolute', top: -70, right: -70, width: 220, height: 220,
              borderRadius: '50%', background: `radial-gradient(circle, ${companyColor}18, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28, position: 'relative', zIndex: 1 }}>
              <div style={{ flex: 1 }}>
                {/* Company + tags */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: 28 }}>{companyEmoji}</div>
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: t.textPrimary }}>
                      {roadmap.company.replace('_', ' ')} · {roadmap.intensity === 'sprint' ? '⚡ Sprint Mode' : roadmap.intensity === 'deep' ? '🔭 Deep Mode' : '📍 Standard Mode'}
                    </div>
                    {/* Focus tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: t.textMuted }}>Tailored for:</span>
                      {(roadmap.focusTags || []).map(tag => (
                        <span key={tag} style={{
                          fontSize: 10.5, fontWeight: 700, padding: '2px 9px', borderRadius: 20,
                          background: `${companyColor}18`, color: companyColor,
                          border: `1px solid ${companyColor}35`,
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Round structure */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {(roadmap.roundStructure || []).map((r, i) => (
                    <span key={i} style={{
                      fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      background: t.elevated, border: `1px solid ${t.border}`, color: t.textMuted,
                    }}>
                      Round {i + 1}: {r}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 26 }}>
                  {[
                    { val: `${overallPct}%`,        label: 'Done',     color: companyColor },
                    { val: completedCount,           label: 'Tasks',    color: t.textPrimary },
                    { val: `${streak.current}🔥`,    label: 'Streak',   color: '#f97316' },
                    { val: roadmap.daysToInterview,  label: 'Days left', color: '#818cf8' },
                  ].map((s, i) => (
                    <div key={i}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Circular ring */}
              <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
                <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  <defs>
                    <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={companyColor} />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                  <circle fill="none" stroke={dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.07)'} strokeWidth="9" cx="60" cy="60" r={R} />
                  <circle fill="none" stroke="url(#ring)" strokeWidth="9" strokeLinecap="round"
                    cx="60" cy="60" r={R}
                    strokeDasharray={CIRC} strokeDashoffset={strokeOffset}
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: companyColor }}>{overallPct}%</div>
                  <div style={{ fontSize: 9.5, color: t.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Complete</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── PHASE TABS ── */}
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14.5, fontWeight: 700, marginBottom: 12, color: t.textPrimary }}>
            📍 5-Phase Journey — {roadmap.company.replace('_', ' ')} Path
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 24 }}>
            {phaseProgress.map((ph, i) => (
              <div
                key={ph.id}
                onClick={() => !ph.isLocked && setViewPhase(i)}
                style={{
                  background: viewPhase === i
                    ? dark ? `${companyColor}18` : `${companyColor}10`
                    : ph.isDone ? dark ? 'rgba(6,182,212,0.06)' : 'rgba(6,182,212,0.04)'
                    : t.card,
                  border: viewPhase === i
                    ? `1.5px solid ${companyColor}70`
                    : ph.isDone  ? '1px solid rgba(6,182,212,0.25)'
                    : `1px solid ${t.border}`,
                  borderRadius: 13, padding: '16px 14px',
                  cursor:   ph.isLocked ? 'not-allowed' : 'pointer',
                  opacity:  ph.isLocked ? 0.42 : 1,
                  transition: 'all 0.22s',
                  boxShadow: viewPhase === i ? `0 0 18px ${companyColor}22` : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.textMuted }}>Phase {i + 1}</div>
                  <div style={{
                    fontSize: 9.5, fontWeight: 700, padding: '2px 6px', borderRadius: 20,
                    ...(ph.isDone   ? { background: 'rgba(6,182,212,0.15)', color: '#06b6d4' }
                      : ph.isActive  ? { background: 'rgba(249,115,22,0.15)', color: '#f97316' }
                      : ph.isLocked  ? { background: t.elevated, color: t.textMuted }
                      : { background: 'rgba(99,102,241,0.15)', color: '#818cf8' }),
                  }}>
                    {ph.isDone ? '✓' : ph.isActive ? '▶' : ph.isLocked ? <FiLock size={8} /> : '●'}
                  </div>
                </div>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{PHASE_ICONS[i]}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11.5, fontWeight: 700, color: t.textPrimary, marginBottom: 3 }}>{ph.title}</div>
                <div style={{ fontSize: 10.5, color: t.textMuted, marginBottom: 8 }}>{ph.done}/{ph.total} tasks</div>
                <div style={{ height: 3, background: t.elevated, borderRadius: 20, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${ph.pct}%`,
                    background: ph.isDone ? '#06b6d4' : `linear-gradient(90deg, ${companyColor}, #818cf8)`,
                    borderRadius: 20, transition: 'width 0.5s ease',
                  }} />
                </div>
                <div style={{ fontSize: 10, color: companyColor, fontWeight: 600, marginTop: 4 }}>{ph.pct}%</div>
              </div>
            ))}
          </div>

          {/* ── MAIN LAYOUT ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 20 }}>

            {/* LEFT: weekly accordion */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: t.textPrimary }}>
                  📅 Phase {viewPhase + 1}: {activePhase?.title} Breakdown
                </div>
                <div style={{ fontSize: 11.5, color: t.textMuted }}>
                  🔴 High · 🟠 Med · 🔵 Low relevance dot
                </div>
              </div>

              {activePhase?.weeks.map((week, wi) => (
                <WeekCard
                  key={week.id}
                  week={week}
                  t={t} dark={dark}
                  completedTasks={completedIds}
                  onToggleTask={handleToggleTask}
                  defaultOpen={wi === 0 && phaseProgress[viewPhase]?.isActive}
                />
              ))}

              {/* Navigation */}
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  disabled={viewPhase === 0}
                  onClick={() => setViewPhase(v => v - 1)}
                  style={{ flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: viewPhase === 0 ? t.elevated : t.card, border: `1px solid ${t.border}`, color: viewPhase === 0 ? t.textMuted : t.textPrimary, cursor: viewPhase === 0 ? 'not-allowed' : 'pointer' }}
                >
                  ← Previous Phase
                </button>
                <button
                  disabled={isRoadmapComplete || viewPhase === 4 || phaseProgress[viewPhase + 1]?.isLocked}
                  onClick={() => setViewPhase(v => v + 1)}
                  style={{ flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600, border: 'none', background: isRoadmapComplete ? 'linear-gradient(90deg, #10b981, #22c55e)' : (viewPhase === 4 || phaseProgress[viewPhase + 1]?.isLocked) ? t.elevated : companyColor, color: (isRoadmapComplete || viewPhase === 4 || phaseProgress[viewPhase + 1]?.isLocked) ? (isRoadmapComplete ? '#ffffff' : t.textMuted) : '#fff', cursor: (isRoadmapComplete || viewPhase === 4 || phaseProgress[viewPhase + 1]?.isLocked) ? 'not-allowed' : 'pointer' }}
                >
                  {isRoadmapComplete ? '🎉 Congrats! Roadmap Complete' : 'Next Phase →'}
                </button>
              </div>

              {/* Unlock hint */}
              {phaseProgress[viewPhase] && viewPhase < phaseProgress.length - 1 && !phaseProgress[viewPhase].isDone && (
                <div style={{ marginTop: 10, padding: '10px 16px', borderRadius: 10, background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 12, color: '#818cf8' }}>
                  🔓 Complete <strong>{Math.max(0, Math.ceil(phaseProgress[viewPhase].total * 0.8) - phaseProgress[viewPhase].done)}</strong> more tasks to unlock Phase {viewPhase + 2}
                  <span style={{ color: t.textMuted }}> ({phaseProgress[viewPhase].pct}% / 80% needed)</span>
                </div>
              )}
            </div>

            {/* RIGHT: sidebar panels */}
            <div>
              {/* AI Insight */}
              <div style={{
                background: dark ? `${companyColor}06` : '#fff',
                border: `1px solid ${companyColor}45`,
                borderRadius: 12, padding: '17px 19px', marginBottom: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                  <span style={{ background: `linear-gradient(135deg, ${companyColor}, #818cf8)`, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, color: '#fff' }}>✨ AI Insight</span>
                  <span style={{ fontSize: 10.5, color: t.textMuted }}>{roadmap.company.replace('_', ' ')}</span>
                </div>
                <div style={{ fontSize: 12.5, lineHeight: 1.65, color: t.textSecondary }}>{aiInsight}</div>
              </div>

              {/* XP + Streak */}
              <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18, marginBottom: 14 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 12, color: t.textPrimary }}>🔥 XP & Streak</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: t.textMuted, marginBottom: 4 }}>
                  <span>Level {levelInfo.level} — {levelInfo.name}</span>
                  <span style={{ color: companyColor, fontWeight: 600 }}>{userProgress.xp} XP</span>
                </div>
                <div style={{ height: 5, background: t.elevated, borderRadius: 20, overflow: 'hidden', marginBottom: 5 }}>
                  <div style={{ height: '100%', background: `linear-gradient(90deg, ${companyColor}, #818cf8)`, borderRadius: 20, width: `${Math.min(100, levelInfo.progress)}%`, transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 14 }}>
                  {levelInfo.xpToNext > 0 ? `${levelInfo.xpToNext} XP to Level ${levelInfo.level + 1}` : '🎉 Max level!'}
                </div>
                <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
                  {last7Days.map((d, i) => (
                    <div key={i} style={{
                      width: 30, height: 30, borderRadius: 7,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10.5, fontWeight: 700,
                      ...(d.isToday ? { background: `linear-gradient(135deg, ${companyColor}, #818cf8)`, color: '#fff', boxShadow: `0 0 10px ${companyColor}50` }
                        : d.active  ? { background: `${companyColor}18`, color: companyColor }
                        :             { background: t.elevated, color: t.textMuted }),
                    }}>{d.label}</div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: t.textSecondary }}>🏆 {streak.current}-day streak · Best: {streak.best}</div>
              </div>

              {/* Phase Overview */}
              <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18, marginBottom: 14 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 12, color: t.textPrimary }}>📊 All Phases</div>
                {phaseProgress.map((ph, i) => (
                  <div
                    key={ph.id}
                    onClick={() => !ph.isLocked && setViewPhase(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '7px 10px', borderRadius: 8, marginBottom: 5,
                      background: viewPhase === i ? `${companyColor}12` : t.elevated,
                      border: viewPhase === i ? `1px solid ${companyColor}40` : '1px solid transparent',
                      cursor: ph.isLocked ? 'not-allowed' : 'pointer', opacity: ph.isLocked ? 0.45 : 1,
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 13 }}>{PHASE_ICONS[i]}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: t.textPrimary }}>{ph.title}</div>
                      <div style={{ height: 2.5, background: t.border, borderRadius: 20, marginTop: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${ph.pct}%`, background: ph.isDone ? '#06b6d4' : `linear-gradient(90deg, ${companyColor}, #818cf8)`, borderRadius: 20, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: ph.isDone ? '#06b6d4' : t.textMuted }}>{ph.pct}%</span>
                  </div>
                ))}
              </div>

              {/* Company Interview Rounds */}
              <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 12, color: t.textPrimary }}>
                  🎯 {roadmap.company.replace('_', ' ')} Interview Rounds
                </div>
                {(roadmap.roundStructure || []).map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: companyColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: companyColor, minWidth: 55 }}>Round {i + 1}</span>
                    <span style={{ fontSize: 11.5, color: t.textSecondary }}>{r}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: `${companyColor}10`, border: `1px solid ${companyColor}30`, fontSize: 11, color: companyColor }}>
                  Difficulty: <strong>{COMPANY_PROFILES[roadmap.company]?.difficulty || roadmap.profile?.difficulty || 'medium'}</strong>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <style>{`
        @keyframes roadmapPulse {
          0% { transform: scale(1); box-shadow: 0 0 0 rgba(129,140,248,0); }
          50% { transform: scale(1.01); box-shadow: 0 0 24px rgba(129,140,248,0.25); }
          100% { transform: scale(1); box-shadow: 0 0 0 rgba(129,140,248,0); }
        }
        @keyframes confettiFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.85; }
          50% { transform: translateY(-6px) rotate(8deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Roadmap;
