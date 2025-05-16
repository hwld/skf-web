import z from "zod";

export type Problem = {
  id: string;
  title: string;
  description: string;
  solutions: { sql: string; expectedCsv: string }[];
};

export const BuildInProblemSetSchema = z.object({
  id: z.string(),
  title: z.string(),
  problemIds: z.array(z.string()),
  isBuildIn: z.literal(true),
});

export type BuildInProblemSet = z.infer<typeof BuildInProblemSetSchema>;

export const CustomProblemSetSchema = z.object({
  id: z.string(),
  title: z.string(),
  problemIds: z.array(z.string()),
  isBuildIn: z.literal(false),
});

export type CustomProblemSet = z.infer<typeof CustomProblemSetSchema>;

export const ProblemSetSchema = z.union([
  BuildInProblemSetSchema,
  CustomProblemSetSchema,
]);

export type ProblemSet = z.infer<typeof ProblemSetSchema>;
