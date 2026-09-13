import { NextRequest, NextResponse } from "next/server";

interface ResumeItem {
  section: string;
  title: string;
  subtitle: string | null;
  period: string | null;
  details: string | null;
  order: number;
}

// Client sends extracted text (parsed client-side), server parses structure
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body as { text: string };
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const items = parseLinkedInText(text);
    return NextResponse.json({ items });
  } catch (e) {
    console.error("[parse-resume]", e);
    return NextResponse.json({ error: "Failed to parse" }, { status: 500 });
  }
}

function parseLinkedInText(text: string): ResumeItem[] {
  const items: ResumeItem[] = [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  let mode: "none" | "experience" | "education" | "skills" = "none";
  let expOrder = 0;
  let eduOrder = 0;
  let skillOrder = 0;

  const expMarkers = ["경력", "Experience"];
  const eduMarkers = ["학력", "Education"];
  const skillMarkers = ["대표 보유기술", "Skills", "보유기술"];
  const stopMarkers = ["간단프로필", "연락처", "Languages", "Certifications", "Honors", "Sung-Hoon LEE"];

  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^Page \d+ of \d+$/.test(line)) { i++; continue; }

    if (expMarkers.includes(line)) { mode = "experience"; i++; continue; }
    if (eduMarkers.includes(line)) { mode = "education"; i++; continue; }
    if (skillMarkers.some((m) => line === m)) { mode = "skills"; i++; continue; }
    if (stopMarkers.some((m) => line.startsWith(m))) { mode = "none"; i++; continue; }

    if (mode === "experience") {
      if (!line.startsWith("-") && !line.startsWith("–") && !isPeriodLine(line)) {
        const company = line;
        let role: string | null = null;
        let period: string | null = null;
        let location: string | null = null;
        const details: string[] = [];

        i++;

        if (i < lines.length && !lines[i].startsWith("-") && !lines[i].startsWith("–") && !isPeriodLine(lines[i]) && !isSection(lines[i])) {
          role = lines[i]; i++;
        }

        if (i < lines.length && isPeriodLine(lines[i])) {
          period = normalizePeriod(lines[i]); i++;
        }

        // Skip page markers between sections
        while (i < lines.length && /^Page \d+/.test(lines[i])) i++;

        // Location line (may appear before or after period)
        if (i < lines.length && isLocationLine(lines[i])) {
          location = lines[i]; i++;
        }

        // Period might come after location (cross-page split)
        while (i < lines.length && /^Page \d+/.test(lines[i])) i++;
        if (!period && i < lines.length && isPeriodLine(lines[i])) {
          period = normalizePeriod(lines[i]); i++;
        }

        // Another location line after period
        while (i < lines.length && /^Page \d+/.test(lines[i])) i++;
        if (!location && i < lines.length && isLocationLine(lines[i])) {
          location = lines[i]; i++;
        }

        while (i < lines.length) {
          const l = lines[i];
          if (/^Page \d+/.test(l)) { i++; continue; }
          if (l.startsWith("-") || l.startsWith("–")) {
            let bullet = l.replace(/^[-–]\s*/, "").trim();
            i++;
            // Continuation: next line starts lowercase and is long enough
            while (i < lines.length && !lines[i].startsWith("-") && !lines[i].startsWith("–") && !isPeriodLine(lines[i]) && !isSection(lines[i]) && !/^Page \d+/.test(lines[i]) && !isLocationLine(lines[i]) && /^[a-z]/.test(lines[i]) && lines[i].length > 5) {
              bullet += " " + lines[i].trim(); i++;
            }
            details.push(bullet);
          } else {
            break;
          }
        }

        if (role || company) {
          expOrder++;
          items.push({
            section: "experience",
            title: role || company,
            subtitle: role ? `${company}${location ? " · " + location : ""}` : (location || null),
            period,
            details: details.length > 0 ? details.join("\n") : null,
            order: expOrder,
          });
        }
        continue;
      }
    }

    if (mode === "education") {
      if (!isSection(line) && !/^Page \d+/.test(line)) {
        const school = line;
        let degree: string | null = null;
        let period: string | null = null;

        i++;

        // Collect all continuation lines for this education entry
        // Lines belong to this entry if they contain: degree keywords, ·, dates, or opening/closing parens
        let combined = "";
        while (i < lines.length && !isSection(lines[i])) {
          const next = lines[i];
          if (/^Page \d+/.test(next)) { i++; continue; }
          // A new school entry starts with a line that has no digits, no ·, no parens
          // and we already have some combined text with a closing paren
          if (combined.includes(")") && !next.match(/\d{4}/) && !next.includes("·") && !next.startsWith("(")) break;
          combined += (combined ? " " : "") + next;
          i++;
          if (combined.includes(")") && combined.match(/\d{4}/)) break;
        }

        if (combined) {
          const periodMatch = combined.match(/\(([^)]+)\)/);
          if (periodMatch) {
            period = normalizePeriod(periodMatch[1]);
          }
          degree = combined.replace(/\([^)]*\)/g, "").replace(/·/g, "—").trim().replace(/^\s*—\s*/, "").replace(/\s*—\s*$/, "").trim();
          if (degree) degree = degree.replace(/\s+/g, " ");
        }

        eduOrder++;
        items.push({
          section: "education",
          title: degree || school,
          subtitle: degree ? school : null,
          period,
          details: null,
          order: eduOrder,
        });
        continue;
      }
    }

    if (mode === "skills") {
      if (!isSection(line)) {
        skillOrder++;
        items.push({
          section: "skills",
          title: line,
          subtitle: null,
          period: null,
          details: null,
          order: skillOrder,
        });
      }
    }

    i++;
  }

  return items;
}

function isPeriodLine(line: string): boolean {
  return /\d{4}/.test(line) && (line.includes("-") || line.includes("–") || line.includes("~") || /present/i.test(line));
}

function isLocationLine(line: string): boolean {
  const locations = ["서울", "Seoul", "대한민국", "미국", "US", "APAC", "아시아태평양", "Korea", "Japan", "Tokyo", "Singapore"];
  return locations.some((loc) => line.includes(loc)) && !isPeriodLine(line) && line.length < 30 && !line.includes("Media Contents Store");
}

function isSection(line: string): boolean {
  return ["경력", "Experience", "학력", "Education", "대표 보유기술", "Skills", "간단프로필", "연락처", "Languages", "Certifications"].includes(line);
}

function normalizePeriod(raw: string): string {
  return raw
    .replace(/년\s*/g, ".")
    .replace(/월/g, "")
    .replace(/\s*-\s*/g, " — ")
    .replace(/\s*–\s*/g, " — ")
    .replace(/\([^)]*\)/g, "")
    .replace(/Present/i, "Present")
    .trim();
}
