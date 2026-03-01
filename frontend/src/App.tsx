import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { authApi } from "./services/api";
import { useAppStore } from "./store/useAppStore";

// Lazy load feature components for code-splitting
const LandingPage = lazy(() => import("./components/LandingPage"));
const SignIn = lazy(() => import("./components/SignIn"));
const SignUp = lazy(() => import("./components/SignUp"));

const Dashboard = lazy(() => import("./components/Dashboard"));
const VideoManager = lazy(() => import("./components/VideoManager"));
const SponsorshipMarketplace = lazy(() => import("./components/SponsorshipMarketplace"));
const SEOOptimizer = lazy(() => import("./components/SEOOptimizer"));
const MonetizationInsights = lazy(() => import("./components/MonetizationInsights"));
const ProductionBoard = lazy(() => import("./components/ProductionBoard"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));

const LoadingFallback = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "var(--primary)", minHeight: "100vh" }}>
    <div style={{ width: "40px", height: "40px", border: "4px solid rgba(139, 92, 246, 0.2)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAppStore(state => state.user);
  if (!user) return <Navigate to="/signin" />;
  return <>{children}</>;
};

const UserRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAppStore(state => state.user);
  if (!user) return <Navigate to="/signin" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAppStore(state => state.user);
  if (!user) return <Navigate to="/signin" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

// We need an internal component wrapper so we can decouple raw full pages from dashboard layout pages
const App = () => {
  const setUser = useAppStore(state => state.setUser);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authApi.getMe();
        if (res.data) {
          setUser({ id: res.data._id, name: res.data.name, role: res.data.role });
        }
      } catch (err) {
        setUser(null);
      }
      setAuthChecking(false);
    };
    checkAuth();
  }, [setUser]);

  if (authChecking) {
    return <LoadingFallback />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Full-screen Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Dashboard Routes Wrapped with Sidebar */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/dashboard" element={<UserRoute><Dashboard /></UserRoute>} />
                      <Route path="/videos" element={<UserRoute><VideoManager /></UserRoute>} />
                      <Route path="/sponsorships" element={<UserRoute><SponsorshipMarketplace /></UserRoute>} />
                      <Route path="/seo" element={<UserRoute><SEOOptimizer /></UserRoute>} />
                      <Route path="/monetization" element={<UserRoute><MonetizationInsights /></UserRoute>} />
                      <Route path="/production" element={<UserRoute><ProductionBoard /></UserRoute>} />
                      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </Router>
  );
};

export default App;
