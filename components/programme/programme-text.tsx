type Block =
  | { type: "p"; text: string }
  | { type: "ol"; start: number; items: string[] }
  | { type: "ul"; items: string[] };

export function ProgrammeText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: Block[] = [];
  let current: Block | null = null;

  for (const line of lines) {
    const numbered = line.match(/^(\d+)[.)]\s+(.*)$/);
    if (numbered) {
      const start = Number(numbered[1]);
      if (!current || current.type !== "ol" || start === 1) {
        current = { type: "ol", start, items: [] };
        blocks.push(current);
      }
      current.items.push(numbered[2]);
      continue;
    }

    const bullet = line.match(/^[-•]\s+(.*)$/);
    if (bullet) {
      if (!current || current.type !== "ul") {
        current = { type: "ul", items: [] };
        blocks.push(current);
      }
      current.items.push(bullet[1]);
      continue;
    }

    current = null;
    blocks.push({ type: "p", text: line });
  }

  if (blocks.length === 0) return null;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {blocks.map((block, index) => {
        if (block.type === "ol") {
          return (
            <ol key={index} start={block.start} className="list-decimal space-y-1 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ol>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{block.text}</p>;
      })}
    </div>
  );
}

export function firstLine(value: string) {
  return value.replace(/\r/g, "").split("\n")[0]?.trim() ?? value;
}

export function textBody(value: string) {
  const lines = value.replace(/\r/g, "").split("\n");
  return lines.length > 1 ? lines.slice(1).join("\n").trim() : "";
}
