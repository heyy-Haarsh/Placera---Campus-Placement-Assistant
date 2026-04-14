import React, { useState, useEffect, useCallback } from 'react';
import {
  FiCheckCircle, FiXCircle, FiAward, FiAlertCircle,
  FiClock, FiMapPin, FiBriefcase, FiSearch, FiFilter,
} from 'react-icons/fi';
import { fetchExperiences } from '../../../services/experienceApi';

// ── Tag style map (same as Vault) ──────────────────────────────
const tagCls = {
  selected:   { background: 'rgba(6,182,212,0.1)',   color: '#22d3ee',  border: '1px solid rgba(6,182,212,0.3)' },
  rejected:   { background: 'rgba(244,63,94,0.1)',   color: '#f43f5e',  border: '1px solid rgba(244,63,94,0.2)' },
  intern:     { background: 'rgba(6,182,212,0.08)',  color: '#06b6d4',  border: '1px solid rgba(6,182,212,0.2)' },
  hard:       { background: 'rgba(244,63,94,0.1)',   color: '#f43f5e' },
  med:        { background: 'rgba(245,158,11,0.1)',  color: '#f97316' },
  easy:       { background: 'rgba(6,182,212,0.08)', color: '#22d3ee' },
  rounds:     { background: 'rgba(99,102,241,0.1)', color: '#8b5cf6' },
  location:   { background: 'rgba(255,255,255,0.05)', color: '#71717a' },
};

