import { Tooltip as BaseTooltip } from "@base-ui-components/react";
import type { JSX, PropsWithChildren, ReactNode } from "react";

type Props = {
  children: ReactNode;
  trigger: JSX.Element;
};

export function Tooltip({ children, trigger }: Props) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={trigger} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner sideOffset={10}>
          <BaseTooltip.Popup className="bg-neutral-700 border text-xs border-neutral-600 rounded-sm p-1 flex items-center text-neutral-100 shadow">
            {children}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}

export function TooltipProvider(props: PropsWithChildren) {
  return <BaseTooltip.Provider {...props} />;
}
