import { Progress } from "@base-ui-components/react";

type ProgressBarProps = { value: number };
export function ProgressBar({ value }: ProgressBarProps) {
	return (
		<Progress.Root value={value}>
			<Progress.Track className="h-1 bg-base-600 rounded-xl overflow-hidden">
				<Progress.Indicator className="block bg-primary-400" />
			</Progress.Track>
		</Progress.Root>
	);
}
