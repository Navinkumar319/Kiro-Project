import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Zap, Shield, BarChart3, Bell, Users,
  CheckCircle2, ArrowRight, Star, Menu, X, Sparkles,
  ClipboardList, UserCog, TrendingUp, Clock, MapPin,
  ChevronRight, Play, Award, Globe, Layers,
} from 'lucide-react';

/* ── Helpers ─────────────────────────────────────────────── */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return y;
}

/* ── Data ────────────────────────────────────────────────── */
const features = [
  {
    icon: Sparkles, color: 'from-violet-500 to-purple-600',
    title: 'AI-Powered Classification',
    desc: 'Smart complaint analysis auto-suggests category, department, priority and summary — saving time and reducing errors.',
  },
  {
    icon: TrendingUp, color: 'from-blue-500 to-cyan-500',
    title: 'Real-Time Tracking',
    desc: 'Students track every status update from Pending → Assigned → In Progress → Resolved with full timeline history.',
  },
  {
    icon: UserCog, color: 'from-emerald-500 to-teal-500',
    title: 'Smart Staff Assignment',
    desc: 'Admin views staff workload and assigns complaints intelligently. Staff get instant notifications on new tasks.',
  },
  {
    icon: BarChart3, color: 'from-orange-500 to-rose-500',
    title: 'Analytics & Reports',
    desc: 'Visual dashboards with resolution rates, department performance, monthly trends and satisfaction scores.',
  },
  {
    icon: Bell, color: 'from-pink-500 to-rose-500',
    title: 'Instant Notifications',
    desc: 'All stakeholders get real-time alerts on assignments, status changes, and resolutions — no one is left waiting.',
  },
  {
    icon: Shield, color: 'from-indigo-500 to-brand-600',
    title: 'Role-Based Security',
    desc: 'Granular access control — students see only their complaints, staff see only their tasks, admins see everything.',
  },
];

const stats = [
  { value: '3x', label: 'Faster Resolution', icon: Zap },
  { value: '98%', label: 'Complaint Traceability', icon: CheckCircle2 },
  { value: '60%', label: 'Reduction in Overhead', icon: TrendingUp },
  { value: '24/7', label: 'System Availability', icon: Globe },
];

const steps = [
  {
    step: '01', icon: ClipboardList, color: 'from-brand-500 to-violet-500',
    title: 'Submit a Complaint',
    desc: 'Student describes the issue. AI instantly classifies category, department and priority.',
  },
  {
    step: '02', icon: UserCog, color: 'from-violet-500 to-purple-500',
    title: 'Admin Assigns Staff',
    desc: 'Admin reviews the complaint, sets priority, and assigns the right maintenance staff.',
  },
  {
    step: '03', icon: Zap, color: 'from-purple-500 to-pink-500',
    title: 'Staff Resolves Issue',
    desc: 'Staff accepts, works on the issue, updates progress notes and marks it resolved.',
  },
  {
    step: '04', icon: Star, color: 'from-pink-500 to-rose-500',
    title: 'Student Gives Feedback',
    desc: 'Student rates the resolution. Data feeds into performance analytics for continuous improvement.',
  },
];

const roles = [
  {
    role: 'Student',
    icon: GraduationCap,
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    features: ['Submit complaints with AI assist', 'Track status in real-time', 'View full complaint history', 'Rate resolution quality'],
  },
  {
    role: 'Maintenance Staff',
    icon: UserCog,
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    features: ['View assigned complaints', 'Filter by priority & status', 'Update progress with notes', 'Mark issues as resolved'],
  },
  {
    role: 'Administrator',
    icon: Layers,
    gradient: 'from-violet-500 to-purple-600',
    bg: 'from-violet-50 to-purple-50',
    border: 'border-violet-200',
    features: ['Full system dashboard', 'Assign & reassign complaints', 'Manage users & departments', 'View analytics & reports'],
  },
];

