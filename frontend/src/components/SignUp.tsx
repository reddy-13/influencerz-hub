import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { authApi } from '../services/api';
import { useAppStore } from '../store/useAppStore';

const SignUp = () => {
    const navigate = useNavigate();
    const setUser = useAppStore(state => state.setUser);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const resp = await authApi.register({ name, email, password });
            if (resp.success) {
                setUser(resp.user);
                navigate(resp.user.role === 'admin' ? '/admin' : '/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-split-card animate-slide-up">

                {/* Left Side: Visual / Testimonial */}
                <div
                    className="auth-sidebar hide-on-mobile"
                    style={{ backgroundImage: "url('/images/growth-abstract.png')" }}
                >
                    <div className="auth-sidebar-overlay"></div>
                    <div className="auth-sidebar-content">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", color: "var(--text-main)", fontWeight: "700" }}>
                            <div style={{ background: "rgba(139, 92, 246, 0.2)", padding: "8px", borderRadius: "8px" }}>
                                <UserPlus size={20} color="var(--primary)" />
                            </div>
                            InfluencerzHub
                        </div>
                        <h3 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "16px", color: "white", lineHeight: "1.3" }}>
                            "This platform completely transformed how we run the channel. Sponsorships and production used to be a nightmare."
                        </h3>
                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px" }}>— Alex R., 1.2M Subscribers</p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="auth-form-side">
                    <div style={{ marginBottom: "32px", textAlign: "left" }}>
                        <h2 className="page-title" style={{ fontSize: "28px", marginBottom: "8px" }}>Create Account</h2>
                        <p className="text-muted text-sm" style={{ fontSize: "15px" }}>Start managing your video production workflow today.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <input type="text" required className="input-field" placeholder="MKBHD" style={{ padding: "12px", fontSize: "15px" }} value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <input type="email" required className="input-field" placeholder="creator@youtube.com" style={{ padding: "12px", fontSize: "15px" }} value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input type="password" required className="input-field" placeholder="••••••••" style={{ padding: "12px", fontSize: "15px" }} value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn w-full mt-4" style={{ width: '100%', marginTop: "24px", padding: "12px", fontSize: "16px" }} disabled={loading}>
                            <UserPlus size={18} className="mr-2" /> {loading ? 'Creating Account...' : "Get Started — It's Free"}
                        </button>
                    </form>

                    <div className="text-center mt-6" style={{ marginTop: "32px", textAlign: "center" }}>
                        <p className="text-muted text-sm" style={{ fontSize: "14px" }}>
                            Already have an account? <Link to="/signin" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "none" }}>Log in</Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default SignUp;
