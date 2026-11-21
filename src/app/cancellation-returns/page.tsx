import React from "react";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Quality Guarantee & Return Policy - Hyderabad Delight Dairy",
  description: "Read the official Quality Guarantee, Cancellation, and Replacement Policy of Hyderabad Delight Dairy.",
};

export default function CancellationReturns() {
  return (
    <main className="min-h-screen bg-[#F4F8FC] text-[#1E242B] font-sans selection:bg-[#3B82C4]/20 pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-3xl md:text-5xl font-serif font-black text-[#1E242B] mb-4 tracking-wide">
          Quality Guarantee &amp; Return Policy
        </h1>
        <p className="text-xs text-black/50 mb-10">ESTD 2008 &bull; Hyderabad Delight Dairy Purity Standard</p>

        <div className="space-y-8 text-sm text-black/85 leading-relaxed font-medium bg-white p-8 md:p-12 rounded-3xl border border-[#3B82C4]/15 shadow-sm">
          
          <div className="p-4 bg-blue-50/70 border border-[#3B82C4]/20 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="text-[#3B82C4] shrink-0 mt-0.5" size={20} />
            <p className="text-xs text-[#1E242B]">
              <strong>100% Purity &amp; Freshness Guarantee:</strong> Because our milk, paneer, and curd are natural fresh perishable food items with zero chemical preservatives, we operate a hassle-free quality promise. If you receive any damaged, spoiled, or defective pack, we provide an immediate free replacement or refund.
            </p>
          </div>

          {/* Section 1: Cancellation Policy */}
          <div className="space-y-4 border-t border-black/10 pt-6">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#3B82C4]">
              Order Cancellation
            </h2>
            <p>
              Daily morning orders are packed between 10:00 PM and 4:00 AM. You may modify or cancel your next morning delivery at any time before <strong>9:00 PM the evening prior</strong> via your account or by messaging our WhatsApp support line.
            </p>
          </div>

          {/* Section 2: Returns & Replacements for Fresh Perishables */}
          <div className="space-y-4 border-t border-black/10 pt-6">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#3B82C4]">
              Damaged, Leaked, or Defective Goods
            </h2>
            <p>
              Due to food safety regulations, delivered perishable goods cannot be physically returned once handed over. However:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-black/80">
              <li>
                If your milk pouch or paneer container is found damaged, leaked, or curdled upon boiling on the morning of delivery, simply take a quick photo and notify our team on WhatsApp (<a href="tel:+919876543210" className="text-[#3B82C4] font-bold hover:underline">+91 98765 43210</a>) within <strong>6 hours</strong> of delivery.
              </li>
              <li>
                We will dispatch an immediate replacement in the next delivery slot or credit the full amount to your wallet/bank account.
              </li>
            </ul>
          </div>

          {/* Section 3: Ghee & Butter Returns */}
          <div className="space-y-4 border-t border-black/10 pt-6">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#3B82C4]">
              Traditional Bilona Ghee Returns
            </h2>
            <p>
              Unopened and sealed glass jars of Bilona Ghee may be returned or replaced within <strong>7 days</strong> of delivery if the seal is intact.
            </p>
          </div>

          {/* Section 4: Contact Us */}
          <div className="space-y-4 border-t border-black/10 pt-6">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#3B82C4]">
              Customer Care &amp; Support
            </h2>
            <p>If you have any questions about our Quality Guarantee, please contact our Hyderabad support team:</p>
            <ul className="space-y-2 text-xs text-black/80 font-medium">
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-[#3B82C4]" />
                <a href="tel:+919876543210" className="hover:text-[#3B82C4] font-bold">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-[#3B82C4]" />
                <a href="mailto:care@hyderabaddelightdairy.com" className="hover:text-[#3B82C4] font-bold">care@hyderabaddelightdairy.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-[#3B82C4] shrink-0 mt-0.5" />
                <span>Hyderabad Delight Dairy Farms, Gachibowli, Hyderabad, Telangana - 500032</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </main>
  );
}
