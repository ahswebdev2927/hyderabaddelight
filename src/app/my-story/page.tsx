"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Star, X, ShieldCheck, HeartHandshake, Truck, Droplets } from "lucide-react";

export default function MyStory() {
  const [isWhyChooseModalOpen, setIsWhyChooseModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#F4F8FC] text-[#1E242B] font-sans selection:bg-[#3B82C4]/20 pb-20">
      
      {/* 1. Header & Main Intro Section */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-10">
        <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-12">
          {/* Website Logo to the left */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full p-2 bg-white border border-[#3B82C4]/25 shadow-md flex items-center justify-center group hover:scale-105 transition-transform duration-300">
              <img
                src="/logo.jpg"
                alt="Hyderabad Delight Dairy Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          {/* Intro Text to the right */}
          <div className="flex-1 text-center sm:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3B82C4]/10 text-[#3B82C4] text-xs font-bold uppercase tracking-widest">
              <span>ESTD 2008</span> • <span>16+ Years of Dairy Purity</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-black text-[#1E242B] leading-tight">
              About Hyderabad Delight Dairy
            </h1>
            <div className="w-20 h-1 bg-[#3B82C4] rounded-full mx-auto sm:mx-0"></div>
            <p className="text-xs md:text-sm text-black/75 font-medium leading-relaxed text-justify sm:text-left">
              Established in 2008, <strong>Hyderabad Delight Dairy</strong> was founded with a singular, uncompromising mission: to bring authentic, farm-fresh, and 100% unadulterated milk and dairy products directly to households across Hyderabad. In an era dominated by processed carton milk and adulterated ghee, we believe every family deserves real, natural nutrition straight from healthy, grass-fed cows and buffaloes.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Split Process / Why Choose Us Section */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch">
          
          {/* Left Column: Farm Fresh Imagery */}
          <div className="relative rounded-[2.5rem] overflow-hidden border border-[#3B82C4]/20 shadow-md bg-white group h-72 sm:h-80 md:h-auto min-h-[280px] md:min-h-0">
            <img
              src="https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=1000&auto=format&fit=crop&q=80"
              alt="Hyderabad Delight Dairy Farm and Healthy Grass-fed Cattle"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#3B82C4] px-3 py-1 rounded-full text-white shadow-sm inline-block">
                Farm Fresh Every Morning
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white drop-shadow-md leading-snug">
                Milked at dawn and delivered chilled to your doorstep before 7:30 AM across Hyderabad.
              </p>
            </div>
          </div>

          {/* Right Column: Why Choose Hyderabad Delight Dairy text */}
          <div className="bg-white border border-[#3B82C4]/20 rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between space-y-4 shadow-sm text-left">
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg md:text-xl font-serif font-black text-[#1E242B] flex items-center gap-2">
                  🥛 Why Hyderabad Trusts Us
                </h2>
                <span className="text-[10px] font-black text-[#3B82C4] uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full">
                  Since 2008
                </span>
              </div>

              <p className="text-xs md:text-sm text-black/75 font-medium leading-relaxed">
                We believe in zero shortcuts and complete purity. Here is why thousands of homes in Hyderabad choose our fresh dairy:
              </p>

              <ul className="space-y-2.5 text-xs text-black/80 font-medium pt-1">
                <li className="flex items-start gap-2.5">
                  <span className="p-1 rounded bg-blue-50 text-[#3B82C4] shrink-0 font-bold">✓</span>
                  <span><strong>100% Unadulterated Milk:</strong> Zero synthetic hormones (oxytocin), zero urea, zero reconstituted milk powder, and zero chemical preservatives.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="p-1 rounded bg-amber-50 text-[#E5A93C] shrink-0 font-bold">✓</span>
                  <span><strong>Traditional Vedic Bilona Ghee:</strong> Slow-churned from curd made from grass-fed cow milk for authentic aroma, rich grain, and health benefits.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="p-1 rounded bg-green-50 text-green-600 shrink-0 font-bold">✓</span>
                  <span><strong>Melt-in-Mouth Malai Paneer:</strong> Crafted every single morning from whole milk without palm oil or starch.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="p-1 rounded bg-blue-50 text-[#3B82C4] shrink-0 font-bold">✓</span>
                  <span><strong>5:30 AM – 7:30 AM Morning Delivery:</strong> Prompt delivery straight to your door across Jubilee Hills, Banjara Hills, Gachibowli, Madhapur, Kukatpally, and Secunderabad.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 border-t border-black/5">
              <button 
                type="button"
                onClick={() => setIsWhyChooseModalOpen(true)}
                className="text-xs font-black uppercase tracking-wider text-[#3B82C4] hover:underline cursor-pointer focus:outline-none inline-flex items-center gap-1 group"
              >
                <span>Read our full quality promise...</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 2.5. Official FSSAI & Quality Standards Section */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white border border-[#3B82C4]/20 rounded-[2.5rem] p-6 sm:p-10 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            
            {/* Left Column: Official FSSAI Logo */}
            <div className="w-full md:w-5/12 flex flex-col items-center justify-center text-center space-y-4">
              <img
                src="/images/fssai_logo.svg"
                alt="FSSAI Official Food Safety Logo"
                className="w-56 sm:w-64 md:w-72 h-auto object-contain"
              />
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-green-100/80 border border-green-300 text-green-800 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                <span>FSSAI Certified • Cold Chain Monitored</span>
              </div>
            </div>

            {/* Right Column: Standards Details */}
            <div className="w-full md:w-7/12 space-y-5 text-left">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#3B82C4] bg-[#3B82C4]/10 px-3 py-1 rounded-full inline-block mb-2">
                  Food Safety &amp; Quality Standards
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1E242B]">
                  Purity Tested at Every Step
                </h2>
                <p className="text-xs sm:text-sm text-black/70 mt-1 leading-relaxed">
                  Every batch of milk and dairy at Hyderabad Delight Dairy undergoes rigorous fat, SNF, and purity testing before bottling. Packaged under sterile conditions and maintained strictly between 2°C to 4°C.
                </p>
              </div>

              {/* Verified Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-blue-50/60 rounded-2xl p-4 border border-[#3B82C4]/15 text-xs">
                  <div className="font-bold text-[#3B82C4] flex items-center gap-1.5">
                    <Droplets size={16} /> 100% Raw Farm Milk
                  </div>
                  <div className="text-[11px] text-black/60 mt-1 leading-snug">Chilled immediately after milking with no chemical adulteration</div>
                </div>
                <div className="bg-amber-50/60 rounded-2xl p-4 border border-[#E5A93C]/20 text-xs">
                  <div className="font-bold text-[#E5A93C] flex items-center gap-1.5">
                    <HeartHandshake size={16} /> Ethical Dairy Farming
                  </div>
                  <div className="text-[11px] text-black/60 mt-1 leading-snug">Cared with pure green fodder, clean water, and cruelty-free shelter</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us Pop-up Modal */}
      {isWhyChooseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsWhyChooseModalOpen(false)} />
          
          <div className="relative bg-white w-full max-w-xl max-h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-[#3B82C4]/20">
            {/* Header */}
            <div className="p-6 border-b border-black/10 flex items-center justify-between bg-blue-50/50">
              <h2 className="text-base md:text-lg font-serif font-black text-[#1E242B] flex items-center gap-2">
                🥛 Our Purity Promise (Since 2008)
              </h2>
              <button
                onClick={() => setIsWhyChooseModalOpen(false)}
                className="p-2 text-black hover:bg-black/10 rounded-full transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Image Banner */}
            <div className="w-full h-44 overflow-hidden relative border-b border-black/10 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1000&auto=format&fit=crop&q=80"
                alt="Hyderabad Delight Dairy Meadows"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-5 text-white">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#3B82C4] px-3 py-1 rounded-full text-white shadow-sm">
                  100% Unadulterated &bull; Daily Chilled Delivery
                </span>
              </div>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-[#1E242B] custom-scrollbar">
              <p className="text-xs md:text-sm font-semibold text-black/80 italic">
                From our family farm to your breakfast table, here is how we guarantee real dairy quality:
              </p>

              <div className="space-y-4 text-xs md:text-sm">
                <div className="space-y-1">
                  <h3 className="font-bold text-[#3B82C4] text-xs uppercase tracking-wider">🌿 Natural Cattle Diet</h3>
                  <p className="text-black/75 leading-relaxed">
                    Our cattle are fed certified green fodder, maize, and natural oil cakes. Healthy food leads to naturally thick, cream-rich milk without synthetic boosters.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-[#3B82C4] text-xs uppercase tracking-wider">🛡️ Zero Processing Additives</h3>
                  <p className="text-black/75 leading-relaxed">
                    No milk powder reconstitution, no artificial thickeners, and no chemical preservatives. Pure milk as nature created it.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-[#3B82C4] text-xs uppercase tracking-wider">🚚 Chilled Hyderabad Morning Delivery</h3>
                  <p className="text-black/75 leading-relaxed">
                    Our dedicated morning delivery fleet ensures your dairy reaches your doorstep fresh between 5:30 AM and 7:30 AM across all major Hyderabad neighborhoods.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-black/10 flex justify-end">
              <button
                onClick={() => setIsWhyChooseModalOpen(false)}
                className="bg-[#3B82C4] hover:bg-[#2B6CB0] text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
