import { Outlet } from "react-router-dom";

export default function AppShell() {
  return (
    <div>
      {/* TODO: TopBar */}
      <main>
        <Outlet />
      </main>
      {/* TODO: BottomNav */}
    </div>
  );
}
