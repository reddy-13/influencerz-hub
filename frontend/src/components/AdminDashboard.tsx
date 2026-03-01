import { useEffect, useState } from "react";
import { Users, Kanban, Activity, Ban, CheckCircle, TrendingUp, Settings, CreditCard, ShieldAlert, ShieldCheck, Lock } from "lucide-react";
import { authApi } from "../services/api";

import type { AdminMetrics, User } from "../types";

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'settings' | 'security'>('overview');

    // Advanced Table & Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    // Mock settings state
    const [stripeKey, setStripeKey] = useState("sk_test_••••••••••••••••••••");
    const [webhookSecret, setWebhookSecret] = useState("whsec_••••••••••••••••••••");

    const [razorpayKeyId, setRazorpayKeyId] = useState("rzp_test_••••••••••••••••");
    const [razorpayKeySecret, setRazorpayKeySecret] = useState("rzp_sec_••••••••••••••••");

    // Modal & Toast States
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void, isDanger?: boolean }>({
        isOpen: false, title: "", message: "", onConfirm: () => { }
    });
    const [toast, setToast] = useState<{ isVisible: boolean, message: string, type: 'success' | 'error' | 'info' }>({
        isVisible: false, message: "", type: "info"
    });

    const showModal = (title: string, message: string, onConfirm: () => void, isDanger = false) => {
        setModalConfig({ isOpen: true, title, message, onConfirm, isDanger });
    };

    const hideModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ isVisible: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
    };

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const res = await authApi.getAdminMetrics(currentPage, limit);
            if (res.success) {
                setMetrics(res.metrics);
                setUsers(res.users);
                if (res.pagination) {
                    setTotalPages(res.pagination.totalPages);
                }
            }
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            setError(errorObj.response?.data?.message || "Failed to load admin metrics.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, [currentPage]);

    const toggleUserStatus = async (userId: string, currentStatus: string, role: string) => {
        if (role === 'admin') {
            showToast("Cannot modify administrator status.", "error");
            return;
        }

        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        showModal(
            `${newStatus === 'suspended' ? 'Suspend' : 'Activate'} User`,
            `Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'activate'} this user?`,
            async () => {
                hideModal();
                try {
                    await authApi.updateUserStatus(userId, newStatus);
                    await fetchAdminData();
                    showToast(`User successfully ${newStatus}.`, "success");
                } catch (err: unknown) {
                    const errorObj = err as { response?: { data?: { message?: string } } };
                    showToast(errorObj.response?.data?.message || "Failed to update status", "error");
                }
            },
            newStatus === 'suspended'
        );
    };

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        showToast("Settings saved successfully! (Simulation)", "success");
    };

    // Only show full-page loader if we haven't fetched the initial data yet
    if (loading && !metrics) {
        return <div style={{ color: "var(--text-muted)", padding: "20px" }}>Loading admin data...</div>;
    }

    if (error) {
        return <div style={{ color: "var(--danger)", padding: "20px" }}>{error} - You might not have admin rights.</div>;
    }

    return (
        <div style={{ maxWidth: "1400px", margin: "0 auto", paddingBottom: "40px" }} className="animate-fade-in">
            <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
                <Activity size={28} color="var(--primary)" />
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>Super Admin Console</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Global platform metrics and advanced system controls</p>
                </div>
            </div>

            {/* Admin Tabs */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', overflowX: 'auto' }}>
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '15px', whiteSpace: 'nowrap' }}>
                    <Users size={18} /> User Overview
                </button>
                <button
                    onClick={() => setActiveTab('financials')}
                    className={`nav-link ${activeTab === 'financials' ? 'active' : ''}`}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '15px', whiteSpace: 'nowrap' }}>
                    <TrendingUp size={18} /> Financials & Revenue
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '15px', whiteSpace: 'nowrap' }}>
                    <ShieldCheck size={18} /> Security & Audit
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '15px', whiteSpace: 'nowrap' }}>
                    <Settings size={18} /> System Settings
                </button>
            </div>

            {activeTab === 'overview' && (
                <>
                    {/* Overview Metrics */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
                        {[
                            { label: "Total Users", value: metrics?.totalUsers || 0, icon: Users, color: "#8b5cf6" },
                            { label: "Active Users", value: metrics?.activeUsers || 0, icon: CheckCircle, color: "#10b981" },
                            { label: "Suspended", value: metrics?.suspendedUsers || 0, icon: Ban, color: "#ef4444" },
                            { label: "Created Tasks", value: metrics?.totalTasks || 0, icon: Kanban, color: "#f59e0b" },
                        ].map((stat, i) => (
                            <div key={i} className="card animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, padding: "20px", display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                                    <div style={{ padding: "8px", borderRadius: "8px", background: `${stat.color}20` }}>
                                        <stat.icon size={18} color={stat.color} />
                                    </div>
                                    <h3 style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>{stat.label}</h3>
                                </div>
                                <div style={{ fontSize: "28px", fontWeight: "700" }}>{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* User List Matrix */}
                    <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>Registered Accounts</h3>
                        <div style={{ overflowX: "auto", position: "relative" }}>
                            {/* In-place Table Loading Overlay */}
                            {loading && metrics && (
                                <div style={{
                                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                                    background: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(2px)",
                                    zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center",
                                    borderRadius: "8px"
                                }}>
                                    <Activity className="animate-spin" size={32} color="var(--primary)" />
                                </div>
                            )}
                            <table style={{
                                width: "100%", borderCollapse: "collapse", fontSize: "14px",
                                opacity: loading && metrics ? 0.6 : 1, transition: "opacity 0.2s"
                            }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "var(--text-muted)", textAlign: "left" }}>
                                        <th style={{ padding: "12px", fontWeight: "500" }}>Name</th>
                                        <th style={{ padding: "12px", fontWeight: "500" }}>Email</th>
                                        <th style={{ padding: "12px", fontWeight: "500" }}>Role</th>
                                        <th style={{ padding: "12px", fontWeight: "500" }}>Status</th>
                                        <th style={{ padding: "12px", fontWeight: "500", textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u: User) => (
                                        <tr key={u._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                                            <td style={{ padding: "12px" }}>{u.name}</td>
                                            <td style={{ padding: "12px", color: "var(--text-muted)" }}>{u.email}</td>
                                            <td style={{ padding: "12px" }}>
                                                <span style={{
                                                    background: u.role === 'admin' ? "rgba(139, 92, 246, 0.2)" : "rgba(255, 255, 255, 0.05)",
                                                    color: u.role === 'admin' ? "var(--primary)" : "var(--text-subtle)",
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px"
                                                }}>
                                                    {u.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px" }}>
                                                <span style={{
                                                    color: u.status === 'active' ? "#10b981" : "#ef4444",
                                                    display: 'flex', alignItems: 'center', gap: '4px'
                                                }}>
                                                    {u.status === 'active' ? <CheckCircle size={14} /> : <Ban size={14} />}
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px", textAlign: "right" }}>
                                                {u.role !== 'admin' && (
                                                    <button
                                                        onClick={() => toggleUserStatus(u._id!, u.status || 'active', u.role)}
                                                        className="btn"
                                                        style={{
                                                            padding: "6px 12px", fontSize: "12px",
                                                            background: u.status === 'active' ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                                                            color: u.status === 'active' ? "#ef4444" : "#10b981",
                                                            borderColor: "transparent"
                                                        }}
                                                    >
                                                        {u.status === 'active' ? "Suspend User" : "Activate User"}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)" }}>No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Overlay Controls */}
                        {totalPages > 1 && (
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px" }}>
                                <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                                    Showing page <span style={{ color: "var(--text)", fontWeight: "600" }}>{currentPage}</span> of <span style={{ color: "var(--text)", fontWeight: "600" }}>{totalPages}</span>
                                </div>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="btn"
                                        style={{ background: currentPage === 1 ? "rgba(255,255,255,0.05)" : "var(--dark)", color: currentPage === 1 ? "var(--text-muted)" : "#fff", padding: "8px 16px", cursor: currentPage === 1 ? 'not-allowed' : 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="btn"
                                        style={{ background: currentPage === totalPages ? "rgba(255,255,255,0.05)" : "var(--dark)", color: currentPage === totalPages ? "var(--text-muted)" : "#fff", padding: "8px 16px", cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {activeTab === 'financials' && (
                <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                        <div className="card" style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "1px solid rgba(16, 185, 129, 0.2)", background: "linear-gradient(145deg, rgba(16, 185, 129, 0.05), transparent)" }}>
                            <p style={{ color: "var(--text-muted)", marginBottom: "8px" }}>Lifetime Platform Revenue</p>
                            <h2 style={{ fontSize: "48px", fontWeight: "700", color: "#10b981" }}>
                                ${((metrics?.totalRevenue || 0) / 1000).toFixed(1)}K
                            </h2>
                        </div>
                        <div className="card" style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "1px solid rgba(59, 130, 246, 0.2)", background: "linear-gradient(145deg, rgba(59, 130, 246, 0.05), transparent)" }}>
                            <p style={{ color: "var(--text-muted)", marginBottom: "8px" }}>Monthly Recurring Revenue</p>
                            <h2 style={{ fontSize: "48px", fontWeight: "700", color: "#3b82f6" }}>
                                ${((metrics?.monthlyRevenue || 0) / 1000).toFixed(1)}K
                            </h2>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>Engagement Metrics</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                            <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
                                <div style={{ fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>{metrics?.totalVideos || 0}</div>
                                <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>Total Videos Uploaded</div>
                            </div>
                            <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
                                <div style={{ fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>{metrics?.totalSponsorships || 0}</div>
                                <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>Sponsorship Deals Processed</div>
                            </div>
                            <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
                                <div style={{ fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>+22.4%</div>
                                <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>MoM Growth Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                        <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                <Lock size={20} color="#8b5cf6" />
                                <span style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "600" }}>Failed Login Attempts</span>
                            </div>
                            <span style={{ fontSize: "28px", fontWeight: "700" }}>34</span>
                            <span style={{ fontSize: "12px", color: "#10b981", marginTop: "4px" }}>-12% this week</span>
                        </div>
                        <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                <ShieldCheck size={20} color="#10b981" />
                                <span style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "600" }}>Active Sessions</span>
                            </div>
                            <span style={{ fontSize: "28px", fontWeight: "700" }}>1,240</span>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Across 8 regions</span>
                        </div>
                        <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                <Ban size={20} color="#ef4444" />
                                <span style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "600" }}>Blocked IP Addresses</span>
                            </div>
                            <span style={{ fontSize: "28px", fontWeight: "700" }}>142</span>
                            <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>+18 since yesterday</span>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>Recent Audit Logs</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {[
                                { action: "Admin Privilege Granted", user: "system@influencerz-hub.com", ip: "10.0.0.1", time: "2 mins ago" },
                                { action: "User Suspended (ID: 80a9)", user: "admin_david", ip: "192.168.1.44", time: "1 hour ago" },
                                { action: "Stripe Webhook Secret Modified", user: "admin_david", ip: "192.168.1.44", time: "3 hours ago" },
                                { action: "Failed Login Attempt", user: "unknown", ip: "45.22.19.122", time: "5 hours ago" }
                            ].map((log, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "6px" }}>
                                    <div>
                                        <div style={{ fontSize: "14px", fontWeight: "500", color: "#fff", marginBottom: "4px" }}>{log.action}</div>
                                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Triggered by: {log.user} (IP: {log.ip})</div>
                                    </div>
                                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{log.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px", alignItems: "start" }}>
                        <div className="card">
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                                <CreditCard size={24} color="#8b5cf6" />
                                <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Stripe Gateway Config</h3>
                            </div>
                            <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div className="input-group">
                                    <label className="input-label">Stripe Public Key</label>
                                    <input type="text" className="input-field" value="pk_live_••••••••••••••••••••" readOnly />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Stripe Secret Key</label>
                                    <input type="password" className="input-field" value={stripeKey} onChange={e => setStripeKey(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Webhook Secret Target</label>
                                    <input type="password" className="input-field" value={webhookSecret} onChange={e => setWebhookSecret(e.target.value)} />
                                </div>
                                <button type="submit" className="btn" style={{ alignSelf: "flex-start", marginTop: "8px" }}>Save Stripe Config</button>
                            </form>
                        </div>

                        <div className="card">
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                                <CreditCard size={24} color="#3b82f6" />
                                <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Razorpay Gateway Config</h3>
                            </div>
                            <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div className="input-group">
                                    <label className="input-label">Razorpay Key ID</label>
                                    <input type="text" className="input-field" value={razorpayKeyId} onChange={e => setRazorpayKeyId(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Razorpay Key Secret</label>
                                    <input type="password" className="input-field" value={razorpayKeySecret} onChange={e => setRazorpayKeySecret(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Environment</label>
                                    <select className="input-field" style={{ appearance: 'none' }}>
                                        <option value="test">Test Mode</option>
                                        <option value="live">Live Production</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", alignSelf: "flex-start", marginTop: "8px" }}>
                                    Save Razorpay Config
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="card" style={{ border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                            <ShieldAlert size={24} color="#ef4444" />
                            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#ef4444" }}>Danger Zone</h3>
                        </div>
                        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px", lineHeight: "1.6" }}>
                            These actions are destructive and cannot be undone. They will severely impact the platform runtime and delete records from the database permanently.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <button className="btn" style={{ background: "transparent", borderColor: "#ef4444", color: "#ef4444", width: "100%" }} onClick={() => showToast('Wipe routine disabled for demo.', 'info')}>
                                Wipe All Creator Tasks
                            </button>
                            <button className="btn" style={{ background: "transparent", borderColor: "#ef4444", color: "#ef4444", width: "100%" }} onClick={() => showToast('Maintenance routine disabled for demo.', 'info')}>
                                Enable Maintenance Mode
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Overlay */}
            {modalConfig.isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                    <div className="card animate-slide-up" style={{ width: '400px', padding: '24px', border: modalConfig.isDanger ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: modalConfig.isDanger ? '#ef4444' : '#fff' }}>{modalConfig.title}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.6', fontSize: '15px' }}>{modalConfig.message}</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }} onClick={hideModal}>Cancel</button>
                            <button className="btn" style={{ background: modalConfig.isDanger ? '#ef4444' : 'var(--primary)', color: '#fff', border: 'none' }} onClick={modalConfig.onConfirm}>Confirm Action</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.isVisible && (
                <div className="animate-slide-up" style={{
                    position: 'fixed', bottom: '32px', right: '32px', zIndex: 1100,
                    padding: '16px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px',
                    background: toast.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : toast.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                    border: `1px solid ${toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#3b82f6'}`,
                    color: '#fff', backdropFilter: 'blur(12px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ padding: '6px', borderRadius: '50%', background: toast.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : toast.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)' }}>
                        {toast.type === 'success' ? <CheckCircle size={20} color="#10b981" /> : toast.type === 'error' ? <Ban size={20} color="#ef4444" /> : <Activity size={20} color="#3b82f6" />}
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: '500' }}>{toast.message}</span>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
