import { useEffect, useState } from 'react';
import { getDashboardData, reviewApi } from '@/services';
import { getApiErrorMessage } from '@/services';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { formatRequestStatus, getRequestStatusClasses, formatAdminDate } from '@/utils/admin';
import {
  Users, ShoppingBag, Package, TrendingUp, Star, User,
  Heart, BarChart2, Tag, Eye, Sparkles, AlertTriangle, RefreshCw, Zap,
} from 'lucide-react';

const roundedTopBar = (x: number, y: number, w: number, h: number, r: number): string => {
  const cr = Math.min(r, h, w / 2);
  return `M ${x + cr},${y} H ${x + w - cr} Q ${x + w},${y} ${x + w},${y + cr} V ${y + h} H ${x} V ${y + cr} Q ${x},${y} ${x + cr},${y} Z`;
};

const CircleRing = ({ pct, color, size = 66, stroke = 5 }: { pct: number; color: string; size?: number; stroke?: number }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const filled = circ * (pct / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${filled} ${circ - filled}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 5px ${color}99)` }}
      />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="sans-serif">
        {Math.round(pct)}%
      </text>
    </svg>
  );
};

const MarketplacePulseChart = ({ counts, inventory, customers, wishlists }: { counts: any; inventory: any; customers: any; wishlists: any }) => {
  const metrics = [
    { label: 'Categories', val: counts.total_categories || 0, from: '#818cf8', to: '#4338ca' },
    { label: 'Products',   val: counts.total_products   || 0, from: '#38bdf8', to: '#0369a1' },
    { label: 'Stock',      val: inventory.total_stock_items || 0, from: '#34d399', to: '#047857' },
    { label: 'Wishlists',  val: wishlists.total_wishlists || 0, from: '#fb7185', to: '#be123c' },
    { label: 'Customers',  val: customers.total_users   || 0, from: '#c084fc', to: '#6d28d9' },
    { label: 'Requests',   val: counts.total_requests   || 0, from: '#3095F8', to: '#1e40af' },
  ];
  const svgW = 580, svgH = 210, padL = 40, padR = 12, padT = 28, padB = 34;
  const chartW = svgW - padL - padR, chartH = svgH - padT - padB;
  const n = metrics.length, barW = 52, gap = (chartW - n * barW) / (n + 1);
  const max = Math.max(...metrics.map(m => m.val), 10);
  const bx = (i: number) => padL + gap + i * (barW + gap);
  const bh = (val: number) => Math.max((val / max) * chartH, 3);
  const by = (val: number) => padT + chartH - bh(val);
  const fmtY = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`;

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/[0.07]"
      style={{ background: 'linear-gradient(140deg,#080e20 0%,#060c18 100%)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04),0 28px 70px rgba(0,0,0,0.45)' }}>
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.045) 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 12% -5%,rgba(99,102,241,0.16) 0%,transparent 65%)' }} />
      <div className="relative p-6 pb-5">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.35em] text-slate-500">Live Dashboard</span>
            </div>
            <h3 className="text-[22px] font-black leading-none tracking-tight text-white">Platform Analytics</h3>
            <p className="mt-1 text-[11px] font-medium text-slate-500">Real-time marketplace health overview</p>
          </div>
          <div className="flex max-w-[220px] flex-wrap justify-end gap-1.5">
            {metrics.map((m, i) => (
              <div key={i} className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: m.from }} />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ height: 210 }}>
          <defs>
            {metrics.map((m, i) => (
              <linearGradient key={i} id={`ppg-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={m.from} stopOpacity="1" />
                <stop offset="100%" stopColor={m.to} stopOpacity="0.72" />
              </linearGradient>
            ))}
            <filter id="ppglow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
            const gy = padT + chartH - p * chartH;
            return (
              <g key={idx}>
                <line x1={padL} y1={gy} x2={svgW - padR} y2={gy} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray={p === 0 ? '0' : '3 6'} />
                <text x={padL - 6} y={gy + 3.5} textAnchor="end" fill="rgba(255,255,255,0.18)" fontSize="8.5">{fmtY(Math.round(max * p))}</text>
              </g>
            );
          })}
          {metrics.map((m, i) => {
            const x = bx(i), h = bh(m.val), y = by(m.val), cx = x + barW / 2;
            return (
              <g key={i}>
                <path d={roundedTopBar(x + 5, y + 5, barW - 10, h, 5)} fill={m.from} opacity="0.2" filter="url(#ppglow)" />
                <path d={roundedTopBar(x, y, barW, h, 8)} fill={`url(#ppg-${i})`} />
                {h > 14 && <path d={roundedTopBar(x + 6, y + 2, barW - 12, Math.min(h - 4, 5), 3)} fill="rgba(255,255,255,0.18)" />}
                <text x={cx} y={y - 8} textAnchor="middle" fill="rgba(255,255,255,0.82)" fontSize="10" fontWeight="800">{m.val.toLocaleString()}</text>
                <text x={cx} y={svgH - 3} textAnchor="middle" fill="rgba(255,255,255,0.26)" fontSize="8" fontWeight="700" letterSpacing="0.1em">{m.label.toUpperCase()}</text>
              </g>
            );
          })}
          <line x1={padL} y1={padT + chartH} x2={svgW - padR} y2={padT + chartH} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};

