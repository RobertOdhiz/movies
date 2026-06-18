import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <Sidebar />
      <TopNav />
      <main className="pl-20 pt-24">{children}</main>
    </div>
  );
}
