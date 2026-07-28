import Link from "next/link";

const CATEGORIES = [
  { label: "1:24",     path: "/products", img: "/images/car-suv.png" },
  { label: "1:18",     path: "/products", img: "/images/car-phantom.png" },
  { label: "RC TOYS",  path: "/products", img: "/images/rc-car-white.png" },
  { label: "Licensed", path: "/products", img: "/images/rc-car-formula.png" },
];

export default function Categories() {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 border-b border-[#e8e0d8]">
      {/* Title */}
      <h2 className="text-center text-[22px] sm:text-[26px] md:text-[28px] font-black tracking-[0.18em] uppercase text-[#1a1714] mb-8 sm:mb-12 font-pally">
        Shop By Category
      </h2>

      {/* Circle Grid / Row — Responsive sizing on mobile vs desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 max-w-[1100px] mx-auto px-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            href={cat.path}
            className="group flex flex-col items-center gap-3 sm:gap-4 no-underline"
          >
            {/* Circle container */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full bg-[#3d2b1f] border-4 border-[#3d2b1f] overflow-hidden flex items-center justify-center shrink-0 transition-all duration-200 group-hover:-translate-y-2 group-hover:shadow-[0_16px_40px_rgba(61,43,31,0.32)]">
              <img
                src={cat.img}
                alt={cat.label}
                className="w-full h-full object-cover object-center rounded-full block"
              />
            </div>

            {/* Label */}
            <span className="text-[13px] sm:text-[15px] font-bold tracking-wide text-[#1a1714] font-pally text-center">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
