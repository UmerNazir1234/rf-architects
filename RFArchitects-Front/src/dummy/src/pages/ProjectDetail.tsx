import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Tag, X, ArrowRight } from "lucide-react";


import { projects } from "@/data/projects";

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const containerRef = useRef(null);

    const projectIndex = projects.findIndex((p) => p.id === id);
    const project = projects[projectIndex];

    const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : projects[projects.length - 1];
    const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : projects[0];

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    useEffect(() => {
        if (!project) {
            // navigate("/projects"); 
        }
        window.scrollTo(0, 0);
    }, [project, navigate]);

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                    <Link to="/projects" className="text-blue-600 hover:underline">
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans" ref={containerRef}>


            <main>
                {/* Parallax Hero Section */}
                <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
                    <motion.div
                        style={{ y, opacity }}
                        className="absolute inset-0"
                    >
                        <img
                            src={project.coverImage}
                            alt={project.title}
                            className="w-full h-full object-cover scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                    </motion.div>

                    <div className="absolute inset-0 flex items-end pb-20 md:pb-32">
                        <div className="container mx-auto px-6 md:px-12">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="max-w-5xl"
                            >
                                <Link
                                    to="/projects"
                                    className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors group tracking-wide text-sm uppercase font-medium"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" />
                                    Back to Projects
                                </Link>
                                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-tighter leading-[0.9]">
                                    {project.title}
                                </h1>
                                <div className="flex flex-wrap gap-8 md:gap-12 text-white/90 text-xs md:text-sm font-bold uppercase tracking-widest border-t border-white/20 pt-8">
                                    <span className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-white/60" /> {project.location}
                                    </span>
                                    <span className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-white/60" /> {project.year}
                                    </span>
                                    <span className="flex items-center gap-3">
                                        <Tag className="w-4 h-4 text-white/60" /> {project.category}
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-24 md:py-40 bg-white">
                    <div className="container mx-auto px-6 md:px-12">
                        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                            {/* Sticky Description */}
                            <div className="lg:col-span-4 lg:sticky lg:top-40">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">The Concept</h3>
                                    <h2 className="text-3xl md:text-4xl font-serif font-medium mb-10 leading-tight text-gray-900">
                                        Crafting a unique narrative through space and light.
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed text-lg md:text-xl font-light text-justify">
                                        {project.description}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Masonry Gallery */}
                            <div className="lg:col-span-8 space-y-6 md:space-y-12">
                                {project.images.map((img, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 60 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-10%" }}
                                        transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                                        className={`rounded-sm overflow-hidden shadow-xl cursor-zoom-in group ${index % 3 === 0 ? 'aspect-[16/9]' : index % 2 === 0 ? 'aspect-[4/5] w-[80%] ml-auto' : 'aspect-[4/3] w-[90%]'
                                            }`}
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <div className="overflow-hidden w-full h-full relative">
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                                            <img
                                                src={img}
                                                alt={`${project.title} view ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Navigation */}
                <section className="border-t border-gray-100 bg-gray-50">
                    <div className="grid grid-cols-2">
                        <Link
                            to={`/projects/${prevProject.id}`}
                            className="group relative flex flex-col justify-center px-8 md:px-20 py-24 md:py-40 border-r border-gray-200 hover:bg-white transition-colors duration-500"
                        >
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 group-hover:text-black transition-colors">Previous Project</span>
                            <h3 className="text-2xl md:text-5xl font-serif text-gray-900 group-hover:translate-x-4 transition-transform duration-500">{prevProject.title}</h3>
                            <ArrowLeft className="absolute bottom-10 left-8 md:left-20 w-6 h-6 text-gray-300 group-hover:text-black transition-colors duration-300" />
                        </Link>
                        <Link
                            to={`/projects/${nextProject.id}`}
                            className="group relative flex flex-col justify-center items-end px-8 md:px-20 py-24 md:py-40 hover:bg-white transition-colors duration-500 text-right"
                        >
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 group-hover:text-black transition-colors">Next Project</span>
                            <h3 className="text-2xl md:text-5xl font-serif text-gray-900 group-hover:-translate-x-4 transition-transform duration-500">{nextProject.title}</h3>
                            <ArrowRight className="absolute bottom-10 right-8 md:right-20 w-6 h-6 text-gray-300 group-hover:text-black transition-colors duration-300" />
                        </Link>
                    </div>
                </section>

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4 md:p-12 backdrop-blur-sm"
                            onClick={() => setSelectedImage(null)}
                        >
                            <button
                                className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors p-2"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X className="w-10 h-10" />
                            </button>
                            <motion.img
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                src={selectedImage}
                                alt="Project Fullscreen"
                                className="max-w-full max-h-full object-contain shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>


        </div>
    );
};

export default ProjectDetail;
