import Link from "next/link";
import type { PageRow, PageTranslation } from "@/lib/pages/data";
import { bodyText } from "@/lib/pages/data";

function translation(page: PageRow | undefined, locale: string): PageTranslation | undefined {
  return page?.page_translations.find((t) => t.locale === locale);
}

export function PageForm({
  page,
  action,
  submitLabel,
}: {
  page?: PageRow;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}) {
  const vi = translation(page, "vi");
  const en = translation(page, "en");

  return (
    <form action={action} className="grid gap-5">
      {page ? <input type="hidden" name="id" value={page.id} /> : null}

      <section className="grid gap-3 rounded-xl border border-line bg-white p-5 sm:grid-cols-4">
        <label className="grid gap-1 text-xs font-bold text-ink-700 sm:col-span-2">
          Slug
          <input
            name="slug"
            defaultValue={page?.slug ?? ""}
            placeholder="tu-dong-tu-tieu-de-neu-de-trong"
            maxLength={200}
            className="h-10 rounded-lg border border-line px-3 text-sm font-normal"
          />
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink-700">
          Template
          <select
            name="template"
            defaultValue={page?.template ?? "default"}
            className="h-10 rounded-lg border border-line px-2 text-sm font-normal"
          >
            <option value="default">default</option>
            <option value="about">about</option>
            <option value="legal">legal</option>
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink-700">
          Trạng thái trang
          <select
            name="status"
            defaultValue={page?.status ?? "draft"}
            className="h-10 rounded-lg border border-line px-2 text-sm font-normal"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink-700">
          Thứ tự
          <input
            type="number"
            name="sort"
            defaultValue={page?.sort ?? 0}
            min={0}
            className="h-10 rounded-lg border border-line px-3 text-sm font-normal"
          />
        </label>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="grid gap-3 rounded-xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-ink-900">Tiếng Việt</h2>
            <select
              name="vi_status"
              defaultValue={vi?.status ?? "draft"}
              className="h-8 rounded border border-line px-2 text-[11px] font-semibold"
              aria-label="Trạng thái bản dịch tiếng Việt"
            >
              <option value="missing">Missing</option>
              <option value="draft">Draft</option>
              <option value="pending_review">Pending review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <label className="grid gap-1 text-xs font-bold text-ink-700">
            Tiêu đề *
            <input
              name="vi_title"
              defaultValue={vi?.title ?? ""}
              required
              maxLength={300}
              className="h-10 rounded-lg border border-line px-3 text-sm font-normal"
            />
          </label>
          <label className="grid gap-1 text-xs font-bold text-ink-700">
            Mô tả ngắn
            <input
              name="vi_excerpt"
              defaultValue={vi?.excerpt ?? ""}
              maxLength={500}
              className="h-10 rounded-lg border border-line px-3 text-sm font-normal"
            />
          </label>
          <label className="grid gap-1 text-xs font-bold text-ink-700">
            Nội dung (mỗi đoạn cách nhau dòng trống)
            <textarea
              name="vi_body"
              defaultValue={bodyText(vi?.body)}
              rows={12}
              maxLength={50000}
              className="rounded-lg border border-line p-3 text-sm font-normal"
            />
          </label>
          <label className="grid gap-1 text-xs font-bold text-ink-700">
            SEO title
            <input name="vi_seo_title" defaultValue={vi?.seo_title ?? ""} maxLength={200} className="h-10 rounded-lg border border-line px-3 text-sm font-normal" />
          </label>
          <label className="grid gap-1 text-xs font-bold text-ink-700">
            SEO description
            <input name="vi_seo_description" defaultValue={vi?.seo_description ?? ""} maxLength={300} className="h-10 rounded-lg border border-line px-3 text-sm font-normal" />
          </label>
        </section>

        <section className="grid gap-3 rounded-xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-ink-900">English</h2>
            <select
              name="en_status"
              defaultValue={en?.status ?? "missing"}
              className="h-8 rounded border border-line px-2 text-[11px] font-semibold"
              aria-label="English translation status"
            >
              <option value="missing">Missing</option>
              <option value="draft">Draft</option>
              <option value="pending_review">Pending review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <label className="grid gap-1 text-xs font-bold text-ink-700">
            Title
            <input name="en_title" defaultValue={en?.title ?? ""} maxLength={300} className="h-10 rounded-lg border border-line px-3 text-sm font-normal" />
          </label>
          <label className="grid gap-1 text-xs font-bold text-ink-700">
            Excerpt
            <input name="en_excerpt" defaultValue={en?.excerpt ?? ""} maxLength={500} className="h-10 rounded-lg border border-line px-3 text-sm font-normal" />
          </label>
          <label className="grid gap-1 text-xs font-bold text-ink-700">
            Body (blank line between paragraphs)
            <textarea name="en_body" defaultValue={bodyText(en?.body)} rows={12} maxLength={50000} className="rounded-lg border border-line p-3 text-sm font-normal" />
          </label>
          <label className="grid gap-1 text-xs font-bold text-ink-700">
            SEO title
            <input name="en_seo_title" defaultValue={en?.seo_title ?? ""} maxLength={200} className="h-10 rounded-lg border border-line px-3 text-sm font-normal" />
          </label>
          <label className="grid gap-1 text-xs font-bold text-ink-700">
            SEO description
            <input name="en_seo_description" defaultValue={en?.seo_description ?? ""} maxLength={300} className="h-10 rounded-lg border border-line px-3 text-sm font-normal" />
          </label>
        </section>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="h-10 rounded-lg bg-brand-600 px-5 text-sm font-bold text-white hover:bg-brand-700">
          {submitLabel}
        </button>
        <Link
          href="/admin/pages"
          className="inline-flex h-10 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink-700 hover:bg-surface"
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}
