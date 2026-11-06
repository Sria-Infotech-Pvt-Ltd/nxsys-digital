import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import AdminModal from './AdminModal';
import { resolveAssetUrl } from '@/services';

interface ExistingImage {
  id: string | number | null;
  url: string;
  display_order: number;
}

interface FormState {
  title: string;
  excerpt: string;
  content: string;
  author_name: string;
  is_active: boolean;
  existingImages: ExistingImage[];
  files: File[];
}

interface PreviewUrl { name: string; url: string; }

const normalizeExistingImage = (image: unknown, index = 0): ExistingImage | null => {
  if (!image) return null;
  if (typeof image === 'string') {
    return { id: null, url: image, display_order: index };
  }
  if (typeof image === 'object') {
    const img = image as Record<string, unknown>;
    const url = (img.url as string) || (img.image_url as string) || (img.image as string) || '';
    if (!url) return null;
    return { id: (img.id as string | number) ?? null, url, display_order: index };
  }
  return null;
};

const createInitialForm = (post: any): FormState => {
  const rawImages: unknown[] = Array.isArray(post?.images) ? post.images : [];
  if (post?.featured_image && typeof post.featured_image === 'string') {
    const mainUrl = post.featured_image;
    const alreadyIncluded = rawImages.some((img) => {
      const url = typeof img === 'string' ? img : (img as any)?.url || (img as any)?.image_url || (img as any)?.image;
      return url === mainUrl;
    });
    if (!alreadyIncluded) rawImages.unshift(mainUrl);
  }
  const existingImages = rawImages
    .map((img, i) => normalizeExistingImage(img, i))
    .filter((img): img is ExistingImage => img !== null);

  return {
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    author_name: post?.author_name || '',
    is_active: post ? Boolean(post?.is_active ?? true) : true,
    existingImages,
    files: [],
  };
};

interface PostEditorModalProps {
  open: boolean;
  post?: any;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
  submitting: boolean;
  error?: any;
}

