import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, User } from 'lucide-react';
import { getBlogPostBySlug, normalizeBlogPost } from '@/services';
import { useDocumentHead } from '@/hooks/useDocumentHead';

const formatDate = (value: any) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'long' }).format(date);
};

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setNotFound(false);
    getBlogPostBySlug(slug)
      .then((res: any) => setPost(normalizeBlogPost(res)))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useDocumentHead({
    title: post ? `${post.title} | NxSys Digital Blog` : 'Blog | NxSys Digital',
    description: post?.excerpt || 'Insights and updates from NxSys Digital.',
  });

  if (loading) {
    return (
      <main className="bg-greyLight min-h-[60vh] flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-400">Loading...</p>
      </main>
    );
  }

  if (notFound || !post) {
    return <Navigate to="/blog" replace />;
  }

  const paragraphs = String(post.content || '').split(/\n{2,}/).filter(Boolean);

  return (
    <main className="bg-greyLight">
      <article className="bg-white py-16 sm:py-20">
        <div className="container-shell max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="mb-8 inline-flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> Back to Blog
          </Link>

          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Blog</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5 leading-tight">
            {post.title}
          </h1>
          <div className="mb-8 flex flex-wrap items-center gap-4 text-[13px] font-semibold text-slate-400">
            {post.created_at && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} /> {formatDate(post.created_at)}
              </span>
            )}
            {post.author_name && (
              <span className="inline-flex items-center gap-1.5">
                <User size={14} /> {post.author_name}
              </span>
            )}
          </div>

          {post.image && (
            <div className="mb-10 overflow-hidden rounded-2xl border border-slate-200">
              <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="space-y-5">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-base leading-8 text-slate-600 whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>

          {Array.isArray(post.images) && post.images.length > 1 && (
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {post.images
                .filter((img: any) => img.url !== post.image)
                .map((img: any, i: number) => (
                  <div key={img.id || i} className="overflow-hidden rounded-2xl border border-slate-200">
                    <img src={img.url} alt="" className="w-full h-auto object-cover" loading="lazy" />
                  </div>
                ))}
            </div>
          )}
        </div>
      </article>
    </main>
  );
}

export default BlogPost;
