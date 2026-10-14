import { NavLink } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Monitor,
  Server,
  Smartphone,
  Tag,
  Trophy,
  X,
  Laptop,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import { useCatalog } from '@/hooks/useCatalog';
import type { Category } from '@/types';
import { NAVBAR_GROUPS } from '../../utils/constants';
import { slugify } from '../../utils/helpers';
import CategoryDropdown from './category-nav/CategoryDropdown';
import MenuItem from './category-nav/MenuItem';

const DESKTOP_COLUMN_WIDTH = 210;
const DESKTOP_COLUMN_GAP = 40;
const DESKTOP_MENU_SIDE_PADDING = 48;
const DESKTOP_MENU_MIN_WIDTH = 340;
const DESKTOP_MENU_MAX_WIDTH = 1440;

function Box({ size, className = '' }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  );
}

const getCategoryIcon = (categoryName = '', navbarGroup = '') => {
  const value = `${categoryName} ${navbarGroup}`.toLowerCase();

  if (value.includes('laptop')) {
    return <Laptop size={16} />;
  }

  if (value.includes('mobile') || value.includes('phone')) {
    return <Smartphone size={16} />;
  }

  if (value.includes('monitor')) {
    return <Monitor size={16} />;
  }

  if (value.includes('enterprise') || value.includes('server')) {
    return <Server size={16} />;
  }

  if (value.includes('brand')) {
    return <Tag size={16} />;
  }

  if (value.includes('top')) {
    return <Trophy size={16} />;
  }

  return <Box size={16} />;
};

const extractNestedItems = (item: any) => item?.children ?? item?.items ?? item?.subcategories ?? [];

const normalizeNestedItems = (category: any, items: any[] = []) =>
  items.map((item) => {
    const nestedItems = extractNestedItems(item);
    const itemName = item.name || item.title || item.label || 'Unnamed item';
    const typoMap = {
      'buisiness': 'Business',
      'buisiness laptops': 'Business Laptops',
    };
    const cleanName = typoMap[itemName.toLowerCase()] || itemName;

    return {
      id: item.id ?? item.pk ?? item.slug ?? itemName,
      name: cleanName,
      path: `/products/${slugify(category.name)}/${slugify(cleanName)}`,
      children: Array.isArray(nestedItems) && nestedItems.length
        ? normalizeNestedItems(category, nestedItems)
        : [],
    };
  });

