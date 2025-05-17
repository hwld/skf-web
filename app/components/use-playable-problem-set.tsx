import type { Results } from "@electric-sql/pglite";
import { useState } from "react";
import { allProblemMap } from "~/data/all-problems";
import { shuffle } from "~/lib/shuffle";
import {
  type Problem,
  type ProblemSet,
  ProblemSetSchema,
} from "~/models/problem";
import { playProblemSetParamName } from "~/routes/paths";
import { useProblemSets } from "./use-problem-sets";

type PlayableProblemResult = Results<string[]> & { isTruncated: boolean };

export type PlayableProblem = Problem &
  (
    | { status: "idle" }
    | { status: "error"; message: string }
    | {
        status: "right" | "wrong";
        result: PlayableProblemResult;
        solutionResults: PlayableProblemResult[];
      }
  );

export type PlayableProblemSet = Omit<ProblemSet, "problemIds"> & {
  playableProblems: PlayableProblem[];
  /**
   * 共有された問題セットで、所持していないか
   */
  isShared: boolean;
};

export type ProblemNavigator = {
  currentProblem: PlayableProblem;
  progressRate: number;
  isFirstProblem: boolean;
  isLastProblem: boolean;
  nextProblem: () => void;
  prevProblem: () => void;
  selectProblem: (id: string) => void;
};

export type UsePlayableProblemSet = {
  problemNavigator: ProblemNavigator;
  playableProblemSet: PlayableProblemSet;
  changeProblemStatus: (
    id: string,
    state: "right" | "wrong",
    result: { user: PlayableProblemResult; solutions: PlayableProblemResult[] },
  ) => void;
  setErrorResult: (id: string, message: string) => void;
  reset: () => void;
};

type UsePlayableProblemSetParams = {
  initialParams: URLSearchParams;
  onAllRight?: () => void;
};

export function usePlayableProblemSet({
  initialParams,
  onAllRight,
}: UsePlayableProblemSetParams): UsePlayableProblemSet {
  const [problemSet] = useState(parseProblemSet(initialParams));
  const { problemSets } = useProblemSets();
  const isSharedProblemSet = !problemSets.find(
    (set) => set.id === problemSet.id,
  );

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [playableProblemSet, setPlayableProblemSet] = useState(
    createPlayableProblemSet(problemSet),
  );

  const currentProblem =
    playableProblemSet.playableProblems[currentProblemIndex];

  const progressRate =
    ((currentProblemIndex + 1) / playableProblemSet.playableProblems.length) *
    100;

  const isFirstProblem = currentProblemIndex === 0;

  const isLastProblem =
    currentProblemIndex + 1 >= playableProblemSet.playableProblems.length;

  function nextProblem() {
    if (isLastProblem) {
      return;
    }

    setCurrentProblemIndex((index) => index + 1);
  }

  function prevProblem() {
    if (isFirstProblem) {
      return;
    }

    setCurrentProblemIndex((index) => index - 1);
  }

  function selectProblem(id: string) {
    const index = playableProblemSet.playableProblems.findIndex(
      (problem) => problem.id === id,
    );
    if (index !== -1) {
      setCurrentProblemIndex(index);
    }
  }

  function setErrorResult(problemId: string, message: string) {
    setPlayableProblemSet((prev) => {
      const playableProblems = prev.playableProblems.map(
        (problem): PlayableProblem => {
          if (problem.id !== problemId) {
            return problem;
          }

          return { ...problem, status: "error", message };
        },
      );

      return { ...prev, playableProblems };
    });
  }

  function changeProblemStatus(
    problemId: string,
    status: "right" | "wrong",
    result: {
      user: PlayableProblemResult;
      solutions: PlayableProblemResult[];
    },
  ) {
    const newProblems = playableProblemSet.playableProblems.map((problem) => {
      if (problem.id !== problemId) {
        return problem;
      }

      return {
        ...problem,
        status,
        result: result.user,
        solutionResults: result.solutions,
      };
    });

    if (newProblems.every((problem) => problem.status === "right")) {
      onAllRight?.();
    }

    setPlayableProblemSet((prev) => ({
      ...prev,
      playableProblems: newProblems,
    }));
  }

  function reset() {
    setCurrentProblemIndex(0);
    setPlayableProblemSet(createPlayableProblemSet(problemSet));
  }

  return {
    problemNavigator: {
      currentProblem,
      progressRate,
      isFirstProblem,
      isLastProblem,
      nextProblem,
      prevProblem,
      selectProblem,
    },
    playableProblemSet: { ...playableProblemSet, isShared: isSharedProblemSet },
    changeProblemStatus,
    setErrorResult,
    reset,
  };
}

function parseProblemSet(params: URLSearchParams) {
  const rawParams = params.get(playProblemSetParamName);
  if (!rawParams) {
    throw new Error("ProblemSet not found");
  }

  return ProblemSetSchema.parse(JSON.parse(rawParams));
}

function createPlayableProblemSet(
  problemSet: ProblemSet,
): Omit<PlayableProblemSet, "isShared"> {
  const problems = problemSet.problemIds.map((id) => {
    const problem = allProblemMap.get(id);
    if (!problem) {
      throw new Error(`Problem not found: ${id}`);
    }

    return problem;
  });

  return {
    id: problemSet.id,
    title: problemSet.title,
    isBuildIn: problemSet.isBuildIn,
    playableProblems: shuffle(
      problems.map((p) => ({
        ...p,
        status: "idle",
      })),
    ),
  };
}
