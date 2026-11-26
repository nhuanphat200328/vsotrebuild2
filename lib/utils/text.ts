export function firstLine(value: string) {
  return value.replace(/\r/g, "").split("\n")[0]?.trim() ?? value;
}

export function textBody(value: string) {
  const lines = value.replace(/\r/g, "").split("\n");
  return lines.length > 1 ? lines.slice(1).join("\n").trim() : "";
}
