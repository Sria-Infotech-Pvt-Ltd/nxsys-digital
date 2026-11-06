import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import { isAdminUser, resolveUserRole, logger, NAVBAR_GROUPS, buildSpecificationSections } from '@/utils';
import { showToast } from '@/utils/helpers';

// ---------------------------------------------------------------------------
// 1. BASE UTILS & CONSTANTS (Must be first to avoid ReferenceErrors)
// ---------------------------------------------------------------------------
const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z\d+.-]*:)?\/\//i;
const AUTH_STORAGE_KEY = 'auth_session';
// Legacy key: refresh tokens now live in an httpOnly cookie; kept only to purge old sessions.
const LEGACY_REFRESH_KEY = 'auth_refresh';
const TEMP_EMAIL_KEY = 'nxsys_temp_email';
const TEMP_PWD_RESET_KEY = 'nxsys_temp_pwd_reset';

export const normalizeBaseUrl = (value: string | undefined | null) => {
  if (!value) return '/api';
  const normalizedValue = value.endsWith('/') && value !== '/' ? value.slice(0, -1) : value;
  return normalizedValue === '/' ? '' : normalizedValue;
};

export const authSessionStorage = {
  getToken: () => localStorage.getItem(AUTH_STORAGE_KEY),
  getUser: () => {
    try {
      const user = localStorage.getItem('auth_user');
      return user ? JSON.parse(user) : null;
    } catch { return null; }
  },
  setSession: (token: string, user: any) => {
    localStorage.setItem(AUTH_STORAGE_KEY, token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.removeItem(LEGACY_REFRESH_KEY);
  },
  clearSession: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(LEGACY_REFRESH_KEY);
    localStorage.removeItem('auth_user');
  }
};

const sessionGet = (key: string) => { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; } };
const sessionSet = (key: string, value: any) => { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { } };
const sessionDel = (key: string) => { try { sessionStorage.removeItem(key); } catch { } };

// ---------------------------------------------------------------------------
// 2. AXIOS INSTANCE CREATION
// ---------------------------------------------------------------------------
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
  return normalizeBaseUrl(envUrl);
};

const commonConfig = {
  baseURL: getBaseUrl(),
  timeout: 60000,
  // Refresh token is an httpOnly cookie; the browser only sends/accepts it with credentials on.
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  // Custom serializer to remove the "[]" from array parameters (e.g., categories=1&categories=2)
  paramsSerializer: (params: any) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  }
};

// Authenticated instance
export const api: AxiosInstance = axios.create(commonConfig);

// Public instance
export const publicApi: AxiosInstance = axios.create(commonConfig);

