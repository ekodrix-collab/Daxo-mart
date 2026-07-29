import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Tag,
  Lock,
  Truck,
  HeartHandshake,
} from "lucide-react";
import FeedbackForm from "@/components/about/FeedbackForm";

export const metadata = {
  title: "About Us | DAXOMART",
  description: "Learn about DAXOMART and our mission to bring joy to every child with quality toys.",
};

const WHY_CHOOSE_US = [
  { icon: ShieldCheck, title: "Quality products" },
  { icon: Tag, title: "Affordable prices" },
  { icon: Lock, title: "Secure shopping" },
  { icon: Truck, title: "Fast delivery" },
  { icon: HeartHandshake, title: "Friendly customer support" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark text-cream font-pally py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-accent transition-colors duration-150 no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-dark2 border border-border rounded-xl p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3 mb-3">
          
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-cream mb-2">
            About Us
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-accent mb-4">
            Bringing Joy to Every Child
          </h2>
          <p className="text-cream text-lg font-medium mb-3">
            Welcome to <span className="font-bold text-accent">Daxo Mart</span>
          </p>
          <p className="text-base sm:text-md leading-relaxed">
            We are passionate about bringing smiles to children by offering a carefully selected collection of quality toys at affordable prices. From educational toys to fun gifts, we strive to provide products that inspire creativity, learning, and happiness.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="bg-dark2 border border-border rounded-xl p-6 sm:p-8 mb-8">
          <h3 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">

            Why Choose Us ?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY_CHOOSE_US.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-dark3/60 border border-border rounded-lg p-4 flex items-center gap-3 hover:border-accent/40 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-md bg-dark2 border border-border flex items-center justify-center shrink-0 text-accent">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-cream font-medium text-base">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Option */}
        <FeedbackForm />

        {/* Goal & Thank You Banner */}
        <div className="bg-dark2 border border-border rounded-xl p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <p className="text-muted text-base sm:text-md leading-relaxed mb-4">
            Our goal is to make toy shopping easy, safe, and enjoyable for every family.
          </p>
          <p className="text-accent font-bold text-lg sm:text-xl tracking-wide">
            Thank you for choosing Daxo Mart
          </p>
        </div>
      </div>
    </div>
  );
}

