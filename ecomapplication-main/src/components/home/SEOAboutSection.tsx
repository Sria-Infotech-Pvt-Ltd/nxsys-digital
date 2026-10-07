import { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  Monitor, Laptop, Video, Network, Printer, Cpu,
  Building2, GraduationCap, Code2, HeartPulse, Landmark,
  MessageSquare, FileText, PackageCheck, Headphones,
  ArrowRight, CheckCircle2,
} from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────── */

const STATS = [
  { value: '25+',   label: 'OEM Brands'       },
  { value: '1000+', label: 'Active SKUs'       },
  { value: '48hr',  label: 'Avg. Fulfillment'  },
  { value: '100%',  label: 'Genuine Stock'     },
];

const ABOUT_BULLETS = [
  'Products sourced through authorised channels',
  '25+ OEM brands',
  '1,000+ active SKUs',
  'Bulk pricing for eligible products',
  'Pan-India delivery support',
  'OEM warranty support',
  'GST-compliant invoicing',
  'Dedicated account support',
  'RFQ and project procurement assistance',
  'Pre-sales product guidance',
];

const CATEGORIES = [
  {
    icon: Monitor,
    name: 'Monitors & Displays',
    short: 'Professional 4K, colour-accurate, and ultrawide panels',
    description:
      'Professional-grade monitors from BenQ, Dell UltraSharp, and HP Z-Display across Full HD to 4K UHD, IPS and VA panels, colour-critical wide-gamut displays, ultra-wide curved models for trading and multi-app workflows, and compact office monitors for high-density desk deployments. Hardware calibration and VESA mount compatibility available across most SKUs.',
  },
  {
    icon: Video,
    name: 'Projectors',
    short: 'Business, classroom, and large-venue laser projectors',
    description:
      'Short-throw and ultra-short-throw projectors from BenQ, Epson, and Acer for conference rooms, classrooms, and large-venue installations. Laser light source models with 20,000+ hour lamp life eliminate recurring replacement costs. Wireless screen mirroring, HDMI switching, and network management supported.',
  },
  {
    icon: Laptop,
    name: 'Laptops & Computers',
    short: 'Commercial-grade devices from Dell, HP, Lenovo & Apple',
    description:
      'Commercial laptops and desktops built for enterprise deployment: thin-and-light ultrabooks, rugged field units, mobile workstations, SFF desktops, all-in-ones, and tower workstations with professional GPU options. Longer warranty terms, TPM chips, and MDM compatibility included. Custom RAM and storage configurations available on volume orders.',
  },
  {
    icon: Network,
    name: 'Networking & Infrastructure',
    short: 'Switches, Wi-Fi 6 APs, routers and rack infrastructure',
    description:
      'Managed and unmanaged switches, Wi-Fi 6 and Wi-Fi 6E access points, UTM routers, structured cabling, and rack infrastructure from Cisco, TP-Link, D-Link, and Ubiquiti. Covers single-office LANs through multi-floor campus deployments with centralised wireless management, VLAN segmentation, and PoE distribution.',
  },
  {
    icon: Printer,
    name: 'Printers & Imaging',
    short: 'Laser, inkjet, and large-format for every print volume',
    description:
      'Monochrome and colour laser printers, multifunction devices, inkjet office units, and large-format plotters from HP, Canon, Epson, and Brother. OEM toner and consumables available alongside hardware. Extended service contracts with next-business-day on-site response for high-uptime environments.',
  },
  {
    icon: Cpu,
    name: 'Accessories & Peripherals',
    short: 'Keyboards, docks, UPS, cameras and ergonomic accessories',
    description:
      'Keyboards, mice, docking stations, USB hubs, video conferencing cameras, KVM switches, UPS and power protection, and ergonomic desk accessories. Consistent SKU availability across replenishment cycles ensures compatibility when adding to existing deployments. Bulk accessory orders receive the same volume pricing as core hardware.',
  },
];

const INDUSTRIES = [
  {
    icon: Building2,
    name: 'Corporate & Enterprise',
    description:
      'Annual hardware refresh cycles, new office fit-outs, and unplanned replacement procurement — supplied with uniform SKU configurations, consistent warranty terms, and phased delivery aligned to your capital expenditure cycle.',
  },
  {
    icon: GraduationCap,
    name: 'Education & Government',
    description:
      'GST-compliant documentation, vendor registration credentials, and a product range covering classroom projectors, student laptops, computer lab desktops, and campus networking built for institutional procurement processes.',
  },
  {
    icon: Code2,
    name: 'IT Resellers & System Integrators',
    description:
      'Dedicated reseller pricing tiers, rapid RFQ turnaround for project bids, and back-to-back PO support that lets you confirm a customer order before committing to stock. Tender co-ordination for multi-vendor hardware consolidation.',
  },
  {
    icon: HeartPulse,
    name: 'Healthcare & Diagnostics',
    description:
      'Commercial-grade laptops, medical cart PCs, high-resolution diagnostic displays, and networking infrastructure for clinical environments — selected with guidance on OEM certifications relevant to medical device integration.',
  },
  {
    icon: Landmark,
    name: 'Banking, Financial Services & Insurance',
    description:
      'TPM chip requirements, secure boot configurations, and display privacy filter options handled at order time. Trading desk monitor arrays, branch office IT infrastructure, and BFSI-compliant hardware pre-configured to your security policy.',
  },
];

