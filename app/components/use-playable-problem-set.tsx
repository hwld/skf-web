import { allProblemMap } from "~/data/all-problems";
import {
	ProblemSetSchema,
	type Problem,
	type ProblemSet,
} from "~/models/problem";
import { playProblemSetParamName } from "~/routes/paths";

type PlayableProblemSet = Omit<ProblemSet, "problemIds"> & {
	problems: Problem[];
};

export function usePlayableProblemSet(
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
		problems,
	};
}
