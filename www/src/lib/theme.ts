import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import * as z from "zod";

const postThemeValidator = z.union([z.literal("light"), z.literal("dark")]);
export type T = z.infer<typeof postThemeValidator>;
const storageKey = "_preferred-theme";

const isProduction = process.env.NODE_ENV === "production";

export const getThemeServerFn = createServerFn().handler(
  async () => (getCookie(storageKey) || "dark") as T,
);

export const setThemeServerFn = createServerFn({ method: "POST" })
  .inputValidator(postThemeValidator)
  .handler(async ({ data }) => {
    // In production, set domain=".lunics.co" so the cookie is shared between
    // lunics.co and careers.lunics.co. In dev, omit domain (host-only) because
    // domain=".localhost" is unreliable across browsers — each dev origin
    // (localhost and careers.localhost) will maintain its own independent cookie.
    const cookieOptions = isProduction
      ? { domain: ".lunics.co", path: "/", sameSite: "lax" as const, maxAge: 60 * 60 * 24 * 365 }
      : { path: "/", sameSite: "lax" as const, maxAge: 60 * 60 * 24 * 365 };

    return setCookie(storageKey, data, cookieOptions);
  });
