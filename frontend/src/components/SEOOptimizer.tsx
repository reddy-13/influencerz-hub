import { useState } from "react";
import { Search, Sparkles, Hash, Copy, CheckCircle } from "lucide-react";

const SEOOptimizer = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<{ score: number, tags: string[], suggestions: string[] } | null>(null);
    const [copied, setCopied] = useState(false);

    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        setIsAnalyzing(true);
        setResults(null);
        setCopied(false);

        // Simulate AI analysis delay
        setTimeout(() => {
            // Mock AI response
            const mockTags = [
                "influencer", "tech", "review", title.split(" ")[0] || "video",
                "trends", "2026", "viral", title.length > 10 ? "detailed" : "quick"
            ];

            const mockScore = title.length > 40 && description.length > 100 ? 92 : 64;

            const mockSuggestions = [];
            if (title.length < 40) mockSuggestions.push("Make your title longer (optimal is 40-70 characters).");
            if (description.length < 100) mockSuggestions.push("Add more detail to the description to help ranking.");
            if (!title.includes("2026")) mockSuggestions.push("Include the current year to capture trending searches.");
            if (mockSuggestions.length === 0) mockSuggestions.push("Your video SEO is looking perfect!");

            setResults({
                score: mockScore,
                tags: mockTags,
                suggestions: mockSuggestions
            });
            setIsAnalyzing(false);
        }, 1500);
    };

    const handleCopyTags = () => {
        if (results?.tags) {
            navigator.clipboard.writeText(results.tags.join(", "));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">SEO Optimizer</h1>
                <p className="page-subtitle">Analyze your upcoming video title and description to maximize algorithmic reach.</p>
            </div>

            <div className="responsive-grid-half">

                <div className="card animate-slide-up stagger-1">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <Search size={22} color="var(--primary)" />
                        <h2 style={{ fontSize: "18px", margin: 0 }}>Content Analyzer</h2>
                    </div>

                    <form onSubmit={handleAnalyze}>
                        <div className="input-group">
                            <label className="input-label">Video Title</label>
                            <input
                                className="input-field"
                                placeholder="e.g. The Best Tech Gadgets of 2026..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Video Description</label>
                            <textarea
                                className="input-field"
                                placeholder="In this video I review..."
                                rows={6}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn"
                            type="submit"
                            style={{ width: "100%", opacity: isAnalyzing ? 0.7 : 1 }}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? (
                                <span>Analyzing AI Magic... <Sparkles size={16} style={{ animation: "pulse 1.5s infinite" }} /></span>
                            ) : (
                                <span><Sparkles size={16} /> Generate SEO Strategy</span>
                            )}
                        </button>
                    </form>
                </div>

                <div>
                    <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>Optimization Results</h2>

                    {!results && !isAnalyzing && (
                        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
                            <Sparkles size={48} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 16px" }} />
                            <p>Enter your details and click generate to get AI-powered insights.</p>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="card" style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                            <div style={{
                                width: "40px", height: "40px",
                                border: "3px solid rgba(139, 92, 246, 0.3)",
                                borderTopColor: "var(--primary)",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite"
                            }} />
                        </div>
                    )}

                    {results && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div className="card animate-fade-in stagger-2" style={{ display: "flex", alignItems: "center", gap: "20px", borderLeft: results.score > 80 ? "4px solid var(--accent)" : "4px solid #f59e0b" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "80px", height: "80px", background: "rgba(0,0,0,0.2)", borderRadius: "50%" }}>
                                    <span style={{ fontSize: "28px", fontWeight: "bold", color: results.score > 80 ? "var(--accent)" : "#f59e0b" }}>{results.score}</span>
                                    <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Score</span>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: "18px", marginBottom: "4px" }}>{results.score >= 80 ? "Excellent Potential!" : "Room to Improve"}</h3>
                                    <p style={{ margin: 0, fontSize: "14px" }}>Based on algorithm trends, here is your SEO strength.</p>
                                </div>
                            </div>

                            <div className="card animate-fade-in stagger-3">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                    <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}><Hash size={18} color="var(--primary)" /> Auto-Generated Tags</h3>
                                    <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }} onClick={handleCopyTags}>
                                        {copied ? <CheckCircle size={14} color="var(--accent)" /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
                                    </button>
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {results.tags.map(tag => (
                                        <span key={tag} style={{ background: "rgba(139, 92, 246, 0.15)", color: "var(--primary)", padding: "4px 12px", borderRadius: "100px", fontSize: "13px", fontWeight: "500" }}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="card animate-fade-in stagger-4">
                                <h3 style={{ fontSize: "16px", marginBottom: "16px" }}>Actionable Suggestions</h3>
                                <ul style={{ paddingLeft: "20px", margin: 0, color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {results.suggestions.map((sug, i) => (
                                        <li key={i}>{sug}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
        </div>
    );
};

export default SEOOptimizer;
