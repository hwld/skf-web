import { type PropsWithChildren, createContext, use } from "react";
import { useLocalStorage } from "usehooks-ts";
import { buildInProblemSet } from "~/data/build-in-problem-set";
import type { CustomProblemSet, ProblemSet } from "~/models/problem";
import type { ProblemSetFormData } from "./problem-set-form";

type ProblemSetContextData = {
  problemSets: ProblemSet[];
  addProblemSet: (data: ProblemSetFormData) => void;
  removeProblemSet: (id: string) => void;
  updateProblemSet: (id: string, data: ProblemSetFormData) => void;
  importProblemSet: (problemSet: ProblemSet) => void;
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
  const [problemSets, setProblemSets] = useLocalStorage<CustomProblemSet[]>(
    "",
    [],
  );
  const allProblemSets = [...buildInProblemSet, ...problemSets];

  function addProblemSet(data: ProblemSetFormData) {
    setProblemSets((sets) => [
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
    const target = problemSets.find((set) => set.id === id);
    if (!target || target?.isBuildIn) {
      return;
    }

    setProblemSets((sets) => sets.filter((set) => set.id !== id));
  }

  function updateProblemSet(id: string, data: ProblemSetFormData) {
    const target = problemSets.find((set) => set.id === id);
    if (!target || target?.isBuildIn) {
      return;
    }

    setProblemSets((sets) =>
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

  function importProblemSet(problemSet: ProblemSet) {
    const exists = problemSets.find((set) => set.id === problemSet.id);
    if (exists) {
      return;
    }

    if (problemSet.isBuildIn) {
      return;
    }

    setProblemSets([...problemSets, problemSet]);
  }

  return (
    <ProblemSetsContext
      value={{
        problemSets: allProblemSets,
        addProblemSet,
        removeProblemSet,
        updateProblemSet,
        importProblemSet,
      }}
      {...props}
    />
  );
}
