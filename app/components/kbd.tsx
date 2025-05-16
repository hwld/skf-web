import type { PropsWithChildren } from "react";

export function Kbd({ children }: PropsWithChildren) {
  return (
    <kbd className="px-1.5 py-0.5 text-xs border border-base-500 rounded-sm flex items-center">
      {children}
    </kbd>
  );
}

export function KbdList({ children }: PropsWithChildren) {
  return <div className="flex gap-1 items-center">{children}</div>;
}
