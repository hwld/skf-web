import { useState } from "react";
import { allProblemMap } from "~/data/all-problems";
import { shuffle } from "~/lib/shuffle";
import {
	type Problem,
	type ProblemSet,
	ProblemSetSchema,
} from "~/models/problem";
import { playProblemSetParamName } from "~/routes/paths";

export type PlayableProblem = Problem &
	(
		| { status: "idle" }
		| {
				status: "success" | "error";

				/**
				 * SQLの実行結果
				 */
				resultCsv: string;
		  }
	);

type PlayableProblemSet = Omit<ProblemSet, "problemIds"> & {
	playableProblems: PlayableProblem[];
};

export function usePlayableProblemSet(params: URLSearchParams) {
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

	function changeProblemStatus(
		problemId: string,
		status: "success" | "error",
		resultCsv: string,
	) {
		setPlayableProblemSet((prev) => {
			const problemResults = prev.playableProblems.map((problem) => {
				if (problem.id !== problemId) {
					return problem;
				}

				return {
					...problem,
					status,
					resultCsv,
				};
			});

			return { ...prev, playableProblems: problemResults };
		});
	}

	return {
		playableProblemSet,
		currentProblem,
		isFirstProblem,
		isLastProblem,
		nextProblem,
		prevProblem,
		changeProblemStatus,
		progressRate,
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
