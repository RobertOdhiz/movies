import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { WatchPlatformSync } from "./WatchPlatformSync";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <WatchPlatformSync />
      <Sidebar />
      <TopNav />
      <main className="app-main flex-1">{children}</main>
      <Footer />
    </div>
  );
}
