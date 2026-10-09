import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  X,
  PhoneCall,
  Youtube,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { slugify } from '../../utils/helpers';

const contactChannels = [
  { label: 'Call Sales', value: '+91 9701314138', href: 'tel:+919701314138', Icon: PhoneCall },
  // { label: 'WhatsApp',     value: '+91 9701314138',       href: 'https://wa.me/919701314138',   Icon: MessageCircle },
  { label: 'Email Desk', value: 'sales@nxsysdigital.com', href: 'mailto:sales@nxsysdigital.com', Icon: Mail },
];

const supportLinks = [
  { label: 'Contact Support', to: '/contact' },
  { label: 'Partner Login', to: '/login' },
  { label: 'Create Account', to: '/register' },
  { label: 'Browse Catalog', to: '/products' },
  { label: 'Terms & Conditions', to: '/terms-conditions' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
];

const services = [
  'Bulk order coordination',
  'Commercial pricing assistance',
  'Pre-sales specification guidance',
  'After-sales support escalation',
];

const socialLinks = [
  { label: 'LinkedIn', Icon: Linkedin, to: 'https://www.linkedin.com/company/nxsys-digital/' },
  { label: 'Instagram', Icon: Instagram, to: 'https://www.instagram.com/nxsysdigital/' },
  { label: 'Facebook', Icon: Facebook, to: 'https://www.facebook.com/profile.php?id=61590303994785' },
  { label: 'YouTube', Icon: Youtube, to: 'https://www.youtube.com/channel/UCMI2XkhDXuTa4nAsYi0c4Jw' },
  { label: 'X', Icon: X, to: 'https://x.com/nxsysdigital' }
];

function Footer() {
  const { categories = [] } = useProducts() ?? {};
  const footerCategories = useMemo(() => {
    const uniqueMap = new Map();
    categories.forEach(cat => {
      if (!uniqueMap.has(cat.name)) {
        uniqueMap.set(cat.name, cat);
      }
    });
    return Array.from(uniqueMap.values()).slice(0, 6);
  }, [categories]);

  return (
    <footer className="mt-auto bg-[#0f1117] text-white">
      {/* Top accent line */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* Dot-grid ambient bg */}
      <div
        className="pointer-events-none absolute left-0 right-0 h-[3px]"
        aria-hidden
      />

      {/* ── Brand + Contact strip ── */}
      <div className="border-b border-white/[0.07]">
        <div className="container-shell py-14 lg:py-16">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_auto] lg:gap-16 xl:grid-cols-[1.3fr_1fr]">

            {/* Brand block */}
            <div className="max-w-xl space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="h-1 w-5 rounded-full bg-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.38em] text-primary">
                  Sria Distribution
                </p>
              </div>
              <h2 className="text-2xl font-black leading-snug tracking-tight text-white sm:text-3xl">
                Enterprise procurement,<br className="hidden sm:block" /> coordinated with distributor-grade support.
              </h2>
              <p className="text-[14px] leading-7 text-slate-400">
                Source business hardware, accessories, and infrastructure products through a storefront designed for bulk purchasing, category discovery, and partner-assisted quoting.
              </p>
            </div>

            {/* Contact channels: phone numbers on row 1, email full-width on row 2 */}
            <div className="space-y-3">
              <div className="grid items-start gap-3 grid-cols-2">
                {contactChannels.map(({ label, value, href, Icon }, idx) => (
                  <a
                    key={href}
                    href={href}
                    aria-label={label}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    className={`group flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4 transition-all duration-200 hover:border-primary/40 hover:bg-white/[0.07] ${idx === 2 ? 'col-span-2' : ''}`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-[0_4px_12px_rgba(48,149,248,0.25)] text-textMain">
                      <Icon size={17} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                        {label}
                      </p>
                      <p className="mt-1 break-all text-[13px] font-semibold text-white transition-colors group-hover:text-primary">
                        {value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Office Address */}
              <div className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-[0_4px_12px_rgba(48,149,248,0.25)] text-textMain">
                  <MapPin size={17} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Our Office
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-white/90 leading-relaxed">
                    303, 3rd Floor, Udaya Vensar Apartments, Rd Number 1, Hanuman Nagar,<br className="hidden sm:block" />  Kothaguda, Kondapur, Hyderabad, Telangana 500084
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Links grid ── */}
      <div className="border-b border-white/[0.07]">
        <div className="container-shell py-12 lg:py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

            {/* Categories */}
            <div className="space-y-5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.28em] text-white">
                Categories
              </h3>
              <ul className="space-y-3">
                {footerCategories.length ? (
                  footerCategories.map((category) => (
                    <li key={category.id}>
                      <Link
                        to={`/products/${slugify(category.name)}`}
                        className="inline-flex items-center gap-2 text-[13px] text-slate-400 transition-colors hover:text-primary"
                      >
                        <ChevronRight size={13} className="shrink-0 text-primary/60" />
                        {category.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-[13px] text-slate-500">Loading categories…</li>
                )}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.28em] text-white">
                Help & Support
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-[13px] text-slate-400 transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.28em] text-white">
                What We Offer
              </h3>
              <ul className="space-y-3">
                {services.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[13px] text-slate-400">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div className="space-y-5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.28em] text-white">
                Follow Us
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map(({ label, Icon, to }) => (
                  <Link
                    key={label}
                    to={to}
                    target='_blank'
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400 transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                  >
                    <Icon size={17} />
                  </Link>
                ))}
              </div>
              <p className="text-[13px] leading-6 text-slate-500">
                Follow us for the latest product launches and partner updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="container-shell">
        <div className="flex flex-col gap-3 py-5 text-[12px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} NxSys Digital Distribution. All rights reserved.
          </p>
          <p className="hidden text-center sm:block">
            A <a href="https://www.sriainfotech.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">Sria Group</a> of Company
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/products" className="transition-colors hover:text-primary">Catalog</Link>
            <Link to="/about" className="transition-colors hover:text-primary">About Us</Link>
            <Link to="/contact" className="transition-colors hover:text-primary">Contact</Link>
            <Link to="/terms-conditions" className="transition-colors hover:text-primary">Terms</Link>
            <Link to="/privacy-policy" className="transition-colors hover:text-primary">Privacy</Link>
            <a href="mailto:sales@nxsysdigital.com" className="transition-colors hover:text-primary">
              sales@nxsysdigital.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
