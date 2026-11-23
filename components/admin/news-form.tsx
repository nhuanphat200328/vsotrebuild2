import Link from "next/link";
import type { NewsRow } from "@/lib/news/data";

function tr(news: NewsRow | undefined, locale: string) {
  return news?.news_translations.find((t) => t.locale === locale);
}
function text(body: { text?: string } | null | undefined) {
  return body?.text ?? "";
}

export function NewsForm({
  news,
  categories,
  action,
  submitLabel,
}: {
  news?: NewsRow;
  categories: { id: string; news_category_translations: { locale: string; name: string | null }[] }[];
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}) {
  const vi = tr(news, "vi");
  const en = tr(news, "en");
  const publishedAt = news?.published_at ? news.published_at.slice(0, 16) : "";

  return (
    <form action={action} className="grid gap-4">
      {news ? <input type="hidden" name="id" value={news.id} /> : null}
      <section className="grid gap-3 rounded-xl border border-line bg-white p-5 sm:grid-cols-4">
        <label className="grid gap-1 text-xs font-bold text-ink-700 sm:col-span-2">
          Slug
          <input name="slug" defaultValue={news?.slug ?? ""} placeholder="tu-dong-neu-de-trong" className="h-10 rounded-lg border border-line px-3 text-sm font-normal" />
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink-700">
          Danh mục
          <select name="category_id" defaultValue={news?.category_id ?? ""} className="h-10 rounded-lg border border-line px-2 text-sm font-normal">
            <option value="">Chưa phân loại</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.news_category_translations.find((t) => t.locale === "vi")?.name ?? category.id}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink-700">
          Trạng thái
          <select name="status" defaultValue={news?.status ?? "draft"} className="h-10 rounded-lg border border-line px-2 text-sm font-normal">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink-700 sm:col-span-2">
          Ngày đăng
          <input type="datetime-local" name="published_at" defaultValue={publishedAt} className="h-10 rounded-lg border border-line px-3 text-sm font-normal" />
        </label>
        <label className="flex items-center gap-2 pt-5 text-sm font-semibold text-ink-700">
          <input type="checkbox" name="is_featured" value="1" defaultChecked={news?.is_featured ?? false} className="size-4" />
          Nổi bật
        </label>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {(["vi", "en"] as const).map((locale) => {
          const t = locale === "vi" ? vi : en;
          const prefix = locale;
          return (
            <section key={locale} className="grid gap-3 rounded-xl border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-ink-900">{locale === "vi" ? "Tiếng Việt" : "English"}</h2>
                <select
                  name={`${prefix}_status`}
                  defaultValue={t?.status ?? (locale === "vi" ? "draft" : "missing")}
                  className="h-8 rounded border border-line px-2 text-[11px] font-semibold"
                >
                  <option value="missing">Missing</option>
                  <option value="draft">Draft</option>
                  <option value="pending_review">Pending review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <label className="grid gap-1 text-xs font-bold text-ink-700">
                Tiêu đề {locale === "vi" ? "*" : ""}
                <input name={`${prefix}_title`} defaultValue={t?.title ?? ""} required={locale === "vi"} className="h-10 rounded-lg border border-line px-3 text-sm font-normal" />
              </label>
              <label className="grid gap-1 text-xs font-bold text-ink-700">
                Mô tả ngắn
                <input name={`${prefix}_excerpt`} defaultValue={t?.excerpt ?? ""} className="h-10 rounded-lg border border-line px-3 text-sm font-normal" />
              </label>
              <label className="grid gap-1 text-xs font-bold text-ink-700">
                Nội dung (cách đoạn bằng dòng trống)
                <textarea name={`${prefix}_body`} defaultValue={text(t?.body)} rows={12} className="rounded-lg border border-line p-3 text-sm font-normal" />
              </label>
            </section>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="h-10 rounded-lg bg-brand-600 px-5 text-sm font-bold text-white hover:bg-brand-700">{submitLabel}</button>
        <Link href="/admin/news" className="inline-flex h-10 items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink-700">Hủy</Link>
      </div>
    </form>
  );
}