// Interceptors
api.interceptors.request.use((config) => {
  const token = authSessionStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const shouldSkipRefresh = (url: string) =>
  url.includes('/login/') || url.includes('/token/refresh/') || url.includes('/register/');

// Single in-flight refresh promise shared across all concurrent 401s
let _refreshPromise: Promise<string> | null = null;
const getRefreshedToken = (): Promise<string> => {
  if (!_refreshPromise) {
    _refreshPromise = axios
      .post(`${getBaseUrl()}/accounts/token/refresh/`, {}, { withCredentials: true })
      .then((res) => {
        const newToken: string = res.data.access;
        const user = authSessionStorage.getUser();
        authSessionStorage.setSession(newToken, user);
        return newToken;
      })
      .finally(() => { _refreshPromise = null; });
  }
  return _refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (axiosError) => {
    const originalRequest = axiosError.config ?? ({} as InternalAxiosRequestConfig & { _retry?: boolean });
    const status = axiosError.response?.status;
    const errorData = axiosError.response?.data as any;
    const isTokenExpired = status === 401 || (errorData?.code === 'token_not_valid');

    if (isTokenExpired && !originalRequest._retry && !shouldSkipRefresh(originalRequest.url ?? '')) {
      originalRequest._retry = true;
      try {
        const newToken = await getRefreshedToken();
        const headers = { ...originalRequest.headers, Authorization: `Bearer ${newToken}` };
        return api({ ...originalRequest, headers });
      } catch (err) {
        authSessionStorage.clearSession();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    // Global error notification for submissions (POST, PUT, PATCH, DELETE)
    const method = axiosError.config?.method?.toLowerCase();
    const isMutation = ['post', 'put', 'patch', 'delete'].includes(method || '');
    const skipToast = (axiosError.config as any)?.skipGlobalToast;

    if (!axios.isCancel(axiosError) && !isTokenExpired && isMutation && !skipToast) {
      showToast({
        title: 'Submission Error',
        message: getApiErrorMessage(axiosError),
        type: 'error'
      });
    }

    return Promise.reject(axiosError);
  }
);

publicApi.interceptors.response.use(
  (response) => response,
  (axiosError) => {
    const method = axiosError.config?.method?.toLowerCase();
    const isMutation = ['post', 'put', 'patch', 'delete'].includes(method || '');
    const skipToast = (axiosError.config as any)?.skipGlobalToast;

    if (!axios.isCancel(axiosError) && isMutation && !skipToast) {
      showToast({
        title: 'Submission Error',
        message: getApiErrorMessage(axiosError),
        type: 'error'
      });
    }
    return Promise.reject(axiosError);
  }
);

// ---------------------------------------------------------------------------
// 3. API SERVICES & HELPERS
// ---------------------------------------------------------------------------
export const unwrapResponse = (response: any) => response?.data ?? response ?? null;

export const getApiErrorMessage = (error: any, fallback = 'Request failed'): string => {
  const data = error?.response?.data ?? error?.data;
  if (!data) return error?.message || fallback;
  if (typeof data === 'string') return data.trim() || fallback;

  const walk = (node: any, path: string[] = []): string | null => {
    if (node == null) return null;
    if (typeof node === 'string') {
      const label = path.length ? `${path.join('.')}: ` : '';
      return `${label}${node}`;
    }
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) {
        const found = walk(node[i], path);
        if (found) return found;
      }
      return null;
    }
    if (typeof node === 'object') {
      for (const key of ['detail', 'error', 'message', 'non_field_errors', 'msg']) {
        if (key in node) {
          const found = walk((node as any)[key], path);
          if (found) return found;
        }
      }
      for (const [key, value] of Object.entries(node)) {
        if (['detail', 'error', 'message', 'non_field_errors', 'msg'].includes(key)) continue;
        const found = walk(value, [...path, key]);
        if (found) return found;
      }
    }
    return null;
  };

  return walk(data) || fallback;
};

export const getNormalizedApiError = (error: any, _options?: any) => {
  const data = error?.response?.data || error?.data;
  const status = error?.response?.status || 0;
  const fieldErrors: Record<string, string[]> = {};
  if (data && typeof data === 'object') {
    Object.entries(data).forEach(([k, v]) => {
      if (Array.isArray(v)) fieldErrors[k] = v.map(String);
    });
  }
  const type = status >= 500 ? 'server' : status === 401 || status === 403 ? 'auth' : 'validation';
  return { message: getApiErrorMessage(error, _options?.fallbackMessage), status, data, fieldErrors, type };
};

// --- NORMALIZERS ---
let cachedAssetBaseUrl: string | null = null;
const getAssetBaseUrl = () => {
  if (cachedAssetBaseUrl !== null) return cachedAssetBaseUrl;
  const basePath = getBaseUrl();
  if (typeof window !== 'undefined' && basePath && !ABSOLUTE_URL_PATTERN.test(basePath)) {
    cachedAssetBaseUrl = window.location.origin;
    return cachedAssetBaseUrl;
  }
  cachedAssetBaseUrl = basePath || (typeof window !== 'undefined' ? window.location.origin : '');
  return cachedAssetBaseUrl;
};

export const resolveAssetUrl = (value: any) => {
  if (!value) return null;
  const rawValue = String(value).trim();
  if (!rawValue) return null;
  if (ABSOLUTE_URL_PATTERN.test(rawValue)) return rawValue;

  const baseUrl = getAssetBaseUrl();
  const cleanValue = rawValue.startsWith('/') ? rawValue : `/media/${rawValue}`;
  return `${baseUrl}${cleanValue}`;
};

export const getEntityId = (value: any) => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'object') return value.id ?? value.pk ?? value.slug ?? null;
  return value;
};

export const extractList = (payload: any) => {
  const data = unwrapResponse(payload);
  return Array.isArray(data) ? data : (data?.results || data?.items || []);
};

/**
 * Recursively converts a nested object/array into FormData.
 *
 * Rules:
 *  - Files at any depth are appended as-is.
 *  - A flat array of Files is appended with the SAME key repeated
 *    (DRF ListField / `getlist()` style). e.g. `uploaded_images` x N.
 *  - Mixed/object arrays use bracketed indices: `items[0][name]`.
 */
export const toFormData = (payload: Record<string, any>) => {
  const formData = new FormData();

  const appendRecursive = (data: any, prefix: string) => {
    if (data === null || data === undefined) return;

    if (data instanceof File || data instanceof Blob) {
      formData.append(prefix, data);
      return;
    }

    if (Array.isArray(data)) {
      // Flat array of Files -> repeat the key (DRF ListField style)
      const allFiles = data.length > 0 && data.every(item => item instanceof File || item instanceof Blob);
      if (allFiles) {
        data.forEach(file => formData.append(prefix, file));
        return;
      }
      data.forEach((item, index) => {
        appendRecursive(item, `${prefix}[${index}]`);
      });
      return;
    }

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        const fullKey = prefix ? `${prefix}[${key}]` : key;
        appendRecursive(value, fullKey);
      });
      return;
    }

    if (typeof data === 'boolean') {
      formData.append(prefix, data ? 'true' : 'false');
      return;
    }

    formData.append(prefix, String(data));
  };

  appendRecursive(payload, '');
  return formData;
};

export const PRODUCT_FLAGS = [
  { key: 'featured', label: 'Featured' },
  { key: 'top_selling', label: 'Top Selling' },
  { key: 'new_arrival', label: 'New Arrival' },
];

