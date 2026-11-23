import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-surface px-5">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">404</p>
        <h1 className="mt-3 text-2xl font-extrabold text-ink-900">Không tìm thấy trang</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Đường dẫn có thể đã thay đổi hoặc nội dung chưa được công bố.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/vi"
            className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-800"
          >
            Trang chủ
          </Link>
          <Link
            href="/vi/hoi-nghi"
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-bold text-ink-700 hover:bg-surface"
          >
            Hội nghị
          </Link>
        </div>
      </div>
    </div>
  );
}
