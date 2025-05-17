import { Tooltip as BaseTooltip } from "@base-ui-components/react";
import type { JSX, PropsWithChildren, ReactNode } from "react";

type Props = {
  children: ReactNode;
  trigger: JSX.Element;
};

export function Tooltip({ children, trigger, ...props }: Props) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={trigger} {...props} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner sideOffset={10}>
          <BaseTooltip.Popup className="bg-base-800 border text-xs border-base-700 rounded-sm p-1 flex items-center text-base-100 shadow data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 opacity-100 transition-all duration-150 data-[side=top]:data-[starting-style]:translate-y-2 data-[side=top]:data-[ending-style]:translate-y-2 translate-y-0">
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
