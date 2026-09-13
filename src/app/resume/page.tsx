import { db } from "@/db";
import { resumes } from "@/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

const sectionLabels: Record<string, string> = {
  experience: "Experience",
  education: "Education",
  skills: "Skills",
};

const sectionOrder = ["experience", "education", "skills"];

const fallbackResume = [
  // Experience
  { id: 1, section: "experience", title: "Contents Creative Manager", subtitle: "키노라이츠 (Kinolights) · Seoul", period: "2026.6 — Present", details: "Planned and produced Korean posters and trailers from overseas source content\nManaged KMRB rating submissions end to end\nDelivered final distribution-ready assets formatted to IPTV and OTT partner specifications", order: 1 },
  { id: 2, section: "experience", title: "Video Editor", subtitle: "디즈니 (Disney) · APAC", period: "2024.5 — 2026.5", details: "Edited short-form promos, sports sizzles, trailers, and social cutdowns\nAdapted broadcast and online videos into short-form social content across platforms\nProduced aspect ratio versions (16:9, 1:1, 9:16, CTV)\nLocalized content across APAC markets", order: 2 },
  { id: 3, section: "experience", title: "Producer / Video Editor", subtitle: "Republic Pictures · Seoul", period: "2023.2 — 2024.4", details: "Produced promotional content for broadcast and OTT\nManaged content production for KT/Genie TV Promotion Channel\nOrchestrated film & drama introduction program production", order: 3 },
  { id: 4, section: "experience", title: "Freelance Trailer Editor", subtitle: "Netflix · US", period: "2022.7 — 2023.4", details: "Executed production of original Korean content trailers", order: 4 },
  { id: 5, section: "experience", title: "Media Technician", subtitle: "Iyuno · Seoul", period: "2022.10 — 2023.1", details: "Executed localization operations including audio dubbing and subtitle synchronization\nFinal Quality Control (QC) procedures and efficient transcoding", order: 5 },
  { id: 6, section: "experience", title: "Video Editor", subtitle: "Media Nikke · Seoul", period: "2022.2 — 2022.8", details: "End-to-end full-length production of imported films, dramas, and documentaries\nSpecialization in audio-visual editing and re-production techniques", order: 6 },
  { id: 7, section: "experience", title: "Video Editor", subtitle: "Nextview · Seoul", period: "2020.6 — 2021.4", details: "Comprehensive film editing, enhancing drama trailers, and preparing compelling previews", order: 7 },
  { id: 8, section: "experience", title: "Video Editor", subtitle: "Media Contents Store · Seoul", period: "2019.8 — 2020.5", details: "End-to-end production and re-production of international films, TV series, and documentaries", order: 8 },
  { id: 9, section: "experience", title: "Trailer Editor", subtitle: "PEEPS · Seoul", period: "2018.9 — 2019.7", details: "Commercial movie trailers, drafts, and unique film projects\nProduction of LG u+ introduction programs", order: 9 },
  { id: 10, section: "experience", title: "Video Editor", subtitle: "MCPENF · Seoul", period: "2017.6 — 2018.6", details: "Post-production for high-profile clients\nPromotional and advertisement campaigns\nLarge-scale exhibition video productions", order: 10 },
  // Education
  { id: 11, section: "education", title: "Master of Arts — Advertising & PR", subtitle: "Korea University Graduate School of Media (고려대학교 미디어대학원)", period: "2025.3 — 2027.8", details: "Research: mobile video advertising, OTT viewing behaviors, persuasive media effects", order: 1 },
  { id: 12, section: "education", title: "Bachelor of Arts — Interpretation & Translation English / Business Administration (Double Major)", subtitle: "Dongguk University (동국대학교)", period: "2011.3 — 2015.2", details: null, order: 2 },
  { id: 13, section: "education", title: "Associate Degree — Computer Electronics", subtitle: "Myongji College (명지전문대학)", period: "2004.3 — 2009.2", details: null, order: 3 },
  // Skills
  { id: 14, section: "skills", title: "Production", subtitle: null, period: null, details: "Trailer Editing · Movie Poster · Short-form Content · Social Cutdowns · Sizzle Reels · Multi-format Assets (16:9, 1:1, 9:16, CTV)", order: 1 },
  { id: 15, section: "skills", title: "Strategy & Planning", subtitle: null, period: null, details: "Content Planning · Data-driven Marketing · OTT & IPTV Distribution · KMRB Rating · Cross-cultural Localization (APAC)", order: 2 },
  { id: 16, section: "skills", title: "AI & Technology", subtitle: null, period: null, details: "Agentic AI Workflows · Claude Code · AI-augmented Editing & Design · Data-informed Content Decisions", order: 3 },
];

