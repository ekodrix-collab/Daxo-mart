import Link from "next/link";

const FRAMES = [
  { id: 13, name: "3D CAR DISPLAY FRAME – ORANGE EDITION",   price: 1999, img: "/images/display-frame.png",      tag: "Sale" },
  { id: 14, name: "3D CAR DISPLAY FRAME – BLUE EDITION",     price: 2199, img: "/images/display-frame-blue.png", tag: "Sale" },
  { id: 15, name: "3D CAR DISPLAY FRAME – DARK EDITION",     price: 1799, img: "/images/display-frame-dark.png", tag: "Sale" },
];

export default function FramesSection() {
  return (
    <section className="bg-white py-12 md:py-16 border-b border-[#e8e0d8]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-[26px] sm:text-[32px] md:text-[34px] font-black text-[#1a1714] uppercase tracking-wide font-pally leading-tight">
            3D Car Frame
          </h2>
          <p className="text-[13px] sm:text-[14px] text-gray-500 font-pally mt-1">
            Wall-mounted diorama display frames for serious collectors
          </p>
        </div>

        {/* Responsive 3-Card Grid — fills container width on desktop, 1 col on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FRAMES.map((frame) => (
            <Link
              key={frame.id}
              href={`/products/${frame.id}`}
              className="group flex flex-col no-underline cursor-pointer transition-transform duration-200 hover:-translate-y-1"
            >
              {/* Image Box — Full fill cover, no grey gaps */}
              <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-3.5">
                <img
                  src={frame.img}
                  alt={frame.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                {/* Sale Badge */}
                <span className="absolute bottom-3 left-3 bg-[#1a1714] text-white text-[11px] font-bold tracking-wider px-3 py-1 rounded font-pally">
                  {frame.tag}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1a1714] uppercase tracking-wide leading-snug line-clamp-2 mb-1.5 font-pally">
                {frame.name}
              </h3>

              {/* Price */}
              <p className="text-[15px] sm:text-[16px] font-bold text-[#1a1714] font-pally">
                Rs. {frame.price.toLocaleString("en-IN")}.00
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
