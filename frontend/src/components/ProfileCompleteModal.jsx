import React, { useState } from 'react';
import {
    FiUser, FiBook, FiCalendar, FiTarget, FiBriefcase,
    FiLinkedin, FiGithub, FiGlobe, FiCode, FiShield,
    FiCheckCircle, FiX, FiArrowRight, FiArrowLeft,
    FiUpload, FiStar, FiMapPin
} from 'react-icons/fi';

// ─── Small helpers ──────────────────────────────────────────────────────────
const Label = ({ children, t }) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        {children}
    </div>
);

const Input = ({ icon: Icon, t, ...props }) => (
    <div style={{ position: 'relative' }}>
        {Icon && <Icon size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: t.textMuted, pointerEvents: 'none' }} />}
        <input
            {...props}
            style={{
                width: '100%', height: 42,
                background: t.elevated,
                border: `1px solid ${t.border}`,
                borderRadius: 9, outline: 'none',
                padding: Icon ? '0 14px 0 36px' : '0 14px',
                color: t.textPrimary, fontSize: 13.5,
                fontFamily: "'Sora', sans-serif",
                transition: 'border-color 0.15s',
                ...props.style,
            }}
            onFocus={e => e.target.style.borderColor = t.borderGlow}
            onBlur={e => e.target.style.borderColor = t.border}
        />
    </div>
);

const Textarea = ({ t, ...props }) => (
    <textarea
        {...props}
        style={{
            width: '100%', minHeight: 72,
            background: t.elevated, border: `1px solid ${t.border}`,
            borderRadius: 9, outline: 'none', padding: '10px 14px',
            color: t.textPrimary, fontSize: 13.5,
            fontFamily: "'Sora', sans-serif", resize: 'vertical',
            transition: 'border-color 0.15s',
            ...props.style,
        }}
        onFocus={e => e.target.style.borderColor = t.borderGlow}
        onBlur={e => e.target.style.borderColor = t.border}
    />
);

const StepDots = ({ total, current, t }) => (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 28 }}>
        {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ height: 3, borderRadius: 2, transition: 'all 0.3s', width: i === current ? 24 : 8, background: i <= current ? t.cyan : t.elevated }} />
        ))}
    </div>
);

