export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesQuery(haystack: string, query: string) {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return true;
  const normalizedHaystack = normalizeSearch(haystack);
  return normalizedQuery
    .split(" ")
    .filter(Boolean)
    .every((token) => normalizedHaystack.includes(token));
}
