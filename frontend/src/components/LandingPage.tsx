import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    PieChart,
    Sparkles,
    LayoutDashboard,
    Search,
    DollarSign,
    Video,
    Kanban,
    ChevronRight,
    PlayCircle
} from 'lucide-react';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    // Simple scroll listener for navbar glass effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: Kanban,
            title: "Production Kanban",
            desc: "Stop dropping the ball on ideas. Visually drag and drop your video pipeline from a raw idea to a published masterpiece.",
            previewData: "Idea ➔ Script ➔ Film ➔ Edit ➔ Live"
        },
        {
            icon: Search,
            title: "SEO Optimizer",
            desc: "Don't guess what the algorithm wants. Analyze your titles, descriptions, and tags against current YouTube search trends.",
            previewData: "Score: 98/100 - 'Highly Optimized'"
        },
        {
            icon: DollarSign,
            title: "Sponsorship Marketplace",
            desc: "Find brands that match your niche. Negotiate rates, lock in contracts, and manage deliverables directly inside the hub.",
            previewData: "$2,500 Base + Affiliate Bonus"
        },
        {
            icon: PieChart,
            title: "Monetization Analytics",
            desc: "Stop relying on basic AdSense. Track multiple income streams (Patreon, Merch, Sponsors) and calculate true RPMs.",
            previewData: "$42.15 True RPM"
        },
        {
            icon: Video,
            title: "Central Video Manager",
            desc: "Your entire content library, organized. Review past performance metrics instantly without opening YouTube Studio.",
            previewData: "2.4M Total Views across 84 Videos"
        }
    ];

    return (
        <div className="landing-bg">
            {/* STICKY NAV LAYER */}
            <nav className="landing-nav" style={{
                background: scrolled ? "rgba(11, 9, 20, 0.85)" : "transparent",
                borderBottomColor: scrolled ? "var(--border)" : "transparent",
                transition: "all 0.3s ease"
            }}>
                <div className="logo cursor-default" style={{ gap: "8px" }}>
                    <Sparkles color="var(--primary)" size={22} style={{ animation: "pulse-slow 3s infinite" }} />
                    InfluencerzHub
                </div>
                <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <Link to="/signin" className="nav-link-btn" style={{ color: "var(--text-muted)" }}>Sign In</Link>
                    <Link to="/signup" className="btn" style={{ padding: "8px 16px" }}>Get Started</Link>
                </div>
            </nav>

            <main className="landing-main" style={{ padding: "0" }}>
                {/* HERO SECTION */}
                <header className="hero-section text-center relative" style={{ paddingTop: "120px", paddingBottom: "100px", paddingLeft: "24px", paddingRight: "24px", overflow: "hidden" }}>

                    {/* Abstract background glow */}
                    <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: -1, pointerEvents: 'none' }} />

                    <div style={{ display: "inline-block", background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.2)", padding: "6px 16px", borderRadius: "100px", color: "var(--text-main)", fontSize: "13px", fontWeight: "600", marginBottom: "32px" }} className="animate-slide-up">
                        <span style={{ color: "var(--primary)", marginRight: "8px" }}>New Update</span>
                        Kanban Production Boards are now live!
                    </div>

                    <h1 className="hero-title animate-slide-up stagger-1" style={{ fontSize: "clamp(42px, 6vw, 72px)", maxWidth: "900px", margin: "0 auto 24px auto" }}>
                        The Operating System for <br />
                        <span className="text-gradient">Modern Creators</span>
                    </h1>

                    <p className="hero-subtitle animate-slide-up stagger-2" style={{ fontSize: "clamp(16px, 2vw, 20px)", maxWidth: "650px", margin: "0 auto", color: "var(--text-muted)" }}>
                        Stop juggling chaotic spreadsheets, loose documents, and fragmented analytics. InfluencerzHub is the all-in-one studio management platform designed exclusively for professional video creators.
                    </p>

                    <div className="hero-cta animate-fade-in stagger-3" style={{ marginTop: "48px", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                        <Link to="/signup" className="btn btn-large" style={{ padding: "16px 32px", fontSize: "16px", borderRadius: "8px" }}>
                            Start Building Now
                            <ArrowRight size={18} style={{ display: 'inline', marginLeft: "8px" }} />
                        </Link>
                        <a href="#story" className="btn btn-secondary btn-large" style={{ padding: "16px 32px", fontSize: "16px", borderRadius: "8px" }}>
                            <PlayCircle size={18} style={{ display: 'inline', marginRight: "8px" }} />
                            See How It Works
                        </a>
                    </div>

                    {/* Dashboard Preview Mockup Container */}
                    <div className="animate-slide-up stagger-4" style={{ marginTop: "80px", maxWidth: "1100px", margin: "80px auto 0 auto", position: "relative" }}>
                        {/* Gradient Fade to obscure the bottom of the mockup */}
                        <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: "30%", background: "linear-gradient(to top, var(--bg-color) 10%, transparent)", zIndex: 10 }} />

                        {/* Mockup Window */}
                        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "16px 16px 0 0", padding: "12px", paddingBottom: "0", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>

                            {/* macOS style traffic lights */}
                            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", paddingLeft: "8px" }}>
                                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }} />
                                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
                                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27c93f" }} />
                            </div>

                            {/* Dashboard Image */}
                            <div style={{ borderRadius: "8px 8px 0 0", overflow: "hidden", border: "1px solid var(--border)", borderBottom: "none" }}>
                                <img
                                    src="/images/real-dashboard-ss.png"
                                    alt="InfluencerzHub Dashboard Snapshot"
                                    style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* THE STORY / PROBLEM SECTION */}
                <section id="story" style={{ padding: "140px 24px", background: "linear-gradient(to bottom, var(--bg-color), var(--bg-secondary))" }}>
                    <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
                        <h2 className="animate-slide-up" style={{ fontSize: "clamp(28px, 4vw, 40px)", marginBottom: "32px", fontWeight: "700" }}>You are a <span style={{ color: "var(--primary)" }}>CEO</span>, not just a creator.</h2>
                        <p className="animate-slide-up stagger-1" style={{ fontSize: "18px", color: "var(--text-muted)", lineHeight: "1.8", marginBottom: "24px" }}>
                            When you start creating content, you only worry about the camera and the edit. But as you scale, you suddenly have to manage pipelines, optimize for a demanding algorithm, negotiate with predatory brands, and track revenue across 5 different platforms. The creative process gets buried under administrative chaos.
                        </p>
                        <p className="animate-slide-up stagger-2" style={{ fontSize: "20px", color: "var(--text-main)", fontWeight: "600", marginTop: "32px", padding: "24px", border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-tertiary)" }}>
                            <LayoutDashboard size={24} color="var(--primary)" style={{ display: "inline", marginRight: "12px" }} />
                            InfluencerzHub brings the chaos into order.
                        </p>
                    </div>
                </section>

                {/* INTERACTIVE FEATURE SHOWCASE */}
                <section style={{ padding: "120px 24px", maxWidth: "1200px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "80px" }}>
                        <h2 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "16px" }}>Everything you need, in one place.</h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "18px" }}>A suite of professional tools designed specifically for the creator economy.</p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }} className="responsive-grid-split mt-8">

                        {/* Adaptive Side Menu */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveFeature(idx)}
                                    style={{
                                        padding: "24px",
                                        borderRadius: "16px",
                                        cursor: "pointer",
                                        background: activeFeature === idx ? "rgba(139, 92, 246, 0.08)" : "transparent",
                                        border: `1px solid ${activeFeature === idx ? "rgba(139, 92, 246, 0.3)" : "transparent"}`,
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        transform: activeFeature === idx ? "translateX(10px)" : "none"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
                                        <div style={{ padding: "10px", background: activeFeature === idx ? "var(--primary)" : "var(--bg-tertiary)", borderRadius: "10px", transition: "all 0.3s ease" }}>
                                            <feature.icon size={22} color={activeFeature === idx ? "#000" : "var(--text-muted)"} />
                                        </div>
                                        <h3 style={{ fontSize: "20px", fontWeight: "600", color: activeFeature === idx ? "var(--text-main)" : "var(--text-muted)" }}>{feature.title}</h3>
                                    </div>
                                    <div style={{
                                        height: activeFeature === idx ? "auto" : "0",
                                        overflow: "hidden",
                                        opacity: activeFeature === idx ? 1 : 0,
                                        transition: "opacity 0.3s ease"
                                    }}>
                                        <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.6", marginLeft: "56px", marginTop: "8px" }}>
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Interactive Visual Window Render Canvas */}
                        <div style={{ position: "relative" }}>
                            <div className="card" style={{ height: "480px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "url('data:image/svg+xml;utf8,<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"2\" cy=\"2\" r=\"1\" fill=\"rgba(255,255,255,0.03)\"/></svg>')", backgroundSize: "20px 20px" }}>
                                <div className="animate-slide-up" key={activeFeature} style={{ textAlign: "center", width: "100%", padding: "0 32px" }}>

                                    {/* Simulated "Widget" inside the dashboard */}
                                    <div style={{ background: "var(--bg-color)", border: "1px solid var(--border)", padding: "40px", borderRadius: "20px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)" }}>
                                        {(() => {
                                            const CurrentIcon = features[activeFeature].icon;
                                            return <CurrentIcon size={72} color="var(--primary)" style={{ margin: "0 auto 32px auto" }} />
                                        })()}
                                        <h4 style={{ fontSize: "22px", marginBottom: "20px", fontWeight: "600" }}>{features[activeFeature].title}</h4>
                                        <div style={{
                                            display: "inline-block",
                                            background: "rgba(139, 92, 246, 0.1)",
                                            padding: "16px 32px",
                                            borderRadius: "12px",
                                            border: "1px dashed rgba(139, 92, 246, 0.4)",
                                            fontFamily: "monospace",
                                            color: "var(--primary)",
                                            fontSize: "15px",
                                            fontWeight: "500"
                                        }}>
                                            {features[activeFeature].previewData}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Decorative glowing backdrops behind the display widget */}
                            <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "200px", height: "200px", background: "rgba(139, 92, 246, 0.3)", opacity: "0.5", filter: "blur(80px)", zIndex: -1, transition: "all 0.5s ease" }} />
                            <div style={{ position: "absolute", bottom: "-30px", left: "-30px", width: "200px", height: "200px", background: "rgba(56, 189, 248, 0.2)", opacity: "0.5", filter: "blur(80px)", zIndex: -1, transition: "all 0.5s ease" }} />
                        </div>
                    </div>
                </section>

                {/* BOTTOM CTA */}
                <section style={{ padding: "140px 24px", textAlign: "center", background: "var(--bg-secondary)" }}>
                    <div className="card" style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 40px", background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1), transparent 80%)", borderColor: "var(--primary)", boxShadow: "0 0 80px rgba(139, 92, 246, 0.1)" }}>
                        <h2 style={{ fontSize: "52px", fontWeight: "800", marginBottom: "24px", letterSpacing: "-1.5px" }}>Ready to scale your channel?</h2>
                        <p style={{ fontSize: "20px", color: "var(--text-muted)", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 48px auto", lineHeight: "1.6" }}>
                            Join the next generation of professional creators operating their content pipelines like real tech companies.
                        </p>
                        <Link to="/signup" className="btn btn-large group" style={{ padding: "20px 48px", fontSize: "18px", borderRadius: "12px" }}>
                            Create Free Workspace
                            <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="landing-footer text-center py-8" style={{ padding: "48px 24px", textAlign: "center", background: "var(--bg-color)" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "24px", color: "var(--text-main)", fontWeight: "600", fontSize: "18px" }}>
                    <Sparkles size={20} color="var(--primary)" /> InfluencerzHub
                </div>
                <p className="text-muted" style={{ fontSize: "14px" }}>&copy; {new Date().getFullYear()} InfluencerzHub Inc. Built exclusively for the Creator Economy.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
