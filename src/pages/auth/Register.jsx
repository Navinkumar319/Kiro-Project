import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { generateUserId } from '../../utils/helpers';
import toast from 'react-hot-toast';

const DEPTS = ['Computer Science','Electronics','Mechanical','Civil Engineering','Information Technology','Electrical Engineering','Chemical Engineering','Biotechnology'];

const perks = [
  'Submit complaints with one click',
  'AI auto-classifies your issue',
  'Track status in real-time',
  'Rate resolution quality',
];

export default function Register() {
  const { login } = useAuth();
  const { addUser, users } = useData();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:'', email:'', password:'', confirmPassword:'',
    phone:'', studentId:'', department: DEPTS[0], year:'1', hostel:'',
  });

  function handle(e) { setForm(p => ({...p, [e.target.name]: e.target.value})); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.studentId) { toast.error('Fill all required fields.'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match.'); return; }
    if (users.find(u => u.email.toLowerCase() === form.email.toLowerCase())) { toast.error('Email already exists.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const user = {
      id: generateUserId('user-s'), name: form.name, email: form.email,
      password: form.password, role: 'student', phone: form.phone,
      avatar: null, createdAt: new Date().toISOString(), isActive: true,
      studentId: form.studentId, department: form.department,
      year: parseInt(form.year), hostel: form.hostel,
    };
    addUser(user);
    setLoading(false);
    toast.success('Account created! Sign in to continue.');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-surface-950 flex overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[420px] flex-shrink-0 relative bg-gradient-to-br from-surface-900 to-surface-950 border-r border-white/5 p-10">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-600/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-600/8 rounded-full blur-[80px]" />

        <button onClick={() => navigate('/')} className="relative flex items-center gap-2 text-white/40 hover:text-white/70 text-sm font-medium transition-colors w-fit mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="relative flex-1 flex flex-col justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg mb-8">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white font-display leading-tight mb-3">
            Join Smart Campus
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-10">
            Create your student account and start reporting campus issues in seconds.
          </p>
          <ul className="space-y-4">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-white/50 text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-white/20 text-xs">© {new Date().getFullYear()} Smart Campus</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-start justify-center p-6 pt-10 overflow-y-auto relative">
        <div className="absolute inset-0 bg-hero-mesh opacity-20 pointer-events-none" />

        <div className="relative w-full max-w-lg animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 justify-center mb-6 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg font-display">Smart Campus</span>
          </div>

          <div className="bg-surface-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-premium">
            <h1 className="text-2xl font-extrabold text-white font-display mb-1">Create account</h1>
            <p className="text-white/40 text-sm mb-7">Register as a student to submit complaints</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-dark">Full Name <span className="text-red-400">*</span></label>
                  <input name="name" value={form.name} onChange={handle} placeholder="Your name" className="input-field-dark" />
                </div>
                <div>
                  <label className="label-dark">Student ID <span className="text-red-400">*</span></label>
                  <input name="studentId" value={form.studentId} onChange={handle} placeholder="CS2021001" className="input-field-dark" />
                </div>
              </div>

              <div>
                <label className="label-dark">Email <span className="text-red-400">*</span></label>
                <input type="email" name="email" value={form.email} onChange={handle} placeholder="you@student.edu" className="input-field-dark" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-dark">Department</label>
                  <select name="department" value={form.department} onChange={handle} className="input-field-dark">
                    {DEPTS.map(d => <option key={d} value={d} className="bg-surface-800">{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-dark">Year</label>
                  <select name="year" value={form.year} onChange={handle} className="input-field-dark">
                    {[1,2,3,4].map(y => <option key={y} value={y} className="bg-surface-800">Year {y}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-dark">Phone</label>
                  <input name="phone" value={form.phone} onChange={handle} placeholder="10-digit" className="input-field-dark" />
                </div>
                <div>
                  <label className="label-dark">Hostel / Block</label>
                  <input name="hostel" value={form.hostel} onChange={handle} placeholder="Block A" className="input-field-dark" />
                </div>
              </div>

              <div>
                <label className="label-dark">Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handle}
                    placeholder="Min 6 characters" className="input-field-dark pr-12" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label-dark">Confirm Password <span className="text-red-400">*</span></label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handle}
                  placeholder="Re-enter password" className="input-field-dark" />
              </div>

              <button type="submit" disabled={loading} className="w-full btn-gradient py-3 text-sm mt-1">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><UserPlus className="w-4 h-4" /> Create Account</>}
              </button>
            </form>

            <p className="text-center text-white/30 text-sm mt-5">
              Already registered?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
