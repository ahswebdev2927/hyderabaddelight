import React from "react";

export const metadata = {
  title: "Delivery & Morning Shipping Policy - Hyderabad Delight Dairy",
  description: "Read the official Morning Delivery and Freshness Handling Policy of Hyderabad Delight Dairy.",
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F4F8FC] text-[#1E242B] font-sans selection:bg-[#3B82C4]/20 pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-3xl md:text-5xl font-serif font-black text-[#1E242B] mb-10 tracking-wide">
          Morning Delivery &amp; Shipping Policy
        </h1>

        <div className="space-y-8 text-sm text-black/85 leading-relaxed font-medium bg-white p-8 md:p-12 rounded-3xl border border-[#3B82C4]/15 shadow-sm">
          
          {/* Section 1: Morning Delivery Slots */}
          <div className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#3B82C4]">
              Daily Morning Delivery Hours
            </h2>
            <p>All daily milk and fresh perishable dairy orders placed before <strong>9:00 PM</strong> are harvested, chilled, and delivered between <strong>5:30 AM and 7:30 AM</strong> the following morning across Hyderabad.</p>
            <p>Ghee, paneer, and artisanal butter can be ordered either as part of your regular morning dairy slot or scheduled for doorstep evening delivery.</p>
          </div>

          {/* Section 2: Coverage Areas in Hyderabad */}
          <div className="space-y-3 border-t border-black/10 pt-6">
            <h2 className="text-xl font-serif font-bold text-[#3B82C4]">
              Delivery Coverage in Hyderabad
            </h2>
            <p>We serve all major residential corridors in Hyderabad and Secunderabad, including:</p>
            <ul className="list-disc pl-5 space-y-1 text-black/75">
              <li>Jubilee Hills, Banjara Hills, Film Nagar</li>
              <li>Gachibowli, Madhapur, Hitec City, Kondapur, Financial District</li>
              <li>Kukatpally, KPHB Colony, Miyapur, Nizampet</li>
              <li>Secunderabad, Begumpet, Somajiguda, Ameerpet</li>
              <li>Manikonda, Narsingi, Tellapur, Kokapet</li>
            </ul>
          </div>

          {/* Section 3: Cold-Chain Temperature Maintenance */}
          <div className="space-y-3 border-t border-black/10 pt-6">
            <h2 className="text-xl font-serif font-bold text-[#3B82C4]">
              Cold-Chain Temperature Maintenance
            </h2>
            <p>Our transport vehicles utilize insulated, food-grade temperature-controlled crates to ensure that all fresh milk and paneer are kept strictly below 4°C right up to your doorstep. Please refrigerate products immediately upon receipt.</p>
          </div>

          {/* Section 4: Delivery Fees & Free Delivery */}
          <div className="space-y-3 border-t border-black/10 pt-6">
            <h2 className="text-xl font-serif font-bold text-[#3B82C4]">
              Delivery Charges
            </h2>
            <p>Morning dairy deliveries are completely <strong>FREE</strong> for active subscription plans and all one-time orders above ₹199.</p>
          </div>

          {/* Section 5: Contact & Support */}
          <div className="space-y-3 border-t border-black/10 pt-6">
            <h2 className="text-xl font-serif font-bold text-[#3B82C4]">
              Delivery Queries &amp; Doorstep Instructions
            </h2>
            <p>If you have specific apartment security instructions (e.g., leave in doorstep milk bag, ring doorbell, gate security clearance), please specify during checkout or message our morning dispatch helpline at <a href="tel:+919876543210" className="text-[#3B82C4] font-bold hover:underline">+91 98765 43210</a> or email <a href="mailto:care@hyderabaddelightdairy.com" className="text-[#3B82C4] font-bold hover:underline">care@hyderabaddelightdairy.com</a>.</p>
          </div>

        </div>
      </div>
    </main>
  );
}
