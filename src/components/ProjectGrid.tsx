"use client";

import Link from "next/link";
import Image from "next/image";

interface Project {
  id: number;
  title: string;
  category: string;
  year: number;
  thumbnail: string | null;
  videoType: string | null;
  thumbPosition?: string | null;
}

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/project/${project.id}`}
          className="group relative block aspect-video rounded-md overflow-hidden"
        >
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-all duration-600 ease-out group-hover:scale-[1.04] group-hover:brightness-[0.4]"
              style={project.thumbPosition ? { objectPosition: project.thumbPosition } : undefined}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-card-bg flex items-center justify-center">
              <svg
                className="w-12 h-12 text-muted/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-lg font-semibold translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              {project.title}
            </h3>
            <p className="text-[13px] text-white/60 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-[50ms]">
              {project.category} &middot; {project.year}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
