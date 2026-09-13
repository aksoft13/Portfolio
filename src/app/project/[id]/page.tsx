import { getProject, getRelatedProjects } from "@/lib/safeDb";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) notFound();

  const project = await getProject(numId);
  if (!project) notFound();

  const relatedProjects = await getRelatedProjects(numId);

  return (
    <div className="max-w-[1000px] mx-auto px-10 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors mb-8"
      >
        &larr; Back to all projects
      </Link>

      {/* Video / Thumbnail */}
      {project.videoUrl || project.videoFile ? (
        <div className="mb-8 rounded-lg overflow-hidden">
          <VideoPlayer
            videoUrl={project.videoUrl}
            videoType={project.videoType}
            videoFile={project.videoFile}
          />
        </div>
      ) : project.thumbnail ? (
        <div className="relative mb-8 aspect-video rounded-lg overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
            sizes="1000px"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[72px] h-[72px] border-2 border-white/50 rounded-full flex items-center justify-center hover:border-white hover:scale-110 transition-all cursor-pointer">
              <div className="w-0 h-0 border-l-[18px] border-l-white border-t-[11px] border-t-transparent border-b-[11px] border-b-transparent ml-1" />
            </div>
          </div>
        </div>
      ) : null}

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 mb-16">
        <div>
          <h1 className="text-[32px] font-bold mb-4">{project.title}</h1>
          {project.description && (
            <p className="text-[#999] text-[15px] leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          )}
        </div>
        <div className="space-y-5 pt-2">
          <div>
            <div className="text-[11px] uppercase tracking-[2px] text-[#555] mb-1">
              Category
            </div>
            <div className="text-sm text-[#ccc]">{project.category}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[2px] text-[#555] mb-1">
              Year
            </div>
            <div className="text-sm text-[#ccc]">{project.year}</div>
          </div>
        </div>
      </div>

      {/* Stills */}
      {project.images.length > 0 && (
        <div className="mb-16">
          <h2 className="text-sm uppercase tracking-[2px] text-[#555] mb-5">
            Stills & Posters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-video rounded-lg overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`${project.title} - ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related */}
      {relatedProjects.length > 0 && (
        <div>
          <h2 className="text-sm uppercase tracking-[2px] text-[#555] mb-5">
            Other Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedProjects.map((rp) => (
              <Link
                key={rp.id}
                href={`/project/${rp.id}`}
                className="group relative aspect-video rounded-md overflow-hidden"
              >
                {rp.thumbnail ? (
                  <Image
                    src={rp.thumbnail}
                    alt={rp.title}
                    fill
                    className="object-cover transition-all duration-400 group-hover:scale-105 group-hover:brightness-50"
                    sizes="33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-card-bg" />
                )}
                <span className="absolute bottom-3 left-3 text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {rp.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
