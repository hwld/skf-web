import { Tooltip as BaseTooltip } from "@base-ui-components/react";
import type { JSX, PropsWithChildren } from "react";

type Props = {
	label: string;
	trigger: JSX.Element;
};

export function Tooltip({ label, trigger }: Props) {
	return (
		<BaseTooltip.Root>
			<BaseTooltip.Trigger render={trigger} />
			<BaseTooltip.Portal>
				<BaseTooltip.Positioner sideOffset={10}>
					<BaseTooltip.Popup className="bg-neutral-700 border border-neutral-600 rounded-sm px-3 h-7 flex items-center text-neutral-100 shadow">
						{label}
					</BaseTooltip.Popup>
				</BaseTooltip.Positioner>
			</BaseTooltip.Portal>
		</BaseTooltip.Root>
	);
}

export function TooltipProvider(props: PropsWithChildren) {
	return <BaseTooltip.Provider {...props} />;
}
