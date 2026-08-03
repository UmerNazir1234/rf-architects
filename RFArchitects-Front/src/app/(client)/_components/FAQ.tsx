import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What types of design services does RF Architects provide?",
    answer: `RF Architects offers <strong>complete interior and exterior design solutions</strong>. Our services include:
<ul class="mt-2 space-y-1">
  <li>• Concept development & space planning</li>
  <li>• Architectural layout planning</li>
  <li>• Detailed design projects</li>
  <li>• High-quality 3D visualizations</li>
  <li>• Material and furniture selection</li>
  <li>• Renovation guidance</li>
  <li>• Full project supervision</li>
</ul>
<br/>
We design <strong>residential spaces, corporate offices, commercial interiors, façades, outdoor living areas, cafés, studios, and branded environments.</strong>`,
  },
  {
    question: "What is your design process from start to finish?",
    answer: `Our workflow is <strong>structured, transparent, and efficient</strong>:
<br/><br/>
<strong>• Initial Consultation</strong><br/>
We discuss your goals, style preferences, requirements, and budget.
<br/><br/>
<strong>• Tech Specifications & Site Measurements</strong><br/>
Our team examines the space, conducts detailed measurements, and evaluates technical conditions.
<br/><br/>
<strong>• Concept Development</strong><br/>
We prepare moodboards, color palettes, themes, and the initial creative direction.
<br/><br/>
<strong>• Design Project (Full Documentation)</strong><br/>
We prepare technical drawings including floor plans, furniture layouts, lighting plans, electrical schemes, and material specifications.
<br/><br/>
<strong>• 3D Visualization</strong><br/>
You receive realistic renders showing exactly how your space will look.
<br/><br/>
<strong>• Cost Estimation & Material List</strong><br/>
We provide a complete list of materials, furniture options, and estimated project cost.
<br/><br/>
<strong>• Execution & Supervision (Optional)</strong><br/>
We supervise the project to ensure the execution matches the approved design precisely.`,
  },
  {
    question: "How long does an interior or exterior design project take?",
    answer: `Timelines depend on <strong>project scale and complexity</strong>. Typical timelines:
<br/><br/>
<strong>• 1–2 weeks</strong> — Concept development<br/>
<strong>• 2–4 weeks</strong> — Design project preparation<br/>
<strong>• 1–3 weeks</strong> — 3D visualization
<br/><br/>
<em>Execution time varies based on materials, contractors, and project size.</em><br/>
Most complete design projects are delivered within <strong>3–8 weeks</strong>.`,
  },
  {
    question: "Do you only design large spaces or can you handle small rooms?",
    answer: `We design <strong>spaces of all sizes</strong>, including:
<ul class="mt-2 space-y-1">
  <li>• Bedrooms</li>
  <li>• Living rooms</li>
  <li>• Kitchens</li>
  <li>• Bathrooms</li>
  <li>• Balconies</li>
  <li>• Studio apartments</li>
  <li>• Small offices</li>
</ul>
<br/>
We specialize in <strong>maximizing small spaces</strong> with functional and creative layouts.`,
  },
  {
    question: "Do you work with international clients?",
    answer: `Yes, we work with <strong>clients worldwide</strong>. We provide:
<ul class="mt-2 space-y-1">
  <li>• Virtual consultations</li>
  <li>• Digital design presentations</li>
  <li>• Coordination with local contractors</li>
</ul>
<br/>
We ensure smooth project execution from any location.`,
  },
  {
    question: "Do you offer full project supervision?",
    answer: `Yes. We provide <strong>optional project supervision</strong>, where we:
<ul class="mt-2 space-y-1">
  <li>• Coordinate with contractors</li>
  <li>• Monitor material quality</li>
  <li>• Track progress</li>
  <li>• Ensure final result aligns with approved design</li>
</ul>`,
  },
  {
    question: "Can you work with my existing contractor or construction team?",
    answer: `Yes, we can <strong>collaborate with your existing contractor or construction team</strong>. Our detailed drawings and 3D visualizations make it easy for your team to execute the project accurately.`,
  },
];

const FAQ = () => {
  return (
    <section className="relative bg-[#F1F1F1] mx-auto px-6 md:px-8 py-16 md:py-24">
      <div className="">
        <div className="mb-12">
          <p className="text-[16px]  font-extrabold mb-8 uppercase">
            YOU MIGHT ASK US
          </p>

          <h2 className="text-4xl text-black sm:text-5xl md:text-6xl lg:text-[72px] font-bold">
            FAQ:
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-6  mb-16">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-3xl px-10 max-sm:px-4 border-none shadow-lg animate-fade-in hover:shadow-2xl transition-shadow duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AccordionTrigger className="text-xl max-sm:text-sm max-sm:py-4  font-bold hover:no-underline py-8 hover:text-accent transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-8 leading-relaxed text-base">
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div
            className="flex  justify-between text-center animate-fade-in"
            style={{ animationDelay: "500ms" }}
          >
            <p className="text-lg">If you want to know anything else:</p>
            <a
              href="tel:+923344738506"
              className="inline-block text-xl font-bold border-b-2 border-current pb-2 hover:text-accent hover:border-accent transition-all duration-300"
            >
              Ask your Question
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
