import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, Database, UserCheck, ArrowLeft, Headphones } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | DAXOMART",
  description: "Read DAXOMART's Privacy Policy and data protection standards.",
};

export default function PrivacyPolicyPage() {
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

        {/* Header Hero */}
        <div className="bg-dark2 border border-border rounded-2xl p-6 sm:p-10 mb-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent flex items-center gap-2">
              <ShieldCheck size={16} /> Data Protection &amp; Security
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wide font-pally mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
            At <strong className="text-cream">DAXOMART</strong>, we respect your personal privacy. This Privacy Policy details how we collect, protect, and use your information when you shop for scale models, RC toys, and frames on our platform.
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="bg-dark2 border border-border rounded-2xl p-6 sm:p-10 space-y-8">

          {/* 1. Information We Collect */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Lock size={18} className="text-accent" />
              1. Information We Collect
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              We collect minimal customer information required exclusively to process, pack, and ship your orders:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-400 space-y-2 pl-2">
              <li><strong className="text-gray-200">Contact Details:</strong> Full Name, Mobile Phone Number, and Email Address.</li>
              <li><strong className="text-gray-200">Delivery Information:</strong> House/Building Address, City, State, and Pincode.</li>
              <li><strong className="text-gray-200">Order Logs:</strong> Purchased model items, quantity, scale preferences, and WhatsApp order notes.</li>
            </ul>
          </div>

          <div className="h-px bg-border/60" />

          {/* 2. How We Use Your Data */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Eye size={18} className="text-accent" />
              2. How We Use Your Data
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your personal information is strictly used for order fulfillment, courier shipping label generation, dispatch notifications, and customer support on WhatsApp. We <strong className="text-accent">NEVER</strong> sell, rent, share, or trade your personal data with third-party advertisers or marketing databases.
            </p>
          </div>

          <div className="h-px bg-border/60" />

          {/* 3. WhatsApp Checkout & Security */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <UserCheck size={18} className="text-accent" />
              3. WhatsApp Order Security
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Order confirmations and queries are transmitted over end-to-end encrypted WhatsApp communication (`+91 9048571147`). Our site uses modern SSL/TLS 256-bit encryption to safeguard all web data transmissions.
            </p>
          </div>

          <div className="h-px bg-border/60" />

          {/* 4. Cookies & Analytics */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Database size={18} className="text-accent" />
              4. Cookies &amp; Local Storage
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              DAXOMART uses standard web browser local storage and cookies strictly to maintain your active shopping cart items, temporary checkout state, and preferred filter selections.
            </p>
          </div>

          <div className="h-px bg-border/60" />

          {/* 5. Contact Information */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <FileText size={18} className="text-accent" />
              5. Contact Us Regarding Privacy
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              If you have any questions or wish to request deletion of your address or contact record, please reach out to our privacy compliance officer via WhatsApp support.
            </p>
            <a
              href="https://wa.me/919048571147?text=Hi%20DAXOMART,%20I%20have%20a%20privacy%20policy%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-lt text-dark font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg no-underline transition-colors"
            >
              Contact Privacy Team
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
