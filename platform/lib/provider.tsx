"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { getQueryClient } from "./get-query-client";

export const TanstackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const client = getQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
