import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Layers, Zap } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Check login status & load remembered email
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }

    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", form.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans text-slate-100 overflow-hidden relative">
      {/* Left Column: Visual Showcase (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 relative bg-mesh-gradient flex-col justify-between p-12 overflow-hidden border-r border-slate-900/50">
        {/* Animated ambient glow circles */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "2s" }}></div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-950 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/20">
            <span className="material-symbols-outlined text-white text-2xl">
              payments
            </span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              UPI Collection
            </h1>
            
          </div>
        </div>

        {/* Dynamic 3D Showcase Image */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40 p-4 animate-float shadow-2xl shadow-indigo-950/40">
            <img 
              src="/login_showcase.png" 
              alt="UPI Collection Showcase" 
              className="w-full h-full object-cover rounded-xl"
            />
            {/* Overlay glow/border decoration */}
            <div className="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none"></div>
          </div>
          
          <div className="mt-8 text-center max-w-sm">
            <h3 className="text-lg font-bold text-white mb-2">Powering Real-time Corporate Collections</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Consolidate, reconcile, and automate all UPI collections across your enterprise from a unified terminal.
            </p>
          </div>
        </div>

        {/* Trust Badge Footer */}
        <div className="relative z-10 flex items-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-violet-500" />
            <span>Bank-grade Security</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-violet-500" />
            <span>Multi-Account Syncing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-violet-500" />
            <span>Instant Settlements</span>
          </div>
        </div>
      </div>

      {/* Right Column: Form Pane */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-gradient-to-b from-[#0a0721] to-[#040212] relative min-h-screen md:min-h-0">
        {/* Ambient Blur Circle for Mobile */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-600/5 rounded-full blur-[80px] md:hidden"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo (Visible on mobile only) */}
          <div className="flex md:hidden items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-950 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/20">
              <span className="material-symbols-outlined text-white text-2xl">
                payments
              </span>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                UPI Collection
              </h1>
          
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              Please sign in to access your administrative dashboard.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-500/20 rounded-xl flex items-start gap-3 animate-shake">
              <span className="material-symbols-outlined text-red-400 mt-0.5">
                error
              </span>
              <div>
                <h4 className="text-sm font-semibold text-red-200">Authentication Failed</h4>
                <p className="text-red-400/90 text-xs mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <a href="#" className="text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your account password"
                  required
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-12 pr-12 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Box */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-violet-600 focus:ring-violet-500/20 focus:ring-offset-0 focus:ring-2"
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-sm text-slate-400 select-none cursor-pointer">
                Keep me signed in
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-305 flex items-center justify-center gap-2 shadow-lg shadow-violet-900/25 active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                  <span>Signing in safely...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="h-px bg-slate-800/80 flex-1"></div>
            <span className="text-[10px] font-bold tracking-widest text-slate-500">OR</span>
            <div className="h-px bg-slate-800/80 flex-1"></div>
          </div>

          {/* Contact Support */}
          <div className="text-center">
            <p className="text-sm text-slate-400">
              Don't have an administrative account?
              <a href="#" className="text-violet-400 hover:text-violet-300 font-semibold ml-1.5 transition-colors">
                Contact Admin
              </a>
            </p>
          </div>

          {/* Footer Copyright */}
          <div className="mt-12 pt-6 border-t border-slate-900 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-400 transition-colors">Support</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;