import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, FileSignature, ShoppingCart, FileCheck2, Truck, LifeBuoy,
  ArrowRight, Briefcase, ClipboardList, MapPin, ScrollText, Plus, Minus,
} from 'lucide-react';
import { useDocumentHead } from '@/hooks/useDocumentHead';

const AT_A_GLANCE = [
  {
    title: 'B2B Access',
    description: 'NxSys Digital operates under a B2B procurement model. Access to pricing and ordering is provided to registered business accounts.',
  },
  {
    title: 'Personalised Quote',
    description: 'Every enquiry is reviewed individually. Our team shares a quotation based on your product, specification and quantity requirements.',
  },
  {
    title: 'Flexible Payment',
    description: 'Payment options are discussed with our sales team based on your order value, business profile and requirement.',
  },
  {
    title: 'Pan-India Delivery',
    description: 'Once an order is confirmed, we coordinate dispatch and delivery to your office, institution or project site across India.',
  },
];

const STEPS = [
  {
    icon: Building2,
    number: '01',
    title: 'Share Your Business Details',
    description: 'Reach out to our team with your company details and the IT hardware you are looking to procure.',
  },
  {
    icon: FileSignature,
    number: '02',
    title: 'Requirement Review',
    description: 'Our team reviews your requirement and shares suitable product options based on specification, budget and availability.',
  },
  {
    icon: ShoppingCart,
    number: '03',
    title: 'Browse Products & Request Pricing',
    description: 'Browse our catalog and use "Enquire Now" on any product, or share a consolidated list for a bulk quotation.',
  },
  {
    icon: FileCheck2,
    number: '04',
    title: 'Quotation & Order Confirmation',
    description: 'We share a formal quotation. Once the product and pricing are finalised, you can confirm the order with a purchase order.',
  },
  {
    icon: Truck,
    number: '05',
    title: 'Dispatch & Delivery',
    description: 'Dispatch is arranged after order and payment confirmation, with delivery coordinated to your location across India.',
  },
  {
    icon: LifeBuoy,
    number: '06',
    title: 'Tracking & After-Sales Support',
    description: 'Our sales team keeps you updated on order status and remains available for warranty and after-sales assistance.',
  },
];

const BEFORE_YOU_START = [
  {
    icon: Briefcase,
    title: 'Company Details',
    description: 'Keep your company name, GSTIN and billing details ready.',
  },
  {
    icon: ClipboardList,
    title: 'Product Requirements',
    description: 'List the products, specifications and quantities you require.',
  },
  {
    icon: MapPin,
    title: 'Delivery Information',
    description: 'Share your delivery location and any project timelines.',
  },
  {
    icon: ScrollText,
    title: 'Terms & Conditions',
    description: 'Review our Terms & Conditions before confirming an order.',
  },
];

const FAQS = [
  {
    q: 'Do I need to register before placing an order?',
    a: 'You can browse our catalog without registering. For pricing, quotations and order confirmation, our sales team will set up your business account based on the details you share.',
  },
  {
    q: 'Are prices shown on the website?',
    a: 'As a B2B distributor, pricing depends on product, quantity and current availability. Use "Enquire Now" on any product or contact our sales team to receive a quotation.',
  },
  {
    q: 'What is the minimum order quantity?',
    a: 'Most laptop, desktop and monitor categories support bulk pricing from 5 units, while accessories generally start from 10 units. Single-unit requirements can also be discussed with our team.',
  },
  {
    q: 'What payment options are available?',
    a: 'Payment options are confirmed with our sales team during order processing, based on your order value and business requirement.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Delivery timelines depend on product availability and your location. Our team shares an estimated delivery schedule once your order is confirmed.',
  },
  {
    q: 'Who do I contact for order status or support?',
    a: 'You can reach our sales team at sales@nxsysdigital.com or call 9701314138 for order tracking, warranty and after-sales support.',
  },
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

function HowToBuy() {
  useDocumentHead({
    title: 'How to Buy | B2B IT Hardware Procurement Process | NxSys Digital',
    description:
      'Learn how the NxSys Digital B2B procurement process works, from sharing your requirement to order confirmation, dispatch and after-sales support.',
  });

  return (
    <main className="bg-greyLight">
      {/* Intro */}
      <section className="bg-white py-16 sm:py-20 border-b border-slate-100">
        <div className="container-shell max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">How to Buy</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-6 leading-tight">
            How Our B2B Procurement Process Works
          </h1>
          <p className="text-base leading-8 text-slate-600">
            NxSys Digital operates under a B2B procurement model. Our process is built around understanding your
            requirement, sharing the right quotation and coordinating delivery, so your business gets the right IT
            hardware without the guesswork.
          </p>
        </div>
      </section>

      {/* At a glance */}
      <section className="bg-slate-50 py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">At a Glance</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5">What to expect</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AT_A_GLANCE.map((item) => (
              <div key={item.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-black text-slate-900 mb-3 text-[15px]">{item.title}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 flex-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step by step */}
      <section className="bg-white py-20 sm:py-24 border-b border-slate-100">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Step by Step</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5">
              From enquiry to delivery
            </h2>
            <p className="text-base leading-relaxed text-slate-500">
              Here is what happens when you buy IT hardware from NxSys Digital.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Before you start */}
      <section className="bg-slate-950 py-20 sm:py-24 border-b border-slate-800">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Before You Start</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-5">What you'll need</h2>
            <p className="text-base leading-relaxed text-slate-400">
              Have these details ready so our team can move quickly from enquiry to quotation.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BEFORE_YOU_START.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <h3 className="font-black text-white mb-2 text-[15px]">{title}</h3>
                <p className="text-[13px] leading-relaxed text-slate-400 flex-1">{description}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[13px] text-slate-400 mt-10">
            Read our{' '}
            <Link to="/terms-conditions" className="font-semibold text-primary hover:underline">
              Terms &amp; Conditions
            </Link>{' '}
            for complete policy details.
          </p>
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
              Common questions about ordering, pricing and delivery from first-time NxSys Digital buyers.
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

      {/* CTA */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="container-shell max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Start Now</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-6">
            Ready to place your order?
          </h2>
          <p className="text-base leading-8 text-slate-500 mb-8">
            Browse our catalog and request pricing on any product, or talk to our sales team to get started.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-textMain font-bold px-6 py-3 rounded-full text-sm hover:bg-primary/90 transition-colors">
              Browse Products <ArrowRight size={14} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-full text-sm hover:border-primary hover:text-primary transition-colors">
              Talk to Our Sales Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HowToBuy;
