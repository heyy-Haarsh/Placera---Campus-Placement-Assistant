import React, { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiTrendingUp, FiTarget, FiBox, FiClock, FiMapPin, FiBriefcase, FiAlertCircle, FiAward, FiStar, FiFilter, FiSearch, FiBookmark, FiThumbsUp, FiMessageSquare } from 'react-icons/fi';

const experienceData = [
  {
    id: 'google',
    logo: <FiSearch />, logoBg: 'rgba(66,133,244,0.15)',
    company: 'Google', role: 'SDE II · Bangalore · Feb 2025',
    verdict: 'selected', diff: 'hard', company_key: 'google',
    search: 'google sde bangalore system design',
    tags: [{ label: 'Selected', icon: <FiCheckCircle size={12} />, cls: 'selected' }, { label: 'Hard', icon: <FiAlertCircle size={12} />, cls: 'hard' }, { label: '5 Rounds', icon: <FiClock size={12} />, cls: 'rounds' }, { label: 'Onsite', icon: <FiMapPin size={12} />, cls: 'location' }],
    preview: "The process started with a recruiter screen followed by a 45-min phone screen (DSA — trees + DP). Onsite had 2 coding rounds, 1 system design (distributed rate limiter), 1 Googleyness, and 1 hiring committee debrief...",
    author: 'Riya Desai', college: 'IIT Bombay', authorInit: 'R', authorGrad: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    upvotes: 312, bookmarked: true, timeago: '3 days ago',
    rounds: [
      { name: 'Recruiter Screen', dur: '30 min', text: 'High-level resume walkthrough, motivation, timeline. Very relaxed. Standard questions about past projects and why Google.' },
      { name: 'Phone Screen — DSA', dur: '45 min', text: 'Two medium/hard problems: (1) Serialize/Deserialize Binary Tree — needed optimal space. (2) DP — coin change variant with constraints. Solved both but rushed the DP.' },
      { name: 'Onsite Round 1 — Coding', dur: '60 min', text: "Graph problem: detect cycle in directed graph + topological sort extension. Follow-up: find all SCCs. I used Kosaraju's — interviewer was impressed." },
      { name: 'Onsite Round 2 — System Design', dur: '60 min', text: "Design a distributed rate limiter at Google scale. I opened with clarifying questions, drew the architecture with Redis cluster, discussed failure modes, leader election, and eventual consistency. They pushed hard on CAP trade-offs." },
      { name: 'Googleyness & Leadership', dur: '45 min', text: "Standard behavioral — times you disagreed with a decision, handled ambiguity, worked across teams. Know your STAR stories cold." },
    ],
    tips: ['Practice explaining your design decisions aloud — they care as much about reasoning as the answer.', "Know CAP theorem cold with concrete examples (Spanner vs Bigtable trade-offs).", 'For Googleyness, have 3-4 stories that map to multiple values.', 'Ask good clarifying questions in system design before jumping in — shows maturity.'],
  },
  {
    id: 'meta',
    logo: <FiMessageSquare />, logoBg: 'rgba(24,119,242,0.15)',
    company: 'Meta', role: 'Software Engineer E4 · Hyderabad · Jan 2025',
    verdict: 'rejected', diff: 'hard', company_key: 'meta',
    search: 'meta software engineer hyderabad behavioral',
    tags: [{ label: 'Rejected', icon: <FiXCircle size={12} />, cls: 'rejected' }, { label: 'Hard', icon: <FiAlertCircle size={12} />, cls: 'hard' }, { label: '6 Rounds', icon: <FiClock size={12} />, cls: 'rounds' }, { label: 'Onsite', icon: <FiMapPin size={12} />, cls: 'location' }],
    preview: "Got referred through a friend on the team. Phone screen was LeetCode hard — sliding window variant with optimization twist. Passed to onsite: 2 coding (arrays, graphs), 1 system design (design Instagram feed), 1 behavioral...",
    author: 'Karan Mehta', college: 'NIT Trichy', authorInit: 'K', authorGrad: 'linear-gradient(135deg,#22d3ee,#6366f1)',
    upvotes: 287, bookmarked: false, timeago: '1 week ago',
    rounds: [
      { name: 'Referral + Recruiter Call', dur: '20 min', text: "Referral from IIT alumnus on the team. Recruiter explained E3 vs E4 leveling. Scheduling was quick — 1 week to phone screen." },
      { name: 'Phone Screen — LeetCode Hard', dur: '45 min', text: "Sliding window variant: find the minimum length subarray with sum ≥ K (with negative numbers). Needed prefix sums + deque optimization." },
      { name: 'Onsite Coding 1 — Arrays & Strings', dur: '60 min', text: "Two problems: merge intervals extension + rotated sorted array search. Both solved optimally. Interviewer asked follow-ups on time/space complexity." },
      { name: 'Onsite Coding 2 — Graphs', dur: '60 min', text: "Clone a graph with random pointers + find number of islands variant with diagonal connectivity. Solved both." },
      { name: 'System Design — Instagram Feed', dur: '60 min', text: "My gap area. I proposed a pull-based feed but didn't go deep enough on the fanout problem for celebrities with 100M followers. Should have discussed hybrid push/pull." },
      { name: 'Behavioral', dur: '45 min', text: "Meta-specific values: Move Fast, Be Bold, Be Open. Had solid stories but was rattled after the SD round." },
    ],
    tips: ['Know the celebrity problem in feed design — hybrid push/pull is the answer Meta wants.', "LeetCode Hard is real — practice sliding window, monotonic stacks, and segment trees.", "Don't let one bad round affect the next — compartmentalize.", "Read meta engineering blog posts before interviewing — shows genuine interest."],
  },
  {
    id: 'amazon',
    logo: <FiBox />, logoBg: 'rgba(255,153,0,0.15)',
    company: 'Amazon', role: 'SDE I · Pune · Dec 2024',
    verdict: 'selected', diff: 'med', company_key: 'amazon',
    search: 'amazon sde pune leadership principles',
    tags: [{ label: 'Selected', icon: <FiCheckCircle size={12} />, cls: 'selected' }, { label: 'Medium', icon: <FiAlertCircle size={12} />, cls: 'med' }, { label: '4 Rounds', icon: <FiClock size={12} />, cls: 'rounds' }, { label: 'Virtual', icon: <FiMapPin size={12} />, cls: 'location' }],
    preview: "Amazon's process is very LP-heavy. OA had 2 coding Qs (medium difficulty) + a work simulation section. Virtual onsite had 2 coding rounds and 2 behavioral (LP) rounds. Every interviewer asks behavioral — know your STAR stories cold...",
    author: 'Priya Nair', college: 'BITS Pilani', authorInit: 'P', authorGrad: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    upvotes: 245, bookmarked: true, timeago: '2 weeks ago',
    rounds: [
      { name: 'Online Assessment', dur: '90 min', text: "Two coding problems (medium — BFS variant + string manipulation) + a work style simulation section." },
      { name: 'Technical Round 1 — DSA', dur: '60 min', text: "Binary tree diameter + a custom linked list problem. Interviewer asked to optimize after initial solution." },
      { name: 'Technical Round 2 — DSA + LP', dur: '60 min', text: "DP problem (knapsack variant) + 2 LP questions. LP is weighted as heavily as coding at Amazon." },
      { name: 'Bar Raiser', dur: '60 min', text: "Senior interviewer from a different team. 1 harder coding problem + deep LP dive. Had 3 strong ownership stories ready — landed the offer." },
    ],
    tips: ["Prepare 10+ STAR stories mapped to Amazon's 16 Leadership Principles.", "The Bar Raiser round is critical — they can veto the offer.", "During LP answers, quantify your impact wherever possible.", "Amazon OA work simulation: pick answers that show 'ownership' and 'bias for action'."],
  },
  {
    id: 'microsoft',
    logo: <FiBriefcase />, logoBg: 'rgba(0,120,212,0.15)',
    company: 'Microsoft', role: 'SWE · Noida · Jan 2025',
    verdict: 'selected', diff: 'med', company_key: 'microsoft',
    search: 'microsoft swe noida azure',
    tags: [{ label: 'Selected', icon: <FiCheckCircle size={12} />, cls: 'selected' }, { label: 'Medium', icon: <FiAlertCircle size={12} />, cls: 'med' }, { label: '4 Rounds', icon: <FiClock size={12} />, cls: 'rounds' }, { label: 'Onsite', icon: <FiMapPin size={12} />, cls: 'location' }],
    preview: "Microsoft's process was pleasant. 3 technical rounds + 1 As-Appropriate (AA) round with a principal engineer. Coding rounds had a mix of DSA and design questions — they prefer candidates who explain thought process clearly...",
    author: 'Saurabh K', college: 'DTU Delhi', authorInit: 'S', authorGrad: 'linear-gradient(135deg,#10b981,#6366f1)',
    upvotes: 198, bookmarked: false, timeago: '2 weeks ago',
    rounds: [
      { name: 'Technical Round 1', dur: '60 min', text: "String manipulation + OOP design question (design a parking lot). They care about clean, maintainable code." },
      { name: 'Technical Round 2', dur: '60 min', text: "Graph problem (shortest path with constraints) + mini system design: design a notification service." },
      { name: 'Technical Round 3', dur: '60 min', text: "DP problem (longest palindromic subsequence) + behavioral (times you dealt with ambiguity)." },
      { name: 'As-Appropriate (AA) Round', dur: '45 min', text: "Principal engineer from Azure team. Felt like a senior coffee chat. Offer came in 5 business days." },
    ],
    tips: ["Microsoft values communication — explain your thought process every step.", "The AA round is conversational — be curious and ask great questions.", "OOP and LLD are tested here more than at FAANG — know design patterns.", "Process is kinder than Google/Meta — interviewers guide you if you're stuck."],
  },
  {
    id: 'flipkart',
    logo: <FiBox />, logoBg: 'rgba(255,102,0,0.12)',
    company: 'Flipkart', role: 'SDE Intern → FTE · Bangalore · Nov 2024',
    verdict: 'intern', diff: 'easy', company_key: 'flipkart',
    search: 'flipkart sde bangalore intern',
    tags: [{ label: 'Intern→FTE', icon: <FiAward size={12} />, cls: 'intern' }, { label: 'Easy', icon: <FiAlertCircle size={12} />, cls: 'easy' }, { label: '3 Rounds', icon: <FiClock size={12} />, cls: 'rounds' }, { label: 'Virtual', icon: <FiMapPin size={12} />, cls: 'location' }],
    preview: "Flipkart's intern process is very streamlined. CodeNation test (60 min), followed by 2 technical rounds focusing on DSA fundamentals and 1 HR round. Conversion offer came at end of internship...",
    author: 'Aanya Rao', college: 'VIT Vellore', authorInit: 'A', authorGrad: 'linear-gradient(135deg,#f59e0b,#8b5cf6)',
    upvotes: 176, bookmarked: false, timeago: '1 month ago',
    rounds: [
      { name: 'CodeNation Test', dur: '60 min', text: "2 DSA problems — easy-medium level. Focused on basic arrays and strings." },
      { name: 'Technical Interview 1', dur: '60 min', text: "Recursion + DP fundamentals. Friendly interviewer. They value clarity of thought over speed." },
      { name: 'Technical Interview 2 + HR', dur: '60 min', text: "OOP design + HR questions about career goals and why Flipkart. Conversion offer came after 3-month internship." },
    ],
    tips: ["Flipkart intern process is entry-level friendly — focus on fundamentals.", "During internship, volunteer for cross-team projects to boost conversion chances.", "Show ownership during intern project — present impact metrics in conversion review."],
  },
  {
    id: 'stripe',
    logo: <FiBriefcase />, logoBg: 'rgba(99,91,255,0.15)',
    company: 'Stripe', role: 'Platform Engineer · Remote · Oct 2024',
    verdict: 'rejected', diff: 'hard', company_key: 'stripe',
    search: 'stripe platform engineer remote payments',
    tags: [{ label: 'Rejected', icon: <FiXCircle size={12} />, cls: 'rejected' }, { label: 'Hard', icon: <FiAlertCircle size={12} />, cls: 'hard' }, { label: '6 Rounds', icon: <FiClock size={12} />, cls: 'rounds' }, { label: 'Remote', icon: <FiMapPin size={12} />, cls: 'location' }],
    preview: "Stripe's loop is intense — 6 rounds over 2 days. Includes a unique 'Codelab' round (build a mini-feature in their codebase), systems design, coding, and 2 behavioral rounds. The Codelab was unlike anything else...",
    author: 'Dev Sharma', college: 'IIT Madras', authorInit: 'D', authorGrad: 'linear-gradient(135deg,#6366f1,#22d3ee)',
    upvotes: 167, bookmarked: false, timeago: '1 month ago',
    rounds: [
      { name: 'Recruiter Screen', dur: '30 min', text: "Background check, timeline, role alignment. Stripe moves fast once you pass this." },
      { name: 'Technical Phone Screen', dur: '60 min', text: "Live coding on CoderPad. Two medium problems. Also asked about a past system you built — architecture, trade-offs." },
      { name: 'Codelab Round', dur: '90 min', text: "Unique to Stripe: add a feature to a real-ish codebase (payments mini-app). Expected tests, documentation, clean code." },
      { name: 'System Design', dur: '60 min', text: "Design a payment processing system with idempotency, retries, and double-charge prevention." },
      { name: 'Behavioral Round 1', dur: '45 min', text: "Values-focused: ownership, craftsmanship, user empathy. Went well." },
      { name: 'Behavioral Round 2 — Final Review', dur: '45 min', text: "Cross-functional round. Got rejected at committee level — 'strong technical, cultural fit concerns'. Vague feedback." },
    ],
    tips: ["The Codelab is make-or-break — write tests, handle edge cases, add comments.", "Stripe deeply values 'User Empathy' — frame everything from the user's perspective.", "For payment systems: always discuss idempotency keys and retry logic.", "Don't skip the human-side rounds — Stripe is selective about culture fit."],
  },
];

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
  const [companyFilter, setCompanyFilter] = useState('all');
  const [votes, setVotes] = useState({});
  const [bookmarks, setBookmarks] = useState({ google: true, amazon: true });
  const [modalExp, setModalExp] = useState(null);

  const filtered = experienceData.filter(exp => {
    if (verdictFilter !== 'all' && exp.verdict !== verdictFilter) return false;
    if (diffFilter && exp.diff !== diffFilter) return false;
    if (companyFilter !== 'all' && exp.company_key !== companyFilter) return false;
    if (search && !exp.search.includes(search.toLowerCase()) && !exp.preview.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
            { val: '2,418', label: 'Total Reports', color: t.cyan },
            { val: '67%', label: 'Selection Rate', color: t.textPrimary },
            { val: '143', label: 'Your Saved', color: '#f97316' },
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
          {filtered.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.5, marginBottom: 12, color: 'var(--text-muted)' }}><FiSearch size={40} /></div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>No results found</div>
              <div style={{ fontSize: 13 }}>Try a different search or adjust your filters</div>
            </div>
          ) : filtered.map(exp => (
            <div key={exp.id} style={styles.expCard} onClick={() => setModalExp(exp)}>
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
            <button style={styles.submitBtn}>+ Submit Experience</button>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelTitle}>🏢 Filter by Company</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                { key: 'all', label: 'All', count: 2418 },
                { key: 'google', label: '🇬 Google', count: 342 },
                { key: 'meta', label: 'Ⓜ️ Meta', count: 287 },
                { key: 'amazon', label: '📦 Amazon', count: 398 },
                { key: 'microsoft', label: '💼 Microsoft', count: 271 },
                { key: 'flipkart', label: '🛍️ Flipkart', count: 189 },
                { key: 'stripe', label: '💳 Stripe', count: 94 },
              ].map(c => (
                <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 6, background: companyFilter === c.key ? t.cyanDim : t.elevated, border: `1px solid ${companyFilter === c.key ? t.borderGlow : t.border}`, borderRadius: 20, padding: '5px 11px', fontSize: 12, cursor: 'pointer', color: companyFilter === c.key ? t.cyanLight : 'inherit' }}
                  onClick={() => setCompanyFilter(c.key)}>
                  {c.label} <span style={{ fontSize: 10, color: t.textMuted }}>{c.count}</span>
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
                {modalExp.rounds.map((round, i) => (
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
