

import { motion } from "framer-motion";
import team1 from "../../public/beautifully-decorated-living-room-interior.jpg";
import team2 from '../../public/ceramic-top-dining-table.jpg';
import team3 from '../../public/concrete-modern-dining-table.jpg';
import team4 from '../../public/elegant-wooden-bookshelf-with-decor.jpg';
import team5 from '../../public/glass-top-dining-table.jpg';

const About = () => {
  const team = [
    { img: team1, name: "John Doe", role: "Principal Architect" },
    { img: team2, name: "Jane Smith", role: "Interior Designer" },
    { img: team3, name: "Michael Brown", role: "Project Manager" },
    { img: team4, name: "Emily Davis", role: "Landscape Architect" },
    { img: team5, name: "David Wilson", role: "Senior Architect" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">


      <main className="pt-0">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-end pb-20 max-sm:pb-8 justify-end bg-black text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/about-banner.png"
              alt="About Hero"
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
              Our Story
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight"
            >
              Crafting Spaces <br /> That <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Inspire</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              We believe architecture is more than just buildings; it's about creating environments that elevate the human experience.
            </motion.p>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
                Visionary Design, <br /> Timeless Execution.
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  RF Architects is a premier architectural firm dedicated to transforming visions into reality. With a passion for innovative design and a commitment to excellence, we create spaces that are not only visually stunning but also functional and sustainable.
                </p>
                <p>
                  Our team of experienced architects and designers works closely with clients to understand their unique needs and aspirations. From residential projects to commercial developments, we bring a personalized approach to every undertaking.
                </p>
              </div>
              <div className="pt-4">
                <div className="grid grid-cols-2 gap-8 border-t border-gray-200 pt-8">
                  <div>
                    <h4 className="text-4xl font-bold text-gray-900 mb-2">150+</h4>
                    <p className="text-gray-500">Projects Completed</p>
                  </div>
                  <div>
                    <h4 className="text-4xl font-bold text-gray-900 mb-2">15+</h4>
                    <p className="text-gray-500">Years Experience</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={team1}
                  alt="Our Office"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gray-100 rounded-full -z-10" />
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gray-900/5 rounded-full -z-10" />
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose Us</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                We bring a unique blend of creativity and technical expertise to every project.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Innovative Design", desc: "We push the boundaries of creativity to deliver unique and inspiring solutions that stand the test of time." },
                { title: "Client-Centric", desc: "Your vision is our priority. We collaborate closely with you at every step to ensure the final result exceeds expectations." },
                { title: "Sustainable Practices", desc: "We are committed to environmentally responsible design, utilizing green materials and energy-efficient systems." }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                    <span className="text-xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">Meet Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                The creative minds and technical experts behind our exceptional designs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-xl shadow-lg mb-6 aspect-[3/4]">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="font-medium">View Profile</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-gray-500 font-medium uppercase tracking-wide text-sm">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>


    </div>
  );
};

export default About;