const testimonials = [
  { name: 'Dr. Priya Sharma', role: 'HOD, Computer Science', rating: 5, text: 'This system transformed how we handle maintenance requests. Issues that used to take weeks are now resolved in days.' },
  { name: 'Arjun Mehta', role: 'Student, Year 3', rating: 5, text: 'I love being able to track my complaint in real time. No more wondering if anyone saw my message on WhatsApp.' },
  { name: 'Selvam K', role: 'Maintenance Technician', rating: 5, text: 'My workload is now organized and clear. I know exactly what needs to be done and in what order.' },
];

/* ── Sub-components ──────────────────────────────────────── */
function Navbar({ scrollY, navigate }) {
  const [open, setOpen] = useState(false);
  const scrolled = scrollY > 40;

  function scrollTo(id) {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-surface-950/90 backdrop-blur-xl border-b border-white/5 shadow-premium' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight font-display">Smart Campus</p>
              <p className="text-white/40 text-xs">Maintenance System</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {['features', 'how-it-works', 'roles', 'testimonials'].map((id) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="text-white/60 hover:text-white px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors hover:bg-white/5">
                {id.replace('-', ' ')}
              </button>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/login')}
              className="text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate('/register')}
              className="btn-gradient px-5 py-2 text-sm">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-white/70 p-2">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-surface-900/95 backdrop-blur-xl rounded-2xl border border-white/10 mb-4 overflow-hidden animate-scale-in">
            <div className="p-4 space-y-1">
              {['features', 'how-it-works', 'roles', 'testimonials'].map((id) => (
                <button key={id} onClick={() => scrollTo(id)}
                  className="w-full text-left text-white/70 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium capitalize hover:bg-white/5 transition-colors">
                  {id.replace('-', ' ')}
                </button>
              ))}
              <div className="border-t border-white/10 pt-3 mt-3 flex flex-col gap-2">
                <button onClick={() => navigate('/login')} className="btn-ghost text-white/70 hover:text-white hover:bg-white/10 w-full">Sign In</button>
                <button onClick={() => navigate('/register')} className="btn-gradient w-full">Get Started <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* ── Main Landing Page ───────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const scrollY = useScrollY();

  return (
    <div className="bg-surface-950 text-white overflow-x-hidden">
      <Navbar scrollY={scrollY} navigate={navigate} />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-mesh" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-transparent to-surface-950 pointer-events-none" />

        {/* Blobs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 mb-8 backdrop-blur-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI-Powered Campus Management Platform
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold font-display leading-[1.05] tracking-tight mb-6 animate-fade-up">
            Smarter Campus.{' '}
            <span className="block text-gradient bg-gradient-to-r from-brand-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Faster Fixes.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Replace WhatsApp groups and paper forms with a centralized, AI-assisted complaint management system built for modern universities.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={() => navigate('/register')}
              className="btn-gradient px-8 py-3.5 text-base shadow-glow">
              Start Free <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/login')}
              className="btn bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 text-base backdrop-blur-sm">
              Sign In to Dashboard
            </button>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="relative max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-600/20 via-violet-600/20 to-purple-600/20 rounded-3xl blur-xl" />
            <div className="relative bg-surface-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-premium">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-surface-800/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 bg-white/5 rounded-md h-6 mx-4 flex items-center px-3">
                  <span className="text-white/30 text-xs">campus.edu/admin</span>
                </div>
              </div>
              {/* Mock Dashboard */}
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-white/5">
                {[
                  { label: 'Total', value: '124', color: 'from-brand-500 to-violet-500' },
                  { label: 'Pending', value: '18', color: 'from-amber-500 to-orange-500' },
                  { label: 'In Progress', value: '31', color: 'from-blue-500 to-cyan-500' },
                  { label: 'Resolved', value: '75', color: 'from-emerald-500 to-teal-500' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 border border-white/5 rounded-xl p-4">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</div>
                    <div className="text-white/40 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="p-6 grid grid-cols-3 gap-3">
                {[
                  { id: 'CMP-2024-008', title: 'Crack in Library Wall', priority: 'Critical', status: 'In Progress', color: 'text-red-400 bg-red-500/10' },
                  { id: 'CMP-2024-005', title: 'WiFi Down in Block B', priority: 'High', status: 'Assigned', color: 'text-orange-400 bg-orange-500/10' },
                  { id: 'CMP-2024-001', title: 'Fan not working Rm 204', priority: 'Medium', status: 'Resolved', color: 'text-emerald-400 bg-emerald-500/10' },
                ].map((c) => (
                  <div key={c.id} className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.color}`}>{c.priority}</span>
                    <p className="text-white/80 text-xs font-medium mt-2 line-clamp-1">{c.title}</p>
                    <p className="text-white/30 text-xs mt-1">{c.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="relative py-16 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center group">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-600/20 group-hover:border-brand-500/30 transition-all duration-300">
                  <s.icon className="w-5 h-5 text-brand-400" />
                </div>
                <p className="text-4xl font-extrabold font-display text-gradient bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-white/40 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-sm text-brand-400 font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Features
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold font-display mb-4">
              Everything you need to manage{' '}
              <span className="text-gradient bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">campus maintenance</span>
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              A complete solution from complaint submission to resolution — with AI, analytics, and real-time tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2 font-display">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-400 font-medium mb-4">
              <ChevronRight className="w-3.5 h-3.5" /> How It Works
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold font-display mb-4">
              From complaint to{' '}
              <span className="text-gradient bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">resolution</span>
            </h2>
            <p className="text-white/40 text-lg">Four simple steps. Zero guesswork.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%-12px)] w-[calc(100%-48px)] h-px bg-gradient-to-r from-white/10 to-transparent z-10" />
                )}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <s.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-extrabold text-white/10 font-display">{s.step}</span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-2 font-display">{s.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ────────────────────────────────────────── */}
      <section id="roles" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-600/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-sm text-emerald-400 font-medium mb-4">
              <Users className="w-3.5 h-3.5" /> User Roles
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold font-display mb-4">
              Built for{' '}
              <span className="text-gradient bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">every stakeholder</span>
            </h2>
            <p className="text-white/40 text-lg">Three dedicated portals. One unified platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((r, i) => (
              <div key={i} className="group bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <r.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-extrabold text-white text-xl mb-4 font-display">{r.role}</h3>
                <ul className="space-y-2.5">
                  {r.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/50 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-600/10 border border-amber-500/20 rounded-full px-4 py-1.5 text-sm text-amber-400 font-medium mb-4">
              <Star className="w-3.5 h-3.5" /> Testimonials
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold font-display mb-3">Loved by campus communities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/50 via-violet-900/30 to-purple-900/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-600/10 rounded-full blur-[80px]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-400/20 rounded-full px-4 py-1.5 text-sm text-brand-300 font-medium mb-6">
            <Award className="w-3.5 h-3.5" /> Get Started Today — It's Free
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold font-display mb-5 text-white">
            Ready to modernize your<br />
            <span className="text-gradient bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">campus maintenance?</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
            Join universities already using Smart Campus to deliver faster, trackable, data-driven maintenance services.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/register')} className="btn-gradient px-10 py-4 text-base shadow-glow">
              Register as Student <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/login')} className="btn bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-4 text-base backdrop-blur-sm">
              Sign In to Portal
            </button>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/30 text-sm">
            {['No credit card required', 'Role-based access control', 'AI-powered classification', 'Real-time updates'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm font-display">Smart Campus</p>
              <p className="text-white/30 text-xs">Complaint & Maintenance System</p>
            </div>
          </div>
          <p className="text-white/20 text-sm">© {new Date().getFullYear()} Smart Campus. University Project.</p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/login')} className="text-white/30 hover:text-white/60 text-sm transition-colors">Login</button>
            <button onClick={() => navigate('/register')} className="text-white/30 hover:text-white/60 text-sm transition-colors">Register</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
