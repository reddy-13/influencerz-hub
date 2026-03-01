import { useState } from "react";
import { Handshake, Building2, Plus, Sparkles } from "lucide-react";
import { useSponsorships, useCreateSponsorship } from "../hooks/useQueries";

const SponsorshipMarketplace = () => {
    const { data: sponsorships = [], isLoading: loading } = useSponsorships();
    const { mutate: createSponsorship } = useCreateSponsorship();

    const [brand, setBrand] = useState("");
    const [amount, setAmount] = useState("");

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brand || !amount) return;

        createSponsorship(
            {
                brand,
                amount: Number(amount),
                user: "6472b535d4f3b890982abcd1" // Mock user ID
            },
            {
                onSuccess: () => {
                    setBrand("");
                    setAmount("");
                },
                onError: (error) => {
                    console.error("Failed to create sponsorship", error);
                }
            }
        );
    };

    return (
        <div>
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <h1 className="page-title">Sponsorship Marketplace</h1>
                    <p className="page-subtitle">Track incoming deals and coordinate with brands.</p>
                </div>
            </div>

            <div className="responsive-grid-split">
                {/* Deal Form */}
                <div className="card animate-slide-up stagger-1">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <Building2 size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: "20px", margin: 0 }}>Add New Deal</h2>
                    </div>
                    <form onSubmit={handleCreate}>
                        <div className="input-group">
                            <label className="input-label">Brand Name</label>
                            <input
                                className="input-field"
                                placeholder="e.g. Nike, TechCorp..."
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Sponsorship Amount ($)</label>
                            <input
                                className="input-field"
                                type="number"
                                placeholder="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>

                        <button className="btn" type="submit" style={{ width: "100%", background: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)", marginTop: "10px" }}>
                            <Plus size={18} /> Register Deal
                        </button>
                    </form>
                </div>

                {/* Existing Deals */}
                <div>
                    <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Active Partnerships</h2>
                    {loading ? (
                        <p style={{ color: "var(--text-muted)" }}>Loading campaigns...</p>
                    ) : sponsorships.length === 0 ? (
                        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
                            <Handshake size={48} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 16px" }} />
                            <p>No active deals yet. Pitch your channel today!</p>
                        </div>
                    ) : (
                        <div className="card-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                            {sponsorships.map((deal, index) => (
                                <div key={deal._id} className="card animate-fade-in" style={{ position: "relative", animationDelay: `${index * 0.15}s` }}>
                                    <div style={{ position: "absolute", top: "16px", right: "16px", color: "var(--accent)" }}>
                                        <Sparkles size={20} />
                                    </div>
                                    <h3 style={{ fontSize: "20px", color: "white", marginBottom: "4px" }}>{deal.brand}</h3>
                                    <div className="stat-value" style={{ fontSize: "28px", color: "var(--accent)", margin: "10px 0" }}>
                                        ${deal.amount.toLocaleString()}
                                    </div>
                                    <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.6 }}>
                                        Started {new Date(deal.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SponsorshipMarketplace;
