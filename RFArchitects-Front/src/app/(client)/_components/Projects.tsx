import { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { fetchProjects } from "@/lib/api";

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const projectsPerPage = 3;

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchProjects();
      if (data) {
        setProjects(data);
      }
    };
    loadProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = page * projectsPerPage;
  const visibleProjects = projects.slice(
    startIndex,
    startIndex + projectsPerPage
  );

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <section className="relative bg-[#F1F1F1] mx-auto px-6 md:px-8 py-16 md:py-24" id="projects">
      <div className=" ">
        <div className="border-t-4 border-black -mt-20 sm:-mt-28 mb-8"></div>

        {/* Header with navigation */}
        <div className="mb-10 sm:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <p className="text-[16px]  font-extrabold mb-8 uppercase">
              WHAT WE PROUD OF
            </p>

            <h2 className="text-4xl text-black sm:text-5xl md:text-6xl lg:text-[72px] font-bold">
              Our Projects:
            </h2>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-10 sm:gap-16 md:gap-24 lg:gap-36">
            <button
              onClick={prevPage}
              disabled={page === 0}
              className={`flex items-center gap-4 text-gray-500 transition-all duration-300 ${page === 0 ? "opacity-40" : "hover:text-black"
                }`}
            >
              <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white shadow hover:scale-110 transition-transform duration-300">
                <ArrowLeftIcon size={18} />
              </span>
              <span className="text-xs sm:text-sm">Previous</span>
            </button>

            <button
              onClick={nextPage}
              disabled={page >= totalPages - 1}
              className={`flex items-center gap-4 text-gray-500 transition-all duration-300 ${page >= totalPages - 1 ? "opacity-40" : "hover:text-black"
                }`}
            >
              <span className="text-xs sm:text-sm">Next</span>
              <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white shadow hover:scale-110 transition-transform duration-300">
                <ArrowRightIcon size={18} />
              </span>
            </button>
          </div>
        </div>

        {/* Cards (responsive size) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 items-start">
          {visibleProjects.map((project, index) => (
            <Link
              href={`/projects/${project.slug}`}
              key={project.id || index}
              className="group cursor-pointer rounded-2xl sm:rounded-3xl transition-transform duration-500 ease-out hover:-translate-y-3 sm:hover:-translate-y-4 block"
            >
              <div
                className={`relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[4/3] bg-gray-200`}
              >
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="w-full h-full object-cover block"
                />
              </div>
              <div className="mt-4 sm:mt-5">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-sm sm:text-base md:text-lg -mb-[2px]">
                  {project.location}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {project.year}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Link */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            href="/projects"
            className="inline-block text-base sm:text-lg md:text-xl font-bold border-b-2 border-current pb-1 sm:pb-2 hover:text-accent hover:border-accent transition-all duration-300"
          >
            All the Projects
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