// ─── STUDENT STEPS ──────────────────────────────────────────────────────────
const StudentStep0 = ({ data, setData, t }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
            <Label t={t}>Full Name</Label>
            <Input icon={FiUser} t={t} placeholder="Arjun Sharma" value={data.name} onChange={e => setData(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div>
            <Label t={t}>College / University</Label>
            <Input icon={FiBook} t={t} placeholder="BITS Pilani, CSE" value={data.college} onChange={e => setData(p => ({ ...p, college: e.target.value }))} />
        </div>
        <div>
            <Label t={t}>Branch & Batch</Label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input icon={FiBook} t={t} placeholder="CSE / IT / ECE" value={data.branch} onChange={e => setData(p => ({ ...p, branch: e.target.value }))} />
                <Input icon={FiCalendar} t={t} placeholder="Graduating Year e.g. 2026" value={data.gradYear} onChange={e => setData(p => ({ ...p, gradYear: e.target.value }))} />
            </div>
        </div>
        <div>
            <Label t={t}>Short Bio</Label>
            <Textarea t={t} placeholder="E.g. SDE aspirant focused on DSA and system design. Targeting Google and Antigravity." value={data.bio} onChange={e => setData(p => ({ ...p, bio: e.target.value }))} />
        </div>
    </div>
);

const StudentStep1 = ({ data, setData, t }) => {
    const SKILLS = ['React', 'Node.js', 'Python', 'Java', 'C++', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Redis', 'Go', 'TypeScript'];
    const toggle = skill => setData(p => {
        const s = new Set(p.skills);
        s.has(skill) ? s.delete(skill) : s.add(skill);
        return { ...p, skills: [...s] };
    });
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
                <Label t={t}>LeetCode Username</Label>
                <Input icon={FiCode} t={t} placeholder="arjun_codes" value={data.leetcode} onChange={e => setData(p => ({ ...p, leetcode: e.target.value }))} />
            </div>
            <div>
                <Label t={t}>Target Companies (comma-separated)</Label>
                <Input icon={FiTarget} t={t} placeholder="Google, Antigravity, Amazon, Microsoft" value={data.targets} onChange={e => setData(p => ({ ...p, targets: e.target.value }))} />
            </div>
            <div>
                <Label t={t}>Tech Stack (select all that apply)</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 4 }}>
                    {SKILLS.map(s => {
                        const active = (data.skills || []).includes(s);
                        return (
                            <button key={s} onClick={() => toggle(s)} type="button"
                                style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: active ? 700 : 400, cursor: 'pointer', fontFamily: "'Sora', sans-serif", border: `1px solid ${active ? t.borderGlow : t.border}`, background: active ? t.cyanDim : t.elevated, color: active ? t.cyan : t.textMuted, transition: 'all 0.15s' }}>
                                {s}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div>
                <Label t={t}>Placement Goal</Label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['Internship 2025', 'Full-time 2025', 'Full-time 2026', 'Off-campus'].map(g => {
                        const active = data.goal === g;
                        return (
                            <button key={g} onClick={() => setData(p => ({ ...p, goal: g }))} type="button"
                                style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: active ? 700 : 400, cursor: 'pointer', fontFamily: "'Sora', sans-serif", border: `1px solid ${active ? t.borderGlow : t.border}`, background: active ? t.cyanDim : t.elevated, color: active ? t.cyan : t.textMuted }}>
                                {g}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const StudentStep2 = ({ data, setData, t }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
            <Label t={t}>GitHub Profile URL</Label>
            <Input icon={FiGithub} t={t} placeholder="https://github.com/arjun-sharma" value={data.github} onChange={e => setData(p => ({ ...p, github: e.target.value }))} />
        </div>
        <div>
            <Label t={t}>LinkedIn Profile URL</Label>
            <Input icon={FiLinkedin} t={t} placeholder="https://linkedin.com/in/arjun-sharma" value={data.linkedin} onChange={e => setData(p => ({ ...p, linkedin: e.target.value }))} />
        </div>
        <div>
            <Label t={t}>Portfolio / Personal Website (optional)</Label>
            <Input icon={FiGlobe} t={t} placeholder="https://arjunsharma.dev" value={data.portfolio} onChange={e => setData(p => ({ ...p, portfolio: e.target.value }))} />
        </div>
        <div>
            <Label t={t}>Resume Upload (optional)</Label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 9, border: `1px dashed ${t.borderGlow}`, background: t.elevated, cursor: 'pointer' }}>
                <FiUpload size={15} style={{ color: t.cyan, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: data.resume ? t.textPrimary : t.textMuted }}>
                    {data.resume ? data.resume.name : 'Click to upload your resume (PDF)'}
                </span>
                <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setData(p => ({ ...p, resume: e.target.files[0] }))} />
            </label>
        </div>
    </div>
);

// ─── SENIOR STEPS ────────────────────────────────────────────────────────────
const SeniorStep0 = ({ data, setData, t }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
            <Label t={t}>Full Name</Label>
            <Input icon={FiUser} t={t} placeholder="Priya Nair" value={data.name} onChange={e => setData(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div>
            <Label t={t}>Current Company</Label>
            <Input icon={FiBriefcase} t={t} placeholder="Google, Antigravity, Microsoft…" value={data.company} onChange={e => setData(p => ({ ...p, company: e.target.value }))} />
        </div>
        <div>
            <Label t={t}>Designation</Label>
            <Input icon={FiStar} t={t} placeholder="SDE II, Senior Engineer, PM…" value={data.designation} onChange={e => setData(p => ({ ...p, designation: e.target.value }))} />
        </div>
        <div>
            <Label t={t}>College & Batch</Label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input icon={FiBook} t={t} placeholder="College / IIT / BITS" value={data.college} onChange={e => setData(p => ({ ...p, college: e.target.value }))} />
                <Input icon={FiCalendar} t={t} placeholder="Graduation Year e.g. 2023" value={data.gradYear} onChange={e => setData(p => ({ ...p, gradYear: e.target.value }))} />
            </div>
        </div>
        <div>
            <Label t={t}>Short Bio</Label>
            <Textarea t={t} placeholder="E.g. Google SDE II with 2 years of experience. Happy to mentor DSA and system design." value={data.bio} onChange={e => setData(p => ({ ...p, bio: e.target.value }))} />
        </div>
    </div>
);

const SeniorStep1 = ({ data, setData, t }) => {
    const SESSION_TYPES = ['DSA', 'System Design', 'HR / Behavioral', 'Full Mock'];
    const COMPANIES = ['Google', 'Antigravity', 'Amazon', 'Microsoft', 'Meta', 'Flipkart', 'Razorpay', 'Atlassian', 'Stripe', 'Zepto'];
    const toggleType = type => setData(p => {
        const s = new Set(p.sessionTypes);
        s.has(type) ? s.delete(type) : s.add(type);
        return { ...p, sessionTypes: [...s] };
    });
    const toggleCo = co => setData(p => {
        const s = new Set(p.mentorFor);
        s.has(co) ? s.delete(co) : s.add(co);
        return { ...p, mentorFor: [...s] };
    });
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <Label t={t}>Session Types You Can Offer</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 4 }}>
                    {SESSION_TYPES.map(s => {
                        const active = (data.sessionTypes || []).includes(s);
                        return (
                            <button key={s} onClick={() => toggleType(s)} type="button"
                                style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: active ? 700 : 400, cursor: 'pointer', fontFamily: "'Sora', sans-serif", border: `1px solid ${active ? t.borderGlow : t.border}`, background: active ? t.cyanDim : t.elevated, color: active ? t.cyan : t.textMuted }}>
                                {s}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div>
                <Label t={t}>Companies I Can Mentor For</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 4 }}>
                    {COMPANIES.map(co => {
                        const active = (data.mentorFor || []).includes(co);
                        return (
                            <button key={co} onClick={() => toggleCo(co)} type="button"
                                style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: active ? 700 : 400, cursor: 'pointer', fontFamily: "'Sora', sans-serif", border: `1px solid ${active ? t.borderGlow : t.border}`, background: active ? t.cyanDim : t.elevated, color: active ? t.cyan : t.textMuted }}>
                                {co}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div>
                <Label t={t}>Max Sessions / Week</Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button type="button" onClick={() => setData(p => ({ ...p, maxSessions: Math.max(1, (p.maxSessions || 3) - 1) }))}
                        style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${t.border}`, background: t.elevated, color: t.textPrimary, cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontSize: 18, fontWeight: 800, color: t.cyan, minWidth: 24, textAlign: 'center' }}>{data.maxSessions || 3}</span>
                    <button type="button" onClick={() => setData(p => ({ ...p, maxSessions: Math.min(10, (p.maxSessions || 3) + 1) }))}
                        style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${t.border}`, background: t.elevated, color: t.textPrimary, cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    <span style={{ fontSize: 12, color: t.textMuted, marginLeft: 4 }}>sessions per week</span>
                </div>
            </div>
            <div>
                <Label t={t}>Referral Availability</Label>
                <div style={{ display: 'flex', gap: 8 }}>
                    {[{ val: true, label: 'Open for referrals' }, { val: false, label: 'Not available now' }].map(opt => (
                        <button key={String(opt.val)} type="button" onClick={() => setData(p => ({ ...p, referrals: opt.val }))}
                            style={{ flex: 1, padding: '8px 12px', borderRadius: 9, fontSize: 12.5, fontWeight: data.referrals === opt.val ? 700 : 400, cursor: 'pointer', fontFamily: "'Sora', sans-serif", border: `1px solid ${data.referrals === opt.val ? t.borderGlow : t.border}`, background: data.referrals === opt.val ? t.cyanDim : t.elevated, color: data.referrals === opt.val ? t.cyan : t.textMuted }}>
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SeniorStep2 = ({ data, setData, t }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
            <Label t={t}>LinkedIn Profile URL</Label>
            <Input icon={FiLinkedin} t={t} placeholder="https://linkedin.com/in/priya-nair" value={data.linkedin} onChange={e => setData(p => ({ ...p, linkedin: e.target.value }))} />
        </div>
        <div>
            <Label t={t}>GitHub Profile URL (optional)</Label>
            <Input icon={FiGithub} t={t} placeholder="https://github.com/priya-nair" value={data.github} onChange={e => setData(p => ({ ...p, github: e.target.value }))} />
        </div>
        <div>
            <Label t={t}>Portfolio / Blog (optional)</Label>
            <Input icon={FiGlobe} t={t} placeholder="https://priyanair.dev" value={data.portfolio} onChange={e => setData(p => ({ ...p, portfolio: e.target.value }))} />
        </div>
        <div style={{ padding: '14px 16px', background: t.elevated, borderRadius: 12, border: `1px solid ${t.borderGlow}`, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <FiShield size={16} style={{ color: t.cyan, flexShrink: 0, marginTop: 1 }} />
            <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.textPrimary, marginBottom: 3 }}>Senior Verification</div>
                <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.6 }}>
                    Your profile will be reviewed by an admin using your LinkedIn + company info. You'll receive a "Verified Senior" badge once confirmed (usually within 24h).
                </div>
            </div>
        </div>
    </div>
);

// ─── STEP CONFIG ─────────────────────────────────────────────────────────────
const STUDENT_STEPS = [
    { title: 'Basic Info', subtitle: 'Tell us who you are', component: StudentStep0 },
    { title: 'Prep Profile', subtitle: 'Your skills and placement goals', component: StudentStep1 },
    { title: 'Links & Resume', subtitle: 'Add your socials and resume', component: StudentStep2 },
];
const SENIOR_STEPS = [
    { title: 'Your Identity', subtitle: 'Introduce yourself', component: SeniorStep0 },
    { title: 'Mentor Setup', subtitle: 'What you can offer to juniors', component: SeniorStep1 },
    { title: 'Links & Verify', subtitle: 'Socials + verification', component: SeniorStep2 },
];

// ─── MAIN MODAL ──────────────────────────────────────────────────────────────
const ProfileCompleteModal = ({ t, role, onComplete }) => {
    const STEPS = role === 'senior' ? SENIOR_STEPS : STUDENT_STEPS;
    const [step, setStep] = useState(0);
    const [data, setData] = useState({ skills: [], sessionTypes: [], mentorFor: [], maxSessions: 3 });
    const [submitting, setSubmitting] = useState(false);

    const isLast = step === STEPS.length - 1;
    const StepComponent = STEPS[step].component;

    const handleNext = async () => {
        if (!isLast) { setStep(s => s + 1); return; }
        // Final submit — save to backend / localStorage
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
                await fetch(`${API_URL}/api/profile/complete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ ...data, role }),
                });
            }
        } catch (_) { /* server may not be up — still complete locally */ }
        // Mark profile as complete in localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...user, profileComplete: true, ...data }));
        setSubmitting(false);
        onComplete();
    };

    return (
        /* Backdrop */
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            {/* Modal */}
            <div style={{ width: '100%', maxWidth: 520, background: t.card, border: `1px solid ${t.borderGlow}`, borderRadius: 20, overflow: 'hidden', boxShadow: `0 0 60px rgba(6,182,212,0.1)` }}>

                {/* Header */}
                <div style={{ padding: '22px 28px 18px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: t.cyanDim, border: `1px solid ${t.borderGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {role === 'senior' ? <FiShield size={16} style={{ color: t.cyan }} /> : <FiUser size={16} style={{ color: t.cyan }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: t.textPrimary }}>Complete Your Profile</div>
                        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 1 }}>
                            {role === 'senior' ? 'Senior Mentor Setup' : 'Student Profile Setup'} · {STEPS[step].subtitle}
                        </div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: t.cyan, padding: '3px 8px', borderRadius: 20, background: t.cyanDim, border: `1px solid ${t.borderGlow}` }}>
                        {step + 1} / {STEPS.length}
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: '24px 28px' }}>
                    <StepDots total={STEPS.length} current={step} t={t} />

                    <div style={{ marginBottom: 6 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: t.textPrimary, marginBottom: 4 }}>{STEPS[step].title}</div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <StepComponent data={data} setData={setData} t={t} />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        {step > 0 && (
                            <button type="button" onClick={() => setStep(s => s - 1)}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, border: `1px solid ${t.border}`, background: 'transparent', color: t.textMuted, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>
                                <FiArrowLeft size={13} /> Back
                            </button>
                        )}
                        <button type="button" onClick={handleNext} disabled={submitting}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 20px', borderRadius: 10, background: t.cyan, border: 'none', color: '#000', fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: "'Sora', sans-serif", opacity: submitting ? 0.7 : 1, boxShadow: `0 0 20px rgba(6,182,212,0.3)`, transition: 'all 0.2s' }}>
                            {submitting ? 'Saving...' : isLast ? (<><FiCheckCircle size={14} /> Complete Profile</>) : (<>Next <FiArrowRight size={13} /></>)}
                        </button>
                    </div>

                    {/* Skip */}
                    <div style={{ textAlign: 'center', marginTop: 14 }}>
                        <button type="button" onClick={onComplete}
                            style={{ fontSize: 11, color: t.textMuted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>
                            Skip for now — I'll complete this later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCompleteModal;
