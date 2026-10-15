import type { ReactNode } from 'react';

interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

function AdminPageHeader({ eyebrow, title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
      <div className="min-w-0 max-w-3xl flex-1">
        {eyebrow && (
          <div className="mb-3 flex items-center gap-2.5">
            <div className="h-[3px] w-5 rounded-full bg-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-slate-400">
              {eyebrow}
            </p>
          </div>
        )}
        <h1 className="text-balance text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-[14px] leading-7 text-slate-500 text-pretty">
            {description}
          </p>
        )}
      </div>
      {action && <div className="min-w-0 max-sm:w-full lg:shrink">{action}</div>}
    </div>
  );
}

export default AdminPageHeader;
