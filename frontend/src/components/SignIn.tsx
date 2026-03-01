import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { authApi } from '../services/api';
import { useAppStore } from '../store/useAppStore';

const SignIn = () => {
    const navigate = useNavigate();
    const setUser = useAppStore(state => state.setUser);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const resp = await authApi.login({ email, password });
            if (resp.success) {
                setUser(resp.user);
                navigate(resp.user.role === 'admin' ? '/admin' : '/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="card auth-card animate-slide-up">
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <h2 className="page-title">Welcome Back</h2>
                    <p className="text-muted text-sm" style={{ fontSize: "14px" }}>Sign in to manage your creator workspace</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input type="email" required className="input-field" placeholder="creator@youtube.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input type="password" required className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn w-full mt-4" style={{ width: '100%', marginTop: "16px" }} disabled={loading}>
                        <LogIn size={16} /> {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <div className="text-center mt-4" style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                        <button type="button" onClick={() => { setEmail('demo@influencerz-hub.com'); setPassword('password123'); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
                            Demo Creator
                        </button>
                        <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>|</span>
                        <button type="button" onClick={() => { setEmail('admin@influencerz-hub.com'); setPassword('password123'); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
                            Admin Access
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6" style={{ marginTop: "24px", textAlign: "center" }}>
                    <p className="text-muted text-sm" style={{ fontSize: "13px" }}>
                        Don't have an account? <Link to="/signup" style={{ color: "var(--primary)", textDecoration: "none" }}>Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default SignIn;
