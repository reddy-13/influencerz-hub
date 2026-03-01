import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { DollarSign, Wallet, TrendingDown, Receipt, ArrowUpRight, Plus } from "lucide-react";
import { useSponsorships, useExpenses, useCreateExpense } from "../hooks/useQueries";

const MonetizationInsights = () => {
    // 1. Fetch real Revenue from Sponsorships
    const { data: sponsorships = [] } = useSponsorships();

    // 2. Fetch real Expenses
    const { data: expenses = [], isLoading: isLoadingExpenses } = useExpenses();
    const { mutate: createExpense } = useCreateExpense();

    const [expenseCategory, setExpenseCategory] = useState("Software/Tools");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenseDescription, setExpenseDescription] = useState("");

    const handleCreateExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!expenseAmount || !expenseDescription) return;

        createExpense(
            {
                category: expenseCategory,
                amount: Number(expenseAmount),
                description: expenseDescription
            },
            {
                onSuccess: () => {
                    setExpenseAmount("");
                    setExpenseDescription("");
                }
            }
        );
    };

    const totalRevenue = sponsorships.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    // Algorithm: Set aside roughly 25% of Net Profit for End of Year Taxes
    const estimatedTaxes = netProfit > 0 ? netProfit * 0.25 : 0;

    // Distribution Data for Pie Chart
    const pieData = [
        { name: "Software/Tools", value: expenses.filter(e => e.category === "Software/Tools").reduce((a, c) => a + c.amount, 0), color: "#3b82f6" },
        { name: "Gear/Equipment", value: expenses.filter(e => e.category === "Gear/Equipment").reduce((a, c) => a + c.amount, 0), color: "#f59e0b" },
        { name: "Contractors", value: expenses.filter(e => e.category === "Contractors/Editors").reduce((a, c) => a + c.amount, 0), color: "#ef4444" },
        { name: "Marketing", value: expenses.filter(e => e.category === "Marketing").reduce((a, c) => a + c.amount, 0), color: "#8b5cf6" },
        { name: "Other", value: expenses.filter(e => e.category === "Other").reduce((a, c) => a + c.amount, 0), color: "#10b981" },
    ].filter(d => d.value > 0);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">True Net Profit Tracker</h1>
                <p className="page-subtitle">Track your precise revenue, log real business expenses, and estimate EOY taxes.</p>
            </div>

            <div className="card-grid" style={{ marginBottom: "32px", gridTemplateColumns: "repeat(4, 1fr)" }}>
                {/* Real-time Metric Cards */}
                <div className="card animate-slide-up stagger-1">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>Gross Revenue</h3>
                        <DollarSign size={16} color="var(--primary)" />
                    </div>
                    <div className="stat-value" style={{ fontSize: "28px" }}>${totalRevenue.toLocaleString()}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px", fontSize: "12px", color: "var(--accent)" }}>
                        <ArrowUpRight size={14} /> <span>From active sponsorships</span>
                    </div>
                </div>

                <div className="card animate-slide-up stagger-2">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>Business Expenses</h3>
                        <TrendingDown size={16} color="#ef4444" />
                    </div>
                    <div className="stat-value" style={{ fontSize: "28px" }}>${totalExpenses.toLocaleString()}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                        Logged Deductions
                    </div>
                </div>

                <div className="card animate-slide-up stagger-3" style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0, color: "var(--text-main)", fontSize: "14px", fontWeight: "600" }}>True Net Profit</h3>
                        <Wallet size={16} color="#10b981" />
                    </div>
                    <div className="stat-value" style={{ fontSize: "28px", color: "#10b981" }}>${netProfit.toLocaleString()}</div>
                    <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-main)", opacity: 0.8 }}>
                        Actual Cash Retained
                    </div>
                </div>

                <div className="card animate-slide-up stagger-4" style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0, color: "var(--text-main)", fontSize: "14px", fontWeight: "600" }}>Estimated Taxes (25%)</h3>
                        <Receipt size={16} color="#ef4444" />
                    </div>
                    <div className="stat-value" style={{ fontSize: "28px", color: "#ef4444" }}>${estimatedTaxes.toLocaleString()}</div>
                    <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-main)", opacity: 0.8 }}>
                        Set this money aside
                    </div>
                </div>
            </div>

            <div className="responsive-grid-split">
                {/* Expense Log Form */}
                <div className="card animate-fade-in stagger-1">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <Receipt size={24} color="#ef4444" />
                        <h2 style={{ fontSize: "20px", margin: 0 }}>Log New Expense</h2>
                    </div>
                    <form onSubmit={handleCreateExpense}>
                        <div className="input-group">
                            <label className="input-label">Expense Category</label>
                            <select
                                className="input-field"
                                value={expenseCategory}
                                onChange={(e) => setExpenseCategory(e.target.value)}
                            >
                                <option value="Software/Tools">Software & Subscriptions</option>
                                <option value="Gear/Equipment">Camera & Gear</option>
                                <option value="Contractors/Editors">Contractors & Editors</option>
                                <option value="Marketing">Marketing & Ads</option>
                                <option value="Other">Other Expenses</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Cost ($)</label>
                            <input
                                className="input-field"
                                type="number"
                                placeholder="0"
                                value={expenseAmount}
                                onChange={(e) => setExpenseAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Short Description</label>
                            <input
                                className="input-field"
                                placeholder="e.g. Adobe Premiere Pro Monthly"
                                value={expenseDescription}
                                onChange={(e) => setExpenseDescription(e.target.value)}
                                required
                            />
                        </div>

                        <button className="btn" type="submit" style={{ width: "100%", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", marginTop: "10px" }}>
                            <Plus size={18} /> Add Deduction
                        </button>
                    </form>
                </div>

                {/* Expense Breakdown */}
                <div className="card animate-fade-in stagger-2">
                    <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>Expense Breakdown</h2>
                    {pieData.length === 0 ? (
                        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>
                            No expenses logged yet.
                        </div>
                    ) : (
                        <div style={{ width: "100%", height: "300px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
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
                    )}
                </div>
            </div>

            <div className="card" style={{ marginTop: "32px" }}>
                <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>Recent Expense Log</h2>
                {isLoadingExpenses ? (
                    <p style={{ color: "var(--text-muted)" }}>Loading records...</p>
                ) : expenses.length === 0 ? (
                    <p style={{ color: "var(--text-muted)" }}>You have 100% profit margin right now! Keep it up.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {expenses.map((exp) => (
                            <div key={exp._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div style={{
                                        width: "40px", height: "40px",
                                        borderRadius: "50%",
                                        background: "rgba(239, 68, 68, 0.15)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "#ef4444"
                                    }}>
                                        <TrendingDown size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: "0 0 4px", fontSize: "15px", color: "var(--text-main)" }}>{exp.description}</h4>
                                        <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>{new Date(exp.date).toLocaleDateString()} • {exp.category}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "15px", fontWeight: "600", color: "#ef4444", marginBottom: "4px" }}>-${exp.amount.toLocaleString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonetizationInsights;
