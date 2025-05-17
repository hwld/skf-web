import clsx from "clsx";
import { NavLink } from "react-router";
import { Paths } from "~/routes/paths";

export function AppHeader() {
  return (
    <header className="h-12 bg-base-900 border border-base-700 rounded-md px-4 grid grid-cols-[auto_1fr] items-center gap-4">
      <img src="/logo.svg" alt="Logo" className="h-4" />
      <div className="flex gap-1">
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
            "h-7 grid grid-cols-[auto_1fr] px-2 rounded-sm items-center gap-1 transition duration-100 border border-transparent",
            isActive ? "bg-base-700" : "hover:border-base-600",
          ),
        )
      }
    >
      <span className={clsx(iconClass, "size-4")} />
      <p>{title}</p>
    </NavLink>
  );
}
