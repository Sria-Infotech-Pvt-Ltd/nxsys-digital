import { Clock, Mail, MapPin, Phone, ArrowRight, MessageSquare } from 'lucide-react';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { useDocumentHead } from '@/hooks/useDocumentHead';

function Contact() {
  useDocumentHead({
    title: 'Contact Us | B2B IT Hardware Procurement Support | NxSys Digital',
    description:
      'Get in touch with NxSys Digital for bulk IT hardware quotes, RFQs and procurement support. Call, email or visit our Hyderabad office.',
  });

  return (
    <div className="min-h-screen bg-greyLight">
      <Breadcrumbs items={[{ label: 'Contact', active: true }]} />

      {/* Hero */}
      <div className="relative overflow-hidden bg-textMain">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full blur-3xl"
          style={{ background: 'rgba(48,149,248,0.07)' }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full blur-3xl"
          style={{ background: 'rgba(48,149,248,0.04)' }}
        />

        <div className="container-shell relative py-20 sm:py-28 lg:py-32">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Enterprise Support</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
                Let's talk<br />
                <span className="text-primary">business</span>
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-slate-400">
                Reach out for bulk quote inquiries, custom procurement, infrastructure proposals,
                and dedicated after-sales support.
              </p>
            </div>

            {/* Live status pill */}
            <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/5 px-6 py-5 backdrop-blur-sm lg:shrink-0">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
                <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Availability</p>
                <p className="mt-0.5 text-sm font-bold text-white">Active &amp; Operational 24 / 7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-shell py-14 sm:py-20">
        <h2 className="sr-only">Get in touch with NxSys Digital</h2>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">

          {/* Left — contact methods */}
          <div className="space-y-4">
            {/* Address */}
            <div className="group flex gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:gap-7 sm:p-8">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-[0_8px_24px_rgba(48,149,248,0.28)] transition-transform duration-300 group-hover:scale-105">
                <MapPin size={22} className="text-textMain" />
              </div>
              <div className="min-w-0 space-y-1.5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Our Office</h3>
                <p className="text-[15px] font-semibold leading-7 text-slate-800">
                  303, 3rd Floor, Udaya Vensar Apartments, Rd Number 1, Hanuman Nagar, Kothaguda, Kondapur, Hyderabad, Telangana 500084
                </p>
                <a
                  href="https://maps.app.goo.gl/b9sUaVidUYvMWxkK9?g_st=iw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold text-primary transition-opacity hover:opacity-70"
                >
                  Open in Maps <ArrowRight size={12} />
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="group flex gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:gap-7 sm:p-8">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-[0_8px_24px_rgba(48,149,248,0.28)] transition-transform duration-300 group-hover:scale-105">
                <Phone size={22} className="text-textMain" />
              </div>
              <div className="min-w-0 space-y-1.5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Phone</h3>
                <a
                  href="tel:+919701314138"
                  className="block text-2xl font-black text-slate-900 transition-colors hover:text-primary sm:text-3xl"
                >
                  +91 97013 14138
                </a>
                <p className="text-[12px] font-medium text-slate-400">Available for calls and WhatsApp</p>
              </div>
            </div>

            {/* Email */}
            <div className="group flex gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:gap-7 sm:p-8">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-[0_8px_24px_rgba(48,149,248,0.28)] transition-transform duration-300 group-hover:scale-105">
                <Mail size={22} className="text-textMain" />
              </div>
              <div className="min-w-0 space-y-1.5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Email</h3>
                <a
                  href="mailto:sales@nxsysdigital.com"
                  className="block break-all text-xl font-black text-slate-900 transition-colors hover:text-primary sm:text-2xl"
                >
                  sales@nxsysdigital.com
                </a>
                <p className="text-[12px] font-medium text-slate-400">We respond within 1 business day</p>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Business hours */}
            <div className="relative overflow-hidden rounded-2xl bg-textMain p-7">
              <div
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div
                className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full blur-3xl"
                style={{ background: 'rgba(48,149,248,0.1)' }}
              />
              <div className="relative space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-[0_6px_18px_rgba(48,149,248,0.3)]">
                    <Clock size={20} className="text-textMain" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Business Hours</h4>
                </div>

                <div>
                  <h5 className="text-lg font-bold text-white">Always here for you</h5>
                  <p className="mt-1 text-[13px] leading-6 text-slate-400">
                    Our team is available around the clock for enterprise partners and bulk order inquiries.
                  </p>
                </div>

                <div className="space-y-2 border-t border-white/8 pt-4">
                  {[
                    { day: 'Mon – Fri', time: '9:00 AM – 8:00 PM' },
                    { day: 'Sat – Sun', time: '10:00 AM – 6:00 PM' },
                    { day: 'Emergency Line', time: '24 / 7 Available' },
                  ].map(({ day, time }) => (
                    <div key={day} className="flex items-center justify-between text-[12px]">
                      <span className="font-semibold text-slate-400">{day}</span>
                      <span className="font-bold text-white">{time}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2.5 rounded-xl bg-white/5 px-4 py-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
                    Currently Online
                  </span>
                </div>
              </div>
            </div>

            {/* Quick note */}
            <div className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                <MessageSquare size={18} className="text-slate-400" />
              </div>
              <div>
                <h6 className="text-[12px] font-bold text-slate-700">Prefer email for bulk requests</h6>
                <p className="mt-1 text-[12px] leading-5 text-slate-400">
                  For quotes above ₹1 lakh or custom procurement, email us with your requirements and we'll respond with a tailored proposal within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
