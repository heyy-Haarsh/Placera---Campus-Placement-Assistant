import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserGraduate, FaUserTie, FaEnvelope, FaLock, FaUser, FaUniversity, FaBuilding, FaCalendarAlt, FaBullseye, FaBriefcase, FaLink } from "react-icons/fa";

// ── Styles ────────────────────────────────────────────────────────────────────
const FontLink = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }

    /* background grid lines with spotlight */
    .auth-bg {
      background-color: #f1f5f9;
      background-image:
        linear-gradient(rgba(15,23,42,0.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15,23,42,0.12) 1px, transparent 1px);
      background-size: 24px 24px;
      /* The mask creates the spotlight effect — visible in center, fading out */
      -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 80%);
      mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 80%);
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    .auth-bg-wrapper {
      min-height: 100vh;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      background-color: #f1f5f9;
      overflow: hidden;
      padding: 24px 16px;
    }

    .auth-input { transition: border 0.2s, box-shadow 0.2s; }
    .auth-input:focus { outline: none; border-color: #06b6d4 !important; box-shadow: 0 0 0 3px rgba(6,182,212,0.15) !important; }
    .auth-input::placeholder { color: #3f3f46; }

    .role-pill { transition: all 0.25s; cursor: pointer; }
    .role-pill.active  { background: #06b6d4; color: #000; font-weight: 700; box-shadow: 0 0 20px rgba(6,182,212,0.35); }
    .role-pill.inactive{ background: transparent; color: #52525b; border: 1px solid rgba(6,182,212,0.15); }
    .role-pill.inactive:hover { border-color: rgba(6,182,212,0.45); color: #06b6d4; }

    @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-24px)} }
    @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(18px)} }
  `}</style>
);

// ── Sub-components ────────────────────────────────────────────────────────────
const Label = ({ children }) => (
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#52525b", marginBottom: 6, fontFamily: "'Sora',sans-serif", letterSpacing: "0.6px", textTransform: "uppercase" }}>
        {children}
    </label>
);

const Field = ({ icon: Icon, type = "text", placeholder, ...rest }) => (
    <div style={{ position: "relative" }}>
        {Icon && <Icon style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#3f3f46", fontSize: 13 }} />}
        <input
            type={type}
            placeholder={placeholder}
            className="auth-input"
            style={{ width: "100%", height: 44, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.12)", borderRadius: 9, padding: Icon ? "0 14px 0 38px" : "0 14px", color: "#f4f4f5", fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}
            {...rest}
        />
    </div>
);

const PrimaryBtn = ({ children, loading, type = "submit" }) => {
    const [h, setH] = useState(false);
    return (
        <button type={type} disabled={loading} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
            style={{ width: "100%", height: 46, borderRadius: 9, border: "none", background: h ? "#22d3ee" : "#06b6d4", color: "#000", fontSize: 15, fontWeight: 700, fontFamily: "'Sora',sans-serif", cursor: loading ? "not-allowed" : "pointer", boxShadow: `0 0 ${h ? 32 : 18}px rgba(6,182,212,${h ? 0.5 : 0.28})`, transition: "all 0.22s", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Please wait…" : children}
        </button>
    );
};

// ── Login Form ────────────────────────────────────────────────────────────────
function LoginForm({ role }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await fetch(`${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                // Success
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                // Redirect based on role returned from the backend
                if (data.user.role === 'admin') {
                    window.location.href = '/Admin-Dashboard';
                } else if (data.user.role === 'senior') {
                    window.location.href = '/Senior-Dashboard';
                } else {
                    window.location.href = '/Student-Dashboard';
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Server error or network issue');
        } finally {
            setLoading(false);
        }
    };
    return (
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {error && <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{error}</p>}
            <div>
                <Label>Email / Username</Label>
                <Field name="email" icon={FaEnvelope} type="text" placeholder={role === "student" ? "your@college.edu" : "senior@alumni.com"} required />
            </div>
            <div>
                <Label>Password</Label>
                <Field name="password" icon={FaLock} type="password" placeholder="Enter your password" required />
                <div style={{ textAlign: "right", marginTop: 6 }}>
                    <a href="#" style={{ fontSize: 12, color: "#06b6d4", fontFamily: "'DM Sans',sans-serif", textDecoration: "none" }}>Forgot password?</a>
                </div>
            </div>
            <PrimaryBtn loading={loading}>Sign in →</PrimaryBtn>
        </form>
    );
}

