import type { BuildInProblemSet } from "~/models/problem";
import { allProblems } from "./all-problems";

export const buildInProblemSet: BuildInProblemSet[] = [
  {
    id: "1",
    title: "すべての問題セット",
    isBuildIn: true,
    problemIds: allProblems.map((p) => p.id),
  },
  {
    id: "2",
    title: "2問",
    isBuildIn: true,
    problemIds: allProblems.slice(0, 4).map((p) => p.id),
  },
];
