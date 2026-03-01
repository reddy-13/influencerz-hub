import { Users, Clock, DollarSign, ChevronRight, PlayCircle, MoreVertical, Eye } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useNavigate } from "react-router-dom";

const performanceData = [
    { name: '28 Oct', views: 200 },
    { name: '21 Aug', views: 280 },
    { name: '25 Aug', views: 400 },
    { name: '27 Sep', views: 600 },
    { name: '30 Oct', views: 480 },
    { name: '1 Nov', views: 700 },
    { name: '15 Nov', views: 850 },
];

const miniData1 = [{ v: 48 }, { v: 46 }, { v: 52 }, { v: 50 }, { v: 58 }, { v: 54 }, { v: 48 }];
const miniData2 = [{ v: 12 }, { v: 14 }, { v: 13 }, { v: 16 }, { v: 15 }, { v: 12 }, { v: 12 }];
const miniData3 = [{ v: 34 }, { v: 31 }, { v: 35 }, { v: 38 }, { v: 32 }, { v: 36 }, { v: 32 }];
const miniData4 = [{ v: 19 }, { v: 18 }, { v: 21 }, { v: 19 }, { v: 23 }, { v: 20 }, { v: 19 }];

const barData = Array.from({ length: 48 }, (_, i) => ({ name: i, value: Math.max(10, Math.random() * 100) }));

