import { Boxes, FolderTree, LayoutDashboard, Package, ReceiptText, MessageSquare, Newspaper } from 'lucide-react';

export const adminNavItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: Boxes },
  { label: 'Inventory', path: '/admin/inventory', icon: Package },
  { label: 'Categories', path: '/admin/categories', icon: FolderTree },
  { label: 'Blogs', path: '/admin/blogs', icon: Newspaper },
  { label: 'Price Requests', path: '/admin/rfq', icon: ReceiptText },
  { label: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
];

export const getParentCategoryId = (category: any) => category?.parent?.id ?? category?.parent_id ?? category?.parent ?? null;
export const isTopLevelCategory = (category: any) => !getParentCategoryId(category);
export const getTopLevelCategories = (categories: any[] = []) => categories.filter((category) => isTopLevelCategory(category));
export const getSubcategories = (categories: any[] = [], parentId: any) => categories.filter((category) => String(getParentCategoryId(category)) === String(parentId));

export const normalizeRequestStatus = (status: any) => String(status || 'pending').trim().toLowerCase();
export const formatRequestStatus = (status: any) => {
  const norm = normalizeRequestStatus(status);
  return norm === 'quote_sent' ? 'Quote Sent' : (norm.charAt(0).toUpperCase() + norm.slice(1));
};

export const getRequestStatusClasses = (status: any) => {
  const norm = normalizeRequestStatus(status);
  if (norm === 'quote_sent') return 'bg-blue-50 text-blue-700 border-blue-100';
  if (norm === 'closed') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  return 'bg-primary/10 text-primary border-primary/20';
};

export const formatAdminDate = (value: any) => {
  if (!value) return 'Recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};
