import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";


import { projects } from "@/data/projects";

const Projects = () => {
    const [page, setPage] = useState(0);
    const projectsPerPage = 6; // Show more on the dedicated page
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    const startIndex = 0;
    const visibleProjects = projects.slice(
        startIndex,
        (page + 1) * projectsPerPage
    );

    const nextPage = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    const prevPage = () => {
        if (page > 0) setPage(page - 1);
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">


            <main className="pt-0">
                {/* Hero Section */}
                <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-black text-white overflow-hidden mb-16">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/projects-banner.png"
                            alt="Projects Hero"
                            className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
                    </div>

                    <div className="relative z-10 container mx-auto px-6 text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wider uppercase mb-6"
                        >
                            Our Portfolio
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
                        >
                            Selected Works
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
                        >
                            A showcase of our passion for design, innovation, and craftsmanship across residential and commercial projects.
                        </motion.p>
                    </div>
                </section>

                <div className="container mx-auto px-6 md:px-8">
                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
                        {visibleProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <Link to={`/projects/${project.id}`} className="block">
                                    <div className={`relative overflow-hidden rounded-2xl mb-4 ${project.aspect}`}>
                                        <img
                                            src={project.coverImage}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-2xl font-bold group-hover:text-gray-600 transition-colors">
                                                {project.title}
                                            </h3>
                                            <span className="text-sm font-medium text-gray-400 border border-gray-200 px-2 py-1 rounded-full">
                                                {project.year}
                                            </span>
                                        </div>
                                        <p className="text-gray-500">{project.location}</p>
                                        <p className="text-sm text-gray-400 mt-1">{project.category}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {visibleProjects.length < projects.length && (
                        <div className="flex justify-center mt-12">
                            <button
                                onClick={() => setPage(prev => prev + 1)}
                                className="px-8 py-3 border border-gray-800 text-gray-800 font-medium hover:bg-gray-800 hover:text-white transition-colors rounded-sm"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            </main>


        </div>
    );
};

export default Projects;
