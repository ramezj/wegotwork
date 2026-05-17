const BLOCKED_CONTENT_BLOCKS =
  /<(script|style|iframe|object|embed|form|video|audio|svg|math)[^>]*>[\s\S]*?<\/\1>/gi;
const BLOCKED_TAGS =
  /<\/?(input|button|textarea|select|option)[^>]*>/gi;

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "a",
  "h2",
  "h3",
  "blockquote",
]);

function escapeAttribute(value: string) {
  return value.replace(/"/g, "&quot;");
}

function sanitizeHref(rawHref: string) {
  const href = rawHref.trim();

  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("/") ||
    href.startsWith("#")
  ) {
    return href;
  }

  return `https://${href.replace(/^\/+/, "")}`;
}

export function sanitizeRichTextHtml(input?: string | null) {
  if (!input) {
    return "";
  }

  let html = input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(BLOCKED_CONTENT_BLOCKS, "")
    .replace(BLOCKED_TAGS, "")
    .replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/\sstyle\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");

  html = html.replace(
    /<(\/?)([a-z0-9-]+)([^>]*)>/gi,
    (_, slash: string, rawTag: string, attributes: string) => {
      const tag = rawTag.toLowerCase();

      if (!ALLOWED_TAGS.has(tag)) {
        return "";
      }

      if (slash) {
        return `</${tag}>`;
      }

      if (tag === "br") {
        return "<br>";
      }

      if (tag === "a") {
        const hrefMatch =
          attributes.match(/\shref\s*=\s*"([^"]+)"/i) ||
          attributes.match(/\shref\s*=\s*'([^']+)'/i) ||
          attributes.match(/\shref\s*=\s*([^\s>]+)/i);

        const href = hrefMatch?.[1] ? sanitizeHref(hrefMatch[1]) : null;

        return href
          ? `<a href="${escapeAttribute(href)}" target="_blank" rel="noreferrer">`
          : "<a>";
      }

      return `<${tag}>`;
    },
  );

  return html.trim();
}

export function isRichTextEmpty(input?: string | null) {
  const plainText = sanitizeRichTextHtml(input)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|li|h2|h3|blockquote)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();

  return plainText.length === 0;
}
