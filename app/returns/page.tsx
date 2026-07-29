import Link from "next/link";
import {
  Video,
  AlertTriangle,
  Banknote,
  RefreshCw,
  SearchCheck,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";

export const metadata = {
  title: "Return Policy | DAXOMART",
  description: "Read the official DAXOMART Return Policy and replacement conditions.",
};

const CONDITIONS = [
  {
    icon: Video,
    text: "Please record a 360° video while opening the package. This video is mandatory for any return request.",
  },
  {
    icon: AlertTriangle,
    text: "Return requests without an unedited unboxing video will not be accepted.",
  },
  {
    icon: Banknote,
    text: "We do not provide cash refunds.",
  },
  {
    icon: RefreshCw,
    text: "Eligible returns will be processed as a product replacement only.",
  },
  {
    icon: SearchCheck,
    text: "The replacement will be provided only after the returned product is received and inspected.",
  },
];

export default function ReturnPolicyPage() {
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
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Policy & Guidelines
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-cream mb-4">
            Return Policy
          </h1>
          <p className=" text-base sm:text-md leading-relaxed">
            We accept returns only under the following conditions
          </p>
        </div>

        {/* Policy Conditions List */}
        <div className="space-y-4 mb-8">
          {CONDITIONS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-dark2 border border-border rounded-xl p-5 sm:p-6 flex items-start gap-4 hover:border-accent/40 transition-all duration-200 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-dark3 border border-border flex items-center justify-center shrink-0 text-accent mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-accent/80 block mb-1">
                    Condition 0{index + 1}
                  </span>
                  <p className="text-cream text-base leading-relaxed font-medium">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="bg-dark3/50 border border-border rounded-xl p-6 sm:p-8 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
            <HelpCircle className="w-6 h-6" />
          </div>
          <p className="text-cream text-base sm:text-lg leading-relaxed font-medium max-w-xl mb-6">
            If you have any questions, please contact our customer support team before requesting a return.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-lt text-dark font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition-colors duration-150 no-underline"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
}
