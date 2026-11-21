import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Droplets, HeartHandshake, Phone } from "lucide-react";

interface LocationViewProps {
  city?: string;
}

export default function LocationView({ city = "" }: LocationViewProps) {
  const normalizedCity = (city || "")
    .toLowerCase()
    .replace(/^dry-fish-in-/, "")
    .replace(/^dry-fish-/, "")
    .replace(/^milk-in-/, "")
    .replace(/^dairy-in-/, "")
    .replace(/-/g, " ")
    .trim();

  const displayLocation =
    normalizedCity.length > 0
      ? normalizedCity
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "Hyderabad";

  return (
    <main className="min-h-[80vh] bg-[#F4F8FC] py-14 px-4 sm:px-6 md:px-12 font-sans text-[#1E242B]">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-[#3B82C4]/15 shadow-sm space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3B82C4]/10 text-[#3B82C4] text-xs font-bold uppercase tracking-widest">
            ESTD 2008 &bull; Farm Fresh Morning Delivery
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#1E242B] leading-tight">
            Pure Farm Fresh Milk &amp; Dairy Delivery in {displayLocation}
          </h1>
          <p className="text-sm text-black/70 max-w-2xl mx-auto leading-relaxed">
            Looking for authentic, 100% pure cow and buffalo milk in <strong>{displayLocation}</strong>? 
            Hyderabad Delight Dairy delivers unadulterated raw and farm-fresh dairy straight to your doorstep every morning between 5:30 AM and 7:30 AM.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-[#3B82C4]/15 space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[#3B82C4] font-bold text-sm">
              <Droplets size={18} />
              <span>100% Purity</span>
            </div>
            <p className="text-xs text-black/70 leading-relaxed">
              Zero water addition, zero milk powder reconstitution, and zero preservatives.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#E5A93C]/20 space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[#E5A93C] font-bold text-sm">
              <ShieldCheck size={18} />
              <span>Vedic Bilona Ghee</span>
            </div>
            <p className="text-xs text-black/70 leading-relaxed">
              Hand-churned from curd made of whole grass-fed cow milk for authentic golden aroma.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-green-50/70 border border-green-200 space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-green-700 font-bold text-sm">
              <Truck size={18} />
              <span>By 7:30 AM Daily</span>
            </div>
            <p className="text-xs text-black/70 leading-relaxed">
              Dedicated cold-chain fleet delivering chilled across {displayLocation}.
            </p>
          </div>
        </div>

        {/* Key Product Sections */}
        <div className="space-y-6 border-t border-black/10 pt-8">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E242B]">
            What We Deliver Fresh Daily in {displayLocation}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-black/10 space-y-2">
              <h3 className="font-bold text-base text-[#3B82C4] flex items-center gap-2">
                🥛 Farm Whole Buffalo &amp; A2 Cow Milk
              </h3>
              <p className="text-xs text-black/75 leading-relaxed">
                Freshly milked at dawn and chilled immediately. Rich in natural butterfat, calcium, and protein. Perfect for healthy tea, curd setting, and daily nutrition.
              </p>
              <Link href="/category/Milk" className="inline-block text-xs font-bold text-[#3B82C4] hover:underline pt-1">
                Order Milk &rarr;
              </Link>
            </div>

            <div className="p-5 rounded-2xl border border-black/10 space-y-2">
              <h3 className="font-bold text-base text-[#3B82C4] flex items-center gap-2">
                🧈 Traditional Bilona A2 Desi Cow Ghee
              </h3>
              <p className="text-xs text-black/75 leading-relaxed">
                Vedic curd-churned golden granular ghee with heavenly aroma. Free from palm oil, artificial essences, or industrial refining.
              </p>
              <Link href="/category/Ghee" className="inline-block text-xs font-bold text-[#3B82C4] hover:underline pt-1">
                Shop Ghee &rarr;
              </Link>
            </div>

            <div className="p-5 rounded-2xl border border-black/10 space-y-2">
              <h3 className="font-bold text-base text-[#3B82C4] flex items-center gap-2">
                🧀 Fresh Soft Malai Paneer
              </h3>
              <p className="text-xs text-black/75 leading-relaxed">
                Crafted fresh every single morning from pure whole milk. Ultra-soft texture, melt-in-mouth mouthfeel, and high protein.
              </p>
              <Link href="/category/Paneer" className="inline-block text-xs font-bold text-[#3B82C4] hover:underline pt-1">
                Get Fresh Paneer &rarr;
              </Link>
            </div>

            <div className="p-5 rounded-2xl border border-black/10 space-y-2">
              <h3 className="font-bold text-base text-[#3B82C4] flex items-center gap-2">
                🥣 Farmhouse Set Dahi &amp; Makkhan
              </h3>
              <p className="text-xs text-black/75 leading-relaxed">
                Naturally cultured thick sweet curd and hand-churned white butter. Loaded with gut-friendly active probiotics.
              </p>
              <Link href="/category/Curd" className="inline-block text-xs font-bold text-[#3B82C4] hover:underline pt-1">
                Order Dahi &amp; Butter &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#1E242B] text-white p-8 rounded-3xl text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#E5A93C]">
            Start Your Morning With Purity in {displayLocation}
          </h3>
          <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto leading-relaxed">
            Order online today and pay comfortably on delivery at your doorstep with Cash or UPI.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/"
              className="bg-[#3B82C4] text-white hover:bg-[#2B6CB0] px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              Explore All Dairy Products
            </Link>
            <a
              href="tel:+919876543210"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Phone size={14} /> Call Dispatch Support
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
