import { NavLink } from "react-router-dom";
import { LayoutDashboard, Video, DollarSign, Hexagon, Search, PieChart, Kanban, Shield, LogOut } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { authApi } from "../services/api";

const Sidebar = () => {
    const user = useAppStore(state => state.user);
    const setUser = useAppStore(state => state.setUser);

    return (
        <div className="sidebar animate-fade-in">
            <div className="sidebar-brand animate-slide-up">
                <Hexagon size={28} color="#8b5cf6" style={{ animation: "pulse-slow 3s infinite" }} />
                InfluenceHub
            </div>
            <nav className="desktop-sidebar-nav">
                {user?.role !== 'admin' && (
                    <>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            <LayoutDashboard size={20} />
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/videos"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            <Video size={20} />
                            Videos
                        </NavLink>
                        <NavLink
                            to="/sponsorships"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            <DollarSign size={20} />
                            Sponsorships
                        </NavLink>
                        <NavLink
                            to="/seo"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            <Search size={20} />
                            SEO Optimizer
                        </NavLink>
                        <NavLink
                            to="/monetization"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            <PieChart size={20} />
                            Monetization
                        </NavLink>
                        <NavLink
                            to="/production"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        >
                            <Kanban size={20} />
                            Kanban
                        </NavLink>
                    </>
                )}

                {user?.role === 'admin' ? (
                    <NavLink
                        to="/admin"
                        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                        style={{ marginTop: 'auto', color: 'var(--primary)' }}
                    >
                        <Shield size={20} />
                        Admin Panel
                    </NavLink>
                ) : (
                    <div style={{ marginTop: 'auto' }} />
                )}

                <button
                    onClick={async () => {
                        await authApi.logout();
                        setUser(null);
                    }}
                    className="nav-link"
                    style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;
