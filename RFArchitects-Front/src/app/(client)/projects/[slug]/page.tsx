import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { fetchProjectBySlug } from "@/lib/api";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchProjectBySlug(slug);
  if (!data || !data.project) return { title: "Project Not Found" };
  const { project } = data;

  return {
    title: `${project.title} | RF Architects`,
    description: project.description?.substring(0, 160),
    openGraph: {
      images: [project.cover_image],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await fetchProjectBySlug(slug);
  if (!data || !data.project) {
    notFound();
  }

  const { project, navigation } = data;
  const { previousProject, nextProject } = navigation || {};

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      {/* Banner Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={project.cover_image}
            alt={project.title}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-end pb-12">
          <Link href="/projects" className="inline-flex items-center text-sm font-medium text-white/70 hover:text-white transition-colors mb-6 w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 tracking-tight">
            {project.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300 font-medium">
            <span>{project.location}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            <span>{project.year}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            <span>{project.category}</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className={`grid grid-cols-1 ${project.gallery_images?.length > 0 ? 'lg:grid-cols-12' : ''} gap-12 lg:gap-20`}>
          
          {/* Left Column (Text) */}
          <div className={`lg:col-span-5 ${project.gallery_images?.length > 0 ? 'lg:sticky lg:top-24 h-fit' : 'max-w-3xl mx-auto'}`}>
            <span className="inline-block py-1 px-3 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium tracking-wider uppercase mb-6 text-gray-600">
              {project.concept_label || "The Concept"}
            </span>
            
            {project.concept_subheading && (
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 leading-tight">
                {project.concept_subheading}
              </h2>
            )}
            
            <div className="prose prose-lg text-gray-600 max-w-none">
              <p className="whitespace-pre-line leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {/* Right Column (Gallery) */}
          {project.gallery_images?.length > 0 && (
            <div className="lg:col-span-7 space-y-8 md:space-y-12">
              {project.gallery_images.map((imgUrl: string, idx: number) => (
                <div key={idx} className="w-full overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={imgUrl}
                    alt={`${project.title} gallery image ${idx + 1}`}
                    className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Prev / Next Navigation */}
      <section className="container mx-auto px-6 pt-12 pb-8 border-t border-gray-200 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {previousProject ? (
            <Link href={`/projects/${previousProject.slug}`} className="group flex flex-col items-start w-full md:w-1/2 md:pr-8">
              <span className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2 group-hover:text-gray-900 transition-colors flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-2" />
                Previous Project
              </span>
              <span className="text-2xl md:text-3xl font-bold text-gray-900 line-clamp-1">{previousProject.title}</span>
            </Link>
          ) : <div className="w-full md:w-1/2" />}

          <div className="hidden md:block w-px h-16 bg-gray-200"></div>

          {nextProject ? (
            <Link href={`/projects/${nextProject.slug}`} className="group flex flex-col items-end w-full md:w-1/2 md:pl-8 text-right">
              <span className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2 group-hover:text-gray-900 transition-colors flex items-center">
                Next Project
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
              </span>
              <span className="text-2xl md:text-3xl font-bold text-gray-900 line-clamp-1">{nextProject.title}</span>
            </Link>
          ) : <div className="w-full md:w-1/2" />}
        </div>
      </section>
    </div>
  );
}
