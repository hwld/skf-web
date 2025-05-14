import clsx from "clsx";
import type { PlayableProblem } from "./use-playable-problem-set";

type Props = { status: PlayableProblem["status"] };

export function ProblemStatusBadge({ status }: Props) {
	const statusClass = {
		idle: "i-tabler-circle text-base-100",
		success: "i-tabler-circle-check text-green-400",
		error: "i-tabler-exclamation-circle text-red-400",
	}[status];

	return <span className={clsx(statusClass, "size-6")} />;
}
