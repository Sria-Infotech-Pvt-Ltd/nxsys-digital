import { memo } from 'react';
import { ShieldCheck, Zap, PackageCheck, Headphones } from 'lucide-react';

const STATS = [
  { value: '25+', label: 'OEM Brands' },
  { value: '1000+', label: 'Active SKUs' },
  { value: '48hr', label: 'Avg. Fulfillment' },
  { value: '100%', label: 'Genuine Stock' },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Verified Authentic Stock',
    desc: 'Every product is sourced directly from authorized distributors and OEM partners — no gray market, no counterfeits.',
  },
  {
    icon: Zap,
    title: 'Competitive Bulk Pricing',
    desc: 'Volume-based pricing tiers and negotiated enterprise rates that scale with your procurement needs.',
  },
  {
    icon: PackageCheck,
    title: 'Priority Fulfillment',
    desc: 'In-stock orders processed the same day with dedicated logistics handling for enterprise shipments.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Account Support',
    desc: 'An assigned account manager for every partner — direct line for quotes, order tracking, and escalations.',
  },
];

function WhyChooseUs() {
  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="container-shell">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">
            Why NxSys Digital
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem]">
            The smarter way to source enterprise hardware
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-500">
            Trusted by procurement teams across the region for verified OEM stock, competitive pricing, and reliable order fulfillment.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-px sm:grid-cols-4 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 mb-14 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center bg-white py-8 px-4 text-center">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">{stat.value}</span>
              <span className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group flex flex-col rounded-2xl border border-slate-100 bg-slate-50/70 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:bg-white hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary">
                <Icon size={20} className="transition-colors group-hover:text-textMain" strokeWidth={2} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default memo(WhyChooseUs);
