import React, { useState, useEffect, useCallback } from 'react';
import { FiCheckCircle, FiXCircle, FiTrendingUp, FiTarget, FiBox, FiClock, FiMapPin, FiBriefcase, FiAlertCircle, FiAward, FiStar, FiFilter, FiSearch, FiBookmark, FiThumbsUp, FiMessageSquare } from 'react-icons/fi';
import { fetchExperiences } from '../services/experienceApi';
import ShareExperienceModal from '../components/ShareExperienceModal';


// ── useDebounce helper ─────────────────────────────────
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}


const tagClsStyles = (t) => ({
  selected: { background: t.cyanDim, color: t.cyan, border: `1px solid ${t.borderGlow}` },
  rejected: { background: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)' },
  intern: { background: t.cyanDim, color: t.cyanLight, border: `1px solid ${t.border}` },
  hard: { background: 'rgba(244,63,94,0.12)', color: '#f43f5e' },
  med: { background: 'rgba(245,158,11,0.12)', color: '#f97316' },
  easy: { background: t.cyanDim, color: t.cyan },
  rounds: { background: 'rgba(99,102,241,0.12)', color: '#8b5cf6' },
  location: { background: 'rgba(255,255,255,0.05)', color: t.textSecondary },
});

const Vault = ({ t, dark }) => {
  const styles = {
    page: { animation: 'fadeUp 0.4s ease both' },
    hero: {
      background: t.card, border: `1px solid ${t.border}`, borderRadius: 20,
      padding: '28px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden',
      boxShadow: dark ? '0 16px 40px rgba(0,0,0,0.5)' : '0 10px 30px rgba(15,23,42,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
    },
    heroLeft: { position: 'relative', zIndex: 1 },
    heroEyebrow: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.cyan, marginBottom: 8 },
    heroTitle: { fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, lineHeight: 1.2, marginBottom: 8, color: t.textPrimary },
    heroSpan: { background: `linear-gradient(135deg, ${t.cyanLight}, ${t.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
    heroSub: { fontSize: 14, color: t.textSecondary, maxWidth: 500, lineHeight: 1.6 },
    heroStats: { display: 'flex', flexShrink: 0 },
    statPill: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: t.elevated, border: `1px solid ${t.border}`,
      padding: '14px 22px',
    },
    filters: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
    searchBar: { display: 'flex', alignItems: 'center', gap: 8, background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: '9px 14px', flex: 1, maxWidth: 320, minWidth: 200 },
    filterBtn: { padding: '7px 14px', borderRadius: 20, fontSize: 12.5, fontWeight: 500, background: t.card, border: `1px solid ${t.border}`, color: t.textSecondary, cursor: 'pointer', whiteSpace: 'nowrap' },
    filterBtnActive: { background: t.cyanDim, borderColor: t.borderGlow, color: t.cyan },
    layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 },
    expCard: { background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22, marginBottom: 14, cursor: 'pointer', transition: 'all 0.25s', position: 'relative', overflow: 'hidden' },
    cardTop: { display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 },
    cardBody: { fontSize: 13.5, color: t.textSecondary, lineHeight: 1.65, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    cardFooter: { display: 'flex', alignItems: 'center', gap: 12 },
    empty: { textAlign: 'center', padding: '60px 20px', color: t.textMuted },
    submitCta: { background: dark ? 'rgba(6,182,212,0.05)' : '#ffffff', border: `1px solid ${t.borderGlow}`, borderRadius: 12, padding: 18, marginBottom: 14, textAlign: 'center' },
    submitBtn: { width: '100%', background: t.cyan, border: 'none', borderRadius: 9, color: '#000', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, padding: 10, cursor: 'pointer', boxShadow: `0 4px 16px ${t.borderGlow}` },
    panel: { background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18, marginBottom: 14 },
    panelTitle: { fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, color: t.textPrimary },
    modalOverlay: { position: 'fixed', inset: 0, background: dark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
    modal: { background: t.surface, border: `1px solid ${t.border}`, borderRadius: 20, width: '100%', maxWidth: 760, maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: dark ? '0 24px 64px rgba(0,0,0,0.7)' : '0 24px 64px rgba(0,0,0,0.1)' },
    modalHeader: { padding: '28px 28px 20px', borderBottom: `1px solid ${t.border}`, position: 'sticky', top: 0, background: t.surface, zIndex: 2, borderRadius: '20px 20px 0 0' },
    modalBody: { padding: '24px 28px 28px' },
    modalClose: { position: 'absolute', top: 20, right: 20, width: 32, height: 32, borderRadius: 8, background: t.elevated, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: t.textPrimary },
    modalSectionTitle: { fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.textMuted },
    roundChip: { background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 12, padding: '14px 16px' },
    roundNum: { width: 26, height: 26, borderRadius: 7, background: t.cyanDim, color: t.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 },
    verdictBanner: { borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 },
    verdictSelected: { background: t.cyanDim, border: `1px solid ${t.borderGlow}` },
    verdictRejected: { background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' },
  };

  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('all');
  const [diffFilter, setDiffFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [votes, setVotes] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [modalExp, setModalExp] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Fetch full experience by ID when card is clicked
  const openModal = async (cardExp) => {
    setModalExp(cardExp);          // show card data immediately
    setModalLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/experiences/${cardExp.id}`);
      if (res.ok) {
        const { experience: raw } = await res.json();
        // Build the full normalized object with all rounds/tips from DB
        setModalExp({
          ...cardExp,
          rounds: (raw.rounds || []).map(r => ({
            name: r.name || '',
            dur: '',
            text: [r.desc, r.questions ? `Questions: ${r.questions}` : ''].filter(Boolean).join('\n\n'),
          })),
          tips: raw.advice ? raw.advice.split('. ').filter(s => s.trim().length > 15).slice(0, 6) : [],
          author: raw.author || cardExp.author,
          college: raw.college || cardExp.college,
          upvotes: raw.upvotes ?? cardExp.upvotes,
        });
      }
    } catch (e) { /* keep card data */ }
    finally { setModalLoading(false); }
  };

  // ── Live data ──────────────────────────────────────────────────────
  const [experienceData, setExperienceData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const normalize = (exp) => ({
    id: exp._id,
    logo: <FiBriefcase />,
    logoBg: 'rgba(6,182,212,0.12)',
    company: exp.company,
    role: `${exp.role}${exp.ctc ? ' · ' + exp.ctc : ''}`,
    verdict: exp.verdict,
    diff: exp.diff,
    company_key: exp.company.toLowerCase(),
    search: `${exp.company} ${exp.role} ${exp.college}`.toLowerCase(),
    tags: [
      exp.verdict === 'selected' ? { label: 'Selected', icon: <FiCheckCircle size={12} />, cls: 'selected' }
        : exp.verdict === 'rejected' ? { label: 'Rejected', icon: <FiXCircle size={12} />, cls: 'rejected' }
        : { label: 'Intern', icon: <FiAward size={12} />, cls: 'intern' },
      { label: exp.diff === 'easy' ? 'Easy' : exp.diff === 'med' ? 'Medium' : 'Hard', icon: <FiAlertCircle size={12} />, cls: exp.diff },
      { label: `${exp.rounds?.length || 0} Rounds`, icon: <FiClock size={12} />, cls: 'rounds' },
      { label: exp.campus === 'oncampus' ? 'On-campus' : 'Remote', icon: <FiMapPin size={12} />, cls: 'location' },
    ],
    preview: exp.advice || (exp.rounds?.[0]?.desc) || '',
    author: exp.author || 'Anonymous',
    college: exp.college || '',
    authorInit: exp.authorInit || 'A',
    authorGrad: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    upvotes: exp.upvotes || 0,
    bookmarked: false,
    timeago: exp.createdAt ? new Date(exp.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '',
    rounds: (exp.rounds || []).map(r => ({ name: r.name, dur: '', text: `${r.desc}${r.questions ? ' Questions: ' + r.questions : ''}` })),
    tips: exp.advice ? [exp.advice] : [],
  });

  // Debounce inputs so API only fires 400ms after user stops typing
  const debouncedCompany = useDebounce(companyFilter, 400);
  const debouncedSearch  = useDebounce(search, 400);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {};
      if (debouncedCompany) filters.company = debouncedCompany;
      if (verdictFilter && verdictFilter !== 'all') filters.verdict = verdictFilter;
      if (diffFilter) filters.diff = diffFilter;
      if (debouncedSearch) filters.search = debouncedSearch;
      console.log('[Vault] fetching with filters:', filters);
      const data = await fetchExperiences(filters);
      setExperienceData((data.experiences || []).map(normalize));
      setTotal(data.total || 0);
    } catch (e) {
      console.error('[Vault] fetch failed:', e);
    } finally {
      setLoading(false);
    }
  }, [debouncedCompany, verdictFilter, diffFilter, debouncedSearch]);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleVote = (id) => setVotes(v => ({ ...v, [id]: !v[id] }));
  const toggleBookmark = (id) => setBookmarks(b => ({ ...b, [id]: !b[id] }));

  return (
    <div style={styles.page}>
      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.heroEyebrow}>Community Intelligence · 2,400+ Reports</div>
          <div style={styles.heroTitle}>
            Experience <span style={styles.heroSpan}>Vault</span>
          </div>
          <div style={styles.heroSub}>Real interview reports from students who cracked top tech companies. Filter by company, role, difficulty, and verdict.</div>
        </div>
        <div style={styles.heroStats}>
          {[
            { val: total > 0 ? total.toLocaleString() : '—', label: 'Total Reports', color: t.cyan },
            { val: total > 0 ? Math.round((experienceData.filter(e => e.verdict === 'selected').length / Math.max(experienceData.length, 1)) * 100) + '%' : '—', label: 'Selection Rate', color: t.textPrimary },
            { val: Object.keys(bookmarks).filter(k => bookmarks[k]).length, label: 'Your Saved', color: '#f97316' },
          ].map((s, i) => (
            <div key={i} style={styles.statPill}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2, whiteSpace: 'nowrap' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTERS */}
      <div style={styles.filters}>
        <div style={styles.searchBar}>
          <span style={{ color: t.textMuted, fontSize: 14 }}>🔍</span>
          <input type="text" placeholder="Search by company, role, topic…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: t.textPrimary, flex: 1 }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', 'selected', 'rejected', 'intern'].map(v => (
            <button key={v} style={{ ...styles.filterBtn, ...(verdictFilter === v ? styles.filterBtnActive : {}) }}
              onClick={() => setVerdictFilter(v)}>
              {v === 'all' ? 'All' : v === 'selected' ? <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}><FiCheckCircle /> Selected</span> : v === 'rejected' ? <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}><FiXCircle /> Rejected</span> : <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}><FiAward /> Intern</span>}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['hard', 'med', 'easy'].map(d => (
            <button key={d} style={{ ...styles.filterBtn, ...(diffFilter === d ? styles.filterBtnActive : {}) }}
              onClick={() => setDiffFilter(diffFilter === d ? '' : d)}>
              {d === 'hard' ? <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}><FiAlertCircle color="#ef4444" /> Hard</span> : d === 'med' ? <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}><FiTrendingUp color="#f59e0b" /> Medium</span> : <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}><FiCheckCircle color="#10b981" /> Easy</span>}
            </button>
          ))}
        </div>
      </div>

      {/* LAYOUT */}
      <div style={styles.layout}>
        <div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22, marginBottom: 0 }}>
                  <div style={{ height: 16, background: t.elevated, borderRadius: 6, width: '40%', marginBottom: 12 }} />
                  <div style={{ height: 12, background: t.elevated, borderRadius: 6, width: '70%', marginBottom: 8 }} />
                  <div style={{ height: 12, background: t.elevated, borderRadius: 6, width: '90%' }} />
                </div>
              ))}
            </div>
          ) : experienceData.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.5, marginBottom: 12, color: t.textMuted }}><FiSearch size={40} /></div>
              <div style={{ fontSize: 16, fontWeight: 600, color: t.textSecondary, marginBottom: 6 }}>No results found</div>
              <div style={{ fontSize: 13 }}>Try a different search or adjust your filters</div>
            </div>
          ) : experienceData.map(exp => (
            <div key={exp.id} style={styles.expCard} onClick={() => openModal(exp)}>
              <div style={styles.cardTop}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: exp.logoBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{exp.logo}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{exp.company}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>{exp.role}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {exp.tags.map((tag, j) => (
                      <span key={j} style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 9px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4, ...tagClsStyles(t)[tag.cls] }}>{tag.icon} {tag.label}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={styles.cardBody}>{exp.preview}</div>
              <div style={styles.cardFooter}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: exp.authorGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{exp.authorInit}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>@{exp.author.replace(' ', '_')} · {exp.college}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{exp.timeago}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: votes[exp.id] ? t.cyanLight : t.textMuted, cursor: 'pointer', padding: '4px 9px', borderRadius: 7, background: votes[exp.id] ? t.cyanDim : 'transparent', border: `1px solid ${votes[exp.id] ? t.borderGlow : 'transparent'}` }}
                    onClick={e => { e.stopPropagation(); toggleVote(exp.id); }}>
                    ▲ {exp.upvotes + (votes[exp.id] ? 1 : 0)}
                  </div>
                  <span style={{ fontSize: 14, cursor: 'pointer', opacity: bookmarks[exp.id] ? 1 : 0.4 }}
                    onClick={e => { e.stopPropagation(); toggleBookmark(exp.id); }}>🔖</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          <div style={styles.submitCta}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✍️</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 4, color: t.textPrimary }}>Share Your Experience</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 12, lineHeight: 1.5 }}>Help fellow students by sharing your interview journey. Earn 200 XP per accepted report.</div>
            <button onClick={() => setShowShareModal(true)} style={styles.submitBtn}>+ Submit Experience</button>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelTitle}>🏢 Filter by Company</div>
            {/* Searchable company input */}
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: t.elevated, border: `1px solid ${companyFilter ? t.borderGlow : t.border}`, borderRadius: 10, padding: '7px 12px', transition: 'border-color 0.2s' }}>
                <FiSearch size={13} color={t.textMuted} />
                <input
                  type="text"
                  placeholder="Search company…"
                  value={companyFilter}
                  onChange={e => setCompanyFilter(e.target.value)}
                  style={{ background: 'none', border: 'none', outline: 'none', color: t.textPrimary, fontSize: 13, fontFamily: "'DM Sans',sans-serif", flex: 1 }}
                />
                {companyFilter && (
                  <button onClick={() => setCompanyFilter('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, fontSize: 12, padding: 0, lineHeight: 1 }}>✕</button>
                )}
              </div>
            </div>
            {/* Quick-pick chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Barclays', 'Google', 'Amazon', 'Microsoft', 'TCS', 'Infosys', 'Persistent Systems', 'Cognizant'].map(c => (
                <div key={c}
                  style={{ fontSize: 11.5, padding: '4px 10px', borderRadius: 20, background: companyFilter === c ? t.cyanDim : t.elevated, border: `1px solid ${companyFilter === c ? t.borderGlow : t.border}`, cursor: 'pointer', color: companyFilter === c ? t.cyanLight : t.textSecondary, transition: 'all 0.15s' }}
                  onClick={() => setCompanyFilter(companyFilter === c ? '' : c)}>
                  {c}
                </div>
              ))}
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelTitle}><FiTrendingUp color={t.cyan} /> Trending Topics</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['System Design', 'DP Patterns', 'Behavioral STAR', 'Graph Traversal', 'Rate Limiting', 'Concurrency', 'LLD OOP', 'Google L4', 'LP Questions', 'Distributed DB', 'CAP Theorem', 'Kafka'].map((tag, i) => (
                <span key={i} style={{ fontSize: 11.5, padding: '4px 10px', borderRadius: 20, background: t.elevated, color: t.textSecondary, cursor: 'pointer', border: '1px solid transparent' }}>{tag}</span>
              ))}
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelTitle}><FiBookmark color={t.cyan} /> My Bookmarks <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 400, marginLeft: 'auto' }}>143 saved</span></div>
            {['Google SDE II — Selected', 'Amazon SDE I — Selected', 'Microsoft SWE — Selected'].map((bm, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 9, background: t.elevated, marginBottom: 8, cursor: 'pointer' }}>
                <span style={{ color: t.cyan }}>{[<FiSearch size={16} />, <FiBox size={16} />, <FiBriefcase size={16} />][i]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: t.textPrimary }}>{bm}</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>{['5 rounds · Hard', '4 rounds · Medium', '4 rounds · Medium'][i]}</div>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', paddingTop: 4 }}>
              <span style={{ fontSize: 12, color: t.cyan, cursor: 'pointer' }}>View all 143 →</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalExp && (
        <div style={styles.modalOverlay} onClick={e => e.target === e.currentTarget && setModalExp(null)}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: modalExp.logoBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{modalExp.logo}</div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 2, color: t.textPrimary }}>{modalExp.company}</div>
                  <div style={{ fontSize: 14, color: t.textSecondary }}>{modalExp.role}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {modalExp.tags.map((tag, i) => (
                  <span key={i} style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 9px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4, ...tagClsStyles(t)[tag.cls] }}>{tag.icon} {tag.label}</span>
                ))}
              </div>
              <button style={styles.modalClose} onClick={() => setModalExp(null)}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.modalSectionTitle}><FiTarget style={{ marginRight: 6 }} /> Interview Rounds</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                {modalLoading ? (
                  [1,2,3].map(i => (
                    <div key={i} style={{ ...styles.roundChip, opacity: 0.5 }}>
                      <div style={{ height: 14, background: t.elevated, borderRadius: 6, width: '40%', marginBottom: 10 }} />
                      <div style={{ height: 10, background: t.elevated, borderRadius: 6, width: '100%', marginBottom: 6 }} />
                      <div style={{ height: 10, background: t.elevated, borderRadius: 6, width: '80%' }} />
                    </div>
                  ))
                ) : modalExp.rounds.map((round, i) => (
                  <div key={i} style={styles.roundChip}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <div style={styles.roundNum}>{i + 1}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: t.textPrimary }}>{round.name}</div>
                      <div style={{ marginLeft: 'auto', fontSize: 11.5, color: t.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}><FiClock /> {round.dur}</div>
                    </div>
                    <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.65 }}>{round.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 22 }}>
                <div style={styles.modalSectionTitle}><FiStar style={{ marginRight: 6 }} /> Key Takeaways</div>
                {modalExp.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5, color: t.textSecondary, marginBottom: 8, lineHeight: 1.55 }}>
                    <span style={{ color: t.cyan, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
                    <div>{tip}</div>
                  </div>
                ))}
              </div>
              <div style={{ ...styles.verdictBanner, ...(modalExp.verdict === 'selected' ? styles.verdictSelected : styles.verdictRejected), marginTop: 20 }}>
                <span style={{ color: modalExp.verdict === 'selected' ? t.cyan : '#f43f5e' }}>{modalExp.verdict === 'selected' ? <FiCheckCircle size={24} /> : <FiXCircle size={24} />}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary }}>
                    {modalExp.verdict === 'selected' ? 'Offer Received' : 'Not Selected'}{' '}
                    <span style={{ fontWeight: 400, color: t.textMuted, fontSize: 13 }}>· {modalExp.author} · {modalExp.college}</span>
                  </div>
                  <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{modalExp.upvotes} upvotes · {modalExp.timeago}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Experience Modal */}
      {showShareModal && (
        <ShareExperienceModal
          t={t}
          dark={dark}
          onClose={() => setShowShareModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};

const styles = {
  page: { animation: 'fadeUp 0.4s ease both' },
  hero: {
    background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20,
    padding: '28px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden',
    boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
  },
  heroLeft: { position: 'relative', zIndex: 1 },
  heroEyebrow: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--violet)', marginBottom: 8 },
  heroTitle: { fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 },
  heroSpan: { background: 'linear-gradient(135deg,#a78bfa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  heroSub: { fontSize: 14, color: 'var(--text-secondary)', maxWidth: 500, lineHeight: 1.6 },
  heroStats: { display: 'flex', flexShrink: 0 },
  statPill: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
    padding: '14px 22px',
  },
  filters: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  searchBar: { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px', flex: 1, maxWidth: 320, minWidth: 200 },
  filterBtn: { padding: '7px 14px', borderRadius: 20, fontSize: 12.5, fontWeight: 500, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' },
  filterBtnActive: { background: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.4)', color: 'var(--indigo-bright)' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 },
  expCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 22, marginBottom: 14, cursor: 'pointer', transition: 'all 0.25s', position: 'relative', overflow: 'hidden' },
  cardTop: { display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 },
  cardBody: { fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  cardFooter: { display: 'flex', alignItems: 'center', gap: 12 },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' },
  submitCta: { background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.08))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 'var(--radius)', padding: 18, marginBottom: 14, textAlign: 'center' },
  submitBtn: { width: '100%', background: 'linear-gradient(135deg,var(--violet),var(--indigo))', border: 'none', borderRadius: 9, color: '#fff', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, padding: 10, cursor: 'pointer', boxShadow: '0 4px 16px rgba(139,92,246,0.3)' },
  panel: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18, marginBottom: 14 },
  panelTitle: { fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 760, maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.7)' },
  modalHeader: { padding: '28px 28px 20px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-surface)', zIndex: 2, borderRadius: '20px 20px 0 0' },
  modalBody: { padding: '24px 28px 28px' },
  modalClose: { position: 'absolute', top: 20, right: 20, width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 },
  modalSectionTitle: { fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' },
  roundChip: { background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' },
  roundNum: { width: 26, height: 26, borderRadius: 7, background: 'rgba(99,102,241,0.2)', color: 'var(--indigo-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 },
  verdictBanner: { borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 },
  verdictSelected: { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' },
  verdictRejected: { background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' },
};

export default Vault;