function PostEditorModal({ open, post, onClose, onSubmit, submitting, error }: PostEditorModalProps) {
  const [form, setForm] = useState<FormState>(() => createInitialForm(post));
  const [previewUrls, setPreviewUrls] = useState<PreviewUrl[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);

  useEffect(() => {
    setForm(createInitialForm(post));
    // Existing featured image (if any) starts life at index 0 of existingImages.
    setMainImageIndex(post?.featured_image ? 0 : null);
  }, [post, open]);

  useEffect(() => {
    const nextUrls = form.files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
    setPreviewUrls(nextUrls);
    return () => { nextUrls.forEach((item) => URL.revokeObjectURL(item.url)); };
  }, [form.files]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files || []);
    if (!nextFiles.length) return;
    setForm((current) => ({ ...current, files: [...current.files, ...nextFiles] }));
    event.target.value = '';
  };

  const handleRemoveNewFile = (index: number) => {
    setForm((current) => ({ ...current, files: current.files.filter((_, i) => i !== index) }));
  };

  const handleRemoveExistingImage = (index: number) => {
    setForm((current) => ({ ...current, existingImages: current.existingImages.filter((_, i) => i !== index) }));
    setMainImageIndex((current) => (current === index ? null : current));
  };

  const getFieldError = (fieldName: string) => {
    if (error && typeof error === 'object' && error.fieldErrors) {
      return error.fieldErrors[fieldName]?.[0];
    }
    return null;
  };

  const topLevelError = typeof error === 'string' ? error : error?.message;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    const images = [
      ...form.existingImages.map((img, i) => ({
        id: img.id || null,
        image_url: img.url,
        is_main: mainImageIndex === i,
      })),
      ...form.files.map((file, i) => ({
        id: null,
        image: file,
        is_main: mainImageIndex === form.existingImages.length + i,
      })),
    ];

    onSubmit({
      id: post?.id,
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      author_name: form.author_name.trim(),
      is_active: Boolean(form.is_active),
      images,
    });
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={post ? 'Edit Post' : 'New Post'}
      description={post ? 'Update the content, images or publish status of this post.' : 'Write a new blog post and publish it to the website.'}
      size="lg"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="admin-btn-secondary">Cancel</button>
          <button type="submit" form="admin-post-form" disabled={submitting} className="admin-btn-primary">
            {submitting ? 'Saving...' : post ? 'Save Changes' : 'Create Post'}
          </button>
        </div>
      }
    >
      <form id="admin-post-form" onSubmit={handleSubmit} className="space-y-6">
        {topLevelError && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
            <p className="text-xs font-bold text-rose-600">{topLevelError}</p>
          </div>
        )}

        <section className="space-y-4">
          <div className="field-stack">
            <label className="text-sm font-semibold text-slate-700" htmlFor="admin-post-title">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="admin-post-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))}
              placeholder="Example: 5 Ways to Future-Proof Your Office IT Setup"
              className={`admin-control ${getFieldError('title') ? 'border-rose-300 bg-rose-50/30' : ''}`}
              required
            />
            {getFieldError('title') && <p className="text-[10px] font-bold text-rose-500 mt-1 pl-1">{getFieldError('title')}</p>}
            {post?.slug && (
              <p className="text-[11px] text-slate-400">
                URL: <span className="font-mono">/blog/{post.slug}</span>
              </p>
            )}
          </div>

          <div className="field-stack">
            <label className="text-sm font-semibold text-slate-700" htmlFor="admin-post-author">
              Author (Optional)
            </label>
            <input
              id="admin-post-author"
              type="text"
              value={form.author_name}
              onChange={(e) => setForm((c) => ({ ...c, author_name: e.target.value }))}
              placeholder="Example: NxSys Digital Team"
              className="admin-control"
            />
          </div>

          <div className="field-stack">
            <label className="text-sm font-semibold text-slate-700" htmlFor="admin-post-excerpt">
              Excerpt (Optional)
            </label>
            <textarea
              id="admin-post-excerpt"
              value={form.excerpt}
              onChange={(e) => setForm((c) => ({ ...c, excerpt: e.target.value }))}
              placeholder="A short summary shown on the blog listing page. Leave blank to auto-generate from the content."
              rows={2}
              className="admin-control resize-none"
            />
          </div>

          <div className="field-stack">
            <label className="text-sm font-semibold text-slate-700" htmlFor="admin-post-content">
              Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="admin-post-content"
              value={form.content}
              onChange={(e) => setForm((c) => ({ ...c, content: e.target.value }))}
              placeholder="Write the full post here. Leave a blank line between paragraphs."
              rows={12}
              className={`admin-control resize-y ${getFieldError('content') ? 'border-rose-300 bg-rose-50/30' : ''}`}
              required
            />
            {getFieldError('content') && <p className="text-[10px] font-bold text-rose-500 mt-1 pl-1">{getFieldError('content')}</p>}
          </div>
        </section>

        {/* Visuals */}
        <section className="space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Visuals</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-950">Featured image and gallery</h3>
            <p className="mt-1 text-[11px] text-slate-400">Mark one image as the star to use it as the post's cover photo.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {form.existingImages.map((image, index) => {
              const isMain = mainImageIndex === index;
              return (
                <div key={image.id || index} className={`group relative aspect-square overflow-hidden rounded-[24px] border-2 ${isMain ? 'border-primary' : 'border-slate-200'}`}>
                  <img src={(resolveAssetUrl(image.url)) ?? undefined} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-rose-600 shadow-sm transition-opacity opacity-0 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMainImageIndex(isMain ? null : index)}
                    className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide shadow-sm transition-all ${isMain ? 'bg-primary text-textMain' : 'bg-white/90 text-slate-500 opacity-0 group-hover:opacity-100'
                      }`}
                    title={isMain ? 'Remove cover' : 'Set as cover'}
                  >
                    <Star size={9} className={isMain ? 'fill-textMain' : ''} />
                    {isMain ? 'Cover' : 'Set cover'}
                  </button>
                </div>
              );
            })}
            {previewUrls.map((item, index) => {
              const globalIndex = form.existingImages.length + index;
              const isMain = mainImageIndex === globalIndex;
              return (
                <div key={item.url} className={`group relative aspect-square overflow-hidden rounded-[24px] border-2 ${isMain ? 'border-primary' : 'border-primary/20'}`}>
                  <img src={item.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewFile(index)}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-slate-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMainImageIndex(isMain ? null : globalIndex)}
                    className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide shadow-sm transition-all ${isMain ? 'bg-primary text-textMain' : 'bg-white/90 text-slate-500 opacity-0 group-hover:opacity-100'
                      }`}
                    title={isMain ? 'Remove cover' : 'Set as cover'}
                  >
                    <Star size={9} className={isMain ? 'fill-textMain' : ''} />
                    {isMain ? 'Cover' : 'Set cover'}
                  </button>
                </div>
              );
            })}
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-primary/50 hover:bg-primary/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M12 5v14M5 12h14" /></svg>
              <span className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Upload</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
            </label>
          </div>
          {getFieldError('featured_image') && <p className="text-[10px] font-bold text-rose-500 mt-2">{getFieldError('featured_image')}</p>}
        </section>

        {/* Publish status */}
        <section className="space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Visibility</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-950">Publish status</h3>
          </div>
          <label className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 transition-colors cursor-pointer ${form.is_active ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-slate-50'}`}>
            <div>
              <p className="font-bold text-slate-900 text-sm">{form.is_active ? 'Published' : 'Draft'}</p>
              <p className="text-[12px] text-slate-500">{form.is_active ? 'Visible to everyone on the blog.' : 'Hidden from the public blog until published.'}</p>
            </div>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((c) => ({ ...c, is_active: e.target.checked }))}
              className="h-5 w-5 accent-primary"
            />
          </label>
        </section>
      </form>
    </AdminModal>
  );
}

export default PostEditorModal;