export const extractAuthData = (payload: any) => {
  const data = unwrapResponse(payload);
  const token = data?.access || data?.token || null;
  return { ...data, token, admin: data?.user || null };
};

const extractParentId = (parent: any): any => {
  if (parent == null) return null;
  if (typeof parent === 'object') return parent.id ?? null;
  return parent;
};

export const normalizeCategory = (category: any) => {
  if (!category || typeof category !== 'object') return category;
  const id = category.id ?? category.pk;
  const parent = extractParentId(category.parent);
  return {
    ...category,
    id,
    parent,
    name: category.name || 'Unnamed category',
    navbar_group: category.navbar_group || category.navbarGroup || null,
    image: resolveAssetUrl(category.image),
    subcategories: Array.isArray(category.subcategories)
      ? category.subcategories.map((s: any) => normalizeSubcategory(s, id)).filter(Boolean)
      : []
  };
};

export const normalizeSubcategory = (subcategory: any, fallbackCategoryId: any = null) => {
  if (!subcategory || typeof subcategory !== 'object') return subcategory;
  const parentId = extractParentId(subcategory.parent);
  return {
    ...subcategory,
    id: subcategory.id ?? subcategory.pk,
    name: subcategory.name || 'Unnamed subcategory',
    parent: parentId,
    category_id: parentId ?? fallbackCategoryId,
    image: resolveAssetUrl(subcategory.image)
  };
};

export const normalizeProduct = (product: any, catalog: any = {}) => {
  if (!product) return null;

  // Extract all possible images from various fields
  const sourceList: any[] = [];

  if (Array.isArray(product.images)) {
    sourceList.push(...product.images);
  } else if (product.images) {
    sourceList.push(product.images);
  }

  if (product.product_image) sourceList.push(product.product_image);
  if (product.image) sourceList.push(product.image);

  // Normalize and resolve URLs, keeping only unique ones
  const seenUrls = new Set<string>();
  let normalizedImages = sourceList
    .map((img: any) => {
      // Extract URL string from string or various object keys
      const url = typeof img === 'string' ? img : (img?.image_url || img?.image || img?.url || img?.src);
      const resolved = resolveAssetUrl(url);
      if (!resolved || seenUrls.has(resolved)) return null;

      seenUrls.add(resolved);

      // If it was an object, return a clean version with resolved fields
      if (typeof img === 'object' && img !== null) {
        return {
          ...img,
          image: resolved,
          url: resolved,
          image_url: resolved // Ensure all common keys are resolved
        };
      }
      return { image: resolved, url: resolved, image_url: resolved };
    })
    .filter(Boolean);

  // Storefront preference: show the first image added (oldest) instead of the last (newest).
  // We reverse the array for storefront views so the oldest image is at index 0.
  const isStorefront = typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin');
  if (isStorefront && normalizedImages.length > 1) {
    normalizedImages = [...normalizedImages].reverse();
  }

  const primaryImageObj = normalizedImages[0];
  const primaryImageUrl = typeof primaryImageObj === 'string'
    ? primaryImageObj
    : (primaryImageObj as any)?.url;

  const normalized = {
    ...product,
    id: product.id ?? product.pk,
    name: product.name || 'Untitled product',
    image: primaryImageUrl || null,
    product_image: primaryImageUrl || null,
    images: normalizedImages,
  };

  // Normalize nested lists if they contain objects
  if (Array.isArray(product.related_products)) {
    normalized.related_products = product.related_products.map((p: any) =>
      typeof p === 'object' ? normalizeProduct(p, catalog) : p
    );
  }

  if (Array.isArray(product.frequently_bought_together)) {
    normalized.frequently_bought_together = product.frequently_bought_together.map((p: any) =>
      typeof p === 'object' ? normalizeProduct(p, catalog) : p
    );
  }

  return normalized;
};

export const normalizeCategories = (payload: any) => extractList(payload).map(normalizeCategory).filter(Boolean);
export const normalizeBrands = (payload: any) => extractList(payload).map(b => ({ ...b, id: b.id ?? b.pk, name: b.name || 'Unnamed' })).filter(Boolean);
export const normalizeProducts = (payload: any, catalog: any = {}) => extractList(payload).map(p => normalizeProduct(p, catalog)).filter(Boolean);

export const getBrandName = (val: any, brands: any[] = []) => {
  if (!val) return '';
  const id = typeof val === 'object' ? val.id ?? val.pk : val;
  return brands.find(b => String(b.id) === String(id))?.name || (typeof val === 'object' ? val.name : '') || '';
};

export const getCategoryName = (val: any, cats: any[] = []) => {
  if (!val) return '';
  const id = typeof val === 'object' ? val.id ?? val.pk : val;
  return cats.find(c => String(c.id) === String(id))?.name || (typeof val === 'object' ? val.name : '') || '';
};

export const getSubcategoryName = (val: any, subs: any[] = []) => {
  if (!val) return '';
  const id = typeof val === 'object' ? val.id ?? val.pk : val;
  return subs.find(s => String(s.id) === String(id))?.name || (typeof val === 'object' ? val.name : '') || '';
};

