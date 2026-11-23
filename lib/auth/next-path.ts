export function safeNextPath(value: unknown, fallback = "/admin") {
  const path = typeof value === "string" ? value : "";
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return fallback;
  return path;
}
