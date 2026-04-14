import React, { useState, useEffect } from 'react';
import {
    FiX, FiPlus, FiTrash2, FiChevronDown, FiCheck,
    FiBriefcase, FiDollarSign, FiTarget, FiCode, FiMessageSquare
} from 'react-icons/fi';
import { submitExperience } from '../services/experienceApi';

const DEFAULT_ROUND = { name: '', desc: '', questions: '' };

const COMPANIES_LIST = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Flipkart', 'Stripe', 'Uber', 'Atlassian', 'Adobe', 'Walmart', 'Goldman Sachs', 'JPMorgan', 'Barclays', 'HSBC', 'Deutsche Bank', 'Infosys', 'TCS', 'Wipro', 'Persistent Systems', 'Cognizant', 'Accenture', 'Capgemini', 'Tech Mahindra', 'L&T Technology', 'NVIDIA', 'Qualcomm', 'Samsung', 'Cisco', 'Oracle', 'SAP'];

const ShareExperienceModal = ({ t, dark, onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        company: '',
        type: 'placement',
        role: '',
        ctc: '',
        verdict: 'selected',
        campus: 'oncampus',
        diff: 'med',
        rounds: [{ ...DEFAULT_ROUND }, { ...DEFAULT_ROUND }],
        advice: '',
    });
    const [companySearch, setCompanySearch] = useState('');
    const [companyOpen, setCompanyOpen] = useState(false);

    const filteredCo = COMPANIES_LIST.filter(c => c.toLowerCase().includes(companySearch.toLowerCase()));

    const setField = (field, val) => setForm(f => ({ ...f, [field]: val }));
    const setRound = (i, field, val) => setForm(f => ({
        ...f,
        rounds: f.rounds.map((r, j) => j === i ? { ...r, [field]: val } : r),
    }));
    const addRound = () => setForm(f => ({ ...f, rounds: [...f.rounds, { ...DEFAULT_ROUND }] }));
    const removeRound = (i) => setForm(f => ({ ...f, rounds: f.rounds.filter((_, j) => j !== i) }));

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleSubmit = async () => {
        if (!form.company?.trim() || !form.role?.trim()) {
            setSubmitError('Company and Role are required.');
            return;
        }
        setSubmitting(true);
        setSubmitError('');
        try {
            // Pull author info from localStorage (set at login)
            const userRaw = localStorage.getItem('user');
            const user = userRaw ? JSON.parse(userRaw) : {};
            await submitExperience({
                ...form,
                company: form.company.trim(),
                role: form.role.trim(),
                author: user.name || 'Anonymous',
                authorInit: user.name ? user.name[0].toUpperCase() : 'A',
                college: user.college || '',
                userId: user._id || user.id || undefined,
            });
            setSubmitted(true);
            if (onSuccess) onSuccess(); // trigger parent refresh
            setTimeout(onClose, 2200);
        } catch (err) {
            setSubmitError('Submission failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const total = 3;

    const RadioGroup = ({ label, options, field }) => (
        <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>{label}</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {options.map(opt => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => setField(field, opt.value)}
                        style={{
                            padding: '7px 14px', borderRadius: 20,
                            background: form[field] === opt.value ? t.cyanDim : t.elevated,
                            border: `1px solid ${form[field] === opt.value ? t.borderGlow : t.border}`,
                            color: form[field] === opt.value ? t.cyan : t.textSecondary,
                            fontSize: 12.5, fontWeight: form[field] === opt.value ? 700 : 400,
                            cursor: 'pointer', transition: 'all 0.2s',
                        }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );

    const InputField = ({ label, placeholder, field, type = 'text' }) => (
        <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={form[field]}
                onChange={e => setField(field, e.target.value)}
                style={{
                    width: '100%', background: t.elevated, border: `1px solid ${t.border}`,
                    borderRadius: 10, padding: '11px 14px', color: t.textPrimary,
                    fontSize: 13.5, fontFamily: "'Sora', sans-serif", outline: 'none',
                    transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = t.borderGlow}
                onBlur={e => e.target.style.borderColor = t.border}
            />
        </div>
    );

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div
                className="modal-box"
                style={{
                    background: t.surface,
                    border: `1px solid ${t.border}`,
                    borderRadius: '20px 20px 0 0',
                    width: '100%', maxWidth: 620,
                    maxHeight: '90vh',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 -16px 48px rgba(0,0,0,0.6)',
                }}
            >
                {/* Modal Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px 16px',
                    borderBottom: `1px solid ${t.border}`,
                    flexShrink: 0,
                }}>
                    <div>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: t.textPrimary }}>Share Your Experience</h2>
                        <p style={{ fontSize: 12, color: t.textMuted, marginTop: 3 }}>Help juniors prepare · Earn 500 XP</p>
                    </div>
                    <button onClick={onClose} style={{ background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.textMuted, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; e.currentTarget.style.color = '#f43f5e'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = t.elevated; e.currentTarget.style.color = t.textMuted; }}>
                        <FiX size={16} />
                    </button>
                </div>

                {/* Step indicator */}
                <div style={{ display: 'flex', padding: '12px 24px', gap: 8, flexShrink: 0 }}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                            <div style={{
                                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                                background: step > s ? t.cyan : step === s ? t.cyanDim : t.elevated,
                                border: `1.5px solid ${step >= s ? t.cyan : t.border}`,
                                color: step > s ? '#000' : step === s ? t.cyan : t.textMuted,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 10, fontWeight: 700, transition: 'all 0.3s',
                            }}>
                                {step > s ? <FiCheck size={12} /> : s}
                            </div>
                            <div style={{ fontSize: 11, color: step >= s ? t.cyan : t.textMuted, fontWeight: step === s ? 700 : 400, transition: 'color 0.3s' }}>
                                {['Company Info', 'Round Details', 'Final Tips'][s - 1]}
                            </div>
                            {s < 3 && <div style={{ flex: 1, height: 1, background: step > s ? t.cyan : t.border, transition: 'background 0.3s' }} />}
                        </div>
                    ))}
                </div>

                {/* Modal Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 20px' }}>

                    {/* Step 1: Company Info */}
                    {step === 1 && (
                        <div style={{ animation: 'fadeUp 0.25s ease' }}>
                            {/* Company search */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Company</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        placeholder="Search company..."
                                        value={companySearch || form.company}
                                        onChange={e => {
                                            const value = e.target.value;
                                            setCompanySearch(value);
                                            setField('company', value);
                                            setCompanyOpen(true);
                                        }}
                                        onFocus={() => setCompanyOpen(true)}
                                        style={{ width: '100%', background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 10, padding: '11px 14px', color: t.textPrimary, fontSize: 13.5, fontFamily: "'Sora', sans-serif", outline: 'none' }}
                                        onFocusCapture={e => e.target.style.borderColor = t.borderGlow}
                                        onBlur={e => {
                                            e.target.style.borderColor = t.border;
                                            setField('company', (companySearch || form.company || '').trim());
                                            setTimeout(() => setCompanyOpen(false), 150);
                                        }}
                                    />
                                    {companyOpen && filteredCo.length > 0 && (
                                        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 10, zIndex: 10, maxHeight: 200, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                                            {filteredCo.map(c => (
                                                <button key={c} onMouseDown={() => { setField('company', c); setCompanySearch(''); setCompanyOpen(false); }}
                                                    style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '9px 14px', color: t.textSecondary, fontSize: 13, cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = t.cyanDim; e.currentTarget.style.color = t.cyan; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = t.textSecondary; }}>
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <RadioGroup label="Type" field="type" options={[{ value: 'placement', label: 'Placement (FTE)' }, { value: 'internship', label: 'Internship' }]} />
                            <InputField label="Role / Position" placeholder="e.g. Software Development Engineer" field="role" />
                            <InputField label="CTC / Stipend" placeholder="e.g. 32 LPA or 1.2L/mo" field="ctc" />
                            <RadioGroup label="Verdict" field="verdict" options={[{ value: 'selected', label: 'Selected' }, { value: 'rejected', label: 'Rejected' }, { value: 'intern', label: 'Intern Offer' }]} />
                            <RadioGroup label="Campus Type" field="campus" options={[{ value: 'oncampus', label: 'On-campus' }, { value: 'offcampus', label: 'Off-campus' }]} />
                            <RadioGroup label="Difficulty" field="diff" options={[{ value: 'easy', label: 'Easy' }, { value: 'med', label: 'Medium' }, { value: 'hard', label: 'Hard' }]} />
                        </div>
                    )}

                    {/* Step 2: Round Details */}
                    {step === 2 && (
                        <div style={{ animation: 'fadeUp 0.25s ease' }}>
                            <p style={{ fontSize: 13, color: t.textMuted, marginBottom: 16 }}>Fill in each interview round below. Add as many rounds as needed.</p>
                            {form.rounds.map((round, i) => (
                                <div key={i} style={{ background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 24, height: 24, borderRadius: 7, background: t.cyanDim, color: t.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary }}>Round {i + 1}</span>
                                        </div>
                                        {form.rounds.length > 2 && (
                                            <button onClick={() => removeRound(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, display: 'flex', padding: 4 }}
                                                onMouseEnter={e => e.currentTarget.style.color = '#f43f5e'} onMouseLeave={e => e.currentTarget.style.color = t.textMuted}>
                                                <FiTrash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        placeholder="Round name (e.g. System Design, Phone Screen)"
                                        value={round.name}
                                        onChange={e => setRound(i, 'name', e.target.value)}
                                        style={{ width: '100%', background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: '9px 12px', color: t.textPrimary, fontSize: 13, fontFamily: "'Sora', sans-serif", outline: 'none', marginBottom: 10 }}
                                        onFocus={e => e.target.style.borderColor = t.borderGlow}
                                        onBlur={e => e.target.style.borderColor = t.border}
                                    />
                                    <textarea
                                        placeholder="Describe what happened in this round..."
                                        value={round.desc}
                                        onChange={e => setRound(i, 'desc', e.target.value)}
                                        rows={2}
                                        style={{ width: '100%', background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: '9px 12px', color: t.textPrimary, fontSize: 13, fontFamily: "'Sora', sans-serif", outline: 'none', resize: 'vertical', marginBottom: 10 }}
                                        onFocus={e => e.target.style.borderColor = t.borderGlow}
                                        onBlur={e => e.target.style.borderColor = t.border}
                                    />
                                    <div>
                                        <label style={{ fontSize: 11, color: t.textMuted, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                                            <FiCode size={12} /> DSA / Technical Questions asked
                                        </label>
                                        <textarea
                                            placeholder="List questions (one per line)..."
                                            value={round.questions}
                                            onChange={e => setRound(i, 'questions', e.target.value)}
                                            rows={3}
                                            style={{ width: '100%', background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, padding: '9px 12px', color: t.textPrimary, fontSize: 13, fontFamily: "'Sora', sans-serif", outline: 'none', resize: 'vertical' }}
                                            onFocus={e => e.target.style.borderColor = t.borderGlow}
                                            onBlur={e => e.target.style.borderColor = t.border}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={addRound}
                                style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.elevated, border: `1.5px dashed ${t.border}`, borderRadius: 10, padding: '10px 16px', cursor: 'pointer', color: t.cyan, fontSize: 13, fontWeight: 600, width: '100%', justifyContent: 'center', transition: 'all 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = t.borderGlow}
                                onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
                            >
                                <FiPlus size={16} /> Add Round
                            </button>
                        </div>
                    )}

                    {/* Step 3: Advice */}
                    {step === 3 && !submitted && (
                        <div style={{ animation: 'fadeUp 0.25s ease' }}>
                            <p style={{ fontSize: 13, color: t.textMuted, marginBottom: 16 }}>What advice would you give to juniors preparing for this company?</p>
                            <textarea
                                placeholder="Share tips, resources, gotchas, and key takeaways that helped you..."
                                value={form.advice}
                                onChange={e => setField('advice', e.target.value)}
                                rows={7}
                                style={{ width: '100%', background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 12, padding: '14px 16px', color: t.textPrimary, fontSize: 13.5, fontFamily: "'Sora', sans-serif", outline: 'none', resize: 'vertical', lineHeight: 1.7 }}
                                onFocus={e => e.target.style.borderColor = t.borderGlow}
                                onBlur={e => e.target.style.borderColor = t.border}
                            />
                            {/* Summary preview */}
                            {form.company && (
                                <div style={{ background: t.elevated, border: `1px solid ${t.border}`, borderRadius: 10, padding: 14, marginTop: 16 }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Preview</div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary, marginBottom: 4 }}>{form.company} — {form.role || 'Role'}</div>
                                    <div style={{ fontSize: 12, color: t.textMuted }}>{form.type === 'placement' ? 'Placement' : 'Internship'} · {form.ctc || 'CTC TBD'} · {form.rounds.length} rounds</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Submitted state */}
                    {submitted && (
                        <div style={{ textAlign: 'center', padding: '32px 0', animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: t.cyanDim, border: `2px solid ${t.cyan}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <FiCheck size={28} color={t.cyan} />
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: t.textPrimary, marginBottom: 8 }}>Experience Shared!</div>
                            <div style={{ fontSize: 13, color: t.textMuted }}>You earned <span style={{ color: t.cyan, fontWeight: 700 }}>+500 XP</span>. Thank you for helping the community.</div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                {!submitted && (
                    <div style={{ padding: '14px 24px', borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
                        {submitError && (
                            <div style={{ color: '#f43f5e', fontSize: 12.5, marginBottom: 10, padding: '8px 12px', background: 'rgba(244,63,94,0.1)', borderRadius: 8 }}>
                                ⚠ {submitError}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: 10 }}>
                            {step > 1 && (
                                <button onClick={() => setStep(s => s - 1)} disabled={submitting} style={{ flex: 1, background: t.elevated, border: `1px solid ${t.border}`, color: t.textSecondary, padding: '11px 0', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: "'Sora', sans-serif", transition: 'all 0.2s' }}>
                                    Back
                                </button>
                            )}
                            <button
                                onClick={step < 3 ? () => setStep(s => s + 1) : handleSubmit}
                                disabled={submitting}
                                style={{ flex: 2, background: submitting ? t.elevated : t.cyan, border: 'none', color: submitting ? t.textMuted : '#000', padding: '11px 0', borderRadius: 10, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, fontFamily: "'Sora', sans-serif", boxShadow: submitting ? 'none' : `0 4px 20px rgba(6,182,212,0.35)`, transition: 'all 0.2s' }}
                            >
                                {step < 3 ? 'Continue →' : submitting ? 'Submitting…' : 'Submit Experience'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareExperienceModal;
