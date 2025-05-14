import { Outlet } from "react-router";
import { AppHeader } from "../components/app-header";

export default function AppLayout() {
	return (
		<div className="grid grid-rows-[auto_1fr] gap-4 h-full">
			<AppHeader />
			<Outlet />
		</div>
	);
}
