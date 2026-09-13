import Link from "next/link";
import Image from "next/image";

const contacts = [
  { label: "Seoul, KR", href: null, icon: "location" },
  { label: "aksoft1@naver.com", href: "mailto:aksoft1@naver.com", icon: "email" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shlee860104", icon: "linkedin" },
  { label: "GitHub", href: "https://github.com/aksoft13", icon: "github" },
];

function LocationIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
}
function EmailIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;
}
function LinkedInIcon() {
  return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
}
function GitHubIcon() {
  return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>;
}

function getIcon(type: string) {
  switch(type) {
    case "location": return <LocationIcon />;
    case "email": return <EmailIcon />;
    case "linkedin": return <LinkedInIcon />;
    case "github": return <GitHubIcon />;
    default: return null;
  }
}

function ContactLink({ c, children }: { c: typeof contacts[0]; children: React.ReactNode }) {
  if (c.href) return <Link href={c.href} target={c.href.startsWith("mailto") ? undefined : "_blank"} className="contents">{children}</Link>;
  return <>{children}</>;
}

export default function DesignsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
      <div>
        <h1 className="text-2xl font-bold mb-2">Contact Bar — 10 Designs</h1>
        <p className="text-muted text-sm mb-8">Pick one for the resume header</p>
      </div>

      {/* 1. Pill Badges */}
      <section>
        <p className="text-xs text-muted mb-3 uppercase tracking-widest">1. Pill Badges</p>
        <div className="flex flex-wrap gap-2">
          {contacts.map((c) => (
            <ContactLink key={c.label} c={c}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-full text-sm hover:border-[#555] transition-colors cursor-pointer">
                {getIcon(c.icon)}
                <span>{c.label}</span>
              </span>
            </ContactLink>
          ))}
        </div>
      </section>

      {/* 2. Card Grid */}
      <section>
        <p className="text-xs text-muted mb-3 uppercase tracking-widest">2. Card Grid</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {contacts.map((c) => (
            <ContactLink key={c.label} c={c}>
              <div className="flex flex-col items-center gap-2 p-4 bg-card-bg border border-border rounded-xl hover:border-[#444] transition-colors cursor-pointer">
                <span className="text-muted">{getIcon(c.icon)}</span>
                <span className="text-sm">{c.label}</span>
              </div>
            </ContactLink>
          ))}
        </div>
      </section>

      {/* 3. Underline Links */}
      <section>
        <p className="text-xs text-muted mb-3 uppercase tracking-widest">3. Underline with Icons</p>
        <div className="flex flex-wrap gap-6">
          {contacts.map((c) => (
            <ContactLink key={c.label} c={c}>
              <span className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground border-b border-transparent hover:border-foreground pb-0.5 transition-all cursor-pointer">
                {getIcon(c.icon)}
                <span>{c.label}</span>
              </span>
            </ContactLink>
          ))}
        </div>
      </section>

      {/* 4. Icon-only Circles */}
      <section>
        <p className="text-xs text-muted mb-3 uppercase tracking-widest">4. Icon Circles + Text Below</p>
        <div className="flex gap-6">
          {contacts.map((c) => (
            <ContactLink key={c.label} c={c}>
              <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-muted group-hover:text-foreground group-hover:border-[#555] transition-all">
                  {getIcon(c.icon)}
                </div>
                <span className="text-xs text-muted group-hover:text-foreground transition-colors">{c.label}</span>
              </div>
            </ContactLink>
          ))}
        </div>
      </section>

      {/* 5. Horizontal Dividers */}
      <section>
        <p className="text-xs text-muted mb-3 uppercase tracking-widest">5. Divider Separated</p>
        <div className="flex items-center divide-x divide-[#333]">
          {contacts.map((c) => (
            <ContactLink key={c.label} c={c}>
              <span className="inline-flex items-center gap-2 px-5 first:pl-0 text-sm text-muted hover:text-foreground transition-colors cursor-pointer">
                {getIcon(c.icon)}
                <span>{c.label}</span>
              </span>
            </ContactLink>
          ))}
        </div>
      </section>

      {/* 6. Ghost Buttons */}
      <section>
        <p className="text-xs text-muted mb-3 uppercase tracking-widest">6. Ghost Buttons</p>
        <div className="flex flex-wrap gap-2">
          {contacts.map((c) => (
            <ContactLink key={c.label} c={c}>
              <span className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#333] rounded-lg text-sm text-muted hover:text-foreground hover:bg-[#1a1a1a] transition-all cursor-pointer">
                {getIcon(c.icon)}
                <span>{c.label}</span>
              </span>
            </ContactLink>
          ))}
        </div>
      </section>

      {/* 7. Tag Style */}
      <section>
        <p className="text-xs text-muted mb-3 uppercase tracking-widest">7. Filled Tags</p>
        <div className="flex flex-wrap gap-2">
          {contacts.map((c) => (
            <ContactLink key={c.label} c={c}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#222] rounded-md text-sm hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                <span className="text-muted">{getIcon(c.icon)}</span>
                <span>{c.label}</span>
              </span>
            </ContactLink>
          ))}
        </div>
      </section>

      {/* 8. Left Bar Accent */}
      <section>
        <p className="text-xs text-muted mb-3 uppercase tracking-widest">8. Vertical List with Accent</p>
        <div className="space-y-2 max-w-xs">
          {contacts.map((c) => (
            <ContactLink key={c.label} c={c}>
              <div className="flex items-center gap-3 px-4 py-2.5 border-l-2 border-[#444] hover:border-foreground bg-card-bg rounded-r-lg transition-all cursor-pointer">
                <span className="text-muted">{getIcon(c.icon)}</span>
                <span className="text-sm">{c.label}</span>
              </div>
            </ContactLink>
          ))}
        </div>
      </section>

      {/* 9. Minimal Row with Dots */}
      <section>
        <p className="text-xs text-muted mb-3 uppercase tracking-widest">9. Dot Separated Minimal</p>
        <div className="flex flex-wrap items-center gap-1 text-sm">
          {contacts.map((c, idx) => (
            <ContactLink key={c.label} c={c}>
              <span className="inline-flex items-center cursor-pointer">
                {idx > 0 && <span className="text-[#333] mx-2">·</span>}
                <span className="text-muted hover:text-foreground transition-colors">{c.label}</span>
              </span>
            </ContactLink>
          ))}
        </div>
      </section>

      {/* 10. Glass Morphism Cards */}
      <section>
        <p className="text-xs text-muted mb-3 uppercase tracking-widest">10. Glass Cards</p>
        <div className="flex flex-wrap gap-3">
          {contacts.map((c) => (
            <ContactLink key={c.label} c={c}>
              <span className="inline-flex items-center gap-2.5 px-5 py-3 bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-xl text-sm hover:bg-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer">
                <span className="text-foreground/50">{getIcon(c.icon)}</span>
                <span>{c.label}</span>
              </span>
            </ContactLink>
          ))}
        </div>
      </section>

    </div>
  );
}
