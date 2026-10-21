import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop, Monitor, Video, Network, Printer, Cpu, ClipboardList,
  ShieldCheck, BadgeCheck, Users, ClipboardCheck, TrendingUp, Handshake,
  ArrowRight, MapPin, Globe2, Mail, Phone, Plus, Minus,
} from 'lucide-react';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import warehouseBarcodeImage from '../../assets/content/warehouse-barcode-scan.jpg';
import warehouseTeamImage from '../../assets/content/warehouse-team-review.jpg';

const INTRO_PARAGRAPHS = [
  'NxSys Digital is an IT hardware distributor in Hyderabad, supporting businesses with technology products and B2B procurement solutions. Based in the Kondapur business area, Hyderabad, Telangana, we help organisations source IT hardware for their daily operations, workplace infrastructure, and technology requirements.',
  'As part of the Sria Infotech group, NxSys Digital focuses on simplifying business technology procurement. We help companies explore suitable products, review hardware options, and manage their purchasing requirements through a B2B-focused digital platform.',
  'From laptops and desktops to monitors, projectors, networking equipment, printers, and IT accessories, we support businesses seeking practical technology solutions. Our focus is on product suitability, transparent communication, and a convenient procurement experience.',
  'Our approach centres on product information, responsible sourcing, warranty considerations, and clear procurement communication. Instead of coordinating every product enquiry independently, business buyers can explore their requirements through NxSys Digital.',
  'We support organisations looking for individual IT products, multiple devices, and bulk hardware procurement, subject to availability and commercial terms. Our objective is to help businesses make informed purchasing decisions while keeping their IT procurement process organised and efficient.',
];

const BUSINESS_MODEL_ITEMS = [
  { title: 'Corporate IT procurement', description: 'Hardware requirements for offices, corporate departments, and business teams.' },
  { title: 'Bulk IT hardware supply', description: 'Multiple-device requirements for office expansion, new workspaces, and equipment replacement.' },
  { title: 'SME and startup procurement', description: 'Computing devices and workplace technology for growing businesses.' },
  { title: 'IT infrastructure procurement', description: 'Hardware for computing, display, printing, and networking requirements.' },
  { title: 'Product sourcing and quotations', description: 'Enquiries based on specifications, quantities, preferred brands, and budget.' },
];

const CORPORATE_VALUES = [
  { icon: ShieldCheck, title: 'Trust and Transparency', description: 'We believe strong business relationships begin with honest communication, clear product information, and transparent commercial discussions.' },
  { icon: BadgeCheck, title: 'Product Quality and Authenticity', description: 'We prioritise genuine products and responsible sourcing practices. We encourage customers to verify product authenticity, serial details, and applicable warranty terms before purchase.' },
  { icon: Users, title: 'Customer-Centred Service', description: "We consider each customer's requirements, specifications, quantities, and budget when discussing suitable product options." },
  { icon: ClipboardCheck, title: 'Accountability', description: 'We value clear communication throughout product enquiries, quotations, order coordination, and after-sales discussions.' },
  { icon: TrendingUp, title: 'Continuous Improvement', description: 'We aim to improve our product knowledge, procurement processes, and digital purchasing experience as business technology requirements evolve.' },
  { icon: Handshake, title: 'Long-Term Partnerships', description: 'We focus on developing lasting relationships with business customers through consistent communication and a clear understanding of their procurement needs.' },
];

const OFFERINGS = [
  { icon: Laptop, title: 'Laptops and Desktops', description: 'Explore laptops and desktop computers for office employees, management teams, developers, and business operations. We help business buyers consider specifications, performance requirements, and intended usage when selecting suitable devices.' },
  { icon: Monitor, title: 'Monitors and Display Solutions', description: 'NxSys Digital offers monitor and display options for corporate workstations, office setups, conference rooms, and multi-screen business environments. Choose suitable display solutions based on your workspace requirements and product availability.' },
  { icon: Video, title: 'Projectors', description: 'NxSys Digital provides access to projector solutions for business meetings, corporate presentations, employee training sessions, and educational environments. Explore available models based on display requirements, room size, and intended usage.' },
  { icon: Network, title: 'Networking Equipment', description: 'Explore networking products that support business connectivity and IT infrastructure requirements. Product enquiries may include relevant networking devices and equipment, depending on availability and specifications.' },
  { icon: Printer, title: 'Printers and Scanners', description: 'Find printing and document-scanning equipment for offices, corporate departments, educational institutions, and administrative operations. Product selection can depend on print volume, connectivity, functionality, and business requirements.' },
  { icon: Cpu, title: 'IT Accessories and Peripherals', description: 'Explore accessories and peripherals that complement workplace computing systems. These products can support everyday office work, employee productivity, and business technology setups.' },
  { icon: ClipboardList, title: 'B2B Hardware Procurement', description: 'NxSys Digital helps business buyers explore IT hardware options based on product specifications, quantities, preferred brands, and budgets. Contact our team to discuss your requirements, request a quotation, and confirm availability.' },
];

