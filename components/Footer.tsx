import { site } from "@/content/site";
import { Container } from "./ui";

export default function Footer() {
  const { education, certificates, line, copyright } = site.footer;
  const groups = [education, certificates];
  return (
    <footer className="border-t-(length:--border-width) border-line py-16 text-sm">
      <Container>
        <div className="grid gap-10 md:grid-cols-2">
          {groups.map((group) => (
            <div key={group.label}>
              <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
                {group.label}
              </h2>
              <ul className="mt-4 space-y-2 leading-relaxed">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-14 max-w-2xl leading-relaxed text-text/75">{line}</p>
        <p className="mt-8 font-mono text-xs text-text-muted">{copyright}</p>
      </Container>
    </footer>
  );
}
