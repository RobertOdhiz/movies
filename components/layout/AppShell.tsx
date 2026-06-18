import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { WatchPlatformSync } from "./WatchPlatformSync";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <WatchPlatformSync />
      <Sidebar />
      <TopNav />
      <main className="flex-1 pl-20 pt-24">{children}</main>
      <Footer />
    </div>
  );
}
