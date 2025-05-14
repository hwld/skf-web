import clsx from "clsx";
import { NavLink } from "react-router";
import { Paths } from "~/routes/paths";

export function AppHeader() {
	return (
		<header className="h-14 bg-base-800 border border-base-700 rounded-lg px-4 grid grid-cols-[auto_1fr] items-center gap-4">
			<img src="/logo.svg" alt="Logo" className="h-5" />
			<div className="flex gap-2">
				<AppHeaderLink
					to={Paths.home}
					iconClass="i-tabler-home"
					title="ホーム"
				/>
				<AppHeaderLink
					to={Paths.createProblem}
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
						"h-8 grid grid-cols-[auto_1fr] px-2 rounded-sm items-center gap-2 transition duration-100",
						isActive ? "bg-base-600" : "hover:bg-base-700",
					),
				)
			}
		>
			<span className={clsx(iconClass, "size-5")} />
			<p>{title}</p>
		</NavLink>
	);
}
