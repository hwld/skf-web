export type Problem = {
  id: string;
  title: string;
  description: string;
  solutions: { sql: string; expectedCsv: string }[];
};

export type BuildInProblemSet = {
  id: string;
  title: string;
  problemIds: string[];
  isBuildIn: true;
};

export type CustomProblemSet = {
  id: string;
  title: string;
  problemsIds: string[];
  isBuildIn: false;
};

export type ProblemSet = BuildInProblemSet | CustomProblemSet;