function normalize(exp) {
  return {
    id: exp._id,
    company: exp.company,
    role: exp.role,
    ctc: exp.ctc,
    verdict: exp.verdict,
    diff: exp.diff,
    author: exp.author || 'Anonymous',
    college: exp.college || '',
    upvotes: exp.upvotes || 0,
    timeago: exp.createdAt ? new Date(exp.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '',
    preview: exp.advice || exp.rounds?.[0]?.desc || '',
    rounds: (exp.rounds || []).map(r => ({
      name: r.name,
      text: [r.desc, r.questions ? `Questions: ${r.questions}` : ''].filter(Boolean).join('\n\n'),
    })),
    tags: [
      exp.verdict === 'selected' ? { label: 'Selected', icon: <FiCheckCircle size={10} />, cls: 'selected' }
        : exp.verdict === 'rejected' ? { label: 'Rejected', icon: <FiXCircle size={10} />, cls: 'rejected' }
        : { label: 'Intern', icon: <FiAward size={10} />, cls: 'intern' },
      { label: exp.diff === 'easy' ? 'Easy' : exp.diff === 'med' ? 'Medium' : 'Hard', icon: <FiAlertCircle size={10} />, cls: exp.diff },
      { label: `${exp.rounds?.length || 0} Rounds`, icon: <FiClock size={10} />, cls: 'rounds' },
      { label: exp.campus === 'oncampus' ? 'On-campus' : 'Off-campus', icon: <FiMapPin size={10} />, cls: 'location' },
    ],
  };
}

const ExperiencesModule = ({ companyData, t }) => {
  const [exps, setExps]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [verdictFilter, setVF]  = useState('');
  const [diffFilter, setDF]     = useState('');
  const [modalExp, setModal]    = useState(null);
  const [modalLoading, setML]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const filters = { company: companyData.name };
      if (verdictFilter) filters.verdict = verdictFilter;
      if (diffFilter)    filters.diff    = diffFilter;
      const data = await fetchExperiences(filters);
      setExps((data.experiences || []).map(normalize));
    } catch {}
    finally { setLoading(false); }
  }, [companyData.name, verdictFilter, diffFilter]);

  useEffect(() => { load(); }, [load]);

  const openModal = async (card) => {
    setModal(card);
    setML(true);
    try {
      const res = await fetch(`http://localhost:5000/api/experiences/${card.id}`);
      if (res.ok) {
        const { experience: raw } = await res.json();
        setModal({ ...card, rounds: (raw.rounds || []).map(r => ({ name: r.name, text: [r.desc, r.questions ? `Questions: ${r.questions}` : ''].filter(Boolean).join('\n\n') })) });
      }
    } catch {}
    finally { setML(false); }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Filter bar */}
      <div style={{ padding: '12px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <FiFilter size={13} color={t.textMuted} />
        {['', 'selected', 'rejected', 'intern'].map(v => (
          <button key={v} onClick={() => setVF(v)}
            style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
              background: verdictFilter === v ? t.cyanDim : t.elevated,
              border: `1px solid ${verdictFilter === v ? t.borderGlow : t.border}`,
              color: verdictFilter === v ? t.cyan : t.textSecondary }}>
            {v === '' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
        <div style={{ width: 1, height: 16, background: t.border }} />
        {['', 'easy', 'med', 'hard'].map(d => (
          <button key={d} onClick={() => setDF(diffFilter === d ? '' : d)}
            style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
              background: diffFilter === d && d ? t.cyanDim : t.elevated,
              border: `1px solid ${diffFilter === d && d ? t.borderGlow : t.border}`,
              color: diffFilter === d && d ? t.cyan : t.textSecondary }}>
            {d === '' ? 'Any Diff' : d === 'med' ? 'Medium' : d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 11.5, color: t.textMuted }}>{exps.length} experience{exps.length !== 1 ? 's' : ''}</div>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18 }}>
              {[['40%',14],['60%',10],['90%',10]].map(([w,h],j) => (
                <div key={j} style={{ height: h, background: t.elevated, borderRadius: 6, width: w, marginBottom: 10 }} />
              ))}
            </div>
          ))
        ) : exps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: t.textMuted }}>
            <FiBriefcase size={36} style={{ opacity: 0.4, marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: t.textSecondary, marginBottom: 6 }}>No experiences yet for {companyData.name}</div>
            <div style={{ fontSize: 13 }}>Be the first to share! Go to Home Feed → Share Experience</div>
          </div>
        ) : exps.map(exp => (
          <div key={exp.id} onClick={() => openModal(exp)}
            style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18, cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = t.borderGlow}
            onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: t.textPrimary, marginBottom: 2 }}>{exp.role}{exp.ctc ? ` · ${exp.ctc}` : ''}</div>
                <div style={{ fontSize: 12, color: t.textMuted }}>{exp.author}{exp.college ? ` · ${exp.college}` : ''} · {exp.timeago}</div>
              </div>
              <div style={{ fontSize: 12, color: t.cyan, fontWeight: 700, flexShrink: 0 }}>↑ {exp.upvotes}</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
              {exp.tags.map((tag, i) => (
                <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 3, ...tagCls[tag.cls] }}>
                  {tag.icon} {tag.label}
                </span>
              ))}
            </div>
            {exp.preview && (
              <div style={{ fontSize: 12.5, color: t.textSecondary, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {exp.preview}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalExp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '85vh', overflowY: 'auto', position: 'relative' }}>
            {/* Header */}
            <div style={{ padding: '24px 28px 18px', borderBottom: `1px solid ${t.border}`, position: 'sticky', top: 0, background: t.surface, borderRadius: '20px 20px 0 0', zIndex: 2 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: t.textPrimary, marginBottom: 4 }}>{companyData.name} — {modalExp.role}</div>
              <div style={{ fontSize: 12.5, color: t.textMuted, marginBottom: 10 }}>{modalExp.author}{modalExp.college ? ` · ${modalExp.college}` : ''} · {modalExp.timeago}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {modalExp.tags.map((tag, i) => (
                  <span key={i} style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 3, ...tagCls[tag.cls] }}>
                    {tag.icon} {tag.label}
                  </span>
                ))}
              </div>
              <button onClick={() => setModal(null)}
                style={{ position: 'absolute', top: 20, right: 20, width: 32, height: 32, borderRadius: 8, background: t.elevated, border: `1px solid ${t.border}`, cursor: 'pointer', color: t.textPrimary, fontSize: 14 }}>✕</button>
            </div>
            {/* Body */}
            <div style={{ padding: '22px 28px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: t.textMuted, marginBottom: 14 }}>Interview Rounds</div>
              {modalLoading ? (
                [1,2,3].map(i => <div key={i} style={{ height: 60, background: t.elevated, borderRadius: 10, marginBottom: 10, opacity: 0.5 }} />)
              ) : modalExp.rounds.length === 0 ? (
                <div style={{ color: t.textMuted, fontSize: 13 }}>No round details available.</div>
              ) : modalExp.rounds.map((r, i) => (
                <div key={i} style={{ background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: t.cyanDim, color: t.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i+1}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: t.textPrimary }}>{r.name}</div>
                  </div>
                  <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.65, whiteSpace: 'pre-line' }}>{r.text || 'No details provided.'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperiencesModule;
