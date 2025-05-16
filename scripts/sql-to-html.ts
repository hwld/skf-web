import { codeToHtml } from "shiki";
import { allProblems } from "~/data/all-problems";

/**
 * allProblemsのsolutionのsqlをシンタックスハイライト済みのhtmlに変換する
 */
async function sqlToHtml(id?: string) {
  const filteredProblems = id
    ? allProblems.filter((p) => p.id === id)
    : allProblems;

  const result = await Promise.all(
    filteredProblems.map(async (problem) => {
      return {
        ...problem,
        solutions: await Promise.all(
          problem.solutions.map(async (solution) => {
            return {
              ...solution,
              sqlHtml: await codeToHtml(solution.sql, {
                lang: "sql",
                theme: "slack-dark",
              }),
            };
          }),
        ),
      };
    }),
  );

  const str = JSON.stringify(result);

  console.log(id !== undefined ? str.slice(1, -1) : str);
}

const args = process.argv.slice(2);
const problemId = args.length > 0 ? args[0] : undefined;
sqlToHtml(problemId);
