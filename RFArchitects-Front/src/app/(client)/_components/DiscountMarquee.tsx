const discounts = [
  { value: "25%", text: "Transforming Spaces, Enriching Lives" },
  { value: "20%", text: "Designing Experiences, Not Just Spaces" },
  { value: "12%", text: "End-to-End Project Management - Residential & Commercial Projects" }
];

const DiscountMarquee = () => {
  return (
    <div className="py-4 bg-cover bg-[#F1DFC2] relative overflow-hidden border-y border-border/50">
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...discounts, ...discounts, ...discounts, ...discounts].map((discount, index) => (
            <div key={index} className="inline-flex items-baseline mx-12">
              {/* <span className="text-2xl font-bold mr-6">- {discount.value}</span> */}
              <span className="text-xl text-muted-foreground font-light">{discount.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscountMarquee;
