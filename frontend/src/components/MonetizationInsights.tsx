import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { DollarSign, TrendingUp, CreditCard, ShoppingBag, ArrowUpRight } from "lucide-react";

const data = [
    { name: "YouTube AdSense", value: 4500, color: "#ef4444" },
    { name: "Sponsorships", value: 6200, color: "#8b5cf6" },
    { name: "Affiliate Links", value: 1800, color: "#10b981" },
    { name: "Merchandise", value: 2000, color: "#f59e0b" },
];

const recentTransactions = [
    { id: 1, source: "NordVPN Sponsorship", date: "Oct 24, 2026", amount: "+$2,500.00", status: "Completed" },
    { id: 2, source: "YouTube AdSense", date: "Oct 21, 2026", amount: "+$1,240.50", status: "Completed" },
    { id: 3, source: "Amazon Affiliates", date: "Oct 15, 2026", amount: "+$450.20", status: "Processing" },
    { id: 4, source: "Creator Merch Store", date: "Oct 12, 2026", amount: "+$890.00", status: "Completed" },
];

const MonetizationInsights = () => {
    const totalRevenue = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Monetization Insights</h1>
                <p className="page-subtitle">Track your revenue streams, RPM, and analyze your financial growth.</p>
            </div>

            <div className="card-grid" style={{ marginBottom: "32px" }}>
                <div className="card animate-slide-up stagger-1">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>Total Revenue</h3>
                        <DollarSign size={16} color="var(--primary)" />
                    </div>
                    <div className="stat-value" style={{ fontSize: "28px" }}>${totalRevenue.toLocaleString()}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px", fontSize: "12px", color: "var(--accent)" }}>
                        <ArrowUpRight size={14} /> <span>+12.5% from last month</span>
                    </div>
                </div>

                <div className="card animate-slide-up stagger-2">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>Average RPM</h3>
                        <TrendingUp size={16} color="var(--accent)" />
                    </div>
                    <div className="stat-value" style={{ fontSize: "28px" }}>$8.42</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px", fontSize: "12px", color: "var(--accent)" }}>
                        <ArrowUpRight size={14} /> <span>+$0.50 an improvement</span>
                    </div>
                </div>

                <div className="card animate-slide-up stagger-3">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>Active Sponsors</h3>
                        <CreditCard size={16} color="#f59e0b" />
                    </div>
                    <div className="stat-value" style={{ fontSize: "28px" }}>6</div>
                    <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
                        2 negotiating renewal
                    </div>
                </div>

                <div className="card animate-slide-up stagger-4">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>Merch Sales</h3>
                        <ShoppingBag size={16} color="#ef4444" />
                    </div>
                    <div className="stat-value" style={{ fontSize: "28px" }}>142</div>
                    <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
                        Orders fulfilled this week
                    </div>
                </div>
            </div>

            <div className="responsive-grid-half">
                <div className="card animate-fade-in stagger-1">
                    <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>Revenue Distribution</h2>
                    <div style={{ width: "100%", height: "300px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                                    itemStyle={{ color: "#fff" }}
                                    formatter={(value: string | number | undefined) => `$${Number(value).toLocaleString()}`}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card animate-fade-in stagger-2" style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "18px", margin: 0 }}>Recent Payouts</h2>
                        <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>View All</button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
                        {recentTransactions.map((tx) => (
                            <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div style={{
                                        width: "40px", height: "40px",
                                        borderRadius: "50%",
                                        background: "rgba(139, 92, 246, 0.15)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "var(--primary)"
                                    }}>
                                        <DollarSign size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: "0 0 4px", fontSize: "15px", color: "var(--text-main)" }}>{tx.source}</h4>
                                        <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>{tx.date}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-main)", marginBottom: "4px" }}>{tx.amount}</div>
                                    <div style={{
                                        fontSize: "11px",
                                        padding: "2px 8px",
                                        borderRadius: "100px",
                                        display: "inline-block",
                                        background: tx.status === "Completed" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                                        color: tx.status === "Completed" ? "var(--accent)" : "#f59e0b"
                                    }}>
                                        {tx.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonetizationInsights;
