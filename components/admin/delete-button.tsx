"use client";

export function DeleteButton({ label = "Xóa" }: { label?: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa? Hành động này sẽ ẩn nội dung khỏi website.")) {
          event.preventDefault();
        }
      }}
      className="h-10 rounded-lg border border-red-200 bg-white px-3 text-sm font-bold text-red-700 hover:bg-red-50"
    >
      {label}
    </button>
  );
}
