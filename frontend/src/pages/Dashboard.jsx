import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import {
  FiZap, FiMap, FiTrendingUp, FiBookmark,
  FiCheckCircle, FiCircle, FiArrowUp,
  FiBarChart2, FiBriefcase, FiCalendar,
  FiVideo, FiThumbsUp, FiStar, FiMessageSquare
} from 'react-icons/fi';
import {
  getAllTasks, getXPLevel, calculateStreak, createInitialProgress,
} from '../roadmapEngine';

Chart.register(...registerables);

// ── Helper: read engine state from localStorage ──────────────────
function useEngineState() {
  const roadmap = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('placera_roadmap') || 'null'); } catch { return null; }
  }, []);
  const progress = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('placera_progress') || 'null') || createInitialProgress(); } catch { return createInitialProgress(); }
  }, []);
  return { roadmap, progress };
}

// ── Helper: read logged-in user from localStorage ──────────────
function useCurrentUser() {
  return useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  }, []);
}


const Dashboard = ({ onNavigate, t, dark }) => {
  const radarRef = useRef(null);
  const lineRef = useRef(null);
  const barRef = useRef(null);
  const radarChart = useRef(null);
  const lineChart = useRef(null);
  const barChart = useRef(null);

  const cyan = t?.cyan || '#06b6d4';
  const cyanLight = t?.cyanLight || '#22d3ee';
  const textMuted = t?.textMuted || '#52525b';
  const textSecondary = t?.textSecondary || '#a1a1aa';
  const textPrimary = t?.textPrimary || '#f4f4f5';
  const border = t?.border || 'rgba(6,182,212,0.1)';
  const elevated = t?.elevated || '#181818';
  const cardBg = t?.card || '#111111';
  const isDark = dark !== false;

  // Palette — only these 4 colors used anywhere
  const RED = '#f43f5e';
  const ORANGE = '#f97316';

  // ── Live engine data ─────────────────────────────────────────────
  const { roadmap, progress } = useEngineState();
  const allTasks       = useMemo(() => getAllTasks(roadmap), [roadmap]);
  const completedCount = useMemo(() => progress.completedTasks.filter(id => allTasks.some(t => t.id === id)).length, [progress.completedTasks, allTasks]);
  const totalCount     = allTasks.length;
  const overallPct     = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const levelInfo      = useMemo(() => getXPLevel(progress.xp), [progress.xp]);
  const streak         = useMemo(() => calculateStreak(progress.completionDates), [progress.completionDates]);
  const currentPhase   = roadmap ? roadmap.phases[progress.currentPhase - 1] : null;
  const currentPhaseName = currentPhase?.title || 'Foundation';
  const remainingTasks = totalCount - completedCount;
  const targetCompany  = roadmap?.company || 'Google';
  // This week's tasks: first 5 tasks from current phase's first incomplete week
  const liveWeekTasks  = useMemo(() => {
    if (!roadmap || !currentPhase) return [];
    const incompletedWeek = currentPhase.weeks.find(w =>
      w.tasks.some(t => !progress.completedTasks.includes(t.id))
    ) || currentPhase.weeks[0];
    return (incompletedWeek?.tasks || []).slice(0, 5).map(task => ({
      done:     progress.completedTasks.includes(task.id),
      label:    task.title,
      tag:      task.difficulty,
      tagColor: task.difficulty === 'Hard' ? 'hard' : task.difficulty === 'Med' ? 'med' : 'easy',
    }));
  }, [roadmap, currentPhase, progress.completedTasks]);

  // ── Real Mock Arena stats ────────────────────────────────────
  const currentUser = useCurrentUser();
  const [mockStats, setMockStats] = useState(null);
  useEffect(() => {
    const userId = currentUser?._id || currentUser?.id;
    if (!userId) return;
    fetch(`http://localhost:5000/api/stats/${userId}`)
      .then(r => r.json())
      .then(setMockStats)
      .catch(() => {});
  }, [currentUser?._id, currentUser?.id]);


  // ── Chart re-runs when dark OR roadmap changes ────────────────
  useEffect(() => {
    Chart.defaults.color = isDark ? '#71717a' : '#64748b';
    Chart.defaults.font.family = 'DM Sans';

    // ── Derive radar target data from company profile weights ──
    const prof = roadmap?.profile;
    const dw   = prof?.dsaWeights  || {};
    const sw   = prof?.sdWeights   || {};
    const avg  = (...keys) => Math.round(keys.map(k => (dw[k] || sw[k] || 0.5) * 100).reduce((a, b) => a + b, 0) / keys.length);
    const companyTarget = [
      avg('arrays', 'graphs', 'dp', 'trees', 'strings'),   // DSA
      avg('distributed', 'scalability', 'microservices'),   // System Design
      avg('concurrency', 'security'),                       // OS/Networks
      avg('oop'),                                           // OOP/LLD
      80,                                                   // Behavioral (standard)
      avg('sql'),                                           // SQL/DB
    ];

    // ── Derive your actual score from task completion per topic ──
    const topicBuckets = [
      ['arrays', 'graphs', 'dp', 'trees', 'strings', 'heaps', 'backtracking'],
      ['SystemDesign'],
      ['concurrency', 'security'],
      ['oop'],
      ['Mock'],
      ['sql'],
    ];
    const myScore = topicBuckets.map(topics => {
      const matching = allTasks.filter(t => topics.includes(t.topic || t.type));
      if (!matching.length) return 40;
      const pct = (progress.completedTasks.filter(id => matching.some(t => t.id === id)).length / matching.length) * 100;
      return Math.max(10, Math.round(pct));
    });

    if (radarRef.current) {
      if (radarChart.current) radarChart.current.destroy();
      radarChart.current = new Chart(radarRef.current, {
        type: 'radar',
        data: {
          labels: ['DSA', 'System Design', 'OS/Networks', 'OOP/LLD', 'Behavioral', 'SQL/DB'],
          datasets: [
            {
              label: 'Your Completion',
              data: myScore,
              backgroundColor: 'rgba(6,182,212,0.1)',
              borderColor: cyan,
              borderWidth: 2,
              pointBackgroundColor: cyanLight,
              pointBorderColor: 'transparent',
              pointRadius: 4,
            },
            {
              label: `Target (${targetCompany})`,
              data: companyTarget,
              backgroundColor: 'rgba(6,182,212,0.04)',
              borderColor: 'rgba(6,182,212,0.25)',
              borderWidth: 1.5,
              borderDash: [4, 3],
              pointBackgroundColor: cyanLight,
              pointRadius: 3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 10, padding: 12, font: { size: 11 } } } },
          scales: {
            r: {
              grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)' },
              angleLines: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)' },
              pointLabels: { font: { size: 11, weight: '500' }, color: isDark ? '#71717a' : '#64748b' },
              ticks: { display: false },
              min: 0, max: 100,
            },
          },
        },
      });
    }

      // ── Line chart: real mock session scores ───────────────────
      const hasSessions = mockStats?.scoreTrend?.length > 0;
      const lineLabels = hasSessions
        ? mockStats.scoreTrend.map(s => s.label)
        : ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];
      const lineData = hasSessions
        ? mockStats.scoreTrend.map(s => s.score)
        : [52, 58, 55, 63, 68, 72, 70, 78];  // placeholder progression

      if (lineRef.current) {
        if (lineChart.current) lineChart.current.destroy();
        const ctx = lineRef.current.getContext('2d');
        const lineGrad = ctx.createLinearGradient(0, 0, 0, 200);
        lineGrad.addColorStop(0, hasSessions ? 'rgba(6,182,212,0.28)' : 'rgba(6,182,212,0.10)');
        lineGrad.addColorStop(1, 'rgba(6,182,212,0)');
        lineChart.current = new Chart(lineRef.current, {
          type: 'line',
          data: {
            labels: lineLabels,
            datasets: [{
              label: hasSessions ? 'Mock Score' : 'Sample Trend',
              data: lineData,
              fill: true,
              backgroundColor: lineGrad,
              borderColor: hasSessions ? cyan : 'rgba(6,182,212,0.4)',
              borderWidth: 2.5,
              borderDash: hasSessions ? [] : [5, 4],
              tension: 0.4,
              pointBackgroundColor: cyanLight,
              pointBorderColor: isDark ? '#111' : '#f1f5f9',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
            }],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  title: (items) => hasSessions ? `Session ${items[0].dataIndex + 1}` : items[0].label,
                  label: (item) => ` Score: ${item.raw}/100`,
                }
              }
            },
            scales: {
              x: { grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 } } },
              y: { grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 } }, min: 0, max: 100 },
            },
          },
        });
      }

    if (barRef.current) {
      if (barChart.current) barChart.current.destroy();
      barChart.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: ['DP', 'Trees', 'Graphs', 'Concurr.', 'Caching', 'CAP'],
          datasets: [{
            label: 'Accuracy %',
            data: [45, 60, 52, 38, 55, 42],
            backgroundColor: [
              'rgba(244,63,94,0.75)', 'rgba(6,182,212,0.75)',
              'rgba(249,115,22,0.75)', 'rgba(244,63,94,0.85)',
              'rgba(249,115,22,0.65)', 'rgba(244,63,94,0.75)',
            ],
            borderRadius: 6,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10.5 } } },
            y: { grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 }, callback: v => v + '%' }, min: 0, max: 100 },
          },
        },
      });
    }

    return () => {
      if (radarChart.current) radarChart.current.destroy();
      if (lineChart.current) lineChart.current.destroy();
      if (barChart.current)  barChart.current.destroy();
    };
  }, [dark, roadmap, progress.completedTasks, mockStats]); // re-run when company or progress or session data changes

  // Use live tasks if roadmap exists, else show helpful defaults
  const tasks = liveWeekTasks.length > 0 ? liveWeekTasks : [
    { done: false, label: 'Generate your roadmap to get personalized tasks', tag: 'Easy', tagColor: 'easy' },
    { done: false, label: 'Select your target company in the Roadmap tab', tag: 'Easy', tagColor: 'easy' },
    { done: false, label: 'Complete Phase 1 Foundation — Arrays & Strings', tag: 'Med', tagColor: 'med' },
    { done: false, label: 'Set your interview date to get a timeline', tag: 'Easy', tagColor: 'easy' },
    { done: false, label: 'Review your first System Design question', tag: 'Hard', tagColor: 'hard' },
  ];

  // Minimal tag colors: cyan for easy, orange for med, red for hard
  const tagColors = {
    easy: { background: isDark ? 'rgba(6,182,212,0.1)' : 'rgba(6,182,212,0.12)', color: cyan },
    med: { background: isDark ? 'rgba(249,115,22,0.1)' : 'rgba(249,115,22,0.12)', color: ORANGE },
    hard: { background: isDark ? 'rgba(244,63,94,0.1)' : 'rgba(244,63,94,0.12)', color: RED },
  };

  const expCards = [
    { initials: 'G', company: 'Google', role: 'SDE II · Bangalore', verdict: 'Selected', vType: 'selected', diff: 'Hard', upvotes: 312, rounds: 5 },
    { initials: 'A', company: 'Amazon', role: 'SDE I · Hyderabad', verdict: 'Intern→FTE', vType: 'intern', diff: null, upvotes: 287, rounds: 3 },
    { initials: 'M', company: 'Microsoft', role: 'SWE · Noida', verdict: 'Selected', vType: 'selected', diff: 'Med', upvotes: 251, rounds: 4 },
    { initials: 'At', company: 'Atlassian', role: 'Backend · Remote', verdict: 'Selected', vType: 'selected', diff: 'Hard', upvotes: 198, rounds: 4 },
    { initials: 'S', company: 'Stripe', role: 'Platform Eng', verdict: 'Rejected', vType: 'rejected', diff: 'Hard', upvotes: 176, rounds: 6 },
    { initials: 'F', company: 'Flipkart', role: 'SDE III · Bangalore', verdict: 'Selected', vType: 'selected', diff: 'Med', upvotes: 143, rounds: 3 },
    { initials: 'Ad', company: 'Adobe', role: 'MTS · Noida', verdict: 'Intern', vType: 'intern', diff: 'Easy', upvotes: 129, rounds: 3 },
  ];

  // Verdicts: cyan=selected/intern, red=rejected
  const verdictColors = {
    selected: { background: isDark ? 'rgba(6,182,212,0.1)' : 'rgba(6,182,212,0.12)', color: cyan },
    intern: { background: isDark ? 'rgba(6,182,212,0.08)' : 'rgba(6,182,212,0.1)', color: isDark ? cyanLight : t?.cyan },
    rejected: { background: isDark ? 'rgba(244,63,94,0.1)' : 'rgba(244,63,94,0.12)', color: RED },
  };

  const badgeStyles = {
    hot: { background: isDark ? 'rgba(249,115,22,0.1)' : 'rgba(249,115,22,0.12)', color: ORANGE },
    new: { background: isDark ? 'rgba(6,182,212,0.1)' : 'rgba(6,182,212,0.12)', color: cyan },
    rising: { background: isDark ? 'rgba(244,63,94,0.08)' : 'rgba(244,63,94,0.1)', color: RED },
  };

  const cardStyle = {
    background: cardBg,
    border: `1px solid ${border}`,
    borderRadius: 14,
    padding: 22,
    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.5)' : '0 2px 12px rgba(0,0,0,0.06)',
    position: 'relative', overflow: 'hidden',
    transition: 'background 0.3s, border-color 0.3s',
  };

  const sL = { fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.09em', color: textMuted, marginBottom: 10 };
  const cT = { fontFamily: "'Sora', sans-serif", fontSize: 14.5, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, color: textPrimary };
  const cS = { fontSize: 12, color: textMuted };

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both', color: textPrimary }}>

      {/* ── WELCOME ── */}
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, padding: '22px 28px' }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: 6 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · {targetCompany} Prep
          </div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 25, fontWeight: 800, lineHeight: 1.25, marginBottom: 6, color: textPrimary }}>
            {streak.current > 0 ? `${streak.current} days strong 🔥` : 'Ready to crush it today?'}
          </div>
          <div style={{ fontSize: 13, color: textSecondary }}>
            {streak.current > 0
              ? `${streak.current}-day streak active · Level ${levelInfo.level} — ${levelInfo.name} · ${levelInfo.xpToNext} XP to next level`
              : roadmap ? 'Start today to begin your streak. Every rep counts!' : 'Head to Roadmap tab → Generate your personalized prep plan.'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: elevated, border: `1px solid ${border}`, borderRadius: 12, padding: '18px 26px', minWidth: 150 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: 6 }}>Placement Readiness</div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 42, fontWeight: 800, color: cyan, lineHeight: 1 }}>{overallPct}%</div>
          <div style={{ fontSize: 12, color: cyan, fontWeight: 500, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4, opacity: 0.75 }}>
            <FiArrowUp size={11} /> {completedCount} tasks done
          </div>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 13, marginBottom: 18 }}>
        {[
          { icon: FiBriefcase, color: cyan,   trend: roadmap ? `Phase ${progress.currentPhase}/5` : '—',  up: true,  value: roadmap ? `${progress.currentPhase}/5` : '—',   label: 'Current Phase' },
          { icon: FiMap,       color: cyan,   trend: `${overallPct}%`,                                    up: true,  value: `${overallPct}%`,                               label: 'Roadmap Progress' },
          { icon: FiZap,       color: cyan,   trend: `+${progress.xp} XP`,                               up: true,  value: String(progress.xp),                            label: 'Total XP Earned' },
          { icon: FiBookmark,  color: ORANGE, trend: `${streak.current} days`,                            up: streak.current > 0, value: `${streak.current}🔥`,          label: 'Day Streak' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} style={{ ...cardStyle, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: isDark ? `${stat.color}14` : `${stat.color}12`, border: `1px solid ${stat.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                  <Icon size={16} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: stat.up ? 'rgba(6,182,212,0.1)' : 'rgba(244,63,94,0.1)', color: stat.up ? cyan : RED }}>
                  {stat.trend}
                </div>
              </div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 32, fontWeight: 800, lineHeight: 1, marginBottom: 4, color: textPrimary }}>{stat.value}</div>
              <div style={{ fontSize: 12.5, color: textSecondary }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* ── ROADMAP + ACTIVITY ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 18 }}>

        {/* Roadmap Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={cT}><FiMap size={14} style={{ color: cyan }} /> AI Roadmap Progress</div>
              <div style={cS}>Phase {progress.currentPhase} of 5 · {currentPhaseName} Track · {targetCompany}</div>
            </div>
            <span style={{ background: isDark ? 'rgba(6,182,212,0.1)' : 'rgba(6,182,212,0.12)', color: cyan, border: `1px solid rgba(6,182,212,0.25)`, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>Phase {progress.currentPhase}</span>
          </div>
          <div style={{ height: 6, background: elevated, borderRadius: 20, marginBottom: 5, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${overallPct}%`, borderRadius: 20, background: `linear-gradient(90deg, ${cyan}, ${cyanLight})`, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: textMuted, marginBottom: 16 }}>
            <span>Start</span><span>{overallPct}% — {remainingTasks} tasks left</span><span>Ready ✓</span>
          </div>
          <div style={sL}>This Week's Tasks</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {tasks.map((task, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, padding: '8px 11px', borderRadius: 8, background: elevated, cursor: 'pointer' }}>
                <div style={{ color: task.done ? cyan : textMuted, flexShrink: 0 }}>
                  {task.done ? <FiCheckCircle size={14} /> : <FiCircle size={14} />}
                </div>
                <span style={{ flex: 1, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? textMuted : textPrimary }}>{task.label}</span>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, ...tagColors[task.tagColor] }}>{task.tag}</span>
              </li>
            ))}
          </ul>
          <button
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: cyan, color: '#000', fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 700, border: 'none', borderRadius: 9, padding: '11px 20px', cursor: 'pointer', width: '100%' }}
            onClick={() => onNavigate('roadmap')}
          >
            <FiZap size={14} /> Continue Preparation
          </button>
        </div>

        {/* Company Activity */}
        <div style={cardStyle}>
          <div style={cT}><FiTrendingUp size={14} style={{ color: cyan }} /> Company Activity</div>
          <div style={{ ...cS, marginBottom: 14 }}>Trends in your target companies</div>
          <div style={sL}>Trending Topics</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
            {[
              { rank: '#1', topic: 'Distributed Systems at Google', meta: '47 discussions · Google', badge: 'Hot', type: 'hot' },
              { rank: '#2', topic: 'Meta L4 Behavioral Round', meta: '32 experiences · Meta', badge: 'New', type: 'new' },
              { rank: '#3', topic: 'Amazon LP Principles Deep Dive', meta: '28 discussions · Amazon', badge: 'Rising', type: 'rising' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, background: elevated, cursor: 'pointer' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: textMuted, width: 14, flexShrink: 0 }}>{item.rank}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: textPrimary }}>{item.topic}</div>
                  <div style={{ fontSize: 11, color: textMuted, marginTop: 1 }}>{item.meta}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, flexShrink: 0, ...badgeStyles[item.type] }}>{item.badge}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${border}, transparent)`, margin: '0 -22px 14px' }} />
          <div style={sL}>Live Community</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { initial: 'R', name: '@Riya_Desai', text: 'Just cleared Google phone screen! Prep the DP patterns from AlgoExpert', time: '2 min ago · Google Hub' },
              { initial: 'K', name: '@Karan_M', text: "Anyone done Meta's infra round? The scale questions are brutal", time: '8 min ago · Meta Hub' },
            ].map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 9 }}>
                <div style={{ width: 27, height: 27, borderRadius: '50%', flexShrink: 0, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.12)', color: cyan, border: `1px solid rgba(6,182,212,0.25)` }}>{msg.initial}</div>
                <div style={{ background: elevated, borderRadius: '0 10px 10px 10px', padding: '7px 11px', flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: cyan, marginBottom: 2 }}>{msg.name}</div>
                  <div style={{ fontSize: 12, color: textSecondary, lineHeight: 1.4 }}>{msg.text}</div>
                  <div style={{ fontSize: 10, color: textMuted, marginTop: 3 }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOCK SESSION + VAULT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>

        {/* ── Mock Score Card (real data) ── */}
        <div style={{ ...cardStyle, border: `1px solid rgba(6,182,212,0.2)` }}>
          <div style={cT}><FiVideo size={14} style={{ color: cyan }} /> Mock Arena Performance</div>
          <div style={{ ...cS, marginBottom: 16 }}>
            {mockStats?.mockSessions > 0
              ? `${mockStats.mockSessions} session${mockStats.mockSessions > 1 ? 's' : ''} completed`
              : 'No sessions yet — start your first mock!'}
          </div>

          {/* Real stats row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Sessions', val: mockStats?.mockSessions ?? '—' },
              { label: 'Avg Score', val: mockStats?.mockSessions > 0 ? `${mockStats.avgOverall}/100` : '—' },
              { label: 'Best', val: mockStats?.mockSessions > 0 ? `${mockStats.bestScore}/100` : '—' },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: elevated, borderRadius: 10, padding: '10px 12px', textAlign: 'center', border: `1px solid ${border}` }}>
                <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: cyan }}>{s.val}</div>
                <div style={{ fontSize: 10, color: textMuted, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Score breakdown if sessions exist */}
          {mockStats?.mockSessions > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {[
                { label: 'Confidence', val: mockStats.avgConfidence },
                { label: 'Communication', val: mockStats.avgCommunication },
                { label: 'Technical', val: mockStats.avgTechnical },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 11, color: textMuted, width: 90, flexShrink: 0 }}>{item.label}</div>
                  <div style={{ flex: 1, height: 5, borderRadius: 3, background: elevated, overflow: 'hidden' }}>
                    <div style={{ width: `${item.val}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${cyan}, ${cyanLight})`, transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ fontSize: 11, color: cyan, fontWeight: 700, width: 30, textAlign: 'right' }}>{item.val}%</div>
                </div>
              ))}
            </div>
          )}

          {!mockStats?.mockSessions && (
            <div style={{ background: elevated, borderRadius: 10, padding: '12px 14px', marginBottom: 14, fontSize: 12, color: textSecondary, lineHeight: 1.5 }}>
              🎯 Take a mock interview to see your score trend here. Each session tracks your confidence, communication, and technical accuracy.
            </div>
          )}

          <button
            onClick={() => onNavigate?.('arena')}
            style={{ width: '100%', background: cyan, border: 'none', borderRadius: 9, color: '#000', fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 700, padding: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <FiVideo size={14} /> {mockStats?.mockSessions > 0 ? 'Start New Mock Session' : 'Start Your First Mock'}
          </button>
        </div>


        {/* New in Vault */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 15 }}>
            <div>
              <div style={cT}><FiBarChart2 size={14} style={{ color: cyan }} /> New in Experience Vault</div>
              <div style={cS}>Freshly added interview reports</div>
            </div>
            <span style={{ fontSize: 12, color: cyan, cursor: 'pointer', fontWeight: 600 }}>View all →</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[
              { initials: 'G', topic: 'Google SDE II · Hyderabad', meta: '5 rounds · Selected · Hard · ↑ 234', badge: 'New', type: 'new' },
              { initials: 'M', topic: 'Microsoft SWE · Bangalore', meta: '4 rounds · Selected · Medium · ↑ 189', badge: 'Hot', type: 'hot' },
              { initials: 'A', topic: 'Amazon SDE I · Pune', meta: '3 rounds · Intern · Easy · ↑ 167', badge: 'Rising', type: 'rising' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 10px', borderRadius: 8, background: elevated, cursor: 'pointer' }}>
                <div style={{ width: 33, height: 33, borderRadius: 8, background: isDark ? 'rgba(6,182,212,0.1)' : 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: cyan, flexShrink: 0 }}>{item.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: textPrimary }}>{item.topic}</div>
                  <div style={{ fontSize: 11, color: textMuted, marginTop: 1 }}>{item.meta}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, flexShrink: 0, ...badgeStyles[item.type] }}>{item.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EXPERIENCE CAROUSEL ── */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 15 }}>
          <div>
            <div style={cT}><FiZap size={14} style={{ color: cyan }} /> Recommended Experiences</div>
            <div style={cS}>Curated for your target companies & track</div>
          </div>
          <span style={{ fontSize: 12, color: cyan, cursor: 'pointer', fontWeight: 600 }}>Browse all →</span>
        </div>
        <div style={{ overflowX: 'auto', paddingBottom: 6, cursor: 'grab' }}>
          <div style={{ display: 'flex', gap: 12, padding: '3px 2px', width: 'max-content' }}>
            {expCards.map((card, i) => (
              <div key={i} style={{ width: 182, flexShrink: 0, background: elevated, border: `1px solid ${border}`, borderRadius: 10, padding: 14, cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, marginBottom: 10, background: isDark ? 'rgba(6,182,212,0.1)' : 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: cyan }}>{card.initials}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, color: textPrimary }}>{card.company}</div>
                <div style={{ fontSize: 11.5, color: textMuted, marginBottom: 9 }}>{card.role}</div>
                <div style={{ display: 'flex', gap: 5, marginBottom: 9 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, ...verdictColors[card.vType] }}>{card.verdict}</span>
                  {card.diff && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, ...tagColors[card.diff.toLowerCase() === 'hard' ? 'hard' : card.diff.toLowerCase() === 'med' ? 'med' : 'easy'] }}>{card.diff}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: textMuted }}>
                  <FiThumbsUp size={11} /><span>{card.upvotes}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10 }}>{card.rounds} rounds</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ANALYTICS ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 15 }}>
        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap', color: textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiBarChart2 size={15} style={{ color: cyan }} /> Performance Analytics
        </div>
        <div style={{ flex: 1, height: 1, background: border }} />
        <div style={{ fontSize: 12, color: cyan, cursor: 'pointer', fontWeight: 600 }}>Full Report →</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 24 }}>
        {[
          { title: 'Topic Strength Radar', sub: 'Skill coverage across domains', ref: radarRef },
          { title: 'Mock Score Trend', sub: 'Last 8 mock sessions', ref: lineRef },
          { title: 'Weak Area Breakdown', sub: 'Topics needing attention', ref: barRef },
        ].map((chart, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 2, color: textPrimary }}>{chart.title}</div>
            <div style={{ fontSize: 11, color: textMuted, marginBottom: 14 }}>{chart.sub}</div>
            <canvas ref={chart.ref} height={220} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