function CategoryNav() {
  const { categoryTree = [], brands = [] } = useCatalog() ?? {};
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>(null);
  const [expandedMobileSections, setExpandedMobileSections] = useState<Record<string, boolean>>({});
  const [desktopDropdownStyle, setDesktopDropdownStyle] = useState({
    left: 0,
    width: DESKTOP_MENU_MIN_WIDTH,
    pointerLeft: DESKTOP_MENU_MIN_WIDTH / 2,
    columnCount: 1,
  });
  const closeTimerRef = useRef<number | null>(null);
  const navRootRef = useRef<HTMLDivElement | null>(null);
  const navShellRef = useRef<HTMLDivElement | null>(null);
  const menuTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const megaMenuContent = useMemo(() => {
    const content: Record<string, any[]> = {};

    if (Array.isArray(categoryTree)) {
      categoryTree.forEach((group: any) => {
        const groupName = group.name;
        content[groupName] = (group.subcategories || []).map((category: any) => ({
          id: category.id,
          title: category.name,
          icon: getCategoryIcon(category.name, category.navbar_group),
          path: `/products/${slugify(category.name)}`,
          items: normalizeNestedItems(category, category.subcategories || []),
        }));
      });
    }

    // Populate Top Brands if brands exist
    const safeBrands = Array.isArray(brands) ? brands : [];
    if (safeBrands.length > 0) {
      content['Top Brands'] = [
        {
          id: 'top-brands-col',
          title: 'Global Brands',
          icon: getCategoryIcon('brand', 'Top Brands'),
          path: '/products',
          items: safeBrands.map((brand) => ({
            id: brand.id || brand.name,
            name: brand.name,
            path: `/products?brand=${encodeURIComponent(brand.name || brand.id)}`,
            children: [],
          })),
        },
      ];
    }

    return content;
  }, [categoryTree, brands]);

  const menuItems = useMemo(() => {
    const dynamicGroupNames = Object.keys(megaMenuContent);

    // Sort all dynamic groups alphabetically
    const sortedGroups = dynamicGroupNames.sort((a, b) => a.localeCompare(b));

    return sortedGroups.map((group) => ({
      name: group,
      hasDropdown: true,
      sections: megaMenuContent[group] || [],
    }));
  }, [megaMenuContent]);

  const activeSections = activeMenu ? megaMenuContent[activeMenu] || [] : [];

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const measureDesktopDropdown = useCallback((menuName) => {
    const rootRect = navRootRef.current?.getBoundingClientRect();
    const shellRect = navShellRef.current?.getBoundingClientRect();
    const triggerRect = menuTriggerRefs.current[menuName]?.getBoundingClientRect();
    const sections = megaMenuContent[menuName] || [];

    if (!rootRect || !shellRect || !triggerRect) {
      return;
    }

    const columnCount = Math.min(Math.max(sections.length || 1, 1), 10);
    const dropdownWidth = Math.min(
      Math.max(
        DESKTOP_MENU_MIN_WIDTH,
        columnCount * DESKTOP_COLUMN_WIDTH +
        Math.max(columnCount - 1, 0) * DESKTOP_COLUMN_GAP +
        DESKTOP_MENU_SIDE_PADDING,
      ),
      DESKTOP_MENU_MAX_WIDTH,
    );

    const shellOffsetLeft = shellRect.left - rootRect.left;
    const shellOffsetRight = shellRect.right - rootRect.left;
    const triggerCenter = triggerRect.left - rootRect.left + triggerRect.width / 2;
    const minLeft = shellOffsetLeft + 24;
    const maxLeft = Math.max(minLeft, shellOffsetRight - dropdownWidth);
    const left = Math.min(Math.max(triggerCenter - dropdownWidth / 2, minLeft), maxLeft);
    const pointerLeft = Math.min(Math.max(triggerCenter - left, 28), dropdownWidth - 28);

    setDesktopDropdownStyle({
      left,
      width: dropdownWidth,
      pointerLeft,
      columnCount,
    });
  }, [megaMenuContent]);

  const openDesktopMenu = (menuName) => {
    clearCloseTimer();
    if (window.innerWidth < 1024 && activeMenu === menuName) {
      setActiveMenu(null);
      return;
    }
    measureDesktopDropdown(menuName);
    setActiveMenu(menuName);
  };

  const scheduleDesktopClose = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setActiveMenu(null);
    }, 110);
  };

  useEffect(
    () => () => {
      clearCloseTimer();
    },
    [],
  );

  useEffect(() => {
    if (!activeMenu) {
      return undefined;
    }

    const handleResize = () => {
      measureDesktopDropdown(activeMenu);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeMenu, measureDesktopDropdown]);

  useEffect(() => {
    if (!isSidebarOpen) {
      document.body.style.overflow = '';
      return undefined;
    }

    const currentOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = currentOverflow;
    };
  }, [isSidebarOpen]);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setExpandedMobileGroup(null);
    setExpandedMobileSections({});
  };

  const toggleMobileGroup = (groupName) => {
    setExpandedMobileGroup((current) => (current === groupName ? null : groupName));
    setExpandedMobileSections({});
  };

  const toggleMobileSection = (sectionKey) => {
    setExpandedMobileSections((current) => ({
      ...current,
      [sectionKey]: !current[sectionKey],
    }));
  };

  const renderMobileItems = (items, level = 0) => (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id ?? `${item.name}-${level}`} className="space-y-2">
          <NavLink
            to={item.path}
            className={({ isActive }) => `block rounded-sm px-3 py-2 transition-colors ${level === 0
              ? `text-[14px] font-medium ${isActive
                ? 'bg-primary/10 text-primary'
                : 'text-textSecondary hover:bg-greyLight hover:text-textMain'
              }`
              : `text-[11px] font-normal ${isActive
                ? 'bg-primary/10 text-primary'
                : 'text-greyMedium hover:bg-greyLight hover:text-textMain'
              }`
              }`}
            style={level ? { marginLeft: `${level * 12}px` } : undefined}
            onClick={closeSidebar}
          >
            {item.name}
          </NavLink>

          {Array.isArray(item.children) && item.children.length ? renderMobileItems(item.children, level + 1) : null}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div
        ref={navRootRef}
        className="relative z-[60] border-t border-black/5 bg-primary select-none shadow-md"
        onMouseEnter={clearCloseTimer}
        onMouseLeave={scheduleDesktopClose}
      >
        <div ref={navShellRef} className="container-shell flex min-h-[44px] lg:min-h-[52px] items-stretch">
          <div className="flex min-h-[44px] lg:min-h-[52px] w-full items-stretch text-[12px] font-black uppercase tracking-wider text-white sm:text-[13px]">
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open Menu"
              className={`flex h-[44px] lg:h-[52px] items-center justify-center transition-all outline-none sm:w-[80px] sm:justify-start sm:border-r sm:border-black/10 ${isSidebarOpen ? 'bg-black/10' : 'hover:bg-black/10'
                }`}
            >
              <Menu size={28} />
              {/* <span>Menu</span> */}
            </button>

            <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto overflow-y-hidden px-2">
              {menuItems.map((item) => (
                <MenuItem
                  key={item.name}
                  label={item.name}
                  active={activeMenu === item.name}
                  buttonRef={(node) => {
                    menuTriggerRefs.current[item.name] = node;
                  }}
                  onOpen={() => openDesktopMenu(item.name)}
                />
              ))}
              <NavLink
                to="/how-to-buy"
                className="flex h-full shrink-0 items-center px-3 md:px-6 text-[12px] md:text-[14px] font-medium uppercase tracking-[0.12em] text-white whitespace-nowrap transition-all hover:bg-black/10"
              >
                How to Buy
              </NavLink>
            </div>
          </div>
        </div>

        {activeMenu ? (
          <CategoryDropdown
            groupLabel={activeMenu}
            sections={activeSections}
            onNavigate={() => setActiveMenu(null)}
            left={desktopDropdownStyle.left}
            width={desktopDropdownStyle.width}
            pointerLeft={desktopDropdownStyle.pointerLeft}
            columnCount={desktopDropdownStyle.columnCount}
          />
        ) : null}
      </div>

      {createPortal(
        <>
          {isSidebarOpen ? (
            <div
              className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm animate-in fade-in"
              onClick={closeSidebar}
            />
          ) : null}

          <div
            className={`fixed top-0 left-0 z-[9999] flex h-full w-[300px] sm:w-[340px] transform flex-col bg-white shadow-[4px_0_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
          >
            {/* Sidebar header */}
            <div className="relative flex shrink-0 items-center justify-between overflow-hidden bg-textMain px-6 py-5">
              <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.38em] text-primary">Browse</p>
                <h2 className="mt-1 text-[18px] font-black tracking-tight text-white">Global Navigation</h2>
              </div>
              <button
                onClick={closeSidebar}
                aria-label="Close Menu"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sidebar body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <NavLink
                to="/how-to-buy"
                onClick={closeSidebar}
                className={({ isActive }) => `block rounded-2xl border border-slate-100 px-4 py-3.5 text-left text-[13px] font-bold uppercase tracking-wider transition-colors ${isActive ? 'bg-primary/5 text-primary' : 'bg-white text-textMain hover:bg-slate-50'}`}
              >
                How to Buy
              </NavLink>
              {menuItems.map((item) => {
                const isOpen = expandedMobileGroup === item.name;
                const sections = item.sections;

                return (
                  <div key={item.name} className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between px-4 py-3.5 text-left text-[13px] font-bold uppercase tracking-wider transition-colors ${isOpen ? 'bg-primary/5 text-primary' : 'text-textMain hover:bg-slate-50'}`}
                      onClick={() => toggleMobileGroup(item.name)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : 'text-slate-400'}`}
                      />
                    </button>

                    {isOpen ? (
                      <div className="space-y-1.5 border-t border-slate-100 bg-slate-50/60 p-3">
                        {sections.length ? (
                          sections.map((section) => {
                            const sectionKey = `${item.name}-${section.id}`;
                            const sectionOpen = Boolean(expandedMobileSections[sectionKey]);

                            return (
                              <div key={section.id} className="overflow-hidden rounded-xl border border-slate-100 bg-white">
                                <button
                                  type="button"
                                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                                  onClick={() => toggleMobileSection(sectionKey)}
                                  aria-expanded={sectionOpen}
                                >
                                  <span className="text-[12px] font-semibold text-textMain">
                                    {section.title}
                                  </span>
                                  <ChevronRight
                                    size={14}
                                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${sectionOpen ? 'rotate-90 text-primary' : ''}`}
                                  />
                                </button>

                                {sectionOpen ? (
                                  <div className="border-t border-slate-100 px-3 py-2">
                                    {section.items.length ? (
                                      renderMobileItems(section.items)
                                    ) : (
                                      <div className="space-y-2">
                                        <NavLink
                                          to={section.path}
                                          className={({ isActive }) => `block rounded-xl px-3 py-2 text-[12px] font-semibold transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-textMain'}`}
                                          onClick={closeSidebar}
                                        >
                                          View all {section.title}
                                        </NavLink>
                                        <p className="px-3 text-[10px] font-semibold text-slate-400">
                                          No subcategories available
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })
                        ) : (
                          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-[12px] font-medium normal-case text-slate-400">
                            Categories will appear once catalog data is loaded.
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

export default memo(CategoryNav);
