import Link from "next/link";
import { ArrowLeft, Mail, Phone, Clock, MessageSquareHeart } from "lucide-react";

export const metadata = {
  title: "Contact Us | DAXOMART",
  description: "Get in touch with DAXOMART. We are here to help with your order, products, or any assistance you need.",
};

const PHONE_NUMBER = "919048571147";
const DEFAULT_WA_MESSAGE = "Hello Daxo Mart! I have an inquiry.";

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "support@daxomart.com",
    href: "mailto:support@daxomart.com",
    external: false,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9048571147",
    href: `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(DEFAULT_WA_MESSAGE)}`,
    external: true,
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Monday – Saturday\n9:00 AM – 6:00 PM",
    href: null,
    external: false,
  },
];

export default function ContactPage() {
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
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-cream mb-2">
            Contact Us
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-accent mb-4">
            We're here to help!
          </h2>
          <p className="text-base sm:text-md leading-relaxed">
            If you have any questions about your order, products, or need assistance, feel free to contact us.
          </p>
        </div>

        {/* Get in Touch */}
        <div className="bg-dark2 border border-border rounded-xl p-6 sm:p-8 mb-8">
          <h3 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
            Get in Touch
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CONTACT_INFO.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-dark3/60 border border-border rounded-lg p-5 flex flex-col items-start gap-3 hover:border-accent/40 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-md bg-dark2 border border-border flex items-center justify-center shrink-0 text-accent">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                      {item.label}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="text-cream font-medium text-sm hover:text-accent transition-colors duration-150 no-underline break-all"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-cream font-medium text-sm whitespace-pre-line leading-relaxed">
                        {item.value}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Response Guarantee & Thank You Banner */}
        <div className="bg-dark2 border border-border rounded-xl p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <p className="text-muted text-base sm:text-md leading-relaxed mb-6">
            We aim to respond to all inquiries within <span className="font-bold text-cream">24 hours</span>.
          </p>
          <div className="w-full h-px bg-border my-6" />
          <p className="text-accent font-bold text-lg sm:text-xl tracking-wide">
            Thank you for shopping with Daxo Mart
          </p>
        </div>
      </div>
    </div>
  );
}
