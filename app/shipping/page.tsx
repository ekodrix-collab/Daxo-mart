import Link from "next/link";
import { Truck, Clock, ShieldCheck, Package, MapPin, ArrowLeft, Headphones, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | DAXOMART",
  description: "Learn about DAXOMART's 5 working days express courier shipping across India.",
};

const HIGHLIGHTS = [
  {
    icon: Clock,
    title: "5 Working Days Shipping",
    desc: "All orders across India are delivered within 5 working days from order confirmation via express courier.",
  },
  {
    icon: Truck,
    title: "Express Courier Partners",
    desc: "Dispatched via trusted national logistics partners: BlueDart, Delhivery, DTDC & XpressBees.",
  },
  {
    icon: Package,
    title: "Collector-Grade Packaging",
    desc: "Every 1:18, 1:24 & RC car is wrapped in 3-layer protective bubble wrap & heavy-duty hardboard boxes.",
  },
  {
    icon: ShieldCheck,
    title: "100% Insured Transit",
    desc: "Your shipment is fully protected against in-transit damage or loss until it reaches your doorstep.",
  },
];

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-cream font-pally py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-accent transition-colors duration-150 no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Header Hero Banner */}
        <div className="bg-dark2 border border-border rounded-2xl p-6 sm:p-10 mb-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent flex items-center gap-2">
              <Truck size={16} /> Official Shipping Guide
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wide font-pally mb-4">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
            At <strong className="text-cream">DAXOMART</strong>, we ensure your collectible diecast scale models, RC toys, and 3D display frames reach you safely, in pristine mint condition, within <span className="text-accent font-bold">5 working days</span>.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#141416] border border-[#222226] rounded-xl p-6 hover:border-accent/50 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Detailed Shipping Sections */}
        <div className="bg-dark2 border border-border rounded-2xl p-6 sm:p-10 space-y-8">

          {/* 1. Delivery Timeline */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              1. Delivery Timeline &amp; Express Shipping
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              We process and dispatch all orders within <strong className="text-white">24 to 48 hours</strong> of WhatsApp order confirmation. Final delivery takes <strong className="text-accent">5 working days</strong> from the dispatch date across major cities and pincodes in India.
            </p>
            <div className="bg-[#141416] border border-[#28282D] rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300 leading-normal">
                <strong>Standard Express Delivery:</strong> 5 Working Days via BlueDart, Delhivery, DTDC, or XpressBees Express Air/Surface logistics.
              </p>
            </div>
          </div>

          <div className="h-px bg-border/60" />

          {/* 2. Collector-Grade Protective Packaging */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              2. Collector-Grade Protective Packaging
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Diecast scale models are delicate precision art items. Every product is individually inspected for flawless paintwork, sealed inside 3-layer heavy bubble wrap, surrounded by shock-absorbing foam cushions, and placed inside a 5-ply corrugated shipping box labeled <em>"FRAGILE – HANDLE WITH CARE"</em>.
            </p>
          </div>

          <div className="h-px bg-border/60" />

          {/* 3. Tracking Your Order */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              3. Real-Time WhatsApp &amp; Courier Tracking
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              Once your package is handed over to the courier partner, you will receive an automatic tracking link and AWB number via WhatsApp to track your parcel live right up to delivery.
            </p>
          </div>

          <div className="h-px bg-border/60" />

          {/* 4. Undelivered / Wrong Address */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              4. Incorrect Address &amp; Delivery Attempts
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Our courier partners make up to 3 delivery attempts. Please ensure your mobile number and complete shipping address with pincode provided during WhatsApp checkout are accurate to prevent delivery delays.
            </p>
          </div>

          {/* Contact Bar */}
          <div className="bg-[#18181C] border border-[#2D2D35] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-3">
              <Headphones size={22} className="text-accent" />
              <div>
                <h4 className="text-sm font-bold text-white">Need Shipping Assistance?</h4>
                <p className="text-xs text-gray-400">Our customer support team is available on WhatsApp</p>
              </div>
            </div>
            <a
              href="https://wa.me/919048571147?text=Hi%20DAXOMART,%20I%20have%20a%20question%20about%20shipping%20and%20delivery."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent hover:bg-accent-lt text-dark font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg no-underline transition-colors shrink-0"
            >
              WhatsApp Support
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
