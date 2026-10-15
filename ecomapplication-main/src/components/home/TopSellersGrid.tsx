import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HomeProductCard from './HomeProductCard';

function TopSellersGrid({
  products = [] as any[],
  loading = false,
  error = '',
}: {
  products?: any[];
  loading?: boolean;
  error?: string;
}) {
  const SectionHeader = () => (
    <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pb-8">
      <div className="max-w-xl">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="h-1 w-5 rounded-full bg-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            Most Popular
          </p>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
          Top Selling Products
        </h2>
      </div>
      <Link
        to="/products"
        className="group inline-flex items-center gap-3 rounded-full border-2 border-slate-900 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-900 transition-all hover:bg-slate-900 hover:text-white shrink-0"
      >
        <span>View Full Catalog</span>
        <ArrowRight size={13} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );

  if (loading) {
    return (
      <section className="bg-slate-50 py-12 sm:py-16 md:py-20">
        <div className="container-shell space-y-8">
          <SectionHeader />
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-24 text-center text-sm font-bold uppercase tracking-widest text-slate-400">
            Refreshing Top Sellers…
          </div>
        </div>
      </section>
    );
  }

  if (error || !products.length) {
    return (
      <section className="bg-slate-50 py-12 sm:py-16 md:py-20">
        <div className="container-shell space-y-8">
          <SectionHeader />
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-24 text-center text-sm font-bold uppercase tracking-widest text-slate-400">
            {error || 'No trending products available'}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-12 sm:py-16 md:py-20">
      <div className="container-shell space-y-8 sm:space-y-10">
        <SectionHeader />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id || product.sku}>
              <HomeProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(TopSellersGrid);
