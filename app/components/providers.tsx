import type { PropsWithChildren } from "react";
import { DbProvider } from "./db-provider";
import { ToastProvider } from "./toast-provider";
import { ProblemSetsProvider } from "./use-problem-sets";

export function Providers({ children }: PropsWithChildren) {
  return (
    <DbProvider>
      <ToastProvider>
        <ProblemSetsProvider>{children}</ProblemSetsProvider>
      </ToastProvider>
    </DbProvider>
  );
}
