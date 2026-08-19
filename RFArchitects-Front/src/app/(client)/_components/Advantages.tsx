

const Advantages = () => {
  return (
    <section className="relative bg-[#F1F1F1] mx-auto px-6 md:px-8 py-16 md:py-24">
      <div className=" ">
        {/* Header block */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-start mb-10">
          <div className="space-y-1">
            <div className="text-[16px] font-extrabold">
              WHY PEOPLE CHOOSE US
            </div>
          </div>
        </div>
        <div
          className="
            grid grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-2 
            lg:grid-cols-4 
            gap-10
          "
        >
          {/* Row 1: Title (standalone on md and sm, centered on lg) */}
          <div
            className="
              col-span-1 
              sm:col-span-2 
              md:col-span-2 
              lg:col-span-3 
              flex justify-start lg:justify-center text-center
              mb-4
            "
          >
            <h2
              className="
                text-4xl sm:text-5xl md:text-6xl lg:text-[72px] 
                leading-[1.1] font-bold 
                 whitespace-nowrap
              "
            >
              Advantages:
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6 mt-10">
          {/* Brand tile (large, left) */}
          <div className="col-span-12 md:col-span-4 rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden">
            <img
              src="/beautifully-decorated-living-room-interior.jpg"
              alt="RF ARCHITECTS brand"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Big living room (center wide) */}
          <div className="col-span-12 md:col-span-6 rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden relative">
            <img
              src="/luxury-bedroom-with-bed-and-nightstands.jpg"
              alt="Unique Design Aesthetic"
              className="w-full h-full object-cover"
            />
            <div className="absolute left-4 bottom-4 md:left-6 md:bottom-6 text-white text-sm font-medium">
              Unique Design
              <br /> Aesthetic
            </div>
          </div>

          {/* Right stacked small tiles */}
          <div className="col-span-12 md:col-span-2 grid grid-rows-2 gap-4 md:gap-6">
            <div className="rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden">
              <img
                src={
                  "/material-selection.jpg"
                }
                alt="Serious Attention to Detail"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden">
              <img
                src={
                  "/travertine-dining-table-sculptural.jpg"
                }
                alt="Innovative Solutions"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bottom row left — stat style card */}
          <div className="col-span-12 md:col-span-4 rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden">
            <img
              src="/modern-minimalist-coffee-table.jpg"
              alt="Projects are launched"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom row middle — client oriented */}
          <div className="col-span-12 md:col-span-4 rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden">
            <img
              src={
                "/contemporary-home-office-desk-setup.jpg"
              }
              alt="Client-oriented Approach"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom row right — clean still life */}
          <div className="col-span-12 md:col-span-4 rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden">
            <img
              src={
                "/rustic-wood-dining-table.jpg"
              }
              alt="Serious Attention to Detail"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