/* ── Tiny helpers ── */
const Kpi = ({
  label, value, sub, icon, color = 'slate',
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ReactNode; color?: string;
}) => {
  const bg: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-500',
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-primary/10 text-primary',
    rose: 'bg-rose-50 text-rose-600',
    violet: 'bg-violet-50 text-violet-600',
  };
  return (
    <div className="surface-panel flex items-center gap-4 p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${bg[color]}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className="mt-0.5 truncate text-2xl font-black text-slate-900">{value}</p>
        {sub && <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400">{sub}</p>}
      </div>
    </div>
  );
};

const SectionHeader = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="mb-4 flex items-center gap-3">
    <div className="h-[3px] w-4 rounded-full bg-primary" />
    <h2 className="text-[13px] font-black uppercase tracking-tight text-slate-800">{title}</h2>
    <div className="h-px flex-1 bg-slate-100" />
    {sub && <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{sub}</span>}
  </div>
);

const StarBar = ({ label, count, total }: { label: string; count: number; total: number }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-6 shrink-0 text-right text-[11px] font-bold text-slate-500">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-slate-100" style={{ height: 6 }}>
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-7 shrink-0 text-right text-[11px] font-bold text-slate-400">{count}</span>
    </div>
  );
};

const MetricRow = ({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) => (
  <div className="flex items-center justify-between border-b border-slate-50 py-2.5 last:border-0">
    <span className="text-[12px] font-medium text-slate-500">{label}</span>
    <span className={`text-[13px] font-black ${accent ? 'text-primary' : 'text-slate-800'}`}>{value}</span>
  </div>
);

/* ── Main page ── */
function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboardData, reviewsData] = await Promise.all([
        getDashboardData(),
        reviewApi.getReviews(),
      ]);
      setData(dashboardData);
      setRecentReviews(
        Array.isArray(reviewsData)
          ? reviewsData.slice(0, 5)
          : (reviewsData?.results?.slice(0, 5) || []),
      );
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load dashboard'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-700">
        <p className="text-lg font-black text-rose-900">Unable to load dashboard</p>
        <p className="mt-2 text-[13px]">{error}</p>
        <button
          onClick={loadDashboard}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-800 hover:bg-rose-200"
        >
          <RefreshCw size={13} /> Try Again
        </button>
      </div>
    );
  }

  /* ── Data destructuring ── */
  const summary    = data?.summary    || {};
  const counts     = summary.counts   || {};
  const alerts     = summary.alerts   || {};
  const perf       = summary.performance || {};
  const recent     = summary.recent   || {};
  const sales      = data?.sales      || {};
  const customers  = data?.customers  || {};
  const reviews    = data?.reviews    || {};
  const wishlists  = data?.wishlists  || {};
  const inventory  = data?.inventory  || {};

  const lowStockProducts = alerts.low_stock_products || [];
  const recentRequests   = recent.requests || [];
  const topSelling       = perf.top_selling || [];
  const topRated         = perf.top_rated   || [];
  const totalReviews     = reviews.total_reviews || 0;

  return (
    <div className="space-y-10 pb-12">
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Real-time snapshot of your catalog, customers, inventory, and engagement."
      />

      {/* ── Chart + Daily Momentum ── */}
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <MarketplacePulseChart
            counts={counts}
            inventory={inventory}
            customers={customers}
            wishlists={data?.wishlists || {}}
          />
        </div>
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/[0.06] p-5 text-white"
          style={{ background: 'linear-gradient(150deg,#0d1117 0%,#090e1a 100%)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04),0 28px 60px rgba(0,0,0,0.4)', minHeight: 280 }}>
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 55% at 50% -10%,rgba(48,149,248,0.1) 0%,transparent 70%)' }} />
          <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.035) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative">
            <Zap className="mb-3 text-primary" size={20} />
            <p className="mb-1 text-[9px] font-black uppercase tracking-[0.35em] text-slate-500">Daily Momentum</p>
            <p className="text-[44px] font-black leading-none tabular-nums text-white">{customers.active_today || 0}</p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Active Users Today</p>
          </div>
          <div className="relative border-t border-white/[0.07] pt-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="mb-0.5 text-[9px] font-black uppercase tracking-widest text-slate-500">Weekly Active</p>
                <p className="text-base font-black leading-tight text-white">{customers.active_this_week || 0} users</p>
                <p className="mt-0.5 text-[10px] text-slate-600">This week</p>
              </div>
              <CircleRing
                pct={customers.total_users > 0 ? Math.round((customers.active_this_week / customers.total_users) * 100) : 0}
                color="#facc15"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Top KPIs ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 2xl:grid-cols-6">
        <Kpi label="Products"   value={counts.total_products   || 0} sub={`${counts.total_categories || 0} categories`}  icon={<ShoppingBag size={18} />} color="slate"  />
        <Kpi label="Customers"  value={customers.total_users   || 0} sub={`${customers.new_users_today || 0} joined today`} icon={<Users size={18} />}      color="blue"   />
        <Kpi label="RFQs"       value={counts.total_requests   || 0} sub={`${counts.pending_requests  || 0} pending`}     icon={<TrendingUp size={18} />}  color="amber"  />
        <Kpi label="Inventory"  value={inventory.total_stock_quantity?.toLocaleString() || 0} sub={`${inventory.out_of_stock || 0} out of stock`} icon={<Package size={18} />} color="emerald" />
        <Kpi label="Avg Rating" value={reviews.average_rating ? Number(reviews.average_rating).toFixed(1) : '—'} sub={`${totalReviews} reviews`} icon={<Star size={18} />} color="amber" />
        <Kpi label="Wishlists"  value={wishlists.total_wishlists || 0} sub={`${wishlists.total_items || 0} total items`} icon={<Heart size={18} />} color="rose" />
      </div>

      {/* ── Sales & Inventory ── */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Sales highlights */}
        <div className="surface-panel p-5">
          <div className="mb-4 flex items-center gap-2">
            <Tag size={15} className="text-primary" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Sales Highlights</h3>
          </div>
          <MetricRow label="Total Products"    value={sales.total_products    || 0} />
          <MetricRow label="Featured Products" value={sales.featured_products || 0} accent />
          <MetricRow label="New Arrivals"      value={sales.new_arrivals      || 0} accent />
          <MetricRow label="Top Selling"       value={sales.top_selling       || 0} />
          <MetricRow label="Most Viewed"       value={sales.most_viewed       || '—'} />
          <MetricRow label="Least Viewed"      value={sales.least_viewed      || '—'} />
        </div>

        {/* Inventory */}
        <div className="surface-panel p-5">
          <div className="mb-4 flex items-center gap-2">
            <Package size={15} className="text-emerald-600" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Inventory Status</h3>
          </div>
          <MetricRow label="Total Stock Items"    value={inventory.total_stock_items     || 0} />
          <MetricRow label="Total Stock Qty"      value={(inventory.total_stock_quantity || 0).toLocaleString()} accent />
          <MetricRow label="Low Stock"            value={inventory.low_stock             || 0} />
          <div className="mt-3 flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-rose-500" />
              <span className="text-[11px] font-bold text-rose-600">Out of Stock</span>
            </div>
            <span className="text-xl font-black text-rose-600">{inventory.out_of_stock || 0}</span>
          </div>
        </div>

        {/* Wishlist */}
        <div className="surface-panel p-5">
          <div className="mb-4 flex items-center gap-2">
            <Heart size={15} className="text-rose-500" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Wishlist Insights</h3>
          </div>
          <MetricRow label="Total Wishlists"       value={wishlists.total_wishlists      || 0} />
          <MetricRow label="Total Wishlist Items"  value={wishlists.total_items          || 0} accent />
          <MetricRow label="Avg Wishlist Size"     value={wishlists.average_wishlist_size != null ? Number(wishlists.average_wishlist_size).toFixed(1) : '—'} />
          <MetricRow label="Most Wishlisted"       value={wishlists.most_wishlisted_product || '—'} />
        </div>
      </div>

      {/* ── Customers & Reviews ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Customer engagement */}
        <div className="surface-panel p-5">
          <div className="mb-5 flex items-center gap-2">
            <Users size={15} className="text-blue-600" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Customer Engagement</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { period: 'Today',   active: customers.active_today       || 0, new: customers.new_users_today      || 0 },
              { period: 'Week',    active: customers.active_this_week   || 0, new: customers.new_users_this_week  || 0 },
              { period: 'Month',   active: customers.active_this_month  || 0, new: customers.new_users_this_month || 0 },
            ].map(({ period, active, new: newU }) => (
              <div key={period} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{period}</p>
                <p className="mt-1 text-xl font-black text-blue-600">{active}</p>
                <p className="text-[9px] font-bold text-slate-400">active</p>
                <div className="my-2 h-px bg-slate-200" />
                <p className="text-base font-black text-emerald-600">{newU}</p>
                <p className="text-[9px] font-bold text-slate-400">new users</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews breakdown */}
        <div className="surface-panel p-5">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 size={15} className="text-primary" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Review Breakdown</h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-slate-900">{reviews.average_rating ? Number(reviews.average_rating).toFixed(1) : '—'}</p>
              <p className="text-[10px] font-bold text-slate-400">{totalReviews} reviews · {reviews.verified_reviews || 0} verified</p>
            </div>
          </div>
          <div className="space-y-2.5">
            <StarBar label="5★" count={reviews.five_star  || 0} total={totalReviews} />
            <StarBar label="4★" count={reviews.four_star  || 0} total={totalReviews} />
            <StarBar label="3★" count={reviews.three_star || 0} total={totalReviews} />
            <StarBar label="2★" count={reviews.two_star   || 0} total={totalReviews} />
            <StarBar label="1★" count={reviews.one_star   || 0} total={totalReviews} />
          </div>
        </div>
      </div>

      {/* ── Top Products ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Top Rated */}
        <div className="surface-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star size={15} className="text-primary" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Top Rated Products</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">By Rating</span>
          </div>
          {topRated.length > 0 ? (
            <div className="space-y-2">
              {topRated.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-black text-primary">#{i + 1}</span>
                  <p className="min-w-0 flex-1 truncate text-[13px] font-semibold text-slate-800">{item.name}</p>
                  <div className="flex items-center gap-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-black text-primary">{item.rating || '5.0'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 text-center">
              <Star size={28} className="mb-2 text-slate-200" />
              <p className="text-[12px] font-semibold text-slate-400">No rated products yet</p>
            </div>
          )}
        </div>

        {/* Top Selling */}
        <div className="surface-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-primary" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Top Selling Products</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">By Volume</span>
          </div>
          {topSelling.length > 0 ? (
            <div className="space-y-2">
              {topSelling.map((item: any, i: number) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-black text-textMain">#{i + 1}</span>
                    <p className="min-w-0 flex-1 truncate text-[13px] font-semibold text-slate-800">{item.name}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(10, 100 - i * 20)}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{Math.max(10, 100 - i * 20)}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 text-center">
              <Eye size={28} className="mb-2 text-slate-200" />
              <p className="text-[12px] font-semibold text-slate-400">No sales data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Watchlists ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Low stock */}
        <div className="space-y-3">
          <SectionHeader title="Stock Alerts" sub="Low / Out of stock" />
          <AdminDataTable
            tableFixed
            columns={[
              {
                key: 'name', label: 'Product', width: '70%',
                render: (row) => (
                  <div className="py-1">
                    <p className="truncate text-[13px] font-semibold text-slate-900">{row.name || row.product_name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{row.brand || 'General'}</p>
                  </div>
                ),
              },
              {
                key: 'stock', label: 'Qty', width: '30%',
                headerClassName: 'text-right', cellClassName: 'text-right',
                render: (row) => {
                  const stock = Number(row.stock || 0);
                  return (
                    <span className={`inline-flex rounded-lg border px-2.5 py-1 text-[11px] font-black ${stock === 0 ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-primary/20 bg-primary/10 text-primary'}`}>
                      {stock === 0 ? 'Out' : stock}
                    </span>
                  );
                },
              },
            ]}
            rows={lowStockProducts}
            emptyText="No stock alerts. All products are well stocked."
            minWidthClassName="min-w-[300px]"
          />
        </div>

        {/* Recent requests */}
        <div className="space-y-3">
          <SectionHeader title="Recent RFQs" sub="Inbound leads" />
          <AdminDataTable
            tableFixed
            columns={[
              {
                key: 'name', label: 'Lead', width: '40%',
                render: (row) => <p className="truncate text-[13px] font-semibold text-slate-900">{row.name}</p>,
              },
              {
                key: 'product', label: 'Product', width: '35%',
                render: (row) => <p className="truncate text-[12px] text-slate-500">{row.product || row.product_name}</p>,
              },
              {
                key: 'status', label: 'Status', width: '25%',
                headerClassName: 'text-right', cellClassName: 'text-right',
                render: (row) => (
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${getRequestStatusClasses(row.status)}`}>
                    {formatRequestStatus(row.status)}
                  </span>
                ),
              },
            ]}
            rows={recentRequests}
            emptyText="No recent RFQs received."
            minWidthClassName="min-w-[300px]"
          />
        </div>
      </div>

      {/* ── Recent Reviews ── */}
      <div className="space-y-3">
        <SectionHeader title="Latest Reviews" sub="Customer feedback" />
        <AdminDataTable
          tableFixed
          columns={[
            {
              key: 'user', label: 'Customer', width: '22%',
              render: (row) => (
                <div className="flex items-center gap-2.5 py-1">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <User size={13} />
                  </div>
                  <p className="truncate text-[13px] font-bold text-slate-800">{row.username || 'Anonymous'}</p>
                </div>
              ),
            },
            {
              key: 'rating', label: 'Rating', width: '14%',
              render: (row) => (
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={11} className={s <= row.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                  ))}
                </div>
              ),
            },
            {
              key: 'comment', label: 'Review', width: '44%',
              render: (row) => (
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-slate-900">{row.title || 'Review'}</p>
                  <p className="truncate text-[11px] text-slate-500">{row.comment || ''}</p>
                </div>
              ),
            },
            {
              key: 'date', label: 'Posted', width: '20%',
              headerClassName: 'text-right', cellClassName: 'text-right',
              render: (row) => (
                <span className="text-[11px] font-bold text-slate-400">{formatAdminDate(row.created_at)}</span>
              ),
            },
          ]}
          rows={recentReviews}
          emptyText="No customer reviews yet."
          minWidthClassName="min-w-[700px]"
        />
      </div>
    </div>
  );
}

export default AdminDashboardPage;
