import type { Results } from "@electric-sql/pglite";
import z from "zod";

export type Problem = {
  id: string;
  title: string;
  description: string;
  solutions: {
    sql: string;
    expectedResult: { fields: string[]; rows: string[][] };
  }[];
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

export function isProblemResultEqual(
  actual: Results<string[]>,
  expected: { fields: string[]; rows: string[][] },
) {
  if (
    actual.fields.length !== expected.fields.length ||
    !actual.fields.every((f, i) => f.name === expected.fields[i])
  ) {
    return false;
  }

  if (actual.rows.length !== expected.rows.length) {
    return false;
  }

  for (let i = 0; i < actual.rows.length; i++) {
    const aRow = actual.rows[i];
    const eRow = expected.rows[i];

    if (aRow.length !== eRow.length || !aRow.every((v, j) => v === eRow[j])) {
      return false;
    }
  }

  return true;
}
