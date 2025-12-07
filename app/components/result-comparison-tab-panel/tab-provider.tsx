import { type PropsWithChildren, createContext, use, useState } from "react";

export const ResultComparisonTabs = {
  relationships: "relationships",
  result: "result",
  expected: "expected",
} as const;

export type ResultComparisonTab =
  (typeof ResultComparisonTabs)[keyof typeof ResultComparisonTabs];

type ResultComparisonTabContextData = {
  tab: ResultComparisonTab;
  setTab: (tab: ResultComparisonTab) => void;
};

const ResultComparisonTabContext = createContext<
  ResultComparisonTabContextData | undefined
>(undefined);

export function useResultComparisonTab() {
  const ctx = use(ResultComparisonTabContext);
  if (!ctx) {
    throw new Error("ResultComparisonTabContextが存在しません");
  }

  return ctx;
}

type Props = PropsWithChildren;

export function ResultComparisonTabProvider({ children }: Props) {
  const [tab, setTab] = useState<ResultComparisonTab>("relationships");

  return (
    <ResultComparisonTabContext value={{ tab, setTab }}>
      {children}
    </ResultComparisonTabContext>
  );
}
