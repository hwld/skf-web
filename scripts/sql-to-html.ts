import { codeToHtml } from "shiki";
import { allProblems } from "~/data/all-problems";

/**
 * allProblemsのsolutionのsqlをシンタックスハイライト済みのhtmlに変換する
 */
async function sqlToHtml() {
  const result = await Promise.all(
    allProblems.map(async (problem) => {
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

  console.log(JSON.stringify(result));
}

sqlToHtml();
