import { AppShell } from "@/components/layout/AppShell";
import { LEGAL_LAST_UPDATED } from "@/lib/site";

interface LegalPageProps {
  title: string;
  children: React.ReactNode;
}

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <AppShell>
      <article className="mx-auto max-w-3xl px-4 pb-16">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm text-white/50">Last updated: {LEGAL_LAST_UPDATED}</p>
        <div className="mt-8 space-y-8 text-sm leading-relaxed text-white/75">
          {children}
        </div>
      </article>
    </AppShell>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
