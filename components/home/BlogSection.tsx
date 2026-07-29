import Image from "next/image";
import Link from "next/link";

const POSTS = [
  {
    title: "How to Start Your Diecast Collection in 2025",
    excerpt: "Whether you're a seasoned collector or just getting started, here's everything you need to know about building a stunning diecast display.",
    date: "Jan 15, 2025",
    cat: "Guides",
    img: "/images/car-suv.png",
  },
  {
    title: "The Best 1:18 Scale Models for Your Shelf",
    excerpt: "We round up the most stunning, high-detail 1:18 scale models that will make any display cabinet look like a proper showroom.",
    date: "Jan 22, 2025",
    cat: "Top Picks",
    img: "/images/car-pickup.png",
  },
  {
    title: "RC Cars vs Diecast – Which Should You Buy?",
    excerpt: "Both are fun, but serve different purposes. We break down the pros and cons so you can pick the right one for your needs.",
    date: "Feb 3, 2025",
    cat: "Comparison",
    img: "/images/rc-car.png",
  },
];

export default function BlogSection() {
  return (
    <section className="py-16 bg-dark2">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-[22px] font-bold uppercase tracking-[0.06em] text-cream">Blog Posts</h2>
            <p className="text-[13px] text-muted mt-1">Tips, guides and collector stories</p>
          </div>
          <Link href="/blog"
            className="text-[12px] font-bold tracking-[0.08em] uppercase text-accent
                       hover:text-accent-lt transition-colors duration-150 no-underline flex items-center gap-1">
            View All <span>→</span>
          </Link>
        </div>

        <div className="section-rule" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POSTS.map((post, i) => (
            <div key={i}
              className="blog-card bg-dark3 border border-border rounded-lg overflow-hidden
                         cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]
                         hover:border-accent transition-all duration-200">
              <div className="overflow-hidden bg-dark" style={{ aspectRatio: "16/10" }}>
                <Image
                  src={post.img}
                  alt={post.title}
                  width={500}
                  height={312}
                  className="blog-img w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-accent mb-2">
                  {post.cat} · {post.date}
                </p>
                <h3 className="text-[15px] font-bold text-cream leading-snug mb-2">{post.title}</h3>
                <p className="text-[13px] text-muted leading-relaxed">{post.excerpt}</p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 mt-4 text-[12px] font-bold
                             tracking-[0.06em] uppercase text-accent hover:text-accent-lt
                             transition-colors duration-150 no-underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