const STRATEGIC_OBJECTIVES = [
  { number: '01', title: 'Strengthen Distribution Capabilities', description: 'Strengthen our B2B hardware distribution capabilities by improving product discovery and simplifying procurement enquiries.' },
  { number: '02', title: 'Build Stronger Relationships', description: 'Build stronger relationships with businesses and technology partners as organisations expand their teams and modernise workplaces.' },
  { number: '03', title: 'Expand Beyond Hyderabad', description: 'Support more organisations beyond Kondapur and Hyderabad as our distribution network and operational capabilities develop.' },
  { number: '04', title: 'Accessible Product Information', description: 'Focus on accessible product information and efficient enquiry handling for business customers.' },
  { number: '05', title: 'Responsible Sourcing', description: 'Continue responsible sourcing practices as business technology requirements evolve.' },
  { number: '06', title: 'Smoother Digital Experience', description: 'Build a smoother digital purchasing experience that makes technology procurement more convenient for organisations of different sizes.' },
];

const BRANDS = [
  { name: 'Apple', description: 'Explore selected Apple devices and related technology products for business and workplace requirements, subject to availability.' },
  { name: 'BenQ', description: 'Discover BenQ monitors, projectors, and display solutions for business workstations, presentations, and meeting environments.' },
  { name: 'Dell', description: 'Explore Dell laptops, desktops, monitors, and business computing products for workplace and corporate requirements.' },
  { name: 'Epson', description: 'Find Epson projectors, printers, and imaging products for office operations, business presentations, and educational environments.' },
  { name: 'Google', description: 'Enquire about selected Google technology products and devices, subject to availability and applicable supply arrangements.' },
  { name: 'Lenovo', description: 'Explore Lenovo business laptops, desktops, monitors, and computing devices for organisations with different performance and productivity requirements.' },
  { name: 'Microsoft', description: 'Enquire about selected Microsoft software, accessories, and technology products, subject to availability and applicable licensing or distribution terms.' },
];

const FAQS = [
  { q: 'What does NxSys Digital do?', a: 'NxSys Digital is a B2B IT hardware distribution business associated with Sria Infotech. It helps businesses explore computing devices, displays, networking products, printers, and other IT hardware.' },
  { q: 'Where is NxSys Digital located?', a: "NxSys Digital's business location is associated with Kondapur, Hyderabad, Telangana, India. Contact the team to confirm the current office address and visiting arrangements." },
  { q: 'Does NxSys Digital supply IT hardware to businesses?', a: 'Yes. NxSys Digital focuses on B2B procurement and supports business enquiries for IT hardware, subject to product availability and commercial terms.' },
  { q: 'Which IT hardware brands are available through NxSys Digital?', a: 'Brand options include Apple, BenQ, Dell, Epson, Google, Lenovo, and Microsoft. Specific products and availability vary, so buyers should confirm their requirements with the team.' },
  { q: 'Can businesses enquire about bulk IT hardware purchases?', a: 'Yes. Businesses can contact NxSys Digital with their required products, quantities, specifications, and delivery location to discuss bulk procurement options.' },
  { q: 'Does NxSys Digital provide warranty-supported products?', a: 'Warranty coverage depends on the product, brand, seller, and applicable terms. Buyers should confirm the warranty provider, coverage period, and eligibility before purchase.' },
  { q: 'How can I request an IT hardware quotation from NxSys Digital?', a: 'Visit nxsysdigital.com or email sales@nxsysdigital.com with your product requirements, quantities, and preferred brands to enquire about availability and quotations.' },
  { q: 'Does NxSys Digital supply monitors and projectors for corporate use?', a: 'NxSys Digital offers access to monitor and projector options for workstations, meeting rooms, corporate presentations, and training environments, subject to product availability.' },
];

