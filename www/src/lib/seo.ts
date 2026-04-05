export const SITE_NAME = "lunics";
export const SITE_URL = "https://lunics.co";
export const DEFAULT_OG_IMAGE = "/main.png";
export const DEFAULT_TITLE = "Career Page and Hiring Software for Teams";
export const DEFAULT_DESCRIPTION =
  "Lunics is hiring software for organizations and teams to create career pages, post job openings, receive applicants, and manage the hiring process in one platform.";

type JsonLd = Record<string, unknown>;

type BuildSeoOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  jsonLd?: JsonLd | JsonLd[];
};

function normalizePath(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return new URL(path.startsWith("/") ? path : `/${path}`, SITE_URL).toString();
}

function withBrand(title?: string) {
  if (!title) {
    return `${SITE_NAME} | ${DEFAULT_TITLE}`;
  }

  return title.toLowerCase().includes(SITE_NAME.toLowerCase())
    ? title
    : `${title} | ${SITE_NAME}`;
}

export function absoluteUrl(path = "/") {
  return normalizePath(path);
}

export function stripHtml(input?: string | null) {
  if (!input) {
    return "";
  }

  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(input?: string | null, maxLength = 160) {
  const value = (input ?? "").trim();

  if (!value) {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

export function metaDescription(input?: string | null, maxLength = 160) {
  const plainText = stripHtml(input);
  return truncate(plainText, maxLength);
}

export function buildSeo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  type = "website",
  jsonLd,
}: BuildSeoOptions) {
  const canonicalUrl = normalizePath(path);
  const resolvedImage = normalizePath(image);
  const resolvedTitle = withBrand(title);
  const resolvedDescription =
    metaDescription(description) || DEFAULT_DESCRIPTION;

  const meta: Array<Record<string, unknown>> = [
    { title: resolvedTitle },
    { name: "description", content: resolvedDescription },
    {
      name: "robots",
      content: noIndex ? "noindex, nofollow" : "index, follow",
    },
    { property: "og:title", content: resolvedTitle },
    { property: "og:description", content: resolvedDescription },
    { property: "og:type", content: type },
    { property: "og:url", content: canonicalUrl },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:image", content: resolvedImage },
    { property: "og:image:alt", content: resolvedTitle },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: resolvedTitle },
    { name: "twitter:description", content: resolvedDescription },
    { name: "twitter:image", content: resolvedImage },
  ];

  const jsonLdEntries = Array.isArray(jsonLd)
    ? jsonLd
    : jsonLd
      ? [jsonLd]
      : [];

  jsonLdEntries.forEach((entry) => {
    meta.push({ "script:ld+json": entry });
  });

  return {
    meta,
    links: [{ rel: "canonical", href: canonicalUrl }],
  };
}
