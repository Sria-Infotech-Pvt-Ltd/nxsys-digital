import { Link } from 'react-router-dom';
import {
  Monitor, Laptop, Video, Network, Printer, Cpu,
  Building2, GraduationCap, Code2, HeartPulse, Landmark, Factory,
  ArrowRight, CheckCircle2, MessageSquare, FileText, PackageCheck, Headphones,
} from 'lucide-react';
import { useDocumentHead } from '@/hooks/useDocumentHead';

const SUPPORT_LIST = [
  'Product selection assistance',
  'Product specification guidance',
  'Bulk requirements',
  'Competitive quotations',
  'RFQ and project support',
  'Availability checks',
  'Order coordination',
  'Delivery planning',
  'OEM warranty support',
  'After-sales assistance',
];

const CUSTOMER_TYPES = [
  'Corporate and enterprise organisations',
  'Educational institutions',
  'IT resellers',
  'System integrators',
  'Healthcare organisations',
  'BFSI organisations',
  'Manufacturing companies',
  'Retail businesses',
  'Logistics companies',
  'Media and hospitality businesses',
];

const PRODUCT_CATEGORIES = [
  { icon: Laptop, name: 'Laptops and Desktops', description: 'Source laptops, desktops and computing systems for employees, offices, workstations and other professional requirements.' },
  { icon: Monitor, name: 'Monitors and Displays', description: 'Choose monitors and display products for office workstations, meeting rooms, control rooms and other business environments.' },
  { icon: Video, name: 'Projectors', description: 'Projectors and display equipment for classrooms, meeting rooms, training centres and presentations.' },
  { icon: Printer, name: 'Printers and Imaging', description: 'Printers and imaging products for offices, educational institutions and business operations.' },
  { icon: Network, name: 'Networking and Infrastructure', description: 'Networking and infrastructure products to support business connectivity and IT environments.' },
  { icon: Cpu, name: 'Accessories and Peripherals', description: 'Find keyboards, mice, storage devices, cables, adapters and other computer accessories for business requirements.' },
];

const GENUINE_REASONS = [
  'Manufacturer warranty for the Indian market',
  'Reliable product sourcing',
  'Better procurement transparency',
  'Reduced risk of counterfeit products',
  'Support for bulk requirements',
  'Warranty coordination',
];

const BULK_SUPPORT = [
  'Bulk product quotations',
  'RFQ support',
  'Product comparison',
  'Specification guidance',
  'Volume pricing',
  'Purchase order coordination',
  'Delivery planning',
  'Multi-location fulfilment',
  'Warranty support',
  'After-sales coordination',
];

const INDUSTRIES = [
  { icon: Building2, name: 'Corporate and Enterprise', description: 'IT hardware for offices, employees, workstations and infrastructure requirements.' },
  { icon: GraduationCap, name: 'Education', description: 'Computers, monitors, projectors, networking equipment and accessories for schools, colleges and educational institutions.' },
  { icon: Code2, name: 'IT Resellers and System Integrators', description: 'Procurement support for resellers and system integrators handling customer requirements.' },
  { icon: HeartPulse, name: 'Healthcare', description: 'IT products for offices, workstations and operational requirements.' },
  { icon: Landmark, name: 'BFSI', description: 'Hardware procurement for banking, financial services and insurance organisations.' },
  { icon: Factory, name: 'Manufacturing, Retail and Logistics', description: 'IT equipment for employee systems, business operations and infrastructure requirements.' },
];

const WHY_CHOOSE = [
  { value: '25+', label: 'OEM Brands' },
  { value: '1000+', label: 'Active SKUs' },
  { value: 'Bulk', label: 'Pricing Support' },
  { value: 'Pan-India', label: 'Delivery' },
];

const STEPS = [
  { icon: MessageSquare, number: '01', title: 'Share Your Requirement', description: 'Tell us what products you need, along with specifications and quantities.' },
  { icon: FileText, number: '02', title: 'Check Pricing and Availability', description: 'Our team checks suitable products, current availability and pricing.' },
  { icon: PackageCheck, number: '03', title: 'Confirm Your Order', description: 'Once the product and quotation are finalised, you can proceed with the purchase order.' },
  { icon: Headphones, number: '04', title: 'Delivery and Support', description: 'We coordinate delivery and provide support for warranty and after-sales requirements.' },
];

