import { Separator } from "@base-ui-components/react";
import clsx from "clsx";
import { NavLink } from "react-router";
import logoUrl from "~/assets/logo.svg";
import { Paths } from "~/routes/paths";

export function AppHeader() {
  return (
    <header className="px-4 py-2  grid grid-cols-[auto_auto_1fr] items-center gap-4">
      <img src={logoUrl} alt="Logo" className="h-5 w-11" />
      <Separator orientation="horizontal" className="w-[1px] h-full bg-base-700" />
      <div className="flex gap-2">
        <AppHeaderLink
          to={Paths.home}
          iconClass="i-tabler-home"
          title="ホーム"
        />
        <AppHeaderLink
          to={Paths.createProblemSet}
          iconClass="i-tabler-folder-plus"
          title="問題セット作成"
        />
      </div>
    </header>
  );
}

type AppHeaderLinkProps = { to: string; iconClass: string; title: string };
function AppHeaderLink({ to, iconClass, title }: AppHeaderLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          clsx(
            "h-8 grid grid-cols-[auto_1fr] px-2 rounded-sm items-center gap-1 transition duration-100 border border-transparent",
            isActive ? "bg-base-700" : "hover:bg-base-800 text-base-400 hover:text-base-100",
          ),
        )
      }
    >
      <span className={clsx(iconClass, "size-4")} />
      <p>{title}</p>
    </NavLink>
  );
}
