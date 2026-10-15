import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Search, LogOut, User } from 'lucide-react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import logoDark from '../../assets/NxSys Digital Logo with Pixel Burst.png';
import { useProducts } from '@/hooks/useProducts';
import { isAdminUser } from '@/utils/access';
import { getBrandName, resolveAssetUrl } from '@/services';
import { searchApi } from '@/services';
import { useWishlist } from '@/hooks/useWishlist';

function TopHeader({ profile, handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [remoteSuggestions, setRemoteSuggestions] = useState<any[]>([]);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const { products = [], brands = [] } = useProducts() || {};
  const wishlist = useWishlist();
  const wishlistCount = wishlist?.count || 0;
  const urlSearchTerm = useMemo(
    () => new URLSearchParams(location.search).get('search') || '',
    [location.search],
  );

  useEffect(() => {
    setSearchTerm(urlSearchTerm);
  }, [urlSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmedQuery = deferredSearchTerm.trim().toLowerCase();

  useEffect(() => {
    let isMounted = true;
    if (trimmedQuery.length < 2) {
      setRemoteSuggestions([]);
      return () => { isMounted = false; };
    }
    const timer = window.setTimeout(async () => {
      try {
        const suggestions = await searchApi.autocomplete(trimmedQuery);
        if (isMounted) setRemoteSuggestions(Array.isArray(suggestions) ? suggestions : []);
      } catch {
        if (isMounted) setRemoteSuggestions([]);
      }
    }, 180);
    return () => { isMounted = false; window.clearTimeout(timer); };
  }, [trimmedQuery]);

  const searchResults = useMemo(() => {
    if (!trimmedQuery) return { products: [], suggestions: [] };
    if (!products?.length) return { products: [], suggestions: remoteSuggestions.slice(0, 6) };
    const matchedProducts = products.filter((product) => {
      const brandName = getBrandName(product.brand, brands);
      return (
        String(product.name).toLowerCase().includes(trimmedQuery) ||
        String(product.sku).toLowerCase().includes(trimmedQuery) ||
        brandName.toLowerCase().includes(trimmedQuery)
      );
    });
    const suggestSet = new Set();
    matchedProducts.forEach((product) => {
      const brandName = product.brandName || getBrandName(product.brand);
      if (brandName.toLowerCase().includes(trimmedQuery)) suggestSet.add(brandName);
      if (product.subcategory && String(product.subcategory).toLowerCase().includes(trimmedQuery)) suggestSet.add(product.subcategory);
      if (product.categoryName && String(product.categoryName).toLowerCase().includes(trimmedQuery)) suggestSet.add(product.categoryName);
    });
    return {
      products: matchedProducts.slice(0, 4),
      suggestions: Array.from(new Set([...remoteSuggestions, ...suggestSet])).slice(0, 6),
    };
  }, [trimmedQuery, products, brands, remoteSuggestions]);

  const handleSearchSubmit = (event) => {
    if (event) event.preventDefault();
    const finalQuery = searchTerm.trim();
    setIsDropdownOpen(false);
    if (!finalQuery) { navigate('/products'); return; }
    navigate(`/products?search=${encodeURIComponent(finalQuery)}`);
  };

  return (
    <div className="relative z-[70] border-b border-slate-900 bg-black">
      <div className="container-shell py-3 lg:py-4">
        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-6 xl:gap-10">

          {/* Mobile top row: logo + auth icons */}
          <div className="flex items-center justify-between w-full lg:w-auto">
            <NavLink to="/" aria-label="Home" className="group flex shrink-0 items-center">
              <img
                src={logoDark}
                alt="Nx Sys Distribution Logo"
                className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02] lg:h-[60px]"
                width="240"
                height="64"
              />
            </NavLink>

            {/* Mobile auth icons */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                to="/wishlist"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/10"
                aria-label="Wishlist"
              >
                <Heart size={17} />
                {wishlistCount ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-textMain">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                ) : null}
              </Link>
              {!profile ? (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-white transition-colors hover:text-primary"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-white transition-colors hover:opacity-90"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to={isAdminUser(profile) ? '/admin' : '/profile'}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/10"
                    title={profile.name}
                  >
                    <User size={16} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    aria-label="Sign Out"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-white transition-colors hover:border-rose-400 hover:bg-rose-500/20 hover:text-rose-300"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div ref={searchContainerRef} className="relative min-w-0 w-full lg:order-2">
            <form
              onSubmit={handleSearchSubmit}
              className="group relative flex min-h-[44px] lg:min-h-[50px] w-full overflow-hidden rounded-full border-2 border-white/20 bg-white/10 transition-all duration-300 focus-within:border-primary focus-within:bg-white/15 focus-within:shadow-[0_0_0_4px_rgba(48,149,248,0.12)]"
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search size={15} className="text-white/50 transition-colors group-focus-within:text-primary" />
              </div>
              <input
                value={searchTerm}
                onChange={(event) => {
                  startTransition(() => { setSearchTerm(event.target.value); });
                  if (!isDropdownOpen) setIsDropdownOpen(true);
                }}
                onFocus={() => { if (searchTerm.trim().length > 0) setIsDropdownOpen(true); }}
                type="text"
                placeholder="Search products, brands, SKUs..."
                className="min-w-0 flex-1 bg-transparent py-2 pl-11 pr-3 text-[13px] font-medium text-white placeholder:text-white/50 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 self-stretch rounded-r-full bg-primary px-5 lg:px-8 text-[10px] font-black uppercase tracking-[0.14em] text-white transition-colors hover:opacity-90"
              >
                Search
              </button>
            </form>

            {/* Search dropdown */}
            {isDropdownOpen && trimmedQuery.length > 0 && (
              <div className="absolute top-[108%] left-0 right-0 z-[100] mt-1 w-full flex flex-col md:flex-row overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)] divide-y md:divide-y-0 md:divide-x divide-slate-100 max-h-[70vh] md:max-h-[500px]">
                {/* Suggestions */}
                <div className="w-full md:w-[35%] bg-slate-50/60 p-4 md:p-5 hidden sm:block">
                  <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                    Suggestions
                  </h3>
                  {searchResults.suggestions.length > 0 ? (
                    <ul className="space-y-2.5">
                      {searchResults.suggestions.map((suggestion, idx) => (
                        <li key={idx}>
                          <button
                            type="button"
                            className="block w-full truncate text-left text-[13px] font-medium text-slate-700 transition-colors hover:text-primary"
                            onClick={() => {
                              setSearchTerm(suggestion);
                              setIsDropdownOpen(false);
                              navigate(`/products?search=${encodeURIComponent(suggestion)}`);
                            }}
                          >
                            {suggestion}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[12px] text-slate-400 font-medium">No suggestions.</p>
                  )}
                </div>

                {/* Products */}
                <div className="flex w-full flex-col md:w-[65%] p-4 md:p-5 bg-white">
                  <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                    Products
                  </h3>
                  <div className="flex-1 overflow-y-auto">
                    {searchResults.products.length > 0 ? (
                      <div className="space-y-3.5">
                        {searchResults.products.map((p) => (
                          <Link
                            key={p.id}
                            to={`/product/${p.id}`}
                            onClick={() => setIsDropdownOpen(false)}
                            className="group flex items-start gap-3"
                          >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1">
                              {p.image ? (
                                <img
                                  src={resolveAssetUrl(p.image) ?? undefined}
                                  alt={p.name}
                                  className="max-h-full max-w-full object-contain"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-[9px] font-black uppercase text-slate-300">N/A</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1 pt-0.5">
                              <p className="truncate text-[13px] font-semibold text-slate-900 transition-colors group-hover:text-primary">
                                {p.name}
                              </p>
                              <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {p.brandName || getBrandName(p.brand, brands)} {p.sku ? `• ${p.sku}` : ''}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[12px] font-medium text-slate-400">No matches found.</p>
                    )}
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-textMain px-5 py-2 text-[10px] font-black uppercase tracking-widest text-textMain transition-all hover:bg-textMain hover:text-white"
                    >
                      See All Results
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop auth actions */}
          <div className="hidden lg:flex lg:items-center lg:gap-3 lg:order-3">
            <Link
              to="/wishlist"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white shadow-sm transition-all hover:border-white/30 hover:bg-white/15"
              aria-label="Wishlist"
            >
              <Heart size={17} />
              {wishlistCount ? (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-black text-textMain">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              ) : null}
            </Link>

            {!profile ? (
              <>
                <NavLink
                  to="/register"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-7 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:opacity-90 min-w-[120px]"
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="inline-flex h-11 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-7 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/20 min-w-[120px]"
                >
                  Login
                </NavLink>
              </>
            ) : (
              <>
                <Link
                  to={isAdminUser(profile) ? '/admin' : '/profile'}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/20 max-w-[200px]"
                >
                  <User size={15} className="shrink-0 text-white/70" />
                  <span className="truncate">{profile.name || 'Account'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  aria-label="Sign Out"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:opacity-90"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
