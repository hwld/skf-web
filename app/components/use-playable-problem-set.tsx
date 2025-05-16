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

type PlayableProblemResult = Results<string[]> & { isTruncated: boolean };

export type PlayableProblem = Problem &
  (
    | { status: "idle" }
    | { status: "error"; message: string }
    | {
        status: "right" | "wrong";

        /**
         * SQLの実行結果
         */
        result: PlayableProblemResult;

        /**
         * 解答の実行結果
         */
        solutionResults: PlayableProblemResult[];
      }
  );

export type PlayableProblemSet = Omit<ProblemSet, "problemIds"> & {
  playableProblems: PlayableProblem[];
};

export type ProblemNavigator = {
  currentProblem: PlayableProblem;
  progressRate: number;
  isFirstProblem: boolean;
  isLastProblem: boolean;
  nextProblem: () => void;
  prevProblem: () => void;
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
};

export function usePlayableProblemSet(
  params: URLSearchParams,
): UsePlayableProblemSet {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [playableProblemSet, setPlayableProblemSet] = useState(
    initialPlayableProblemSet(params),
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
    setPlayableProblemSet((prev) => {
      const problemResults = prev.playableProblems.map(
        (problem): PlayableProblem => {
          if (problem.id !== problemId) {
            return problem;
          }

          return {
            ...problem,
            status,
            result: result.user,
            solutionResults: result.solutions,
          };
        },
      );

      return { ...prev, playableProblems: problemResults };
    });
  }

  return {
    problemNavigator: {
      currentProblem,
      progressRate,
      isFirstProblem,
      isLastProblem,
      nextProblem,
      prevProblem,
    },
    playableProblemSet,
    changeProblemStatus,
    setErrorResult,
  };
}

function initialPlayableProblemSet(
  params: URLSearchParams,
): PlayableProblemSet {
  const rawParams = params.get(playProblemSetParamName);
  if (!rawParams) {
    throw new Error("ProblemSet not found");
  }

  const problemSet = ProblemSetSchema.parse(JSON.parse(rawParams));
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