function FaqItem({ number, q, a }: { number: number; q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`group rounded-2xl border bg-white transition-all duration-200 ${open ? 'border-primary/30 shadow-[0_8px_24px_rgba(15,23,42,0.08)]' : 'border-slate-200 hover:border-slate-300'
        }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-black transition-colors ${open ? 'bg-primary text-textMain' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
            }`}
        >
          {String(number).padStart(2, '0')}
        </span>
        <span className="flex-1 font-black text-slate-900 text-[15px]">{q}</span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {open ? <Minus size={15} strokeWidth={2.5} /> : <Plus size={15} strokeWidth={2.5} />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 pl-[68px] text-[14px] leading-relaxed text-slate-500 sm:px-6 sm:pl-[72px]">
          {a}
        </div>
      )}
    </div>
  );
}

function AboutUs() {
  useDocumentHead({
    title: 'About NxSys Digital | IT Hardware Distributor in Hyderabad',
    description:
      'Meet NxSys Digital, a B2B IT hardware distributor in Kondapur, Hyderabad, supplying laptops, monitors, projectors, networking equipment and more for businesses.',
  });

  return (
    <main className="bg-greyLight">
      {/* Hero / intro */}
      <section className="bg-white py-16 sm:py-20 border-b border-slate-100">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Company</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 leading-tight">
              About NxSys Digital – IT Hardware Distributor in Hyderabad
            </h1>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-center lg:gap-14">
            <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 aspect-[3/4]">
              <img
                src={warehouseTeamImage}
                alt="NxSys Digital team reviewing stock and orders"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div>
              {INTRO_PARAGRAPHS.map((text, i) => (
                <p
                  key={text.slice(0, 20)}
                  className={`text-base leading-8 text-slate-600 ${i === INTRO_PARAGRAPHS.length - 1 ? 'mb-8' : 'mb-4'}`}
                >
                  {text}
                </p>
              ))}
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-textMain font-bold px-6 py-3 rounded-full text-sm hover:bg-primary/90 transition-colors">
                  Browse Products
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-full text-sm hover:border-primary hover:text-primary transition-colors">
                  Request an RFQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-50 py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Mission &amp; Vision</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              What drives NxSys Digital
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <h3 className="font-black text-slate-900 text-[17px] mb-4">Our Mission</h3>
              <p className="text-[14px] leading-relaxed text-slate-600">
                Our mission is to simplify B2B IT hardware procurement by connecting businesses with suitable
                technology products and practical sourcing support. We aim to help organisations identify
                appropriate hardware, manage procurement requirements, and select products that match their
                operational needs and budgets.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <h3 className="font-black text-slate-900 text-[17px] mb-4">Our Vision</h3>
              <p className="text-[14px] leading-relaxed text-slate-600">
                Our vision is to become a trusted B2B IT hardware distribution partner for businesses in Hyderabad
                and progressively expand our reach across India. We aspire to build lasting business relationships
                through product knowledge, transparent communication, responsible sourcing, and a customer-focused
                purchasing experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our B2B Business Model */}
      <section className="bg-white py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Our B2B Model</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5 leading-tight">
              A B2B model designed around business requirements
            </h2>
            <p className="text-base leading-relaxed text-slate-500">
              NxSys Digital follows a B2B-focused model designed around business purchasing requirements. We help
              organisations explore hardware options and coordinate procurement enquiries according to their needs.
              Through this model, we aim to make IT hardware sourcing more organised and accessible for business
              buyers.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 max-w-3xl mx-auto">
            <h3 className="font-black text-slate-900 text-[15px] mb-5 text-center">Our Business Model Supports</h3>
            <ul className="grid gap-5 sm:grid-cols-2">
              {BUSINESS_MODEL_ITEMS.map((item) => (
                <li key={item.title}>
                  <p className="text-[14px] font-bold text-slate-800">{item.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Operations snapshot */}
      <section className="bg-slate-50 py-16 sm:py-20 border-b border-slate-100">
        <div className="container-shell max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Behind the Scenes</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Coordinating every order, from stock to dispatch
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <img
              src={warehouseBarcodeImage}
              alt="NxSys Digital team coordinating stock and dispatch for a B2B order"
              className="h-full w-full object-cover max-h-[420px]"
              loading="lazy"
            />
          </div>
          <p className="mt-5 text-center text-[13px] text-slate-500">
            Coordinating product availability, dispatch and documentation for every B2B order.
          </p>
        </div>
      </section>

      {/* Corporate values */}
      <section className="bg-slate-950 py-20 sm:py-24 border-b border-slate-800">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Corporate Values</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-5">
              Six values, one way of working
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CORPORATE_VALUES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <h3 className="font-black text-white mb-3 text-[15px]">{title}</h3>
                <p className="text-[13px] leading-relaxed text-slate-400 flex-1">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we offer / operational pillars */}
      <section className="bg-white py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">What We Offer</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5">
              What we offer our B2B clients
            </h2>
            <p className="text-base leading-relaxed text-slate-500">
              NxSys Digital provides access to a range of IT hardware categories for business and corporate
              requirements, supporting everyday computing, workplace productivity, presentations, and IT
              infrastructure needs.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OFFERINGS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary">
                  <Icon size={20} className="transition-colors group-hover:text-textMain" strokeWidth={2} />
                </div>
                <h3 className="font-black text-slate-900 mb-3 text-[15px]">{title}</h3>
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

      {/* Strategic objectives / where we're heading */}
      <section className="bg-slate-50 py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Strategic Objectives</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5">Where we're heading</h2>
            <p className="text-base leading-relaxed text-slate-500">
              Business technology continues to evolve as organisations expand their teams, modernise workplaces,
              and upgrade their IT infrastructure.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STRATEGIC_OBJECTIVES.map(({ number, title, description }) => (
              <div key={number} className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
                <span className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-textMain font-black text-[13px]">
                  {number}
                </span>
                <h3 className="font-black text-slate-900 text-[15px] mb-3">{title}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="bg-white py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Brands We Supply</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5">
              Global technology brands we supply
            </h2>
            <p className="text-base leading-relaxed text-slate-500">
              NxSys Digital provides access to products from established technology brands, subject to product
              availability and applicable distribution arrangements.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BRANDS.map((brand) => (
              <div key={brand.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-black text-slate-900 mb-2 text-[15px]">{brand.name}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500">{brand.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-[13px] text-slate-400 max-w-2xl mx-auto">
            Brand availability and authorised distribution status may vary by product. Contact NxSys Digital to
            confirm stock, warranty coverage, licensing terms, and applicable brand authorisation before placing an
            order.
          </p>
        </div>
      </section>

      {/* Location */}
      <section className="bg-slate-950 py-20 sm:py-24 border-b border-slate-800">
        <div className="container-shell max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Our Location</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-6">
            Kondapur, Hyderabad
          </h2>
          <p className="text-base leading-8 text-slate-400 mb-10">
            NxSys Digital serves B2B IT hardware procurement requirements in Hyderabad, Telangana, with its
            business location associated with Kondapur. Whether your business needs laptops for employees,
            monitors for workstations, projectors for meeting rooms, or hardware for office expansion, NxSys
            Digital can help you discuss suitable product options.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[13px] font-semibold text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <MapPin size={15} className="text-primary" /> Kondapur, Hyderabad, Telangana, India
            </span>
            <a href="https://www.nxsysdigital.com/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:text-primary transition-colors">
              <Globe2 size={15} className="text-primary" /> nxsysdigital.com
            </a>
            <a href="mailto:sales@nxsysdigital.com" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:text-primary transition-colors">
              <Mail size={15} className="text-primary" /> sales@nxsysdigital.com
            </a>
            <a href="tel:9701314138" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:text-primary transition-colors">
              <Phone size={15} className="text-primary" /> 9701314138 / 9059585039
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5">
              Frequently asked questions
            </h2>
            <p className="text-base leading-relaxed text-slate-500">
              Common questions from procurement managers, IT buyers, and teams working with NxSys Digital for the
              first time.
            </p>
          </div>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-14">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="font-black text-slate-900 text-[14px] mb-1">Still have questions?</p>
                <p className="text-[13px] leading-relaxed text-slate-500 mb-4">
                  Our team can walk you through pricing, availability and procurement support.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-textMain font-bold px-5 py-2.5 rounded-full text-[13px] hover:bg-primary/90 transition-colors"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <FaqItem key={faq.q} number={index + 1} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="container-shell max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Get Started</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-6">
            Explore B2B IT hardware solutions with NxSys Digital
          </h2>
          <p className="text-base leading-8 text-slate-500 mb-8">
            Finding suitable IT hardware starts with understanding your business requirements, product
            specifications, budget, and expected delivery timeline. Planning an IT hardware purchase for your
            business? Contact NxSys Digital with your required products, quantities, and preferred brands to begin
            your enquiry.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-textMain font-bold px-6 py-3 rounded-full text-sm hover:bg-primary/90 transition-colors">
              Explore Products <ArrowRight size={14} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-full text-sm hover:border-primary hover:text-primary transition-colors">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutUs;
