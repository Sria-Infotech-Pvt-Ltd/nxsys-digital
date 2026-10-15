import { ShoppingBag, Tag, MessageSquare, Headphones } from 'lucide-react';
import logoDark from '../../assets/NxSys Digital Logo with Pixel Burst.png';
import logoLight from '../../assets/NxSys Digital Logo with Pixel Dispersion.png';

const PERKS = [
  { Icon: ShoppingBag,   label: 'Wide Product Range',     desc: 'Thousands of electronics and accessories in one place.' },
  { Icon: Tag,           label: 'Best Pricing',           desc: 'Competitive rates tailored to your order size.'          },
  { Icon: MessageSquare, label: 'Quick Quote Requests',   desc: 'Get pricing on any product in just a few clicks.'        },
  { Icon: Headphones,    label: '24/7 Support',           desc: 'Our team is always ready to help you.'                   },
];

const AuthLayout = ({ children, title, subtitle, badge, imageText, imageSubtitle }: { 
  children: any; 
  title: any; 
  subtitle: any; 
  badge?: any;
  imageText?: string;
  imageSubtitle?: string;
}) => {
  return (
    <div className="flex min-h-screen">

      {/* ══════════════════════════════
          LEFT — dark showcase
      ══════════════════════════════ */}
      <div className="relative hidden w-[52%] shrink-0 overflow-hidden lg:flex lg:flex-col lg:justify-between bg-[#111318] p-8 xl:p-10">

        {/* Subtle grid lines */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />
        {/* Yellow glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" style={{ background: 'rgba(48,149,248,0.07)' }} />
        {/* Right divider */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        {/* Brand */}
        <div className="relative flex items-center">
          <img src={logoDark} alt="NxSys Digital" className="h-12 w-auto object-contain xl:h-14" />
        </div>

        {/* Hero text */}
        <div className="relative space-y-5">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">
            {badge || 'Your Store'}
          </p>
          <h1 className="text-[48px] font-black leading-[1.06] tracking-tight text-white xl:text-[56px] whitespace-pre-line">
            {imageText || 'Shop smarter.\nOrder faster.'}
          </h1>
          <p className="max-w-sm text-[15px] leading-7 text-slate-400">
            {imageSubtitle || 'Browse products, request quotes, and track your orders — all from one place.'}
          </p>
        </div>

        {/* Feature grid */}
        <div className="relative grid grid-cols-2 gap-3">
          {PERKS.map(({ Icon, label, desc }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.06]"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Icon size={17} className="text-primary" />
              </div>
              <p className="text-[12px] font-black text-white">{label}</p>
              <p className="mt-1 text-[11px] leading-5 text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════
          RIGHT — white form panel
      ══════════════════════════════ */}
      <div className="flex flex-1 flex-col justify-center bg-white px-8 py-10 lg:px-10">
        <div className="mx-auto w-full max-w-[360px]">

          {/* Mobile brand */}
          <div className="mb-8 flex items-center lg:hidden">
            <img src={logoLight} alt="NxSys Digital" className="h-11 w-auto object-contain" />
          </div>

          {/* Heading */}
          {badge && (
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              {badge}
            </span>
          )}
          <h2 className="text-[28px] font-black tracking-tight text-slate-900">{title}</h2>
          <p className="mt-2 text-[14px] leading-6 text-slate-500">{subtitle}</p>

          {/* Form */}
          <div className="mt-8">{children}</div>
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
