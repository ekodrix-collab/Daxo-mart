import Link from "next/link";
import { Scale, CheckSquare, AlertCircle, ShoppingBag, ShieldCheck, ArrowLeft, Headphones } from "lucide-react";

export const metadata = {
  title: "Terms of Use | DAXOMART",
  description: "Read DAXOMART's Terms of Use and customer agreement.",
};

export default function TermsOfUsePage() {
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
              <Scale size={16} /> Official Store Agreement
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wide font-pally mb-4">
            Terms of Use
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
            Welcome to <strong className="text-cream">DAXOMART</strong>. By placing an order, browsing our products, or communicating with us, you agree to comply with the terms and conditions outlined below.
          </p>
        </div>

        {/* Main Terms Content */}
        <div className="bg-dark2 border border-border rounded-2xl p-6 sm:p-10 space-y-8">

          {/* 1. General Store Terms */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <CheckSquare size={18} className="text-accent" />
              1. General Agreement &amp; Eligibility
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              DAXOMART specializes in premium diecast scale model cars (1:18, 1:24, 1:32), remote control toys, and wall-mounted 3D display diorama frames. All sales are intended for individual collectors, enthusiasts, and general retail customers.
            </p>
          </div>

          <div className="h-px bg-border/60" />

          {/* 2. Order Placement & WhatsApp Confirmation */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <ShoppingBag size={18} className="text-accent" />
              2. Order Confirmation &amp; Processing
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              Orders initiated on the site are sent via WhatsApp to our official store number (`+91 9048571147`).
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-400 space-y-2 pl-2">
              <li>An order is considered confirmed once verified by our support representative on WhatsApp.</li>
              <li>DAXOMART reserves the right to decline orders due to stock unavailability or incorrect shipping details.</li>
            </ul>
          </div>

          <div className="h-px bg-border/60" />

          {/* 3. Pricing & Taxes */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Scale size={18} className="text-accent" />
              3. Pricing, Discounts &amp; Availability
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              All prices listed on DAXOMART are in Indian Rupees (INR ₹) inclusive of applicable taxes. Prices and promotional discounts are subject to change without prior notice based on collector stock availability.
            </p>
          </div>

          <div className="h-px bg-border/60" />

          {/* 4. Intellectual Property */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-accent" />
              4. Intellectual Property &amp; Trademarks
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              All website designs, brand logos, product photography, custom graphics, and UI design elements are the intellectual property of DAXOMART. Unauthorized copying or redistribution is prohibited.
            </p>
          </div>

          <div className="h-px bg-border/60" />

          {/* 5. Unboxing Video Policy */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <AlertCircle size={18} className="text-accent" />
              5. Product Inspection &amp; Replacement Condition
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              As per our Return Policy, customers are required to record a 360-degree unboxing video upon receiving their courier package. This video serves as verification for any in-transit damage claims or product replacement requests.
            </p>
          </div>

          {/* Contact Bar */}
          <div className="bg-[#18181C] border border-[#2D2D35] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-3">
              <Headphones size={22} className="text-accent" />
              <div>
                <h4 className="text-sm font-bold text-white">Questions about our Terms?</h4>
                <p className="text-xs text-gray-400">Get in touch with DAXOMART Support</p>
              </div>
            </div>
            <a
              href="https://wa.me/919048571147?text=Hi%20DAXOMART,%20I%20have%20a%20question%20about%20your%20terms%20of%20use."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent hover:bg-accent-lt text-dark font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg no-underline transition-colors shrink-0"
            >
              Contact Support
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
