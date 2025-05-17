import { type PropsWithChildren, createContext, use } from "react";
import { useLocalStorage } from "usehooks-ts";
import { buildInProblemSet } from "~/data/build-in-problem-set";
import type { ProblemSet } from "~/models/problem";
import type { ProblemSetFormData } from "./problem-set-form";

type ProblemSetContextData = {
  problemSets: ProblemSet[];
  addProblemSet: (data: ProblemSetFormData) => void;
  removeProblemSet: (id: string) => void;
  updateProblemSet: (id: string, data: ProblemSetFormData) => void;
};

const ProblemSetsContext = createContext<ProblemSetContextData | undefined>(
  undefined,
);

export function useProblemSets() {
  const ctx = use(ProblemSetsContext);
  if (!ctx) {
    throw new Error("problemSetsProviderが存在しません");
  }
  return ctx;
}

export function ProblemSetsProvider(props: PropsWithChildren) {
  const [value, setValue] = useLocalStorage<ProblemSet[]>("", []);
  const allProblemSets = [...buildInProblemSet, ...value];

  function addProblemSet(data: ProblemSetFormData) {
    setValue((sets) => [
      ...sets,
      {
        id: crypto.randomUUID(),
        isBuildIn: false,
        title: data.title,
        problemIds: data.problemIds.map(({ value }) => value),
      },
    ]);
  }

  function removeProblemSet(id: string) {
    setValue((sets) => sets.filter((s) => s.id !== id));
  }

  function updateProblemSet(id: string, data: ProblemSetFormData) {
    setValue((sets) =>
      sets.map((set) => {
        if (id !== set.id) {
          return set;
        }

        return {
          ...set,
          title: data.title,
          problemIds: data.problemIds.map(({ value }) => value),
        };
      }),
    );
  }

  return (
    <ProblemSetsContext
      value={{
        problemSets: allProblemSets,
        addProblemSet,
        removeProblemSet,
        updateProblemSet,
      }}
      {...props}
    />
  );
}
