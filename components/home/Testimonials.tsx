const REVIEWS = [
  {
    name: "Saurav J.",
    init: "SJ",
    bg: "#c8a96e",
    stars: 5,
    text: "Absolute quality! The 1:24 Range Rover arrived perfectly packed. The detail is insane — looks exactly like the real thing on my shelf.",
  },
  {
    name: "Fatima R.",
    init: "FR",
    bg: "#7a9ecb",
    stars: 5,
    text: "Ordered the Rolls Royce Phantom for my brother's birthday. He was blown away. Fast delivery and premium packaging.",
  },
  {
    name: "Arjun M.",
    init: "AM",
    bg: "#7acb8a",
    stars: 5,
    text: "The RC car set is a huge hit with my kids. Great build quality, runs smooth. DaxoMart knows their toys!",
  },
  {
    name: "Priya L.",
    init: "PL",
    bg: "#cb7a8a",
    stars: 4,
    text: "The 3D display frame makes my collection look like a museum piece. Will definitely be ordering more.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white border-t border-gray-300 py-16">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[12px] font-bold tracking-[0.22em] uppercase text-accent mb-2">
            DAXOMART
          </p>
         
          <h2 className="text-[26px] font-bold uppercase tracking-[0.05em] text-dark">
            Hear From Our Happy Customers
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((r, i) => (
            <div key={i}
              className="testimonial-card bg-dark3 border border-border rounded-lg p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center
                             text-white font-bold text-[15px] shrink-0 border-2 border-border"
                  style={{ background: r.bg }}
                >
                  {r.init}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-cream">{r.name}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: r.stars }).map((_, j) => (
                      <span key={j} className="text-star text-[12px]">★</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-muted leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
