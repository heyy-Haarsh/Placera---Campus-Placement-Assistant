"use client";
import React from "react";
import { motion } from "framer-motion";
const cn = (...classes) => classes.filter(Boolean).join(" ");
import { useState, useEffect, useRef } from "react";
// ─── Lamp Container ────────────────────────────────────────────────────────────
export const LampContainer = ({
    children,
    className,
    style
}) => {
    return (
        <div
            style={style}
            className={cn(
                "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#000000] w-full rounded-md z-0",
                className
            )}
        >
            <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 mt-32">
                <motion.div
                    initial={{ opacity: 0.5, width: "15rem" }}
                    whileInView={{ opacity: 1, width: "30rem" }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                    style={{
                        backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
                    }}
                    className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
                >
                    <div className="absolute w-[100%] left-0 bg-[#000000] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
                    <div className="absolute w-40 h-[100%] left-0 bg-[#000000] bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0.5, width: "15rem" }}
                    whileInView={{ opacity: 1, width: "30rem" }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                    style={{
                        backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
                    }}
                    className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
                >
                    <div className="absolute w-40 h-[100%] right-0 bg-[#000000] bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
                    <div className="absolute w-[100%] right-0 bg-[#000000] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
                </motion.div>
                <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-[#000000] blur-2xl"></div>
                <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
                <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
                <motion.div
                    initial={{ width: "8rem" }}
                    whileInView={{ width: "16rem" }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
                ></motion.div>
                <motion.div
                    initial={{ width: "15rem" }}
                    whileInView={{ width: "30rem" }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-cyan-400"
                ></motion.div>
                <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-[#000000]"></div>
            </div>

            <div className="relative z-50 flex -translate-y-40 flex-col items-center px-5">
                {children}
            </div>
        </div>
    );
};
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
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 27, fontWeight: 800, color: "#06b6d4", display: "block" }}>{num.toLocaleString()}+</span>
            <span style={{ fontSize: 11, color: "#64748b", marginTop: 2, display: "block", letterSpacing: "0.5px" }}>{label}</span>
        </div>
    );
}
// ─── Stats Data ────────────────────────────────────────────────────────────────
const stats = [
    { value: "12,000+", label: "Students Active" },
    { value: "3,800+", label: "Experiences Shared" },
    { value: "500+", label: "Senior Mentors" },
    { value: "200+", label: "Companies Covered" },
];

// ─── Stats Bar ─────────────────────────────────────────────────────────────────
const StatsBar = () => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7, ease: "easeInOut" }}
        style={{ marginTop: 40 }}
    >
        <StatsRow />
    </motion.div>
);

// ─── Hero Section (Main Export) ────────────────────────────────────────────────
export function Hero() {
    function Btn({ children, primary = false }) {
        const [h, setH] = useState(false);
        return (
            <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: "13px 28px", borderRadius: 10, fontSize: 16, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s", border: primary ? "none" : "1px solid rgba(255,255,255,0.12)", background: primary ? (h ? "#22d3ee" : "#06b6d4") : (h ? "rgba(6,182,212,0.06)" : "transparent"), color: primary ? "#000000" : (h ? "#06b6d4" : "#f0f9ff"), boxShadow: primary ? `0 0 ${h ? 60 : 35}px rgba(6,182,212,${h ? 0.5 : 0.28})` : "none", transform: h ? "translateY(-2px)" : "none", borderColor: !primary && h ? "rgba(6,182,212,0.4)" : undefined }}>
                {children}
            </button>
        );
    }



    return (
        <LampContainer
            style={{ paddingTop: "100px" }}
        >
            {/* Headline */}
            <motion.h1

                initial={{ opacity: 0.5, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                className="mt-28 relative z-10 bg-gradient-to-br from-slate-200 to-slate-500 py-4 bg-clip-text text-center text-4xl font-semibold tracking-tight text-transparent md:text-6xl lg:text-7xl max-w-3xl leading-tight"
                style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}
            >
                Your seniors' success
                <br />
                becomes your roadmap.
            </motion.h1>

            {/* Stats */}
            <StatsBar />
        </LampContainer>
    );
}

export default Hero;
