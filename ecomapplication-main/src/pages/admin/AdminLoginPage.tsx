import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, FolderOpen, ClipboardList, ArrowRight, ShieldCheck } from 'lucide-react';
import logoDark from '../../assets/NxSys Digital Logo with Pixel Burst.png';
import logoLight from '../../assets/NxSys Digital Logo with Pixel Dispersion.png';
import { authService } from '@/services';
import { getNormalizedApiError } from '@/services';
import { showToast } from '@/utils/helpers';
import { isAdminUser } from '@/utils/access';

const FEATURES = [
  { Icon: Package,       label: 'Product Management', desc: 'Add and manage your complete product catalog.'  },
  { Icon: FolderOpen,    label: 'Category Control',   desc: 'Organise your store with clear categories.'     },
  { Icon: ClipboardList, label: 'Orders & Quotes',    desc: 'Manage customer requests and send quotes fast.' },
];

function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, any>>({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((c) => ({ ...c, [name]: value }));
    if (error) setError('');
    if (errorType) setErrorType('');
    setFieldErrors((c) => ({ ...c, [name]: '', ...(name === 'username' ? { email: '' } : {}) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setErrorType('');
    setFieldErrors({});
    try {
      const credentials = {
        username: form.username,
        email: form.username.includes('@') ? form.username : undefined,
        password: form.password,
      };
      const { user: loggedInUser } = await authService.login(credentials);
      let user = loggedInUser;
      if (!isAdminUser(user)) user = await authService.verifyAdminAccess();
      if (!isAdminUser(user)) {
        authService.clearSession();
        setError('Access denied. This account does not have admin privileges.');
        setErrorType('auth');
        showToast({ title: 'Access Denied', message: 'Only authorised admin accounts can sign in here.', type: 'error' });
        return;
      }
      showToast({ title: 'Welcome back!', message: `Signed in as ${user.name || 'Admin'}.` });
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const e = getNormalizedApiError(err, { fallbackMessage: 'Unable to sign in' });
      const fe: Record<string, any> = {};
      if (e.fieldErrors.username || e.fieldErrors.email) fe.username = e.fieldErrors.username || e.fieldErrors.email;
      if (e.fieldErrors.password) fe.password = e.fieldErrors.password;
      setFieldErrors(fe);
      setErrorType(e.type);
      setError(e.message);
      if (e.type === 'server') showToast({ title: 'Sign in failed', message: e.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const highlightCredentials = Boolean(error) && errorType === 'auth';

  return (
    <div className="flex min-h-screen">

      {/* ══════════════════════════
          LEFT — dark panel
      ══════════════════════════ */}
      <div className="relative hidden w-[55%] shrink-0 overflow-hidden bg-[#06090f] lg:flex lg:flex-col lg:justify-between p-10 xl:p-14">

        {/* Backgrounds */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="pointer-events-none absolute -top-60 -left-40 h-[600px] w-[600px] rounded-full blur-[130px]" style={{ background: 'rgba(48,149,248,0.07)' }} />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full blur-[100px]" style={{ background: 'rgba(99,102,241,0.06)' }} />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        {/* Top — brand + headline */}
        <div className="relative space-y-7">
          <div className="flex items-center gap-3">
            <img src={logoDark} alt="NxSys Digital" className="h-11 w-auto object-contain" />
            <p className="text-[11px] text-slate-500">Admin Portal</p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5">
            <ShieldCheck size={11} className="text-primary" />
            <span className="text-[9px] font-black uppercase tracking-[0.38em] text-primary">Secure Admin Area</span>
          </div>

          <div>
            <h1 className="text-[48px] font-black leading-[1.05] tracking-tight text-white xl:text-[58px]">
              Your store,<br />fully in<br />
              <span className="bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
                control.
              </span>
            </h1>
            <p className="mt-4 max-w-xs text-[14px] leading-7 text-slate-400">
              One dashboard to manage products, categories, orders and more.
            </p>
          </div>
        </div>

        {/* Bottom — features */}
        <div className="relative space-y-3">
          {FEATURES.map(({ Icon, label, desc }) => (
            <div key={label} className="group flex items-center gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.03] p-4 transition-all hover:border-primary/20 hover:bg-white/[0.06]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-black text-white">{label}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{desc}</p>
              </div>
              <ArrowRight size={13} className="shrink-0 text-slate-700 transition-all group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════
          RIGHT — white panel
      ══════════════════════════ */}
      <div className="flex flex-1 flex-col justify-center bg-white px-8 py-10 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-[380px]">

          {/* Mobile brand */}
          <div className="mb-7 flex items-center lg:hidden">
            <img src={logoLight} alt="NxSys Digital" className="h-10 w-auto object-contain" />
          </div>

          {/* Accent + heading */}
          <div className="mb-6 h-[3px] w-10 rounded-full bg-primary" />
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Admin Login</p>
          <h2 className="text-[28px] font-black tracking-tight text-slate-900">Welcome back</h2>
          <p className="mt-1.5 text-[13px] leading-6 text-slate-500">
            Enter your credentials to access the dashboard.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">

            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                Email or Username <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="admin@example.com"
                autoComplete="username"
                aria-invalid={highlightCredentials || Boolean(fieldErrors.username)}
                className={`w-full rounded-2xl border-2 bg-slate-50 px-4 py-3.5 text-[14px] font-medium text-slate-800 outline-none placeholder:text-slate-400 transition-all focus:bg-white ${
                  highlightCredentials || fieldErrors.username ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-primary'
                }`}
                required
              />
              {fieldErrors.username && <p className="text-[11px] font-semibold text-rose-500">{fieldErrors.username}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                Password <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••••"
                autoComplete="current-password"
                aria-invalid={highlightCredentials || Boolean(fieldErrors.password)}
                className={`w-full rounded-2xl border-2 bg-slate-50 px-4 py-3.5 text-[14px] font-medium text-slate-800 outline-none placeholder:text-slate-400 transition-all focus:bg-white ${
                  highlightCredentials || fieldErrors.password ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-primary'
                }`}
                required
              />
              {fieldErrors.password && <p className="text-[11px] font-semibold text-rose-500">{fieldErrors.password}</p>}
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group flex w-full min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-primary text-[12px] font-black uppercase tracking-[0.2em] text-textMain shadow-[0_4px_20px_rgba(48,149,248,0.35)] transition-all hover:shadow-[0_8px_28px_rgba(48,149,248,0.4)] hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
              {!submitting && <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />}
            </button>

            <div className="flex items-center justify-between border-t border-slate-100 pt-5 text-[12px]">
              <Link to="/login" className="font-semibold text-slate-500 transition-colors hover:text-primary">
                Customer login
              </Link>
              <Link to="/" className="font-semibold text-slate-500 transition-colors hover:text-primary">
                Back to store
              </Link>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}

export default AdminLoginPage;
