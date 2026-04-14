import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Hero from "./pages/Hero";
import { FaBrain, FaFolderOpen, FaVideo, FaComments, FaGraduationCap, FaSearch, FaMapSigns, FaRocket } from "react-icons/fa";
import { FaGoogle, FaMicrosoft, FaAmazon, FaStripe, FaUber, FaApple, FaPaypal, FaSpotify, FaMeta } from "react-icons/fa6";
import PlaceraLogo from "./assets/Placera.png";
const cn = (...classes) => classes.filter(Boolean).join(" ");
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  `}</style>
);

const ResponsiveStyles = () => (
  <style>{`
    /* ── NAV ── */
    .nav-links { display: flex; gap: 28px; }
    .nav-btns  { display: flex; gap: 10px; }
    .nav-hamburger { display: none; background: none; border: 1px solid rgba(6,182,212,0.3); borderRadius: 6px; padding: 6px 10px; cursor: pointer; color: #94a3b8; font-size: 18px; }
    .mobile-menu { display: none; flex-direction: column; gap: 16px; position: fixed; top: 57px; left: 0; right: 0; background: rgba(0,0,0,0.95); backdrop-filter: blur(20px); padding: 20px 24px; border-bottom: 1px solid rgba(6,182,212,0.1); z-index: 99; }
    .mobile-menu.open { display: flex; }
    /* ── SECTIONS ── */
    .section-pad { padding: 108px 48px; }
    .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
    .how-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; }
    .hubs-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 12px; }
    .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
    .cta-pad {  }
    .cta-grid { padding: 150px 150px; min-height: 540px; }
    .footer-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; }
    .roadmap-mock { font-family: 'Sora',sans-serif; font-size: 12px; }
    /* ── TABLET ── */
    @media (max-width: 1024px) {
      .section-pad { padding: 80px 32px; }
      .hubs-grid { grid-template-columns: repeat(3,1fr); }
      .testi-grid { grid-template-columns: 1fr 1fr; }
      .how-grid { grid-template-columns: 1fr 1fr; }
      .cta-pad { padding: 60px 32px 110px; }
      .cta-grid { padding: 64px 48px; min-height: 400px; }
    }
    /* ── MOBILE ── */
    @media (max-width: 768px) {
      .nav-links { display: none !important; }
      .nav-btns  { display: none !important; }
      .nav-hamburger { display: block; }
      .section-pad { padding: 60px 20px; }
      .features-grid { grid-template-columns: 1fr !important; }
      .how-grid { grid-template-columns: 1fr !important; }
      .hubs-grid { grid-template-columns: repeat(2,1fr) !important; }
      .testi-grid { grid-template-columns: 1fr !important; }
      .cta-pad { padding: 32px 20px 60px; }
      .cta-grid { grid-template-columns: 1fr !important; padding: 32px; text-align: center !important; }
      .cta-grid > div { align-items: center !important; text-align: center !important; justify-self: center !important; }
      .footer-row { flex-direction: column; align-items: flex-start; }
    }
    @keyframes marqueeAnim {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes blink {
      0%,100% { opacity:1; } 50% { opacity:0.3; }
    }
  `}</style>
);

// ── LAMP CONTAINER (Aceternity UI port) ──────────────────────────────────────
function LampContainer({ children }) {
  return (
    <div style={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      minHeight: "100vh",
      overflow: "hidden",
      background: "#000000",
      width: "100%",
      zIndex: 0,
      paddingTop: 60, // navbar height
    }}>
      {/* Beam wrapper — fixed height at top */}
      <div style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: 400,
        flexShrink: 0,
        transform: "scaleY(1.25)",
        alignItems: "center",
        justifyContent: "center",
        isolation: "isolate",
        zIndex: 0,
      }}>
        {/* Left conic beam */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: "auto",
            right: "50%",
            height: 224,
            overflow: "visible",
            backgroundImage: "conic-gradient(from 70deg at center top, #06b6d4 0deg, transparent 60deg)",
            zIndex: 1,
          }}
        >
          <div style={{ position: "absolute", width: "100%", left: 0, background: "#000000", height: 160, bottom: 0, zIndex: 20, maskImage: "linear-gradient(to top,white,transparent)", WebkitMaskImage: "linear-gradient(to top,white,transparent)" }} />
          <div style={{ position: "absolute", width: 160, height: "100%", left: 0, background: "#000000", bottom: 0, zIndex: 20, maskImage: "linear-gradient(to right,white,transparent)", WebkitMaskImage: "linear-gradient(to right,white,transparent)" }} />
        </motion.div>

        {/* Right conic beam */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: "auto",
            left: "50%",
            height: 224,
            overflow: "visible",
            backgroundImage: "conic-gradient(from 290deg at center top, transparent 0deg, transparent 60deg, #06b6d4 120deg)",
            zIndex: 1,
          }}
        >
          <div style={{ position: "absolute", width: 160, height: "100%", right: 0, background: "#000000", bottom: 0, zIndex: 20, maskImage: "linear-gradient(to left,white,transparent)", WebkitMaskImage: "linear-gradient(to left,white,transparent)" }} />
          <div style={{ position: "absolute", width: "100%", right: 0, background: "#000000", height: 160, bottom: 0, zIndex: 20, maskImage: "linear-gradient(to top,white,transparent)", WebkitMaskImage: "linear-gradient(to top,white,transparent)" }} />
        </motion.div>

        {/* Blur cap */}
        <div style={{ position: "absolute", top: "50%", height: 192, width: "100%", transform: "translateY(3rem) scaleX(1.5)", background: "#000000", filter: "blur(2rem)", zIndex: 2 }} />
        {/* Large glow orb */}
        <div style={{ position: "absolute", inset: "auto", zIndex: 50, height: 144, width: "28rem", transform: "translateY(-50%)", borderRadius: "50%", background: "#06b6d4", opacity: 0.5, filter: "blur(3rem)" }} />
        {/* Animated core glow */}
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ position: "absolute", inset: "auto", zIndex: 30, height: 144, borderRadius: "50%", background: "#22d3ee", filter: "blur(2rem)", transform: "translateY(-6rem)" }}
        />
        {/* Animated beam line */}
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ position: "absolute", inset: "auto", zIndex: 50, height: 2, background: "linear-gradient(90deg,transparent,#22d3ee,transparent)", transform: "translateY(-7rem)" }}
        />
        {/* Cap cover */}
        <div style={{ position: "absolute", inset: "auto", zIndex: 40, height: 176, width: "100%", transform: "translateY(-12.5rem)", background: "#000000" }} />
      </div>

      {/* Content — flows naturally below the lamp beam */}
      <div style={{
        position: "relative",
        zIndex: 50,
        display: "flex",
        transform: "translateY(-20rem)",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 20px",
        marginTop: -60,
        width: "100%",
      }}>
        {children}
      </div>
    </div>
  );
}

// ── LAMP HERO ────────────────────────────────────────────────────────────────
function LampHero() {
  return (
    // <LampContainer>
    //   {/* Main headline */}
    //   <motion.h1
    //     initial={{ opacity: 0.5, y: 100 }}
    //     whileInView={{ opacity: 1, y: 0 }}
    //     transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
    //     style={{
    //       marginTop: 32,
    //       background: "linear-gradient(to bottom right, #cbd5e1, #64748b)",
    //       WebkitBackgroundClip: "text",
    //       WebkitTextFillColor: "transparent",
    //       backgroundClip: "text",
    //       textAlign: "center",
    //       fontSize: "clamp(36px, 6vw, 80px)",
    //       fontWeight: 700,
    //       letterSpacing: "-2px",
    //       lineHeight: 1.1,
    //       fontFamily: "'Syne', sans-serif",
    //       paddingTop: 16,
    //       paddingBottom: 16,
    //       maxWidth: 860,
    //     }}
    //   >
    //     Your seniors&apos; success<br />
    //     <span style={{ WebkitTextFillColor: "#06b6d4", background: "none" }}>becomes your roadmap.</span>
    //   </motion.h1>

    //   {/* Stats row */}
    //   
    // </LampContainer>
    <div className="" >
      <Hero />
    </div>
  );
}

function Btn({ children, primary = false }) {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: "13px 28px", borderRadius: 10, fontSize: 16, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s", border: primary ? "none" : "1px solid rgba(255,255,255,0.12)", background: primary ? (h ? "#22d3ee" : "#06b6d4") : (h ? "rgba(6,182,212,0.06)" : "transparent"), color: primary ? "#000000" : (h ? "#06b6d4" : "#f0f9ff"), boxShadow: primary ? `0 0 ${h ? 60 : 35}px rgba(6,182,212,${h ? 0.5 : 0.28})` : "none", transform: h ? "translateY(-2px)" : "none", borderColor: !primary && h ? "rgba(6,182,212,0.4)" : undefined }}>
      {children}
    </button>
  );
}

function StatsRow() {
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const targets = [12000, 3800, 500, 200];
  const labels = ["Students Active", "Experiences Shared", "Senior Mentors", "Companies Covered"];
  const ref = useRef(null);
  const ran = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        targets.forEach((target, i) => {
          let v = 0;
          const step = () => { v += target / 55; if (v >= target) v = target; setCounts(p => { const n = [...p]; n[i] = Math.floor(v); return n; }); if (v < target) requestAnimationFrame(step); };
          requestAnimationFrame(step);
        });
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
      {targets.map((_, i) => <StatCard key={i} num={counts[i]} label={labels[i]} />)}
    </div>
  );
}

function StatCard({ num, label }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: "15px 26px", background: "rgba(10,10,10,0.85)", border: `1px solid rgba(6,182,212,${h ? 0.35 : 0.15})`, borderRadius: 12, textAlign: "center", backdropFilter: "blur(12px)", transition: "all 0.2s", transform: h ? "translateY(-4px)" : "none", minWidth: 128 }}>
      <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 27, fontWeight: 800, color: "#06b6d4", display: "block" }}>{num.toLocaleString()}+</span>
      <span style={{ fontSize: 11, color: "#64748b", marginTop: 2, display: "block", letterSpacing: "0.5px" }}>{label}</span>
    </div>
  );
}

// ── MARQUEE ──────────────────────────────────────────────────────────────────
const ITEMS = ["Google SDE · 6 rounds · Selected", "Microsoft SDET · 4 rounds · Selected", "Amazon SDE-1 · 5 rounds · Selected", "Adobe MTS · 3 rounds · Selected", "Goldman Sachs Analyst · 4 rounds", "Flipkart SDE · 3 rounds · Selected", "Uber SDE · 4 rounds · Selected", "Netflix SDE · 5 rounds · Selected"];
function Marquee() {
  const all = [...ITEMS, ...ITEMS];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid rgba(6,182,212,0.1)", borderBottom: "1px solid rgba(6,182,212,0.1)", background: "rgba(6,182,212,0.02)", padding: "12px 0" }}>
      <div style={{ display: "flex", gap: 48, width: "max-content", animation: "marqueeAnim 34s linear infinite" }}>
        {all.map((item, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", fontSize: 12, fontWeight: 500, color: "#64748b", fontFamily: "'Sora',sans-serif", letterSpacing: "0.5px" }}>
            <span style={{ width: 5, height: 5, background: "#0891b2", borderRadius: "50%" }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  const scrollTo = (id) => { setMenuOpen(false); const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const navItems = [["Features", "features"], ["How it works", "howit"], ["Companies", "companies"], ["Community", "community"]];
  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "12px 44px", display: "flex", alignItems: "center", justifyContent: "space-between",
        backdropFilter: "blur(24px) saturate(1.8)",
        WebkitBackdropFilter: "blur(24px) saturate(1.8)",
        background: scrolled ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.35)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
        transition: "background 0.4s, box-shadow 0.4s"
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={PlaceraLogo} alt="Placera" style={{ height: 28, objectFit: "contain" }} />
        </a>
        <div className="nav-links">
          {navItems.map(([l, id]) => <NL key={l} sectionId={id}>{l}</NL>)}
        </div>
        <div className="nav-btns">
          <NB ghost onClick={() => window.location.href = "/auth"}>Sign in</NB>
          <NB onClick={() => window.location.href = "/auth"}>Join Free →</NB>
        </div>
        <button className="nav-hamburger" onClick={() => setMenuOpen(v => !v)}>{menuOpen ? "✕" : "☰"}</button>
      </div>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {navItems.map(([l, id]) => (
          <span key={l} onClick={() => scrollTo(id)} style={{ color: "#94a3b8", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "'Sora',sans-serif", padding: "8px 0", borderBottom: "1px solid rgba(6,182,212,0.08)" }}>{l}</span>
        ))}
        <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
          <NB ghost onClick={() => window.location.href = "/auth"}>Sign in</NB>
          <NB onClick={() => window.location.href = "/auth"}>Join Free →</NB>
        </div>
      </div>
    </>
  );
}
function NL({ children, sectionId }) {
  const [h, setH] = useState(false);
  const handleClick = () => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return <span onClick={handleClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ color: h ? "#06b6d4" : "#94a3b8", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "color 0.2s" }}>{children}</span>;
}
function NB({ children, ghost = false, onClick }) { const [h, setH] = useState(false); return <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: "7px 17px", borderRadius: 8, fontSize: 14, fontWeight: ghost ? 500 : 600, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "all 0.2s", border: ghost ? "1px solid rgba(6,182,212,0.3)" : "none", background: ghost ? (h ? "rgba(6,182,212,0.08)" : "transparent") : (h ? "#22d3ee" : "#06b6d4"), color: ghost ? "#06b6d4" : "#000000", boxShadow: !ghost ? `0 0 ${h ? 28 : 16}px rgba(6,182,212,${h ? 0.45 : 0.25})` : "none" }}>{children}</button>; }

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────────
function Reveal({ children, style = {}, className = "" }) {
  const ref = useRef(null); const [v, setV] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.07 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  return <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(28px)", transition: "opacity 0.7s ease,transform 0.7s ease", ...style }}>{children}</div>;
}
function SL({ children }) { return <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 500, color: "#06b6d4", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 13 }}><span style={{ display: "block", width: 20, height: 1, background: "#06b6d4" }} />{children}</div>; }
function ST({ children }) { return <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, lineHeight: 1.15, color: "#f0f9ff", marginBottom: 52 }}>{children}</h2>; }

// ── ROADMAP MOCK ──────────────────────────────────────────────────────────────
function RMock() {
  const rows = [{ m: "Month 1", l: "DSA: Arrays, Strings, Hashing", w: "90%" }, { m: "Month 2", l: "Trees, Graphs, DP Patterns", w: "75%" }, { m: "Month 3", l: "System Design + 2 Mocks", w: "65%" }, { m: "Month 4", l: "Google-specific + HR Prep", w: "50%" }];
  return (
    <div style={{ background: "#000000", border: "1px solid rgba(6,182,212,0.15)", borderRadius: 12, padding: 18, fontFamily: "'Sora',sans-serif", fontSize: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid rgba(6,182,212,0.1)" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF5F56" }} /><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFBD2E" }} /><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#27C93F" }} />
        <span style={{ marginLeft: 8, color: "#64748b", fontSize: 11 }}>roadmap — Google · SDE · Sem 6</span>
      </div>
      {rows.map(({ m, l, w }) => (
        <div key={m} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ color: "#06b6d4", fontWeight: 500, minWidth: 58, fontSize: 11 }}>{m}</span>
          <div style={{ flex: 1, background: "rgba(6,182,212,0.08)", borderRadius: 3, height: 19, position: "relative", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg,#0891b2,#06b6d4)", borderRadius: 3, opacity: 0.8, width: w }} />
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 7px", color: "#000000", fontSize: 10, fontWeight: 600 }}>{l}</span>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 12, padding: 9, background: "rgba(6,182,212,0.06)", borderRadius: 8, border: "1px solid rgba(6,182,212,0.15)" }}>
        <span style={{ color: "#06b6d4", fontSize: 11 }}>✦ 80% of Google SDE candidates faced DP in Round 1</span>
      </div>
    </div>
  );
}

// ── FEATURE CARD ─────────────────────────────────────────────────────────────
function FC({ icon, title, desc, children, wide = false }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ gridColumn: wide ? "span 1" : "span 1", display: "block", padding: 36, background: h ? "rgba(20,20,20,0.97)" : "rgba(10,10,10,0.9)", position: "relative", overflow: "hidden", transition: "background 0.3s" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: h ? "linear-gradient(90deg,transparent,#0891b2,transparent)" : "transparent", transition: "background 0.3s" }} />
      <div>
        <div style={{ width: 46, height: 46, background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.22)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 17, boxShadow: h ? "0 0 18px rgba(6,182,212,0.18)" : "none", transition: "box-shadow 0.3s", color: "#06b6d4" }}>{icon}</div>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 19, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 9, color: "#f0f9ff" }}>{title}</h3>
        <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
        {!wide && children && <div style={{ marginTop: 22 }}>{children}</div>}
      </div>
      {wide && children && <div>{children}</div>}
    </div>
  );
}

// ── FEATURES SECTION ─────────────────────────────────────────────────────────
function FeaturesSection() {
  return (
    <Reveal className="section-pad" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <SL>Features</SL>
      <ST>Everything you need to <span style={{ color: "#06b6d4" }}>get placed.</span></ST>
      <div className="features-grid" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.1)", borderRadius: 20, overflow: "hidden" }}>
        <FC wide icon={<FaBrain />} title="AI-Powered Roadmap Generator" desc="Input your target company, role, and semester. Our RAG engine scans hundreds of real experiences to generate a personalized, week-by-week preparation plan — built from what actually worked for your seniors."><RMock /></FC>
        <FC icon={<FaFolderOpen />} title="Experience Vault" desc="Search 3,800+ real interview experiences. Filter by company, role, batch, difficulty, or outcome.">
          <div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
              {["Company: Google ×", "Role: SDE ×", "Batch: 2024 ×"].map(t => <span key={t} style={{ padding: "4px 9px", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.18)", borderRadius: 6, fontSize: 11, color: "#94a3b8", fontFamily: "'Sora',sans-serif" }}>{t}</span>)}
            </div>
            <div style={{ padding: 11, background: "#000000", border: "1px solid rgba(6,182,212,0.14)", borderRadius: 8 }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 11, color: "#06b6d4" }}>47 experiences found</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>Most asked: DP (78%), System Design (61%), OOPS (45%)</div>
            </div>
          </div>
        </FC>
        <FC icon={<FaVideo />} title="Mock Arena" desc="Book 1:1 video mock interviews with seniors who cracked your dream company. Real-time scorecards and AI-generated feedback.">
          <div style={{ padding: 13, background: "#000000", border: "1px solid rgba(6,182,212,0.14)", borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#f0f9ff" }}>Rahul M.</span>
              <span style={{ fontSize: 10, color: "#06b6d4", fontFamily: "'Sora',sans-serif" }}>SDE @ Google</span>
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 9 }}>Available: DSA, System Design, HR</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["30 min", "45 min", "60 min"].map(d => <span key={d} style={{ padding: "2px 8px", background: "rgba(6,182,212,0.1)", borderRadius: 4, fontSize: 10, color: "#06b6d4" }}>{d}</span>)}
            </div>
          </div>
        </FC>
        <FC icon={<FaComments />} title="Company Hubs" desc="Discord-style channels for every major company. Chat with seniors, share resources, and get real-time help.">
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[{ e: <FaGoogle size={14} />, n: "# google-prep", c: "342 members", a: false }, { e: <FaMicrosoft size={14} />, n: "# microsoft-hub", c: null, a: true }, { e: <FaAmazon size={14} />, n: "# amazon-sde", c: "289 members", a: false }].map(hub => (
              <div key={hub.n} style={{ display: "flex", alignItems: "center", gap: 9, padding: 7, background: hub.a ? "rgba(6,182,212,0.04)" : "#000000", border: `1px solid rgba(6,182,212,${hub.a ? 0.3 : 0.13})`, borderRadius: 8 }}>
                <span style={{ fontSize: 13 }}>{hub.e}</span>
                <span style={{ fontSize: 12, color: hub.a ? "#f0f9ff" : "#94a3b8", flex: 1 }}>{hub.n}</span>
                {hub.a ? <span style={{ width: 7, height: 7, background: "#06b6d4", borderRadius: "50%", animation: "blink 1.5s infinite" }} /> : <span style={{ fontSize: 10, color: "#06b6d4" }}>{hub.c}</span>}
              </div>
            ))}
          </div>
        </FC>
      </div>
    </Reveal>
  );
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────
function HowStep({ n, i, t, d, idx }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: "30px 24px", background: h ? "rgba(20,20,20,0.97)" : "rgba(10,10,10,0.9)", position: "relative", transition: "background 0.3s" }}>
      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 500, color: "#06b6d4", letterSpacing: "2px", marginBottom: 13, opacity: 0.7 }}>{n} / 04</div>
      <div style={{ width: 48, height: 48, background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#06b6d4", marginBottom: 17 }}>{i}</div>
      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.3px", color: "#f0f9ff" }}>{t}</div>
      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65 }}>{d}</p>
      {idx < 3 && <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(6,182,212,0.2)", fontSize: 18 }}>→</span>}
    </div>
  );
}
function HowSection() {
  const steps = [{ n: "01", i: <FaGraduationCap />, t: "Register & Set Goals", d: "Sign up with your college email. Select target companies, role preferences, and current semester." }, { n: "02", i: <FaSearch />, t: "Explore the Vault", d: "Browse experiences from seniors who cracked your target companies. Filter, read, and learn." }, { n: "03", i: <FaMapSigns />, t: "Generate AI Roadmap", d: "Our AI analyzes patterns from real experiences to build your personalized week-by-week prep plan." }, { n: "04", i: <FaRocket />, t: "Practice & Get Placed", d: "Book mocks with seniors, chat in hubs, track progress — walk into placement season ready." }];
  return (
    <Reveal className="section-pad" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <SL>How it works</SL>
      <ST>From day one to <span style={{ color: "#06b6d4" }}>offer letter.</span></ST>
      <div className="how-grid" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.1)", borderRadius: 20, overflow: "hidden" }}>
        {steps.map(({ n, i, t, d }, idx) => <HowStep key={n} n={n} i={i} t={t} d={d} idx={idx} />)}
      </div>
    </Reveal>
  );
}

// ── COMPANY HUBS ─────────────────────────────────────────────────────────────
function HubCard({ e, n, c, more = false, color = "#06b6d4" }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: "22px 14px", background: more ? "rgba(6,182,212,0.06)" : "rgba(10,10,10,0.85)", border: `1px solid rgba(6,182,212,${h || more ? 0.35 : 0.12})`, borderRadius: 13, textAlign: "center", cursor: "pointer", transition: "all 0.2s", transform: h ? "translateY(-5px)" : "none", boxShadow: h ? `0 10px 28px ${color}22` : "none" }}>
      <span style={{ fontSize: 26, display: "flex", justifyContent: "center", color: more ? "#06b6d4" : color, marginBottom: 9 }}>{e}</span>
      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 3, color: more ? "#06b6d4" : "#f0f9ff" }}>{n}</div>
      <div style={{ fontSize: 10, color: "#06b6d4", fontFamily: "'Sora',sans-serif" }}>{c}</div>
    </div>
  );
}
function HubsSection() {
  const hubs = [
    { e: <FaGoogle />, n: "Google", c: "342 members", color: "#4285F4" },
    { e: <FaMicrosoft />, n: "Microsoft", c: "298 members", color: "#00A4EF" },
    { e: <FaAmazon />, n: "Amazon", c: "289 members", color: "#FF9900" },
    { e: <FaStripe />, n: "Stripe", c: "98 members", color: "#635BFF" },
    { e: <FaUber />, n: "Uber", c: "156 members", color: "#f0f0f0" },
    { e: <FaApple />, n: "Apple", c: "213 members", color: "#A2AAAD" },
    { e: <FaPaypal />, n: "PayPal", c: "134 members", color: "#003087" },
    { e: <FaSpotify />, n: "Spotify", c: "187 members", color: "#1DB954" },
    { e: <FaMeta />, n: "Meta", c: "142 members", color: "#0081FB" },
    { e: "+", n: "190 more", c: "companies", more: true },
  ];
  return (
    <Reveal className="section-pad" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <SL>Company Hubs</SL>
      <ST>Your company's community <span style={{ color: "#06b6d4" }}>awaits.</span></ST>
      <div className="hubs-grid">
        {hubs.map(({ e, n, c, more, color }) => <HubCard key={n} e={e} n={n} c={c} more={more} color={color} />)}
      </div>
    </Reveal>
  );
}

// ── TESTIMONIALS ─────────────────────────────────────────────────────────────
function TestiCard({ l, n, r, c, b, g, t }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: 26, background: "rgba(10,10,10,0.85)", border: `1px solid rgba(6,182,212,${h ? 0.35 : 0.13})`, borderRadius: 16, backdropFilter: "blur(12px)", position: "relative", overflow: "hidden", transition: "all 0.2s", transform: h ? "translateY(-5px)" : "none" }}>
      <div style={{ position: "absolute", top: -8, right: 18, fontFamily: "'Sora',sans-serif", fontSize: 72, fontWeight: 800, color: "rgba(6,182,212,0.05)", lineHeight: 1 }}>&quot;</div>
      <div style={{ display: "flex", gap: 2, marginBottom: 13 }}>{[...Array(5)].map((_, j) => <span key={j} style={{ color: "#06b6d4", fontSize: 12 }}>★</span>)}</div>
      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.72, marginBottom: 18 }}>{t}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: g, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: "'Sora',sans-serif", color: "#000000", flexShrink: 0 }}>{l}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#f0f9ff" }}>{n}</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>{r} @ <span style={{ color: "#06b6d4" }}>{c}</span> · Batch {b}</div>
        </div>
      </div>
    </div>
  );
}
function TestiSection() {
  const data = [{ l: "P", n: "Priya Sharma", r: "SDE", c: "Google", b: "2024", g: "linear-gradient(135deg,#06b6d4,#0891b2)", t: "The AI roadmap literally saved me. I had 4 months before placements with no idea where to start. It pulled patterns from real Google experiences and gave me a week-by-week plan. Got the offer!" }, { l: "A", n: "Arjun Mehta", r: "SDE-1", c: "Amazon", b: "2024", g: "linear-gradient(135deg,#0891b2,#22d3ee)", t: "Did 4 mock interviews with seniors from Amazon. The scorecard feedback was brutal but honest. Fixed my approach to explaining solutions and cleared the coding rounds with ease." }, { l: "S", n: "Sneha Patel", r: "SDET", c: "Microsoft", b: "2024", g: "linear-gradient(135deg,#06b6d4,#164e63)", t: "The Microsoft Hub was always alive with seniors sharing resources. Someone pinned the exact system design topics asked in the last 3 years. That alone was worth joining." }];
  return (
    <Reveal style={{ padding: "108px 48px", background: "linear-gradient(180deg,transparent,rgba(6,182,212,0.02),transparent)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SL>Community love</SL>
        <ST>What students are <span style={{ color: "#06b6d4" }}>saying.</span></ST>
        <div className="testi-grid">
          {data.map(({ l, n, r, c, b, g, t }) => <TestiCard key={n} l={l} n={n} r={r} c={c} b={b} g={g} t={t} />)}
        </div>
      </div>
    </Reveal>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTASection() {
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for signing up with ${email}!`);
    setEmail("");
  };

  return (
    <Reveal className="cta-pad" style={{ width: "100%", margin: "0 auto" }}>
      <div style={{ position: "relative", width: "100%", overflow: "hidden", borderRadius: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.7)", border: "1px solid rgba(6,182,212,0.15)" }}>
        {/* BG image */}
        <img src="/jeremy-bg.jpg" alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
        {/* dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.68) 60%,rgba(6,182,212,0.06) 100%)" }} />
        {/* Glow */}
        <div style={{ position: "absolute", left: "20%", top: "50%", width: 400, height: 400, background: "radial-gradient(circle,rgba(6,182,212,0.12) 0%,transparent 70%)", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }} className="cta-grid">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", color: "white" }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(32px,5vw,56px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
              Let's build from here
            </h2>
            <p style={{ fontSize: 17, color: "#cbd5e1", lineHeight: 1.6, maxWidth: 540, fontFamily: "'DM Sans',sans-serif", marginBottom: 32 }}>
              Harnessed for productivity. Designed for collaboration. Celebrated for built-in security. Welcome to the platform developed by Students, for students.
            </p>
            <div style={{ display: "flex", gap: "16px 24px", flexWrap: "wrap", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#06b6d4", fontWeight: 800 }}>✓</span> <span style={{ fontSize: 15, color: "#f8fafc" }}>AI-Powered Roadmaps</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#06b6d4", fontWeight: 800 }}>✓</span> <span style={{ fontSize: 15, color: "#f8fafc" }}>1:1 Mock Interviews</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#06b6d4", fontWeight: 800 }}>✓</span> <span style={{ fontSize: 15, color: "#f8fafc" }}>Real Company Hubs</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", width: "100%", maxWidth: 450, flexDirection: "column", alignItems: "center", justifyContent: "center", justifySelf: "end" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", width: "100%", flexDirection: "column", gap: 12 }}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ height: 48, width: "100%", borderRadius: 8, border: "1px solid #334155", background: "rgba(30,41,59,0.5)", padding: "0 16px", color: "white", fontSize: 15, outline: "none" }}
              />
              <button
                type="submit"
                style={{ height: 48, width: "100%", borderRadius: 8, background: "white", color: "black", fontSize: 15, fontWeight: 600, cursor: "pointer", border: "none", transition: "background 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#e2e8f0"}
                onMouseLeave={(e) => e.currentTarget.style.background = "white"}
              >
                Sign up for Placera →
              </button>
            </form>
            <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 16, textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>
              Trusted by <strong style={{ color: "#f8fafc" }}>12,000+</strong> students from top universities globally.
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(6,182,212,0.09)", padding: "30px 48px", background: "rgba(0,0,0,0.5)" }}>
      <div className="footer-row">
        <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: "#f0f9ff" }}>🎯 Placera</span>
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>{["Features", "About", "Privacy", "Contact"].map(l => <NL key={l}>{l}</NL>)}</div>
        <span style={{ fontSize: 12, color: "#64748b" }}>© 2026 Placera. Built for students, by students.</span>
      </div>
    </footer>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ background: "#000000", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif" }}>
      <FontLink />
      <ResponsiveStyles />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 80% 60% at 20% -10%,rgba(6,182,212,0.05) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 80% 110%,rgba(8,145,178,0.04) 0%,transparent 60%)" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <div id="hero"><LampHero /></div>
        <Marquee />
        <div id="features"><FeaturesSection /></div>
        <div id="howit"><HowSection /></div>
        <div id="companies"><HubsSection /></div>
        <div id="community"><TestiSection /></div>
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
