import type { ProblemSet } from "~/models/problem";

export const playProblemSetParamName = "problemSets";

export const Paths = {
  home: "/",

  createProblem: "/problem-sets/create",

  playProblemSet: (problemSet: ProblemSet) => {
    const searchParams = new URLSearchParams();
    searchParams.set(playProblemSetParamName, JSON.stringify(problemSet));

    return `/problem-sets/play?${searchParams.toString()}`;
  },
};
