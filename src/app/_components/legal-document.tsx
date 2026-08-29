import { type ReactNode } from "react";

type LegalDocumentProps = {
  title: string;
  updated: string;
  children: ReactNode;
  subtitle?: string;
};

export function LegalDocument({
  title,
  updated,
  children,
  subtitle,
}: LegalDocumentProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-800 to-primary-900 px-4 py-28 font-text text-body">
      <article className="mx-auto w-full max-w-3xl rounded-2xl border border-body/10 bg-surface/80 p-6 shadow-2xl shadow-black/10 sm:p-10">
        <header className="mb-10 border-b border-body/10 pb-8">
          <p className="mb-2 font-subhead text-xs uppercase tracking-[0.22em] text-accent">
            Rechtliche Informationen
          </p>
          <h1 className="font-headline text-4xl leading-none text-headings sm:text-6xl">
            {title}
          </h1>
          {subtitle && <p className="mt-4 text-body/70">{subtitle}</p>}
          <p className="mt-4 text-xs text-body/45">Stand: {updated}</p>
        </header>

        <div className="space-y-9 leading-relaxed [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_h3]:mt-4 [&_h3]:font-subhead [&_h3]:text-lg [&_h3]:text-headings [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:space-y-2">
          {children}
        </div>
      </article>
    </main>
  );
}

export function LegalSection({
  title,
  children,
  id,
}: {
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id}>
      <h2 className="mb-3 font-subhead text-2xl text-headings">{title}</h2>
      {children}
    </section>
  );
}
