type Service = {
  title: string;
  image: string;
  description: string;
  embedUrl?: string;
};

const SERVICES: Service[] = [
  { title: "Interior Design", image: "/contact-banner.png", description: "Thoughtful interiors shaped around your lifestyle, comfort, and visual identity." },
  { title: "Exterior Design", image: "/1.jpeg", description: "Distinctive exterior concepts that respond to the site, climate, and architectural context." },
  { title: "2D Drawings", image: "/3.jpeg", description: "Clear technical drawings that communicate every important design decision." },
  { title: "3D Modeling", image: "/project-thumb-2.jpg", description: "Accurate digital models that help you understand the space before it is built.", embedUrl: "https://3d.rfarchitects.design/embed/6a54e27b3695efdb5a3efcb0" },
  { title: "Floor Plans", image: "/work-in-progress-3.jpg", description: "Efficient spatial layouts balancing movement, function, and everyday experience." },
  { title: "Elevations", image: "/projects-banner.png", description: "Detailed elevations showing proportions, materials, openings, and architectural character." },
  { title: "Sections", image: "/2.jpeg", description: "Precise sectional studies revealing levels, construction, and the relationship between spaces." },
  { title: "Working Drawings", image: "/4.jpeg", description: "Build-ready documentation that gives contractors a reliable guide for execution." },
];

const Services = () => {
  return (
    <section className="relative bg-[#121212] text-white" id="our-services">
      <div className="mx-auto px-6 py-16 md:px-8 md:py-24">
        <div className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-5 text-[16px] font-extrabold uppercase tracking-wide text-white/70">
              WHAT WE DO
            </p>
            <h2 className="max-w-3xl text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl lg:text-[72px]">
              Our Services
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-white/60">
            From the first idea to the final drawing, we shape spaces with clarity, detail, and purpose.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICES.map((service, index) => (
            <article
              key={service.title}
              className="group overflow-hidden rounded-md bg-white/6 ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="aspect-4/3 overflow-hidden bg-white/10">
                {service.embedUrl ? (
                  <iframe
                    src={service.embedUrl}
                    title={`${service.title} interactive model`}
                    className="h-full w-full border-0"
                    allow="fullscreen; autoplay; xr-spatial-tracking"
                    loading="lazy"
                  />
                ) : (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex items-start justify-between gap-4 p-5">
                <div>
                  <h3 className="text-lg font-semibold leading-tight">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{service.description}</p>
                </div>
                <span className="self-start text-xs tracking-widest text-white/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
