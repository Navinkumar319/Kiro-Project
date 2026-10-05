import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, LogIn, ArrowLeft, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const demos = [
  { label: 'Admin', email: 'admin@campus.edu', password: 'admin123', gradient: 'from-violet-500 to-purple-600', desc: 'Full system access' },
  { label: 'Student', email: 'arjun@student.edu', password: 'student123', gradient: 'from-emerald-500 to-teal-600', desc: 'Submit & track' },
  { label: 'Staff', email: 'selvam@staff.edu', password: 'staff123', gradient: 'from-blue-500 to-cyan-600', desc: 'Resolve issues' },
];

export default function Login() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') navigate('/admin');
      else if (currentUser.role === 'staff') navigate('/staff');
      else navigate('/student');
    }
  }, [currentUser, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}!`);
      if (result.user.role === 'admin') navigate('/admin');
      else if (result.user.role === 'staff') navigate('/staff');
      else navigate('/student');
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="min-h-screen bg-surface-950 flex overflow-hidden">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col w-[480px] flex-shrink-0 relative bg-gradient-to-br from-surface-900 via-surface-900 to-surface-950 border-r border-white/5 p-10">
        {/* Blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-brand-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Back to landing */}
        <button onClick={() => navigate('/')} className="relative flex items-center gap-2 text-white/40 hover:text-white/70 text-sm font-medium transition-colors w-fit mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* Brand */}
        <div className="relative flex-1 flex flex-col justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-glow mb-8">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white font-display leading-tight mb-4">
            One platform.<br />
            <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">Every complaint handled.</span>
          </h2>
          <p className="text-white/40 text-base leading-relaxed mb-10">
            From submission to resolution — track every campus maintenance issue in real time.
          </p>

          {/* Features */}
          {[
            { icon: Sparkles, text: 'AI-powered complaint classification' },
            { icon: Zap, text: 'Real-time status tracking' },
            { icon: Shield, text: 'Role-based secure access' },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-4 h-4 text-brand-400" />
              </div>
              <span className="text-white/50 text-sm">{f.text}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="relative text-white/20 text-xs">© {new Date().getFullYear()} Smart Campus</p>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-hero-mesh opacity-30 pointer-events-none" />

        <div className="relative w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 justify-center mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg font-display">Smart Campus</span>
          </div>

          {/* Card */}
          <div className="bg-surface-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-premium">
            <h1 className="text-2xl font-extrabold text-white font-display mb-1">Sign in</h1>
            <p className="text-white/40 text-sm mb-8">Enter your credentials to continue</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label-dark">Email address</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))}
                  placeholder="you@campus.edu" className="input-field-dark" autoComplete="email" />
              </div>
              <div>
                <label className="label-dark">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm(p => ({...p, password: e.target.value}))}
                    placeholder="Your password" className="input-field-dark pr-12" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full btn-gradient py-3 text-sm mt-2">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><LogIn className="w-4 h-4" /> Sign In</>}
              </button>
            </form>

            <p className="text-center text-white/30 text-sm mt-5">
              New student?{' '}
              <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
                Create account
              </Link>
            </p>

            {/* Demo accounts */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-3">Quick Demo Access</p>
              <div className="grid grid-cols-3 gap-2">
                {demos.map((d) => (
                  <button key={d.label} type="button"
                    onClick={() => setForm({ email: d.email, password: d.password })}
                    className="group relative flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/5 hover:border-white/15 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-200">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${d.gradient} flex items-center justify-center`}>
                      <span className="text-white font-bold text-xs">{d.label.charAt(0)}</span>
                    </div>
                    <span className="text-white/60 text-xs font-semibold">{d.label}</span>
                    <span className="text-white/25 text-xs leading-tight text-center">{d.desc}</span>
                  </button>
                ))}
              </div>
              <p className="text-white/20 text-xs text-center mt-2">Click any card to auto-fill</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
