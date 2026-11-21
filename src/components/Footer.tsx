"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Mail, Globe, ArrowUp, ShieldCheck } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer for Admin Portal
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full flex flex-col font-serif select-none">
      <footer id="contact-us" className="w-full bg-[#1E242B] pt-16 pb-12 px-6 md:px-12 text-[#FFFDF6]/90 font-serif border-t border-[#3B82C4]/20 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1: Brand & Slogan */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Hyderabad Delight Dairy Logo"
                  className="h-12 sm:h-14 w-auto object-contain rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#E5A93C] tracking-wide leading-tight">
                  Hyderabad Delight
                </h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#3B82C4] font-sans font-bold">DAIRY • ESTD 2008</p>
              </div>
            </div>

            <p className="text-xs text-[#FFFDF6]/80 leading-relaxed font-sans">
              Pure unadulterated buffalo milk, Vedic bilona cow ghee, soft malai paneer, and farmhouse dahi delivered fresh across Hyderabad every morning.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#E5A93C] font-sans font-bold">
              <ShieldCheck size={16} />
              <span>100% Purity & Freshness Guaranteed</span>
            </div>
          </div>

          {/* Column 2: Contact Details */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#E5A93C] tracking-wide border-b border-white/10 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3.5 text-xs font-sans text-[#FFFDF6]/90">
              {/* Phone Number */}
              <li className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl text-[#3B82C4] shrink-0">
                  <Phone size={15} />
                </div>
                <a href="tel:+919876543210" className="hover:text-[#E5A93C] transition-colors font-medium">+91 98765 43210</a>
              </li>

              {/* Address */}
              <li className="flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-xl text-[#3B82C4] shrink-0 mt-0.5">
                  <MapPin size={15} />
                </div>
                <div className="leading-relaxed">
                  <p className="font-semibold text-white">Hyderabad Delight Dairy Farms</p>
                  <p>Plot 42, Green Meadows, Near Financial District,</p>
                  <p>Gachibowli, Hyderabad,</p>
                  <p className="text-[#E5A93C] font-semibold">Telangana - 500032</p>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl text-[#3B82C4] shrink-0">
                  <Mail size={15} />
                </div>
                <a href="mailto:care@hyderabaddelightdairy.com" className="hover:text-[#E5A93C] transition-colors font-medium break-all">
                  care@hyderabaddelightdairy.com
                </a>
              </li>

              {/* Website */}
              <li className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl text-[#3B82C4] shrink-0">
                  <Globe size={15} />
                </div>
                <a href="https://www.hyderabaddelightdairy.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#E5A93C] transition-colors font-medium">
                  www.hyderabaddelightdairy.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#E5A93C] tracking-wide border-b border-white/10 pb-2">
              Fresh Categories
            </h3>
            <ul className="space-y-2.5 text-xs font-sans text-[#FFFDF6]/85">
              <li>
                <Link href="/category/Milk" className="hover:text-[#E5A93C] hover:translate-x-1 inline-block transition-all">
                  Farm Fresh Milk
                </Link>
              </li>
              <li>
                <Link href="/category/Ghee" className="hover:text-[#E5A93C] hover:translate-x-1 inline-block transition-all">
                  Traditional Bilona Ghee
                </Link>
              </li>
              <li>
                <Link href="/category/Paneer" className="hover:text-[#E5A93C] hover:translate-x-1 inline-block transition-all">
                  Fresh Malai Paneer
                </Link>
              </li>
              <li>
                <Link href="/category/Butter" className="hover:text-[#E5A93C] hover:translate-x-1 inline-block transition-all">
                  Artisanal White Makkhan & Butter
                </Link>
              </li>
              <li>
                <Link href="/category/Curd" className="hover:text-[#E5A93C] hover:translate-x-1 inline-block transition-all">
                  Farmhouse Dahi & Buttermilk
                </Link>
              </li>
              <li>
                <Link href="/profile/orders" className="hover:text-[#E5A93C] hover:translate-x-1 inline-block transition-all">
                  Track Your Morning Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#E5A93C] tracking-wide border-b border-white/10 pb-2">
              Customer Support
            </h3>
            <ul className="space-y-2.5 text-xs font-sans text-[#FFFDF6]/85">
              <li>
                <Link href="/cancellation-returns" className="hover:text-[#E5A93C] hover:translate-x-1 inline-block transition-all">
                  Quality Guarantee & Returns
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#E5A93C] hover:translate-x-1 inline-block transition-all">
                  Morning Delivery Schedule
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#E5A93C] hover:translate-x-1 inline-block transition-all">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-[#E5A93C] hover:translate-x-1 inline-block transition-all">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/my-story" className="hover:text-[#E5A93C] hover:translate-x-1 inline-block transition-all">
                  Our Story (Since 2008)
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </footer>

      {/* Dark Footer Bottom Bar */}
      <div className="w-full bg-[#14181D] py-5 px-6 md:px-12 text-[#FFFDF6]/60 text-xs font-sans border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Hyderabad Delight Dairy. All Rights Reserved.</p>

          <div className="flex items-center gap-6 text-[11px]">
            <Link href="/terms-conditions" className="hover:text-[#E5A93C] transition-colors">Terms &amp; Conditions</Link>
            <Link href="/privacy-policy" className="hover:text-[#E5A93C] transition-colors">Privacy Policy</Link>

            <button
              onClick={handleBackToTop}
              className="flex items-center gap-1.5 bg-[#3B82C4] text-white hover:bg-[#2B6CB0] px-3.5 py-1.5 rounded-full font-bold transition-all shadow-md cursor-pointer ml-2"
            >
              <span>Top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