const PROJECT_SUPPORT = [
  'Product specifications',
  'Required quantities',
  'Bulk quotations',
  'Purchase orders',
  'Delivery schedules',
  'Multiple-location requirements',
  'Product documentation',
  'Warranty coordination',
  'After-sales support',
];

function AboutUs() {
  useDocumentHead({
    title: 'IT Hardware Distributor in India | Bulk IT Supply | NxSys',
    description:
      'NxSys Digital is an IT hardware distributor in India supplying laptops, desktops, monitors, printers, projectors, networking equipment and more.',
  });

  return (
    <main className="bg-greyLight">
      {/* Intro */}
      <section className="bg-white py-16 sm:py-20 border-b border-slate-100">
        <div className="container-shell max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-6 leading-tight">
            IT Hardware Distributor in India
          </h1>
          <p className="text-base leading-8 text-slate-600 mb-4">
            NxSys Digital is a sister concern of{' '}
            <a href="https://www.sriainfotech.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">Sria Group</a>
            . NxSys Digital is an IT hardware distributor in India, helping businesses, institutions, resellers and
            system integrators source reliable IT products for their requirements. We supply laptops, desktops,
            monitors, projectors, printers, networking equipment, accessories and other IT hardware.
          </p>
          <p className="text-base leading-8 text-slate-600 mb-4">
            Our B2B procurement model helps customers source genuine products through authorised distribution
            channels. We support businesses with product selection, pricing, availability, bulk requirements and
            delivery coordination.
          </p>
          <p className="text-base leading-8 text-slate-600 mb-8">
            Whether you need IT hardware for a new office, employee systems, a computer lab or a large project, our
            team can help you find suitable products for your requirement.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-textMain font-bold px-6 py-3 rounded-full text-sm hover:bg-primary/90 transition-colors">
              Browse Products
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-full text-sm hover:border-primary hover:text-primary transition-colors">
              Request an RFQ
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted distributor + support list */}
      <section className="bg-slate-50 py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">
              Your Trusted IT Hardware Distributor
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-6 leading-tight">
              IT hardware procurement, simplified
            </h2>
            <p className="text-base leading-8 text-slate-500 mb-4">
              Buying IT hardware for a business involves more than finding a product online. You need to consider
              specifications, availability, pricing, warranty and delivery.
            </p>
            <p className="text-base leading-8 text-slate-500">
              NxSys Digital brings these requirements together through a B2B procurement channel. Our team helps
              businesses identify suitable products and coordinate the purchasing process. With access to{' '}
              <strong className="text-slate-700">25+ OEM brands and 1,000+ active SKUs</strong>, we help businesses
              manage their IT hardware procurement through one channel.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h3 className="font-black text-slate-900 text-[15px] mb-5">Our B2B IT Hardware Support</h3>
            <ul className="space-y-3">
              {SUPPORT_LIST.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] text-slate-600">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Customers across India */}
      <section className="bg-white py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Who We Serve</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5">
              IT hardware supplier for businesses across India
            </h2>
            <p className="text-base leading-relaxed text-slate-500">
              Different organisations have different technology needs. A new office may require laptops and
              monitors. An educational institution may need computers and projectors. A system integrator may
              require hardware for a customer project. We work with customers to understand their requirements
              before suggesting suitable products.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {CUSTOMER_TYPES.map((type) => (
              <span key={type} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[13px] font-semibold text-slate-600">
                {type}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Product range */}
      <section className="bg-slate-50 py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Product Range</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5">
              IT hardware products we supply
            </h2>
            <p className="text-base leading-relaxed text-slate-500">
              As an IT hardware distributor in India, NxSys Digital provides access to a wide range of products for
              business and institutional requirements.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_CATEGORIES.map(({ icon: Icon, name, description }) => (
              <div key={name} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary">
                  <Icon size={20} className="transition-colors group-hover:text-textMain" strokeWidth={2} />
                </div>
                <h3 className="font-black text-slate-900 mb-3 text-[15px]">{name}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 flex-1">{description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/products" className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 font-bold px-7 py-3 rounded-full text-sm hover:border-primary hover:text-primary transition-colors">
              Browse the full catalog <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Genuine hardware */}
      <section className="bg-white py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Authorised Sourcing</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-6 leading-tight">
              Genuine IT hardware from authorised distribution channels
            </h2>
            <p className="text-base leading-8 text-slate-500 mb-4">
              Businesses need confidence when purchasing IT hardware. Unverified products can create concerns
              around authenticity, warranty and after-sales support. NxSys Digital focuses on sourcing genuine IT
              hardware through authorised distribution channels.
            </p>
            <p className="text-base leading-8 text-slate-500">
              We help customers understand product specifications, availability and warranty information before
              they make their purchasing decision.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
            <h3 className="font-black text-slate-900 text-[15px] mb-5">Why Businesses Prefer Genuine IT Hardware</h3>
            <ul className="space-y-3">
              {GENUINE_REASONS.map((reason) => (
                <li key={reason} className="flex items-start gap-3 text-[14px] text-slate-600">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" strokeWidth={2.5} />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Bulk procurement */}
      <section className="bg-slate-50 py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Bulk Procurement</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-6 leading-tight">
              Bulk IT hardware supplier for business requirements
            </h2>
            <p className="text-base leading-8 text-slate-500 mb-4">
              Large IT purchases require proper planning. A business may need multiple laptops, desktops, monitors
              or networking products. Large projects may also require quotations, purchase orders, delivery
              schedules and multi-location fulfilment.
            </p>
            <p className="text-base leading-8 text-slate-500">
              NxSys Digital supports these requirements through a structured procurement process. For many laptop,
              desktop and monitor categories, volume pricing can start from 5 units. Accessories may generally
              start from 10 units. Actual pricing and availability depend on the product, quantity and current
              stock.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h3 className="font-black text-slate-900 text-[15px] mb-5">Bulk Procurement Support</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {BULK_SUPPORT.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] text-slate-600">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-white py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">
          <div className="max-w-2xl mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Industries We Serve</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5">
              IT hardware distribution for different industries
            </h2>
            <p className="text-base leading-relaxed text-slate-500">
              Every industry has different IT requirements. NxSys Digital works with organisations that need
              technology products for their day-to-day operations and larger projects.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {INDUSTRIES.map(({ icon: Icon, name, description }) => (
              <div key={name} className="flex gap-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-6 transition-all duration-200 hover:border-primary/20 hover:bg-white hover:shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-[15px] mb-2">{name}</h3>
                  <p className="text-[13px] leading-relaxed text-slate-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-slate-950 py-20 sm:py-24 border-b border-slate-800">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-5">Why choose NxSys Digital?</h2>
            <p className="text-base leading-relaxed text-slate-400">
              Finding an IT hardware supplier is only one part of the procurement process. Businesses also need
              product availability, pricing support and reliable coordination.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px rounded-2xl overflow-hidden border border-white/10 bg-white/10 max-w-2xl mx-auto">
            {WHY_CHOOSE.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center bg-slate-950 py-8 px-4 text-center">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">{stat.value}</span>
                <h4 className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">{stat.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5">
              How our IT hardware procurement process works
            </h2>
            <p className="text-base leading-relaxed text-slate-500">
              We keep the procurement process simple and practical.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, number, title, description }) => (
              <div key={number} className="relative flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-textMain font-black text-[13px]">
                    {number}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 border border-slate-200">
                    <Icon size={17} strokeWidth={2} />
                  </div>
                </div>
                <h3 className="font-black text-slate-900 text-[15px] mb-3">{title}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Large projects */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="container-shell max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Large Projects</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-6">
            IT hardware procurement for large projects
          </h2>
          <p className="text-base leading-8 text-slate-500 mb-8">
            Large IT projects often require detailed procurement planning. If you are setting up multiple offices,
            upgrading your infrastructure or deploying systems across different locations, NxSys Digital can
            support the hardware procurement process.
          </p>
          <h5 className="sr-only">Project support includes</h5>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {PROJECT_SUPPORT.map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-600">
                {item}
              </span>
            ))}
          </div>
          <h6 className="sr-only">Get started</h6>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-textMain font-bold px-6 py-3 rounded-full text-sm hover:bg-primary/90 transition-colors">
              Talk to our sales team <ArrowRight size={14} />
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-full text-sm hover:border-primary hover:text-primary transition-colors">
              Register as a partner
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutUs;
