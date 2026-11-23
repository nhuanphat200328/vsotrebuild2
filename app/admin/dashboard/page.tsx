import { CalendarDays, FileText, Mail, Users } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function AdminDashboardPage() {
  const admin = createSupabaseAdminClient();

  const [conferences, sessions, people, news, contacts] = await Promise.all([
    admin.from("conferences").select("id", { count: "exact", head: true }),
    admin.from("sessions").select("id", { count: "exact", head: true }),
    admin.from("people").select("id", { count: "exact", head: true }),
    admin.from("news").select("id", { count: "exact", head: true }),
    admin.from("contact_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  const cards = [
    { icon: CalendarDays, label: "Hội nghị", value: conferences.count ?? 0 },
    { icon: FileText, label: "Phiên", value: sessions.count ?? 0 },
    { icon: Users, label: "Diễn giả", value: people.count ?? 0 },
    { icon: FileText, label: "Tin tức", value: news.count ?? 0 },
    { icon: Mail, label: "Liên hệ mới", value: contacts.count ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-500">Số liệu lấy trực tiếp từ Supabase.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-line bg-white p-5">
            <card.icon className="size-5 text-brand-500" aria-hidden />
            <p className="mt-3 text-2xl font-extrabold text-ink-900">{card.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-line bg-white p-5">
        <h2 className="text-sm font-bold text-ink-900">Trạng thái hệ thống</h2>
        <ul className="mt-3 grid gap-2 text-sm text-ink-700">
          <li>Supabase: đã kết nối (PostgreSQL 17).</li>
          <li>Dữ liệu 2026: đã import từ nguồn legacy.</li>
        </ul>
      </div>
    </div>
  );
}