// --- API MODULES ---
const joinPath = (...parts: any[]) => `/${parts.filter(p => p).map(p => String(p).replace(/^\/+|\/+$/g, '')).join('/')}/`;

// --- PARAM CLEANER ---
const cleanSearchParams = (params: any) => {
  if (!params || typeof params !== 'object') return params;
  const input = { ...params };
  const clean: Record<string, any> = {};

  // Map 'q' to 'search' for compatibility with /products/search/
  if (input.q && !input.search) {
    input.search = input.q;
    delete input.q;
  }

  // Only keep primitive values or arrays to prevent [object Object] in URLs
  Object.entries(input).forEach(([key, value]) => {
    // Specifically ignore internal catalog structure if passed accidentally
    if (['categoryTree', 'subcategoriesByCategory', 'productFlags'].includes(key)) return;

    if (Array.isArray(value)) {
      clean[key] = value.map((item: any) => getEntityId(item)).filter((id: any) => id !== null);
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      clean[key] = value;
    } else if (value !== null && value !== undefined) {
      // If it's an object but has an ID, use the ID
      const id = getEntityId(value);
      if (id !== null && typeof id !== 'object') {
        clean[key] = id;
      }
    }
  });

  return clean;
};

// ---------------------------------------------------------------------------
// PRODUCT PAYLOAD BUILDER
// ---------------------------------------------------------------------------
/**
 * Transforms the form's `images` array into the shape the backend expects.
 *
 *  Backend (ProductSerializer) accepts:
 *   - `product_image` : single ImageField (the "main"/hero image)
 *   - `uploaded_images`: ListField of new files appended to the gallery
 *   - `images` in the GET response is READ-ONLY and must NOT be sent.
 *
 * Input form shape (existing convention used across the app):
 *   images: Array<{
 *     image?: File | string,    // File for new uploads, string URL for existing
 *     is_main?: boolean,
 *     id?: number | null
 *   }>
 *
 * Output:
 *   - Removes the read-only `images` field from the payload
 *   - Sets `product_image` to the file flagged as main (if it's a NEW file)
 *   - Sets `uploaded_images` to all OTHER new files
 *   - Existing (string URL) images are left untouched on the server
 *     (backend is append-only; deletion needs a separate endpoint)
 */
const buildProductPayload = (payload: any) => {
  // specifications are managed via their own endpoint — exclude from product payload
  const { images, specifications: _specs, ...rest } = payload ?? {};
  const out: any = { ...rest };

  if (!Array.isArray(images) || images.length === 0) return out;

  const newFileEntries = images.filter(
    (img: any) => img && img.image instanceof File
  );
  if (newFileEntries.length === 0) return out;

  // Every newly uploaded file goes into the gallery.
  out.uploaded_images = newFileEntries.map((img: any) => img.image as File);

  // Only set product_image if the user explicitly marked one as main.
  const userMarkedMain = newFileEntries.find((img: any) => img.is_main === true);
  if (userMarkedMain) {
    out.product_image = userMarkedMain.image as File;
  }

  return out;
};

export const authApi = {
  register: (payload: any) => publicApi.post('/accounts/register/', payload).then(unwrapResponse),
  login: (payload: any) => publicApi.post('/accounts/login/', payload),
  verifyOtp: (payload: any) => publicApi.post('/accounts/verify-otp/', payload).then(unwrapResponse),
  requestPasswordReset: (payload: any) => publicApi.post('/accounts/forgot-password/', payload).then(unwrapResponse),
  verifyResetOtp: (payload: any) => publicApi.post('/accounts/verify-reset-otp/', payload).then(unwrapResponse),
  confirmResetPassword: (payload: any) => publicApi.post('/accounts/confirm-password/', payload).then(unwrapResponse),
  resetPasswordAuthenticated: (payload: any) => api.post('/accounts/reset-password/', payload).then(unwrapResponse),
  logout: () => api.post('/accounts/logout/').then(unwrapResponse),
};