const MiniChart = ({ data, color }: { data: any[], color: string }) => (
    <div style={{ height: "40px", width: "100%", marginTop: "auto", marginLeft: "-10px" }}>
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} horizontal={false} />
                <YAxis domain={['dataMin - 10', 'auto']} hide />
                <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#grad-${color.replace('#', '')})`} isAnimationActive={false} />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: "1400px", margin: "0 auto", paddingBottom: "40px" }} className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>Channel Dashboard</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Dynamic analytics</p>
                </div>

                {/* Search / Header Actions Placeholder */}
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)", padding: "10px 16px", borderRadius: "20px", width: "250px", color: "var(--text-muted)", fontSize: "14px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline-block", marginRight: "8px", verticalAlign: "middle" }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        Search
                    </div>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                {/* Card 1 */}
                <div style={{ background: "linear-gradient(145deg, rgba(30, 25, 45, 0.4), rgba(20, 18, 30, 0.6))", borderRadius: "16px", padding: "20px", border: "1px solid rgba(139, 92, 246, 0.15)", display: "flex", flexDirection: "column", height: "160px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "var(--text-muted)" }}>
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>Total Subscribers</span>
                        <Users size={16} />
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "700", lineHeight: "1" }}>485.2K</div>
                    <div style={{ fontSize: "13px", color: "#10b981", marginTop: "8px" }}>+3.1K</div>
                    <MiniChart data={miniData1} color="#c084fc" />
                </div>

                {/* Card 2 */}
                <div style={{ background: "linear-gradient(145deg, rgba(30, 25, 45, 0.4), rgba(20, 18, 30, 0.6))", borderRadius: "16px", padding: "20px", border: "1px solid rgba(139, 92, 246, 0.15)", display: "flex", flexDirection: "column", height: "160px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "var(--text-muted)" }}>
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>Total Views</span>
                        <Eye size={16} />
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "700", lineHeight: "1" }}>12.4M</div>
                    <div style={{ fontSize: "13px", color: "#10b981", marginTop: "8px" }}>+128.5K</div>
                    <MiniChart data={miniData2} color="#38bdf8" />
                </div>

                {/* Card 3 */}
                <div style={{ background: "linear-gradient(145deg, rgba(30, 25, 45, 0.4), rgba(20, 18, 30, 0.6))", borderRadius: "16px", padding: "20px", border: "1px solid rgba(139, 92, 246, 0.15)", display: "flex", flexDirection: "column", height: "160px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "var(--text-muted)" }}>
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>Watch Time</span>
                        <Clock size={16} />
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "700", lineHeight: "1" }}>310K hrs</div>
                    <div style={{ fontSize: "13px", color: "#10b981", marginTop: "8px" }}>+8.9K</div>
                    <MiniChart data={miniData3} color="#c084fc" />
                </div>

                {/* Card 4 */}
                <div style={{ background: "linear-gradient(145deg, rgba(30, 25, 45, 0.4), rgba(20, 18, 30, 0.6))", borderRadius: "16px", padding: "20px", border: "1px solid rgba(139, 92, 246, 0.15)", display: "flex", flexDirection: "column", height: "160px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "var(--text-muted)" }}>
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>Revenue</span>
                        <DollarSign size={16} />
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "700", lineHeight: "1" }}>$19,850</div>
                    <div style={{ fontSize: "13px", color: "#10b981", marginTop: "8px" }}>+$2.1K</div>
                    <MiniChart data={miniData4} color="#38bdf8" />
                </div>
            </div>

            {/* Middle Section: Growth Chart & Top Videos list */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "20px" }}>

                {/* Audience Growth Area Chart */}
                <div style={{ flex: "2 1 600px", background: "linear-gradient(145deg, rgba(20, 18, 30, 0.6), rgba(15, 12, 24, 0.8))", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "600" }}>Audience Growth</h3>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center", fontSize: "12px", color: "var(--text-muted)" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#8b5cf6" }} /> Views</span>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#38bdf8" }} /> Revenue</span>
                        </div>
                    </div>

                    <div style={{ height: "280px", width: "100%", marginLeft: "-20px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}M`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                                />
                                <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorMain)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Videos List */}
                <div style={{ flex: "1 1 300px", background: "linear-gradient(145deg, rgba(20, 18, 30, 0.6), rgba(15, 12, 24, 0.8))", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "600" }}>Top Videos</h3>
                        <span onClick={() => navigate('/videos')} style={{ fontSize: "13px", color: "var(--primary)", cursor: "pointer", display: "inline-block" }}>View all</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {[
                            { title: "Building an operating system for creators", views: "22.4M", likes: "12.5K", comments: "53", duration: "30:20" },
                            { title: "Why I switched from Premiere to DaVinci", views: "12.6M", likes: "9.5K", comments: "13", duration: "50:54" },
                            { title: "My ultimate camera setup for 2026", views: "22.3K", likes: "1.75K", comments: "0", duration: "10:20" },
                            { title: "Reviewing the M5 MacBook Pro", views: "1.2M", likes: "81K", comments: "120", duration: "15:40" }
                        ].map((video, i) => (
                            <div key={i} style={{ display: "flex", gap: "16px", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.02)" }}>
                                <div style={{ position: "relative", width: "80px", height: "50px", borderRadius: "8px", background: "url('data:image/svg+xml;utf8,<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"2\" cy=\"2\" r=\"1\" fill=\"rgba(255,255,255,0.1)\"/></svg>')", backgroundSize: "cover", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-tertiary)" }}>
                                    <div style={{ position: "absolute", top: "4px", left: "4px", background: "rgba(0,0,0,0.6)", color: "white", fontSize: "8px", padding: "2px 4px", borderRadius: "4px" }}>High-res</div>
                                    <PlayCircle size={20} color="rgba(255,255,255,0.8)" />
                                    <div style={{ position: "absolute", bottom: "4px", right: "4px", background: "rgba(0,0,0,0.8)", color: "white", fontSize: "9px", padding: "1px 4px", borderRadius: "4px" }}>{video.duration}</div>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                        <h4 style={{ fontSize: "14px", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "8px" }}>{video.title}</h4>
                                        <MoreVertical size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                    </div>
                                    <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "var(--text-muted)" }}>
                                        <span>Views <span style={{ color: "white" }}>{video.views}</span></span>
                                        <span>Likes <span style={{ color: "white" }}>{video.likes}</span></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Bottom Section: Realtime Views Bar Chart */}
            <div style={{ background: "linear-gradient(145deg, rgba(20, 18, 30, 0.6), rgba(15, 12, 24, 0.8))", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600" }}>Realtime Views (48h)</h3>
                    <div style={{ color: "var(--text-muted)" }}>
                        <ChevronRight size={18} />
                    </div>
                </div>

                <div style={{ height: "80px", width: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <defs>
                                <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#c084fc" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                            <Bar dataKey="value" fill="url(#barColor)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