// ── Register Form ─────────────────────────────────────────────────────────────
function RegisterForm({ role }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', email: '', college: '', company: '', graduationYear: '', targetCompanies: '', designation: '', linkedin: '', password: '', confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (step === 1) { setStep(2); return; }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, role }),
            });

            const data = await response.json();

            if (response.ok) {
                // Success
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                // Redirect based on role returned from the backend
                if (data.user.role === 'admin') {
                    window.location.href = '/Admin-Dashboard';
                } else if (data.user.role === 'senior') {
                    window.location.href = '/Senior-Dashboard';
                } else {
                    window.location.href = '/Student-Dashboard';
                }
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Server error or network issue');
        } finally {
            setLoading(false);
        }
    };
    return (
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* step bar */}
            {error && <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{error}</p>}
            <div style={{ display: "flex", gap: 6, marginBottom: 2 }}>
                {[1, 2].map(s => (
                    <div key={s} style={{ flex: 1, height: 2, borderRadius: 2, background: step >= s ? "#06b6d4" : "rgba(6,182,212,0.12)", transition: "background 0.3s" }} />
                ))}
            </div>
            <p style={{ fontSize: 11, color: "#52525b", fontFamily: "'Sora',sans-serif" }}>Step {step} of 2</p>

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                        <div><Label>Full name</Label><Field name="name" value={formData.name} onChange={handleChange} icon={FaUser} placeholder="Your full name" required /></div>
                        <div><Label>Email</Label><Field name="email" value={formData.email} onChange={handleChange} icon={FaEnvelope} type="email" placeholder={role === "student" ? "your@college.edu" : "senior@alumni.com"} required /></div>
                        {role === "student" && <div><Label>College / University</Label><Field name="college" value={formData.college} onChange={handleChange} icon={FaUniversity} placeholder="e.g. VIT, BITS, IIT Bombay" required /></div>}
                        {role === "senior" && <div><Label>Current Company</Label><Field name="company" value={formData.company} onChange={handleChange} icon={FaBuilding} placeholder="e.g. Google, Microsoft" required /></div>}
                    </motion.div>
                ) : (
                    <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                        {role === "student" && <>
                            <div><Label>Graduation Year</Label><Field name="graduationYear" value={formData.graduationYear} onChange={handleChange} icon={FaCalendarAlt} placeholder="e.g. 2025" required /></div>
                            <div><Label>Target Companies</Label><Field name="targetCompanies" value={formData.targetCompanies} onChange={handleChange} icon={FaBullseye} placeholder="e.g. Google, Amazon, Stripe" /></div>
                        </>}
                        {role === "senior" && <>
                            <div><Label>Role / Designation</Label><Field name="designation" value={formData.designation} onChange={handleChange} icon={FaBriefcase} placeholder="e.g. SDE-2, Product Manager" required /></div>
                            <div><Label>LinkedIn</Label><Field name="linkedin" value={formData.linkedin} onChange={handleChange} icon={FaLink} type="url" placeholder="https://linkedin.com/in/…" /></div>
                        </>}
                        <div><Label>Set Password</Label><Field name="password" value={formData.password} onChange={handleChange} icon={FaLock} type="password" placeholder="Min 8 characters" required /></div>
                        <div><Label>Confirm Password</Label><Field name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} icon={FaLock} type="password" placeholder="Repeat password" required /></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <PrimaryBtn loading={loading}>
                {step === 1 ? "Next →" : loading ? "Creating account…" : "Create Account →"}
            </PrimaryBtn>
            {step === 2 && (
                <button type="button" onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#52525b", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                    ← Back
                </button>
            )}
        </form>
    );
}

