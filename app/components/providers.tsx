import type { PropsWithChildren } from "react";
import { DbProvider } from "./db-provider";
import { ProblemSetsProvider } from "./use-problem-sets";

export function Providers({ children }: PropsWithChildren) {
  return (
    <DbProvider>
      <ProblemSetsProvider>{children}</ProblemSetsProvider>
    </DbProvider>
  );
}
