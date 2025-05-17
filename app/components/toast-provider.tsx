// [Toast · Base UI](https://base-ui.com/react/components/toast)

import { Toast } from "@base-ui-components/react";
import type { PropsWithChildren } from "react";

export function ToastProvider({ children }: PropsWithChildren) {
  return (
    <Toast.Provider>
      {children}
      <Toast.Viewport className="fixed top-auto right-[1rem] bottom-[1rem] mx-auto flex w-[250px] sm:right-[2rem] sm:bottom-[2rem] sm:w-[300px]">
        <ToastList />
      </Toast.Viewport>
    </Toast.Provider>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => {
    return (
      <Toast.Root
        key={toast.id}
        toast={toast}
        className="absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] mr-0 w-full [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+calc(var(--toast-index)*-15px)))_scale(calc(1-(var(--toast-index)*0.1)))] rounded-lg border border-base-600 bg-base-800 text-base-100 bg-clip-padding shadow-lg transition-all [transition-property:opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] select-none after:absolute after:bottom-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[''] data-[ending-style]:opacity-0 data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y)))] data-[starting-style]:[transform:translateY(150%)] data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] data-[ending-style]:[&:not([data-limited])]:[transform:translateY(150%)]"
        style={{
          ["--gap" as string]: "1rem",
          ["--offset-y" as string]:
            "calc(var(--toast-offset-y) * -1 + (var(--toast-index) * var(--gap) * -1) + var(--toast-swipe-movement-y))",
        }}
      >
        <div className="flex flex-col gap-3 pt-4 pl-4 pr-2 pb-2">
          <Toast.Title className="font-bold" />
          <div className="flex items-center gap-1 w-full justify-end">
            <Toast.Action className="h-7 rounded-sm border border-base-500 hover:bg-white/15  transition-all duration-150 px-2 grid grid-cols-[auto_1fr] items-center gap-1" />
          </div>
          <Toast.Close
            className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded border-none bg-transparent text-base-300 hover:bg-white/15 hover:text-base-100"
            aria-label="Close"
          >
            <span className="i-tabler-x" />
          </Toast.Close>
        </div>
      </Toast.Root>
    );
  });
}