export const authService = {
  login: async (creds: any) => {
    const res = await authApi.login(creds);
    const data = extractAuthData(res);
    const user = { id: data.admin?.id, name: creds.username, email: data.admin?.email, role: resolveUserRole(data) };
    if (data.token) authSessionStorage.setSession(data.token, user);
    return { user, token: data.token };
  },
  register: (payload: any) => authApi.register(payload),
  logout: async (redirect?: string) => {
    // Server clears the httpOnly refresh cookie; needs the Bearer header, no body.
    await authApi.logout().catch(() => { });
    authSessionStorage.clearSession();
    if (typeof window !== 'undefined') {
      window.location.href = redirect || '/login';
    }
  },
  clearSession: () => authSessionStorage.clearSession(),
  isAuthenticated: () => !!authSessionStorage.getToken(),
  isAdmin: () => isAdminUser(authSessionStorage.getUser()),
  getCurrentUser: () => authSessionStorage.getUser(),
  getToken: () => authSessionStorage.getToken(),
  getTempEmail: () => sessionGet(TEMP_EMAIL_KEY),
  setTempEmail: (email: string) => sessionSet(TEMP_EMAIL_KEY, email),
  clearTempEmail: () => sessionDel(TEMP_EMAIL_KEY),
  getTempPasswordReset: () => sessionGet(TEMP_PWD_RESET_KEY),
  setTempPasswordReset: (data: any) => sessionSet(TEMP_PWD_RESET_KEY, data),
  clearTempPasswordReset: () => sessionDel(TEMP_PWD_RESET_KEY),
  clearTempRegistration: () => sessionDel(TEMP_EMAIL_KEY),
  requestPasswordReset: (payload: any) => authApi.requestPasswordReset(payload),
  resendVerificationOTP: (payload?: any) => publicApi.post('/accounts/resend-otp/', payload || {}).then(unwrapResponse),
  verifyOTP: (payload: any) => authApi.verifyOtp(payload),
  // For password-reset flows
  verifyResetOTP: (payload: any) => authApi.verifyResetOtp(payload),
  confirmPassword: (payload: any) => authApi.confirmResetPassword(payload),
  // Authenticated change (old + new)
  resetPassword: (payload: any) => authApi.resetPasswordAuthenticated(payload),
  verifyAdminAccess: async () => authSessionStorage.getUser(),
};

export const fetchAllPages = async (client: AxiosInstance, url: string, params: any = {}) => {
  const items: any[] = [];
  let nextUrl: string | null = url;
  while (nextUrl) {
    const res: any = await client.get(nextUrl, { params: items.length === 0 ? params : {} });
    items.push(...extractList(res));
    const data = unwrapResponse(res);
    nextUrl = data?.next
      ? new URL(data.next).pathname.replace('/api', '') + new URL(data.next).search
      : null;
  }
  return items;
};

