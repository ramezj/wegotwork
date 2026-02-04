import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as TanstackQuery from "./features/tanstack-query/root-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext();

  const router = createRouter({
    routeTree,
    rewrite: {
      input: ({ url }) => {
        const subdomain = url.hostname.split(".")[0];

        if (subdomain === "jobs") {
          url.pathname = "/view" + url.pathname;
        }

        return url;
      },
      output: ({ url }) => {
        const subdomain = url.hostname.split(".")[0];

        if (subdomain === "jobs" && url.pathname.startsWith("/view")) {
          url.pathname = url.pathname.replace(/^\/view/, "") || "/";
        }
        return url;
      },
    },
    context: {
      ...rqContext,
    },

    defaultPreload: "intent",
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  });

  return router;
};
