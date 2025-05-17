import { Dialog as BaseDialog } from "@base-ui-components/react";
import type { DialogTrigger } from "node_modules/@base-ui-components/react/esm/dialog/trigger/DialogTrigger";
import type { ReactNode } from "react";
import { IconButton } from "./icon-button";

export function Dialog({
  open,
  onOpenChange,
  onCloseAnimationEnd,
  trigger,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseAnimationEnd?: () => void;
  trigger: DialogTrigger.Props["render"];
  children: ReactNode;
}) {
  return (
    <BaseDialog.Root
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(open) => {
        if (!open) {
          onCloseAnimationEnd?.();
        }
      }}
    >
      <BaseDialog.Trigger render={trigger} />
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 bg-black opacity-50 duration-100 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <BaseDialog.Popup className="fixed top-1/2 right-1/2 w-[500px] bg-base-800 rounded-lg border border-base-600 translate-x-1/2 -translate-y-1/2 opacity-100 data-[starting-style]:opacity-0 data-[starting-style]:translate-y-[-40%] data-[ending-style]:opacity-0 data-[ending-style]:translate-y-[-40%] transition-all duration-150 ease-in-out p-4 flex flex-col gap-4">
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-end">
      <BaseDialog.Title className="font-bold text-base">
        {children}
      </BaseDialog.Title>
      <BaseDialog.Close render={<IconButton iconClass="i-tabler-x" />} />
    </div>
  );
}
