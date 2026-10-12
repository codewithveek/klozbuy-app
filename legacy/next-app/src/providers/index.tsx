"use client";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsProvider } from "./nuqs";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </NuqsProvider>
    </QueryClientProvider>
  );
};
