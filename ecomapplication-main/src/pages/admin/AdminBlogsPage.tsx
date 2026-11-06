import { useEffect, useMemo, useState } from 'react';
import {
  createBlogPost, updateBlogPost, patchBlogPost, deleteBlogPost, deleteBlogPostImage,
  fetchAllPages, api, normalizeBlogPost, getApiErrorMessage, getNormalizedApiError,
} from '@/services';
import { showToast } from '@/utils/helpers';
import { formatAdminDate } from '@/utils/admin';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable from '@/components/admin/AdminDataTable';
import PostEditorModal from '@/components/admin/PostEditorModal';
import { Eye, EyeOff, Pencil, Trash2, ExternalLink } from 'lucide-react';

function AdminBlogsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [activePost, setActivePost] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<any>(null);

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await fetchAllPages(api, '/blog/posts/', { include_inactive: 'true', page_size: 100 });
      setPosts(rows.map((p: any) => normalizeBlogPost(p)).filter(Boolean));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load blog posts'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const visiblePosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) =>
      String(p.title || '').toLowerCase().includes(q) ||
      String(p.author_name || '').toLowerCase().includes(q)
    );
  }, [posts, query]);

  const openAdd = () => {
    setActivePost(null);
    setSaveError(null);
    setEditorOpen(true);
  };

  const openEdit = (post: any) => {
    setActivePost(post);
    setSaveError(null);
    setEditorOpen(true);
  };

  const handleSave = async (payload: any) => {
    setSaving(true);
    setSaveError(null);
    try {
      const { id, images, ...rest } = payload;

      if (id) {
        const existingIds = new Set(
          (activePost?.images || [])
            .map((img: any) => img.id)
            .filter((imgId: any) => imgId !== null && imgId !== undefined)
        );
        const submittedIds = new Set(
          (images || [])
            .map((img: any) => img.id)
            .filter((imgId: any) => imgId !== null && imgId !== undefined)
        );
        const removedIds = [...existingIds].filter((imgId) => !submittedIds.has(imgId));
        if (removedIds.length) {
          await Promise.allSettled(removedIds.map((imgId) => deleteBlogPostImage(id, imgId)));
        }
        await updateBlogPost(id, { ...rest, images });
        showToast({ title: 'Post updated', message: `"${rest.title}" was updated successfully.` });
      } else {
        await createBlogPost({ ...rest, images });
        showToast({ title: 'Post created', message: `"${rest.title}" was published successfully.` });
      }

      setEditorOpen(false);
      await loadPosts();
    } catch (err) {
      const errorData = getNormalizedApiError(err, { fallbackMessage: 'Operation failed' });
      setSaveError(errorData);
      showToast({
        title: `Unable to ${payload.id ? 'update' : 'create'} post`,
        message: errorData.message,
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (post: any) => {
    const nextStatus = !post.is_active;
    const verb = nextStatus ? 'publish' : 'unpublish';
    const confirmed = window.confirm(`Are you sure you want to ${verb} "${post.title}"?`);
    if (!confirmed) return;

    try {
      await patchBlogPost(post.id, { is_active: nextStatus });
      showToast({ title: 'Success', message: `"${post.title}" is now ${nextStatus ? 'published' : 'a draft'}.` });
      await loadPosts();
    } catch (err) {
      showToast({ title: 'Unable to update status', message: getApiErrorMessage(err, 'Update failed'), type: 'error' });
    }
  };

  const handleDelete = async (post: any) => {
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${post.title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteBlogPost(post.id);
      showToast({ title: 'Post deleted', message: `"${post.title}" was removed.` });
      setPosts((current) => current.filter((p) => p.id !== post.id));
    } catch (err) {
      showToast({ title: 'Unable to delete post', message: getApiErrorMessage(err, 'Deletion failed'), type: 'error' });
    }
  };

  if (loading) {
    return <div className="flex min-h-[40vh] items-center justify-center text-slate-500">Loading blog posts...</div>;
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-700">
        <p className="text-lg font-semibold text-rose-900">Unable to load blog posts</p>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Content"
        title={`Blog Posts (${posts.length})`}
        description="Create, update and publish blog posts. Posts are hidden from the website until you publish them."
        action={
          <button type="button" onClick={openAdd} className="admin-btn-primary max-sm:w-full">
            Add post
          </button>
        }
      />

      <div className="surface-panel grid gap-4 p-5 sm:p-6">
        <label className="field-stack">
          <span className="text-sm font-semibold text-slate-700">Search posts</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or author..."
            className="admin-control"
          />
        </label>
      </div>

      <AdminDataTable
        tableFixed
        columns={[
          {
            key: 'title',
            label: 'Post',
            width: '40%',
            cellClassName: 'min-w-[260px]',
            render: (post) => (
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                  {post.image ? (
                    <img src={post.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] font-black uppercase text-slate-300">
                      No Image
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-950 leading-relaxed line-clamp-2">{post.title}</p>
                  <p className="mt-1 text-[11px] text-slate-400 truncate">/blog/{post.slug}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'author_name',
            label: 'Author',
            width: '18%',
            render: (post) => (
              <span className="text-xs font-medium text-slate-600">
                {post.author_name || <span className="text-slate-300 italic">NxSys Digital</span>}
              </span>
            ),
          },
          {
            key: 'created_at',
            label: 'Created',
            width: '17%',
            render: (post) => (
              <span className="text-xs text-slate-500">{formatAdminDate(post.created_at)}</span>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            width: '10%',
            render: (post) => (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${post.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
              >
                {post.is_active ? 'Published' : 'Draft'}
              </span>
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            width: '15%',
            cellClassName: 'text-right min-w-[180px]',
            render: (post) => (
              <div className="flex items-center justify-end gap-2">
                {post.is_active && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View live post"
                    className="admin-btn-secondary !min-h-[34px] !w-[34px] !rounded-xl !p-0 flex items-center justify-center"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleTogglePublish(post)}
                  title={post.is_active ? 'Unpublish' : 'Publish'}
                  className="admin-btn-secondary !min-h-[34px] !w-[34px] !rounded-xl !p-0 flex items-center justify-center"
                >
                  {post.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(post)}
                  title="Edit"
                  className="admin-btn-secondary !min-h-[34px] !w-[34px] !rounded-xl !p-0 flex items-center justify-center"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post)}
                  title="Delete"
                  className="admin-btn-danger !min-h-[34px] !w-[34px] !rounded-xl !p-0 flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ),
          },
        ]}
        rows={visiblePosts}
        emptyText="No blog posts yet. Click “Add post” to publish your first one."
        minWidthClassName="min-w-[900px]"
      />

      <PostEditorModal
        open={editorOpen}
        post={activePost}
        onClose={() => setEditorOpen(false)}
        onSubmit={handleSave}
        submitting={saving}
        error={saveError}
      />
    </div>
  );
}

export default AdminBlogsPage;
