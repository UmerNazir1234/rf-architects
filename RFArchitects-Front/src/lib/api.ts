// RF Architects Frontend API Client

const DEFAULT_LOCAL_API_BASE_URL = 'http://localhost:5005/api/v1';
const DEFAULT_DEPLOY_API_BASE_URL = 'https://rf-architects-backend-six.vercel.app/api/v1';

function normalizeApiBaseUrl(rawValue?: string | null): string {
  const value = (rawValue || process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || '').trim();

  if (value) {
    const withoutTrailingSlash = value.replace(/\/+$/, '');
    const withoutApiVersion = withoutTrailingSlash
      .replace(/\/api\/v\d+$/i, '')
      .replace(/\/api$/i, '');

    return `${withoutApiVersion}/api/v1`;
  }

  return process.env.NODE_ENV === 'development'
    ? DEFAULT_LOCAL_API_BASE_URL
    : DEFAULT_DEPLOY_API_BASE_URL;
}

const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL);

function getApiUrl(path: string) {
  if (!API_BASE_URL) return null;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

type ApiResponse<T = unknown> = {
  success?: boolean;
  data?: T;
  message?: string;
};

function normalizeIds(obj: any): any {
  if (!obj || typeof obj !== "object") return obj
  if (Array.isArray(obj)) {
    return obj.map(normalizeIds)
  }
  const result: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = normalizeIds(obj[key])
    }
  }
  if (result._id && !result.id) {
    result.id = result._id
  }
  return result
}

function normalizeProductShape(product: any): any {
  if (!product || typeof product !== "object") return product

  const images = Array.isArray(product.images) ? product.images : []
  const normalizedImages = images
    .map((img: any) => {
      if (typeof img === "string") return img
      return img?.url || img?.secure_url || img?.image || ""
    })
    .filter(Boolean)

  const featuredImage =
    (typeof product.image === "string" && product.image.trim() ? product.image : "") ||
    images.find((img: any) => img?.isFeatured)?.url ||
    images.find((img: any) => img?.isFeatured)?.secure_url ||
    normalizedImages[0] ||
    ""

  return {
    ...product,
    image: featuredImage,
    media: Array.isArray(product.media) ? product.media.filter(Boolean) : normalizedImages,
  }
}

export function dedupeProducts(products: any[] = []): any[] {
  const seen = new Set<string>()

  return products.filter((product: any) => {
    if (!product || typeof product !== "object") return true

    const key = product.id || product._id || product.slug || product.name || ""
    if (!key) return true

    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function fetchNavMenu(handle = 'main-navbar') {
  try {
    const url = getApiUrl(`/nav-menus/${handle}`);
    if (!url) return null;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json: ApiResponse<unknown> = await res.json();
    return normalizeIds(json.data);
  } catch (err) {
    console.error('Failed to fetch nav menu:', err);
    return null;
  }
}

export async function fetchProducts(params?: { category?: string; collection?: string; sort?: string; page?: number; limit?: number; search?: string }) {
  try {
    const q = new URLSearchParams();
    if (params?.category) q.append('category', params.category);
    if (params?.collection) q.append('collection', params.collection);
    if (params?.sort) q.append('sort', params.sort);
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    if (params?.search) q.append('search', params.search);

    const url = getApiUrl(`/products?${q.toString()}`);
    if (!url) return null;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json: ApiResponse<unknown> = await res.json();
    const normalized = normalizeIds(json.data);

    if (normalized && Array.isArray(normalized.products)) {
      normalized.products = dedupeProducts(normalized.products).map(normalizeProductShape)
    }

    return normalized;
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return null;
  }
}

export async function fetchProductById(id: string) {
  try {
    const url = getApiUrl(`/products/${id}`);
    if (!url) return null;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json: ApiResponse<unknown> = await res.json();
    const normalized = normalizeIds(json.data);
    return normalizeProductShape(normalized);
  } catch (err) {
    console.error('Failed to fetch product detail:', err);
    return null;
  }
}

export async function fetchProductBySlug(slug: string) {
  try {
    const url = getApiUrl(`/products/slug/${slug}`);
    if (!url) return null;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json: ApiResponse<unknown> = await res.json();
    const normalized = normalizeIds(json.data);
    return normalizeProductShape(normalized);
  } catch (err) {
    console.error('Failed to fetch product detail by slug:', err);
    return null;
  }
}

export async function fetchCollections(category?: string) {
  try {
    const q = new URLSearchParams();
    if (category) q.append('category', category);
    const url = getApiUrl(`/collections?${q.toString()}`);
    if (!url) return null;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json: ApiResponse<unknown> = await res.json();
    return normalizeIds(json.data);
  } catch (err) {
    console.error('Failed to fetch collections:', err);
    return null;
  }
}

export async function fetchCategoriesByCollection(collectionId?: string) {
  try {
    const q = new URLSearchParams();
    if (collectionId) q.append('collectionId', collectionId);
    const url = getApiUrl(`/categories?${q.toString()}`);
    if (!url) return null;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json: ApiResponse<unknown> = await res.json();
    return normalizeIds(json.data);
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return null;
  }
}

export async function fetchProductsByCategory(categoryId?: string) {
  try {
    const q = new URLSearchParams();
    if (categoryId) q.append('category', categoryId);
    const url = getApiUrl(`/products?${q.toString()}`);
    if (!url) return null;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json: ApiResponse<unknown> = await res.json();
    const normalized = normalizeIds(json.data);
    if (normalized && Array.isArray(normalized.products)) {
      normalized.products = dedupeProducts(normalized.products).map(normalizeProductShape);
    }
    return normalized;
  } catch (err) {
    console.error('Failed to fetch products by category:', err);
    return null;
  }
}

export async function fetchCollectionBySlug(slug: string) {
  try {
    const url = getApiUrl(`/collections/${slug}`);
    if (!url) return null;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json: ApiResponse<unknown> = await res.json();
    const normalized = normalizeIds(json.data);

    if (normalized && Array.isArray(normalized.products)) {
      normalized.products = dedupeProducts(normalized.products).map(normalizeProductShape);
    }

    return normalized;
  } catch (err) {
    console.error('Failed to fetch collection details by slug:', err);
    return null;
  }
}

export async function fetchProjects() {
  try {
    const url = getApiUrl('/projects');
    if (!url) return null;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json: ApiResponse<unknown> = await res.json();
    return normalizeIds(json.data);
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    return null;
  }
}

export async function fetchProjectBySlug(slug: string) {
  try {
    const url = getApiUrl(`/projects/${slug}`);
    if (!url) return null;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json: ApiResponse<unknown> = await res.json();
    return normalizeIds(json.data);
  } catch (err) {
    console.error('Failed to fetch project detail by slug:', err);
    return null;
  }
}