const STEPS = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Tell Us What You Need',
    description:
      'Browse our products or send us an RFQ. Share the product, quantity, delivery location and expected timeline.',
  },
  {
    icon: FileText,
    number: '02',
    title: 'Get Pricing and Availability',
    description:
      'Our team checks the requirement against current availability and pricing. You receive a quotation based on the products and quantities required.',
  },
  {
    icon: PackageCheck,
    number: '03',
    title: 'Confirm the Order',
    description:
      'Once you are comfortable with the quotation, you can proceed with your purchase order. Our team then coordinates the fulfilment process.',
  },
  {
    icon: Headphones,
    number: '04',
    title: 'Delivery and Ongoing Support',
    description:
      'We coordinate delivery based on the agreed requirements. For future purchases, warranty queries or product-related issues, you can continue working with your account contact.',
  },
];

const FAQS = [
  {
    q: 'What does a B2B IT hardware distributor do?',
    a: 'A B2B IT hardware distributor supplies technology products to businesses, institutions, resellers and other organisations. This can include laptops, desktops, monitors, printers, projectors, networking equipment and accessories.',
  },
  {
    q: 'What IT hardware can I buy from NxSys Digital?',
    a: 'You can source laptops, desktops, monitors, projectors, printers, networking equipment, accessories and other business technology products. Product availability depends on current stock.',
  },
  {
    q: 'Do you provide bulk IT hardware pricing?',
    a: 'Yes. You can contact our team for bulk pricing. Pricing depends on the product, quantity, availability and project requirements.',
  },
  {
    q: 'Do you supply genuine OEM products?',
    a: 'Yes. Products are sourced through authorised distribution channels and OEM partners. Products carry manufacturer warranty for the Indian market.',
  },
  {
    q: 'What is the minimum quantity for bulk orders?',
    a: 'For many laptop, monitor and desktop categories, volume pricing starts from five units. Accessory requirements generally start from ten units. The minimum quantity can vary depending on the product.',
  },
  {
    q: 'Do you supply IT hardware across India?',
    a: 'Yes. We support customers across India. For larger projects, multiple delivery locations can also be coordinated.',
  },
  {
    q: 'Can you help me choose the right product?',
    a: 'Yes. Our team can help with product comparisons, compatibility, workstation requirements and other pre-sales questions.',
  },
  {
    q: 'Can NxSys Digital handle large IT hardware projects?',
    a: 'Yes. We support larger requirements such as computer labs, workstation deployments and multi-unit laptop projects. Project requirements can be discussed with our sales team before placing an order.',
  },
  {
    q: 'How can I request a quotation?',
    a: 'You can submit an RFQ through the NxSys B2B portal or contact our sales team. Share the product, quantity, delivery location and expected timeline to help us prepare the quotation.',
  },
];

/* ─── Component ─────────────────────────────────────────── */

