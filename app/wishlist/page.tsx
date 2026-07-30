import Link from "next/link";
import { Heart, Car, ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";

export const metadata = {
  title: "My Wishlist | DAXOMART",
  description: "View your saved diecast scale models and favorite collectibles.",
};

export default function WishlistPage() {
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

        {/* Wishlist Header */}
        <div className="bg-dark2 border border-border rounded-2xl p-8 mb-8 text-center relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4 border border-accent/20">
            <Heart size={26} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide font-pally mb-2">
            My Collectible Wishlist
          </h1>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Save your favorite 1:18, 1:24 diecast cars, RC toys, and 3D frames here for quick ordering.
          </p>
        </div>

        {/* Empty Wishlist Card */}
        <div className="bg-[#141416] border border-[#222226] rounded-2xl p-10 text-center">
          <Car size={44} className="mx-auto text-gray-600 mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white mb-2">Your wishlist is currently empty</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
            Browse our premium diecast scale model catalog and click the heart icon on any car to save it here!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-lt text-dark font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl no-underline transition-all shadow-md"
          >
            <ShoppingBag size={15} /> Explore Diecast Catalog
          </Link>
        </div>

      </div>
    </div>
  );
}
