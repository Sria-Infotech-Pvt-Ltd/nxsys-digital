import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import placeholder from '../../assets/placeholder.jpg';

const formatDate = (value: any) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date);
};

function BlogPreviewSection() {
  const { posts } = useBlogPosts();

  // No posts published yet — hide this section entirely, same as the nav link.
  if (!posts.length) return null;

  const latest = posts.slice(0, 3);

  return (
    <section className="bg-white py-20 sm:py-24 border-b border-slate-100">
      <div className="container-shell">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">From the Blog</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-5">
            Latest insights and updates
          </h2>
          <p className="text-base leading-relaxed text-slate-500">
            Guides, product updates and procurement tips from the NxSys Digital team.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post: any) => (
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
              <div className="flex flex-1 flex-col p-5">
                {post.created_at && (
                  <span className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    <CalendarDays size={12} /> {formatDate(post.created_at)}
                  </span>
                )}
                <h3 className="font-black text-slate-900 text-[15px] mb-2 leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-500 flex-1 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 font-bold px-7 py-3 rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
          >
            Visit the Blog <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default memo(BlogPreviewSection);
