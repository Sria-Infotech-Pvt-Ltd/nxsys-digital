import { useEffect, useState } from 'react';
import { getBlogPosts, normalizeBlogPosts } from '@/services';

let cachedPosts: any[] | null = null;
let inflightPromise: Promise<any[]> | null = null;

async function fetchPosts(): Promise<any[]> {
  if (cachedPosts) return cachedPosts;
  if (inflightPromise) return inflightPromise;

  inflightPromise = getBlogPosts({ page_size: 50 })
    .then((res: any) => {
      const list = normalizeBlogPosts(res);
      cachedPosts = list;
      return list;
    })
    .catch(() => {
      cachedPosts = [];
      return [];
    })
    .finally(() => {
      inflightPromise = null;
    });

  return inflightPromise;
}

/**
 * Shared, session-cached list of published blog posts.
 * Used across Home, the blog listing/detail pages, and the nav/footer
 * so the "Blog" link and any blog section only ever render once at
 * least one post exists.
 */
export function useBlogPosts() {
  const [posts, setPosts] = useState<any[]>(cachedPosts || []);
  const [loading, setLoading] = useState(!cachedPosts);

  useEffect(() => {
    let active = true;
    if (cachedPosts) {
      setPosts(cachedPosts);
      setLoading(false);
      return undefined;
    }
    fetchPosts().then((list) => {
      if (active) {
        setPosts(list);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { posts, loading };
}
