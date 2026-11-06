import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, User } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import placeholder from '../../assets/placeholder.jpg';

const formatDate = (value: any) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date);
};

function Blog() {
  const { posts, loading } = useBlogPosts();

  useDocumentHead({
    title: 'Blog | NxSys Digital',
    description: 'Insights, updates and guides on B2B IT hardware procurement from NxSys Digital.',
  });

  if (loading) {
    return (
      <main className="bg-greyLight min-h-[60vh] flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-400">Loading...</p>
      </main>
    );
  }

  // No posts published yet — the blog page itself stays hidden from the site,
  // same as the nav link and the Home page preview section.
  if (!posts.length) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="bg-greyLight">
      <section className="bg-white py-16 sm:py-20 border-b border-slate-100">
        <div className="container-shell max-w-2xl mx-auto text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Blog</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-6 leading-tight">
            Insights &amp; Updates
          </h1>
          <p className="text-base leading-8 text-slate-600">
            Guides, product updates and procurement tips from the NxSys Digital team.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container-shell">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={post.image || placeholder}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {post.created_at && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={12} /> {formatDate(post.created_at)}
                      </span>
                    )}
                    {post.author_name && (
                      <span className="inline-flex items-center gap-1.5">
                        <User size={12} /> {post.author_name}
                      </span>
                    )}
                  </div>
                  <h2 className="font-black text-slate-900 text-[17px] mb-3 leading-snug line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-[13px] leading-relaxed text-slate-500 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-primary">
                    Read more <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Blog;