export default async function ResumePage() {
  let resumeItems: Array<{
    id: number;
    section: string;
    title: string;
    subtitle: string | null;
    period: string | null;
    details: string | null;
    order: number;
  }> = [];

  try {
    resumeItems = await Promise.race([
      db
        .select()
        .from(resumes)
        .orderBy(asc(resumes.section), asc(resumes.order)),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 3000)
      ),
    ]);
  } catch {
    // DB not available
  }

  const items = resumeItems.length > 0 ? resumeItems : fallbackResume;

  const grouped = sectionOrder
    .map((section) => ({
      section,
      label: sectionLabels[section] || section,
      items: items.filter((item) => item.section === section),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-start gap-8 mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden shrink-0 border-2 border-border">
            <Image
              src="/profile.jpg"
              alt="Sung-Hoon LEE"
              width={112}
              height={112}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="pt-1">
            <h1 className="text-4xl font-bold mb-2">Sung-Hoon LEE <span className="text-muted font-normal text-2xl">(Genie)</span></h1>
            <p className="text-muted text-lg mb-3">
              Data and AI-driven Movie Poster & Trailer Video Editor
            </p>
            <div className="flex flex-wrap gap-6">
              <span className="inline-flex items-center gap-2 text-sm text-muted border-b border-transparent pb-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                Seoul, South Korea
              </span>
              <Link href="mailto:aksoft1@naver.com" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground border-b border-transparent hover:border-foreground pb-0.5 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                aksoft1@naver.com
              </Link>
              <Link href="https://www.linkedin.com/in/shlee860104" target="_blank" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground border-b border-transparent hover:border-foreground pb-0.5 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </Link>
              <Link href="https://github.com/aksoft13" target="_blank" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground border-b border-transparent hover:border-foreground pb-0.5 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </Link>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-card-bg border border-border rounded-xl p-6 text-sm text-foreground/80 leading-relaxed space-y-4">
          <p>
            I am a video editor and content creator at Kinolights, where I work across movie poster and trailer production, overseas content acquisition and planning, and data-driven marketing. With a background in English Translation, Business Administration, and graduate-level Advertising/PR studies at Korea University, I bridge storytelling, audience psychology, and performance-driven content creation.
          </p>
          <p>
            At Kinolights, I collaborate with content planning, acquisition, and marketing teams to turn imported titles into localized assets that strengthen viewer engagement and brand consistency. Beyond production, I am exploring how data-based AI tools can support smarter content decisions, from acquisition and planning to creative execution and campaign optimization.
          </p>
          <div>
            <p className="mb-2">My approach combines:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/60">
              <li>Narrative editing grounded in emotional pacing</li>
              <li>Data-informed decisions using performance metrics such as view-through rates and retention curves</li>
              <li>OTT and content strategy aligned with global market trends</li>
              <li>Cross-cultural communication, supported by bilingual proficiency and media research</li>
              <li>AI-augmented workflows leveraging agentic AI tools across editing, design concepting, and marketing strategy</li>
            </ul>
          </div>
          <p>
            Currently, I am pursuing a Master&apos;s degree in Media (Advertising &amp; PR) at Korea University, where my research explores mobile video advertising, OTT viewing behaviors, and persuasive media effects. I am passionate about roles at the intersection of storytelling and data-driven production within the film, OTT, marketing, and digital media space.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-12">
        {grouped.map((group) => (
          <section key={group.section}>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-6 border-b border-border pb-3">
              {group.label}
            </h2>
            <div className="space-y-6">
              {group.items.map((item) => (
                <div key={item.id} className="flex gap-6">
                  {item.period && (
                    <div className="w-36 shrink-0 text-sm text-muted pt-0.5">
                      {item.period}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-sm text-muted mt-1">
                        {item.subtitle}
                      </p>
                    )}
                    {item.details && (
                      <ul className="list-disc list-inside text-sm text-foreground/70 mt-2 space-y-0.5">
                        {item.details.split("\n").map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