export const catalogApi = {
  getCatalogData: async () => {
    const [rawAll, brandsRes] = await Promise.all([
      fetchAllPages(publicApi, '/products/categories/', { page_size: 200 }),
      publicApi.get('/products/brands/')
    ]);
    const brands = normalizeBrands(brandsRes);

    // Normalize all categories into a flat list
    const allCategories = rawAll.map(normalizeCategory).filter(Boolean);

    // Group subcategories by parent ID for lookup
    const subcategoriesByCategory: Record<string, any[]> = {};
    allCategories.forEach((cat: any) => {
      if (cat.parent) {
        const parentId = String(cat.parent);
        if (!subcategoriesByCategory[parentId]) subcategoriesByCategory[parentId] = [];
        subcategoriesByCategory[parentId].push(cat);
      }
    });

    // Create a tree structure for the navbar grouped by navbar_group
    const groups: Record<string, any> = {};
    allCategories.forEach(cat => {
      if (cat.navbar_group) {
        const groupName = cat.navbar_group;
        if (!groups[groupName]) {
          groups[groupName] = {
            id: groupName,
            name: groupName,
            isGroup: true,
            subcategories: []
          };
        }

        // Find and sort children for this item
        const children = (subcategoriesByCategory[String(cat.id)] || [])
          .sort((a, b) => a.name.localeCompare(b.name));

        groups[groupName].subcategories.push({
          ...cat,
          subcategories: children
        });
      }
    });

    // Sort items within each group alphabetically
    Object.values(groups).forEach((group: any) => {
      group.subcategories.sort((a: any, b: any) => a.name.localeCompare(b.name));
    });

    // Sort the top-level groups alphabetically
    const categoryTree = Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));

    return {
      categories: allCategories, // Full flat list for the admin dashboard
      brands,
      subcategoriesByCategory,
      productFlags: PRODUCT_FLAGS,
      categoryTree
    };
  },
  getProducts: (params: any = {}, cat: any = {}) =>
    publicApi
      .get('/products/products/', {
        params: { ...cleanSearchParams(params), page_size: 20 },
      })
      .then((res: any) => {
        const data = unwrapResponse(res);
        return {
          results: extractList(res).map((p: any) => normalizeProduct(p, cat)).filter(Boolean),
          next: data?.next || null,
          count: data?.count || 0,
        };
      }),
  getProductsPage: (url: string, cat: any = {}) =>
    publicApi
      .get(url)
      .then((res: any) => {
        const data = unwrapResponse(res);
        return {
          results: extractList(res).map((p: any) => normalizeProduct(p, cat)).filter(Boolean),
          next: data?.next || null,
          count: data?.count || 0,
        };
      }),
  getProductById: (id: any, cat: any = {}) => publicApi.get(`/products/products/${id}/`).then(res => {
    const data = unwrapResponse(res);
    if (!data) return null;
    const list = Array.isArray(data) ? data : (data.results || data.items || [data]);
    return normalizeProducts(list, cat)[0] || null;
  }),
  getSimilarProducts: (id: any, cat: any = {}) => publicApi.get(`/products/products/${id}/similar/`).then(res => normalizeProducts(res, cat)),

  // GET /products/specifications/?product=<id>&grouped=true
  getProductSpecifications: (productId: any, grouped = false) =>
    publicApi.get('/products/specifications/', {
      params: { product: productId, ...(grouped ? { grouped: 'true' } : {}) },
    }).then(unwrapResponse),

  createSpecification: (data: any) =>
    api.post('/products/specifications/', data).then(unwrapResponse),

  deleteSpecification: (id: any) =>
    api.delete(`/products/specifications/${id}/`).then(unwrapResponse),

  // Use individual deletes since bulk delete endpoint is missing
  bulkDeleteSpecifications: (ids: number[]) =>
    Promise.all(ids.map(id => api.delete(`/products/specifications/${id}/`))).then(() => ({ success: true })),

  // Replace all specs for a product: bulk-delete existing, then create new ones.
  syncProductSpecifications: async (productId: any, specifications: any[]) => {
    const raw = await publicApi
      .get('/products/specifications/', { params: { product: productId } })
      .then(unwrapResponse);
    const existing: any[] = Array.isArray(raw) ? raw : (raw?.results || []);
    const existingMap = new Map(existing.map((s: any) => [s.id, s]));

    const specIdsToKeep = new Set();
    const toDelete: number[] = [];
    const toUpdate: any[] = [];
    const toCreate: any[] = [];

    specifications.forEach((spec: any) => {
      if (spec.id && existingMap.has(spec.id)) {
        specIdsToKeep.add(spec.id);
        const ex = existingMap.get(spec.id);
        if (ex.key !== spec.key || ex.value !== spec.value || (ex.section || 'General') !== (spec.section || 'General')) {
          toUpdate.push({ ...spec, product: productId });
        }
      } else {
        toCreate.push({ ...spec, product: productId });
      }
    });

    existing.forEach((s: any) => {
      if (!specIdsToKeep.has(s.id)) {
        toDelete.push(s.id);
      }
    });

    if (toDelete.length > 0) {
      await Promise.all(
        toDelete.map((id: number) => api.delete(`/products/specifications/${id}/`))
      );
    }

    if (toUpdate.length > 0) {
      await Promise.all(
        toUpdate.map((spec: any) => api.put(`/products/specifications/${spec.id}/`, spec))
      );
    }

    if (toCreate.length > 0) {
      await Promise.all(
        toCreate.map((spec: any) => api.post('/products/specifications/', spec))
      );
    }
  },

  createProduct: (payload: any, _catalog?: any) => {
    const built = buildProductPayload(payload);
    return api.post('/products/products/', toFormData(built), {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(unwrapResponse);
  },

  updateProduct: (id: any, payload: any, _catalog?: any) => {
    const built = buildProductPayload(payload);
    return api.put(`/products/products/${id}/`, toFormData(built), {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(unwrapResponse);
  },

  patchProduct: (id: any, payload: any) => {
    const built = buildProductPayload(payload);
    return api.patch(`/products/products/${id}/`, toFormData(built), {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(unwrapResponse);
  },

  deleteProduct: (id: any) => api.delete(`/products/products/${id}/`).then(unwrapResponse),

  deleteProductImage: (imageId: any) =>
    api.delete(joinPath('products', 'images', imageId)).then(unwrapResponse),

  bulkUploadProducts: (file: File, imageFiles: File[] = [], onProgress?: (percent: number) => void) => {
    const formData = new FormData();
    formData.append('excel_file', file);
    imageFiles.forEach((img) => formData.append('images', img));
    return api.post('/products/products/bulk/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 0,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    }).then(unwrapResponse);
  },
  getProductMetadata: () => publicApi.options('/products/products/').then(unwrapResponse),
  createSubcategory: (parentId: any, data: any) => api.post(joinPath('products', 'categories', parentId, 'subcategories'), data).then(unwrapResponse),
  updateSubcategory: (parentId: any, subId: any, data: any) => api.put(joinPath('products', 'categories', parentId, 'subcategories', subId), data).then(unwrapResponse),
  deleteSubcategory: (parentId: any, subId: any) => api.delete(joinPath('products', 'categories', parentId, 'subcategories', subId)).then(unwrapResponse),
  getCategoryMetadata: () => publicApi.options('/products/categories/').then(unwrapResponse),
};

export const categoryApi = {
  createCategory: (payload: any) => api.post('/products/categories/', payload).then(unwrapResponse),
  updateCategory: (id: any, payload: any) => api.put(joinPath('products', 'categories', id), payload).then(unwrapResponse),
  deleteCategory: (id: any) => api.delete(joinPath('products', 'categories', id)).then(unwrapResponse),
};

export const brandApi = {
  createBrand: (payload: any) => api.post('/products/brands/', payload).then(unwrapResponse),
  updateBrand: (id: any, payload: any) => api.put(joinPath('products', 'brands', id), payload).then(unwrapResponse),
  deleteBrand: (id: any) => api.delete(joinPath('products', 'brands', id)).then(unwrapResponse),
};

// ---------------------------------------------------------------------------
// BLOG POST PAYLOAD BUILDER (mirrors buildProductPayload)
// ---------------------------------------------------------------------------
const buildBlogPostPayload = (payload: any) => {
  const { images, ...rest } = payload ?? {};
  const out: any = { ...rest };

  if (!Array.isArray(images) || images.length === 0) return out;

  const newFileEntries = images.filter(
    (img: any) => img && img.image instanceof File
  );
  if (newFileEntries.length === 0) return out;

  out.uploaded_images = newFileEntries.map((img: any) => img.image as File);

  const userMarkedMain = newFileEntries.find((img: any) => img.is_main === true);
  if (userMarkedMain) {
    out.featured_image = userMarkedMain.image as File;
  }

  return out;
};

export const normalizeBlogPost = (post: any) => {
  if (!post) return null;
  const sourceList: any[] = [];
  if (Array.isArray(post.images)) sourceList.push(...post.images);
  if (post.featured_image) sourceList.push(post.featured_image);

  const seenUrls = new Set<string>();
  const normalizedImages = sourceList
    .map((img: any) => {
      const url = typeof img === 'string' ? img : (img?.image_url || img?.image || img?.url);
      const resolved = resolveAssetUrl(url);
      if (!resolved || seenUrls.has(resolved)) return null;
      seenUrls.add(resolved);
      return typeof img === 'object' && img !== null
        ? { ...img, image: resolved, url: resolved, image_url: resolved }
        : { image: resolved, url: resolved, image_url: resolved };
    })
    .filter(Boolean);

  const primaryImage = normalizedImages[0] as any;

  return {
    ...post,
    id: post.id ?? post.pk,
    title: post.title || 'Untitled post',
    image: primaryImage?.url || resolveAssetUrl(post.featured_image) || null,
    images: normalizedImages,
  };
};

export const normalizeBlogPosts = (payload: any) => extractList(payload).map(normalizeBlogPost).filter(Boolean);

export const blogApi = {
  getPosts: (params: any = {}) => publicApi.get('/blog/posts/', { params }).then(unwrapResponse),
  getPostBySlug: (slug: string) => publicApi.get(`/blog/posts/slug/${slug}/`).then(unwrapResponse),
  getPostById: (id: any) => api.get(joinPath('blog', 'posts', id)).then(unwrapResponse),
  createPost: (payload: any) => {
    const built = buildBlogPostPayload(payload);
    return api.post('/blog/posts/', toFormData(built), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(unwrapResponse);
  },
  updatePost: (id: any, payload: any) => {
    const built = buildBlogPostPayload(payload);
    return api.put(joinPath('blog', 'posts', id), toFormData(built), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(unwrapResponse);
  },
  patchPost: (id: any, payload: any) => {
    const built = buildBlogPostPayload(payload);
    return api.patch(joinPath('blog', 'posts', id), toFormData(built), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(unwrapResponse);
  },
  deletePost: (id: any) => api.delete(joinPath('blog', 'posts', id)).then(unwrapResponse),
  deletePostImage: (postId: any, imageId: any) =>
    api.delete(joinPath('blog', 'posts', postId, 'images', imageId)).then(unwrapResponse),
};

export const searchApi = {
  searchProducts: (params: any, cat: any = {}) => publicApi.get('/products/products/search/', { params: cleanSearchParams(params) }).then(res => normalizeProducts(res, cat)),
  getSearchFacets: (params: any) => publicApi.get('/products/products/facets/', { params: cleanSearchParams(params) }).then(unwrapResponse),
  autocomplete: (prefix: string) => publicApi.get('/products/products/autocomplete/', { params: { prefix } }).then(unwrapResponse),
};

// --- RFQ NORMALIZER ---
export const normalizeRFQ = (request: any) => {
  if (!request) return null;
  return {
    ...request,
    id: request.id,
    name: request.name || 'Anonymous',
    email: request.email,
    contactNumber: request.phone || request.contactNumber || null,
    message: request.description || request.message || null,
    createdAt: request.created_at || request.createdAt,
    status: request.status || 'pending',
  };
};

export const rfqService = {
  getRequests: () => api.get('/orders/requests/').then(res => {
    const data = extractList(res);
    if (!Array.isArray(data)) return [];
    return data.map(normalizeRFQ).filter(Boolean);
  }),
  getProducts: () => api.get('/products/products/').then(res => extractList(res)),
  createRequest: (payload: any) => publicApi.post('/orders/requests/', payload).then(unwrapResponse),
  updateRequest: (id: any, payload: any) => api.put(joinPath('orders', 'requests', id), payload).then(unwrapResponse),
};

export const rfqIntentService = {
  save: (data: any) => sessionSet('rfq_intent', data),
  get: () => sessionGet('rfq_intent'),
  clear: () => sessionDel('rfq_intent'),
};

export const inventoryService = {
  getInventory: () => api.get('/inventory/inventory/').then(unwrapResponse),
  updateStock: (id: any, prodId: any, stock: number) => api.put(`/inventory/inventory/${id}/`, { product: prodId, stock }).then(unwrapResponse),
};

export const wishlistApi = {
  getWishlist: () => api.get('/wishlist/wishlist/').then(unwrapResponse),
  addWishlistItem: (prodId: any) => api.post('/wishlist/wishlist/', { product_id: prodId }).then(unwrapResponse),
  removeWishlistItem: (prodId: any) => api.delete(joinPath('wishlist', 'wishlist', prodId)).then(unwrapResponse),
  setWishlist: (pIds: any[]) => api.put('/wishlist/wishlist/', { products: pIds }).then(unwrapResponse),
};

export const reviewApi = {
  getReviews: () => api.get('/reviews/reviews/').then(unwrapResponse),
  getProductReviews: (pId: any) => publicApi.get(joinPath('reviews', 'reviews', pId)).then(unwrapResponse),
  createReview: (payload: any) => api.post('/reviews/reviews/', payload).then(unwrapResponse),
  updateReview: (id: any, payload: any) => api.put(joinPath('reviews', 'reviews', id), payload).then(unwrapResponse),
  deleteReview: (id: any) => api.delete(joinPath('reviews', 'reviews', id)).then(unwrapResponse),
};

export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard/').then(unwrapResponse),
  getComprehensiveAnalytics: () => api.get('/analytics/comprehensive/').then(unwrapResponse),
  getSalesAnalytics: () => api.get('/analytics/sales/').then(unwrapResponse),
  getCustomerAnalytics: () => api.get('/analytics/customers/').then(unwrapResponse),
  getReviewAnalytics: () => api.get('/analytics/reviews/').then(unwrapResponse),
  getWishlistAnalytics: () => api.get('/analytics/wishlists/').then(unwrapResponse),
  getInventoryAnalytics: () => api.get('/inventory/inventory/').then(unwrapResponse),
};

export const profileApi = {
  getProfile: () => api.get('/accounts/profile/').then(unwrapResponse),
  updateProfile: (payload: any) => api.put('/accounts/profile/', payload).then(unwrapResponse),
};

export const ordersApi = {
  submitEnquiry: (payload: any) => publicApi.post('/orders/enquiries/', payload).then(unwrapResponse),
};

// --- EXPORTS ---
export const getProducts = catalogApi.getProducts.bind(catalogApi);
export const getProductsPage = catalogApi.getProductsPage.bind(catalogApi);
export const getProductById = catalogApi.getProductById.bind(catalogApi);
export const getProductSpecifications = catalogApi.getProductSpecifications.bind(catalogApi);
export const createSpecification = catalogApi.createSpecification.bind(catalogApi);
export const deleteSpecification = catalogApi.deleteSpecification.bind(catalogApi);
export const bulkDeleteSpecifications = catalogApi.bulkDeleteSpecifications.bind(catalogApi);
export const syncProductSpecifications = catalogApi.syncProductSpecifications.bind(catalogApi);
export const createProduct = catalogApi.createProduct.bind(catalogApi);
export const updateProduct = catalogApi.updateProduct.bind(catalogApi);
export const patchProduct = catalogApi.patchProduct.bind(catalogApi);
export const deleteProduct = catalogApi.deleteProduct.bind(catalogApi);
export const deleteProductImage = catalogApi.deleteProductImage.bind(catalogApi);
export const getCatalogData = catalogApi.getCatalogData.bind(catalogApi);
export const getProductMetadata = catalogApi.getProductMetadata.bind(catalogApi);
export const bulkUploadProducts = catalogApi.bulkUploadProducts.bind(catalogApi);
export const getCategoryMetadata = catalogApi.getCategoryMetadata.bind(catalogApi);
export const createCategory = categoryApi.createCategory.bind(categoryApi);
export const createSubcategory = catalogApi.createSubcategory.bind(catalogApi);
export const updateSubcategory = catalogApi.updateSubcategory.bind(catalogApi);
export const deleteSubcategory = catalogApi.deleteSubcategory.bind(catalogApi);
export const updateCategory = categoryApi.updateCategory.bind(categoryApi);
export const deleteCategory = categoryApi.deleteCategory.bind(categoryApi);
export const createBrand = brandApi.createBrand.bind(brandApi);
export const updateBrand = brandApi.updateBrand.bind(brandApi);
export const deleteBrand = brandApi.deleteBrand.bind(brandApi);
export const getDashboardData = analyticsApi.getDashboard.bind(analyticsApi);
export const getBlogPosts = blogApi.getPosts.bind(blogApi);
export const getBlogPostBySlug = blogApi.getPostBySlug.bind(blogApi);
export const getBlogPostById = blogApi.getPostById.bind(blogApi);
export const createBlogPost = blogApi.createPost.bind(blogApi);
export const updateBlogPost = blogApi.updatePost.bind(blogApi);
export const patchBlogPost = blogApi.patchPost.bind(blogApi);
export const deleteBlogPost = blogApi.deletePost.bind(blogApi);
export const deleteBlogPostImage = blogApi.deletePostImage.bind(blogApi);

export default {
  auth: authApi,
  authService,
  catalog: catalogApi,
  category: categoryApi,
  brand: brandApi,
  search: searchApi,
  inventory: inventoryService,
  wishlist: wishlistApi,
  orders: ordersApi,
  rfq: rfqService,
  rfqIntent: rfqIntentService,
  review: reviewApi,
  analytics: analyticsApi,
  blog: blogApi,
};