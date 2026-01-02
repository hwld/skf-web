import { Outlet } from "react-router";
import { ToastViewPort } from "~/components/toast-provider";
import { AppHeader } from "../components/app-header";

export default function AppLayout() {
  return (
    <div className="grid grid-rows-[auto_1fr] gap-2 h-full">
      <AppHeader />
      <Outlet />
      <ToastViewPort />
    </div>
  );
}
