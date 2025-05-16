import { Tabs } from "@base-ui-components/react";
import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";

export function Panel({ children, ...others }: PropsWithChildren) {
  return (
    <div
      {...others}
      className="w-full h-full flex flex-col border border-base-700 rounded-(--rounded) min-w-0"
      style={{ ["--rounded" as string]: "8px" }}
    >
      {children}
    </div>
  );
}

export function PanelHeader({ children, ...others }: PropsWithChildren) {
  return (
    <div
      {...others}
      className="h-9 bg-base-700 w-full flex items-center px-2 gap-2 shrink-0 rounded-t-(--rounded)"
    >
      {children}
    </div>
  );
}

export function PanelBody({
  children,
  noPadding,
  noOverflow,
  ...props
}: { children?: ReactNode; noPadding?: boolean; noOverflow?: boolean }) {
  return (
    <div
      {...props}
      className={clsx(
        "bg-base-800 grow peer-[.footer]:rounded-b-none rounded-b-(--rounded)",
        noPadding ? "" : "p-4",
        noOverflow ? "" : "overflow-auto",
      )}
    >
      {children}
    </div>
  );
}

export function PanelFooter({ children }: PropsWithChildren) {
  return (
    <div className="bg-base-700 p-2 flex items-center justify-end rounded-b-(--rounded) footer">
      {children}
    </div>
  );
}

type PanelTitleProps = { iconClass: string; title: string };

export function PanelTitle({ iconClass, title }: PanelTitleProps) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-1 items-center text-base-100">
      <span className={clsx(iconClass, "size-5")} />
      <p>{title}</p>
    </div>
  );
}

type TabPanelTitleProps = { iconClass: string; title: string };

export function TabPanelTitle({ iconClass, title }: TabPanelTitleProps) {
  return (
    <Tabs.Tab
      className="grid grid-cols-[auto_1fr] gap-1 items-center h-7 px-2 rounded-sm transition duration-100 data-[selected]:text-base-100 text-base-400 hover:text-base-100 hover:bg-white/15"
      value={title}
    >
      <span className={clsx(iconClass, "size-5")} />
      <p>{title}</p>
    </Tabs.Tab>
  );
}

export function TabPanelIndicator() {
  return (
    <Tabs.Indicator className="absolute h-px bottom-[calc(var(--active-tab-bottom)-1px)] rounded-sm w-(--active-tab-width) translate-x-(--active-tab-left) bg-base-100 transition duration-200 ease-in-out" />
  );
}