// ── Main Auth Page ────────────────────────────────────────────────────────────
export default function AuthPage() {
    const [role, setRole] = useState("student");
    const [tab, setTab] = useState("login");

    const leftInfo = {
        student: { title: "Land your dream job", sub: "Access real placement experiences, AI roadmaps, and 1:1 senior mock interviews — all in one place." },
        senior: { title: "Give back & grow", sub: "Share your experience, mentor juniors, conduct mock interviews, and build your mentorship profile." },
    };

    return (
        <div className="auth-bg-wrapper">
            {/* The absolute positioned grid background with spotlight mask */}
            <div className="auth-bg" />

            <FontLink />

            {/* ambient glows — removed for clean black look */}

            {/* ── Card ── */}
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 900, display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(6,182,212,0.12)", minHeight: 520 }}
                className="auth-card"
            >
                {/* ── Left panel ── */}
                <div style={{ position: "relative", padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid rgba(6,182,212,0.1)", overflow: "hidden" }}>
                    {/* Gradient BG replacing missing image */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0a0a0a 0%, #0c1a2e 40%, #061428 70%, #040d1a 100%)" }} />
                    {/* content above overlay */}
                    <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%" }}>
                        {/* logo */}
                        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#06b6d4,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff", fontFamily: "'Sora',sans-serif" }}>P</div>
                            <span style={{ fontSize: 18, fontWeight: 800, color: "#f4f4f5", fontFamily: "'Sora',sans-serif", letterSpacing: "-0.5px" }}>Placera</span>
                        </a>

                        {/* role description */}
                        <AnimatePresence mode="wait">
                            <motion.div key={role} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.25 }} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "36px 0" }}>
                                <div style={{ width: 48, height: 48, borderRadius: 13, background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: "#06b6d4", fontSize: 22 }}>
                                    {role === "student" ? <FaUserGraduate /> : <FaUserTie />}
                                </div>
                                <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, color: "#f4f4f5", lineHeight: 1.2, marginBottom: 14 }}>
                                    {leftInfo[role].title}
                                </h2>
                                <p style={{ color: "#52525b", fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
                                    {leftInfo[role].sub}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* bottom tag */}
                        <p style={{ fontSize: 12, color: "#27272a", fontFamily: "'Sora',sans-serif" }}>© 2026 Placera · Free to start</p>
                    </div>
                </div>

                {/* ── Right panel ── */}
                <div style={{ background: "#020202", padding: "48px 44px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
                    {/* back arrow */}
                    <button onClick={() => window.location.href = "/"}
                        style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", color: "#52525b", fontSize: 13, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", marginBottom: 28, padding: 0, transition: "color 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#06b6d4"}
                        onMouseLeave={e => e.currentTarget.style.color = "#52525b"}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                        Back to home
                    </button>
                    {/* role toggle */}
                    {/* role toggle */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 32, background: "rgba(6,182,212,0.04)", borderRadius: 10, padding: 4, border: "1px solid rgba(6,182,212,0.08)" }}>
                        {["student", "senior"].map(r => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`role-pill ${role === r ? "active" : "inactive"}`}
                                style={{ flex: 1, height: 38, borderRadius: 7, fontSize: 13, fontFamily: "'Sora',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, border: "none" }}
                            >
                                {r === "student" ? <FaUserGraduate size={13} /> : <FaUserTie size={13} />}
                                {r === "student" ? "Student" : "Senior"}
                            </button>
                        ))}
                    </div>

                    {/* tab header */}
                    <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(6,182,212,0.08)", marginBottom: 26 }}>
                        {["login", "register"].map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                style={{ flex: 1, height: 42, background: "none", border: "none", borderBottom: `2px solid ${tab === t ? "#06b6d4" : "transparent"}`, color: tab === t ? "#06b6d4" : "#52525b", fontSize: 13, fontWeight: 700, fontFamily: "'Sora',sans-serif", cursor: "pointer", transition: "all 0.2s", textTransform: "capitalize" }}>
                                {t === "login" ? "Sign In" : "Create Account"}
                            </button>
                        ))}
                    </div>

                    {/* sub-heading */}
                    <AnimatePresence mode="wait">
                        <motion.p key={`${role}-${tab}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
                            style={{ fontSize: 13, color: "#52525b", marginBottom: 22, fontFamily: "'DM Sans',sans-serif" }}>
                            {tab === "login"
                                ? `Sign in to continue your ${role === "student" ? "placement" : "mentorship"} journey.`
                                : `Create your free ${role} account to get started.`}
                        </motion.p>
                    </AnimatePresence>

                    {/* form */}
                    <AnimatePresence mode="wait">
                        {tab === "login"
                            ? <motion.div key={`login-${role}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><LoginForm role={role} /></motion.div>
                            : <motion.div key={`reg-${role}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><RegisterForm role={role} /></motion.div>
                        }
                    </AnimatePresence>

                    {/* footer toggle */}
                    <p style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "#3f3f46", fontFamily: "'DM Sans',sans-serif" }}>
                        {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => setTab(tab === "login" ? "register" : "login")}
                            style={{ background: "none", border: "none", color: "#06b6d4", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
                            {tab === "login" ? "Sign up free" : "Sign in"}
                        </button>
                    </p>
                </div>
            </motion.div>

            {/* responsive stacking */}
            <style>{`
        @media (max-width: 700px) {
          .auth-card { grid-template-columns: 1fr !important; }
          .auth-card > div:first-child { display: none !important; }
        }
      `}</style>
        </div>
    );
}