function SEOAboutSection() {
  return (
    <div>

      {/* ══════════════════════════════════════════
          ABOUT — split layout: text left, stats right
      ══════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-20 items-start">

            {/* Left — text */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">
                About NxSys Digital
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-6 leading-tight">
                Your trusted IT hardware partner for business procurement
              </h2>
              <p className="text-base leading-8 text-slate-500 mb-6">
                Buying IT hardware for a business is not always as simple as choosing a product online. You may
                need to compare specifications, check availability, get bulk pricing, confirm warranty details and
                coordinate delivery. For larger projects, managing all of this through different suppliers can take
                even more time.
              </p>
              <p className="text-base leading-8 text-slate-500 mb-8">
                NxSys Digital helps simplify this process. We bring different IT hardware categories together
                through one B2B procurement channel. Our team can help with product selection, quotations, bulk
                requirements, order coordination and after-sales support.
              </p>

              {/* Bullet checklist */}
              <ul className="space-y-3 mb-10">
                {ABOUT_BULLETS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[14px] text-slate-600">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" strokeWidth={2.5} />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-textMain font-bold px-6 py-3 rounded-full text-sm hover:bg-primary/90 transition-colors"
                >
                  Talk to our sales team <ArrowRight size={14} />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  Register as a partner
                </Link>
              </div>
            </div>

            {/* Right — stats + extra paragraphs */}
            <div className="space-y-6">
              {/* Stats 2×2 grid */}
              <div className="grid grid-cols-2 gap-px rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center justify-center bg-white py-8 px-4 text-center">
                    <span className="text-4xl font-black tracking-tight text-slate-950">{stat.value}</span>
                    <h6 className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">{stat.label}</h6>
                  </div>
                ))}
              </div>

              {/* Supporting text */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 space-y-4 text-[14px] leading-7 text-slate-500">
                <p>
                  Unlike general-purpose marketplaces, NxSys Digital is built specifically for B2B workflows —
                  supporting RFQ submissions, volume pricing negotiations, phased delivery scheduling, and
                  after-sales escalation through a single named contact.
                </p>
                <p>
                  Registered partners gain real-time inventory visibility, priority fulfilment queues, and early
                  access to new product lines. Whether you're deploying 10 workstations or 1,000, our process
                  scales without compromising authenticity or service quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRODUCT RANGE — icon card grid
      ══════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">

          {/* Header */}
          <div className="mx-auto max-w-2xl text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Product Range</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5">
              Enterprise hardware across every category
            </h2>
            <p className="text-base leading-relaxed text-slate-500">
              Source a complete office or data-centre buildout from one verified distributor, with consistent OEM
              pricing and a unified account team managing your entire product portfolio.
            </p>
          </div>

          {/* Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map(({ icon: Icon, name, short, description }) => (
              <div
                key={name}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
              >
                {/* Icon badge */}
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary">
                  <Icon size={20} className="transition-colors group-hover:text-textMain" strokeWidth={2} />
                </div>
                <h3 className="font-black text-slate-900 mb-1 text-[15px]">{name}</h3>
                <h4 className="text-[12px] font-semibold text-primary mb-3">{short}</h4>
                <p className="text-[13px] leading-relaxed text-slate-500 flex-1">{description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 font-bold px-7 py-3 rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
            >
              Browse the full catalog <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          INDUSTRIES WE SERVE — 2-col cards
      ══════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">

          <div className="max-w-2xl mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Industries We Serve</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5">
              Procurement solutions built for your sector
            </h2>
            <p className="text-base leading-relaxed text-slate-500">
              Every industry has unique procurement rhythms, compliance requirements, and deployment constraints.
              Our account team has direct experience serving the following sectors across India.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {INDUSTRIES.map(({ icon: Icon, name, description }) => (
              <div
                key={name}
                className="flex gap-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-6 transition-all duration-200 hover:border-primary/20 hover:bg-white hover:shadow-[0_4px_20px_rgba(15,23,42,0.06)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-[15px] mb-2">{name}</h3>
                  <p className="text-[13px] leading-relaxed text-slate-500">{description}</p>
                </div>
              </div>
            ))}

            {/* CTA card */}
            <div className="flex gap-5 rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-textMain">
                <Building2 size={20} strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-[15px] mb-2">Your industry not listed?</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 mb-4">
                  We work with organisations across manufacturing, retail, media, hospitality, and logistics. If you
                  have a bulk hardware requirement, contact our sales desk and we will put together a proposal.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary hover:underline"
                >
                  Send an enquiry <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS — numbered timeline
      ══════════════════════════════════════════ */}
      <section className="bg-slate-950 py-20 sm:py-24 border-b border-slate-800">
        <div className="container-shell">

          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-5">
              How our B2B IT hardware procurement works
            </h2>
            <p className="text-base leading-relaxed text-slate-400">
              We keep the process straightforward — from sharing your requirement to ongoing support after delivery.
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, number, title, description }) => (
              <div key={number} className="relative flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.04] p-6">
                {/* Step number */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-textMain font-black text-[13px]">
                    {number}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-slate-300">
                    <Icon size={17} strokeWidth={2} />
                  </div>
                </div>
                <h3 className="font-black text-white text-[15px] mb-3">{title}</h3>
                <p className="text-[13px] leading-relaxed text-slate-400">{description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-primary text-textMain font-bold px-7 py-3.5 rounded-full text-sm hover:bg-primary/90 transition-colors"
            >
              Get started — register free <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ — 2-column card grid
      ══════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="container-shell">

          <div className="mx-auto max-w-2xl text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5">
              Frequently asked questions
            </h2>
            <p className="text-base leading-relaxed text-slate-500">
              Common questions from procurement managers, IT buyers, and resellers working with NxSys Digital
              for the first time.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-black text-slate-900 text-[14px] mb-3 leading-snug">{q}</h3>
                <p className="text-[13px] leading-7 text-slate-500">{a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-primary/5 border border-primary/20 p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
            <div>
              <h5 className="font-black text-slate-950 text-lg mb-1">Still have questions?</h5>
              <p className="text-[14px] text-slate-500">Our sales and support team is available Mon–Sat, 9:00 AM – 6:30 PM IST.</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href="tel:+919701314138"
                className="inline-flex items-center gap-2 bg-primary text-textMain font-bold px-6 py-3 rounded-full text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Call +91 97013 14138
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
              >
                Contact form
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default memo(SEOAboutSection);
