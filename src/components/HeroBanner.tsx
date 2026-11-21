"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  Award, 
  ArrowRight, 
  Star, 
  Truck, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SlideData {
  id: string;
  tabLabel: string;
  tabEmoji: string;
  badgeText: string;
  badgeCategory: string;
  headlineMain: string;
  headlineHighlight: string;
  storyDescription: string;
  proofPoints: { icon: string; title: string; subtitle: string }[];
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  imageSrc: string;
  imageAlt: string;
  imageTag: string;
  floatingPillText: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  pillBg: string;
}

const HERO_SLIDES: SlideData[] = [
  {
    id: "milk",
    tabLabel: "Fresh Morning Milk",
    tabEmoji: "🥛",
    badgeCategory: "HERITAGE DAIRY • ESTD 2008",
    badgeText: "Pure Farm Harvest Delivered Daily",
    headlineMain: "The Pure Taste of Morning Milk,",
    headlineHighlight: "Just Like Home.",
    storyDescription: "Freshly milked buffalo and desi cow milk from our Hyderabad farms. Zero hormones, zero water dilution, and zero preservatives — chilled and delivered to your doorstep before your first morning chai.",
    proofPoints: [
      { icon: "clock", title: "At Your Door by 7:30 AM", subtitle: "Fresh morning slot 5:30 – 7:30 AM" },
      { icon: "shield", title: "26+ Daily Purity Checks", subtitle: "Zero adulteration, zero chemicals" },
      { icon: "truck", title: "Within 6 Hrs of Milking", subtitle: "Chilled to 4°C for natural taste" },
    ],
    primaryCtaText: "Order Fresh Milk",
    primaryCtaLink: "/category/milk",
    secondaryCtaText: "Delivery Areas",
    secondaryCtaLink: "/shipping-policy",
    imageSrc: "/images/hero_banner_milk.jpg",
    imageAlt: "Fresh Hyderabad Delight Dairy farm milk poured into traditional vessels at sunrise",
    imageTag: "100% Raw & Pasteurised Buffalo & Cow Milk",
    floatingPillText: "Tested 0% Adulteration • Fresh Daily",
    accentColor: "#3B82C4",
    accentBg: "bg-[#3B82C4]",
    accentBorder: "border-[#3B82C4]",
    pillBg: "bg-[#3B82C4]/10 text-[#2B6CB0] border-[#3B82C4]/25",
  },
  {
    id: "ghee",
    tabLabel: "A2 Bilona Ghee",
    tabEmoji: "🍯",
    badgeCategory: "TRADITIONAL BILONA METHOD",
    badgeText: "Handcrafted from Whole Cultured Curd",
    headlineMain: "Golden, Aromatic Danedaar Ghee,",
    headlineHighlight: "The Way Dadi Made It.",
    storyDescription: "Crafted from cultured A2 desi cow curd churned slowly with a traditional wooden bilona. Simmered over gentle flame to unlock that rich granular texture, authentic village aroma, and ancient Ayurvedic wellness.",
    proofPoints: [
      { icon: "award", title: "Wooden Churned Curd", subtitle: "Never made from industrial cream" },
      { icon: "sparkles", title: "Rich Golden Granules", subtitle: "Natural danedaar grain & aroma" },
      { icon: "shield", title: "100% A2 Desi Cow Milk", subtitle: "Preservative-free & lab verified" },
    ],
    primaryCtaText: "Shop Pure Bilona Ghee",
    primaryCtaLink: "/category/ghee",
    secondaryCtaText: "Our 16-Year Story",
    secondaryCtaLink: "/my-story",
    imageSrc: "/images/hero_banner_ghee.jpg",
    imageAlt: "Authentic Vedic Bilona A2 cow ghee with wooden churner in traditional clay handi",
    imageTag: "Slow Cooked • Golden Granular Texture",
    floatingPillText: "Vedic Bilona Cultured • 100% Pure",
    accentColor: "#D98E16",
    accentBg: "bg-[#E5A93C]",
    accentBorder: "border-[#E5A93C]",
    pillBg: "bg-[#FFF7E6] text-[#B8700E] border-[#E5A93C]/35",
  },
  {
    id: "paneer",
    tabLabel: "Paneer, Curd & Butter",
    tabEmoji: "🧀",
    badgeCategory: "FARMHOUSE ARTISANAL FRESHNESS",
    badgeText: "Made Fresh Every Dawn",
    headlineMain: "Melt-in-Mouth Malai Paneer",
    headlineHighlight: "& Thick Farmhouse Curd.",
    storyDescription: "Handcrafted fresh every single morning from full-cream dairy milk. No starch, no artificial thickeners, and no milk powder — only authentic, protein-rich dairy freshness for your family.",
    proofPoints: [
      { icon: "sparkles", title: "Ultra-Soft Malai Paneer", subtitle: "Absorbs curries, never rubbery" },
      { icon: "award", title: "Clay Matka Farm Dahi", subtitle: "Thick, creamy, naturally probiotic" },
      { icon: "shield", title: "Zero Starch or Chemicals", subtitle: "100% pure whole-milk batch" },
    ],
    primaryCtaText: "Explore Fresh Paneer",
    primaryCtaLink: "/category/paneer",
    secondaryCtaText: "View Butter & Dahi",
    secondaryCtaLink: "/category/curd",
    imageSrc: "/images/hero_banner_paneer.jpg",
    imageAlt: "Fresh artisanal malai paneer cubes, thick farmhouse curd, and churned white butter",
    imageTag: "Daily Morning Batch • Never Frozen",
    floatingPillText: "Handcrafted Daily • 0% Added Starch",
    accentColor: "#2563EB",
    accentBg: "bg-[#3B82C4]",
    accentBorder: "border-[#3B82C4]",
    pillBg: "bg-[#EFF6FF] text-[#1D4ED8] border-[#3B82C4]/30",
  },
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Auto-advance slides every 6 seconds when not paused by user
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const slide = HERO_SLIDES[currentIndex];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "clock":
        return <Clock className="w-4 h-4 text-[#3B82C4]" />;
      case "shield":
        return <ShieldCheck className="w-4 h-4 text-[#E5A93C]" />;
      case "truck":
        return <Truck className="w-4 h-4 text-[#3B82C4]" />;
      case "award":
        return <Award className="w-4 h-4 text-[#E5A93C]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#3B82C4]" />;
    }
  };

  return (
    <section 
      aria-label="Welcome to Hyderabad Delight Dairy"
      className="relative w-full bg-gradient-to-b from-[#F4F8FC] via-white to-[#F8FAFC] border-b border-[#3B82C4]/15 overflow-hidden font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Subtle Warm Milk Tint Backdrop Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3B82C4]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#E5A93C]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
        
        {/* Top Story Tabs: Let humans easily see & tap each category */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-3 mb-4 sm:mb-6 border-b border-gray-200/60">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {HERO_SLIDES.map((s, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-[#1E242B] shadow-md border border-[#3B82C4]/30 scale-[1.02]"
                      : "bg-transparent text-gray-500 hover:text-[#1E242B] hover:bg-white/50"
                  }`}
                >
                  <span className="text-base">{s.tabEmoji}</span>
                  <span className="whitespace-nowrap font-medium tracking-tight">{s.tabLabel}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#3B82C4] ml-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Slide Arrow Navigation for Desktop */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous story"
              className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-[#1E242B] border border-gray-200 shadow-sm flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-mono font-bold text-gray-400 px-1.5">
              0{currentIndex + 1} / 0{HERO_SLIDES.length}
            </span>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next story"
              className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-[#1E242B] border border-gray-200 shadow-sm flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Main Hero Grid: Human 2-Column Layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center"
          >
            {/* LEFT COLUMN: Human Story, Brand Trust & Clear CTAs */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left order-2 lg:order-1">
              
              {/* Artisanal Heritage Pill */}
              <div className="flex flex-wrap items-center gap-2 mb-3.5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider border shadow-xs ${slide.pillBg}`}>
                  <span className="w-2 h-2 rounded-full bg-[#3B82C4]" />
                  <span>{slide.badgeCategory}</span>
                </span>
                <span className="text-xs font-semibold text-gray-500 hidden sm:inline-block">
                  • {slide.badgeText}
                </span>
              </div>

              {/* Main Headline with Editorial Warmth */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E242B] tracking-tight leading-[1.15] mb-3">
                {slide.headlineMain}{" "}
                <span className="font-serif italic font-normal text-[#3B82C4] block sm:inline">
                  {slide.headlineHighlight}
                </span>
              </h1>

              {/* Human Storytelling Description */}
              <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed mb-6 max-w-2xl font-normal">
                {slide.storyDescription}
              </p>

              {/* 3 Real Human Proof Points with Soft Elevated Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-7 max-w-2xl">
                {slide.proofPoints.map((point, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3 rounded-2xl bg-white border border-[#3B82C4]/15 shadow-xs flex items-start gap-2.5 hover:border-[#3B82C4]/40 transition-colors"
                  >
                    <div className="p-1.5 rounded-xl bg-[#F4F8FC] border border-[#3B82C4]/10 shrink-0 mt-0.5">
                      {renderIcon(point.icon)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#1E242B] truncate">{point.title}</div>
                      <div className="text-[11px] text-gray-500 leading-tight mt-0.5">{point.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear, High-Converting Human Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 mb-6">
                <Link
                  href={slide.primaryCtaLink}
                  className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl font-sans font-bold text-sm tracking-wide text-white bg-[#3B82C4] hover:bg-[#2B6CB0] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
                >
                  <span>{slide.primaryCtaText}</span>
                  <ArrowRight size={17} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href={slide.secondaryCtaLink}
                  className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-sans font-semibold text-sm tracking-wide text-[#1E242B] bg-white hover:bg-gray-50 border border-gray-300/80 shadow-xs transition-all flex items-center justify-center cursor-pointer active:scale-98"
                >
                  <span>{slide.secondaryCtaText}</span>
                </Link>
              </div>

              {/* Real Customer Social Proof Strip */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200/70 text-xs text-gray-600">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={15} className="fill-amber-400 text-amber-400" />
                  <Star size={15} className="fill-amber-400 text-amber-400" />
                  <Star size={15} className="fill-amber-400 text-amber-400" />
                  <Star size={15} className="fill-amber-400 text-amber-400" />
                  <Star size={15} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold text-[#1E242B] ml-1">4.9/5</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="font-medium text-gray-600">
                  Trusted by 15,000+ Hyderabad homes across Gachibowli, Madhapur, Jubilee Hills & beyond.
                </span>
              </div>

            </div>

            {/* RIGHT COLUMN: Real Handcrafted Photo Showcase */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-xl shadow-blue-900/5 border-2 border-[#3B82C4]/20 group">
                
                {/* Visual Image */}
                <img
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Soft natural bottom gradient scrim so badges always pop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                {/* Top Badge: Artisanal Guarantee */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-white/60 text-[#1E242B] text-xs font-bold shadow-md">
                  <ShieldCheck size={14} className="text-[#3B82C4]" />
                  <span>{slide.floatingPillText}</span>
                </div>

                {/* Bottom Caption Pill */}
                <div className="absolute bottom-4 inset-x-4 z-10 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/70 shadow-lg flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-[#3B82C4]">
                      Hyderabad Delight Promise
                    </div>
                    <div className="text-xs font-bold text-[#1E242B] truncate mt-0.5">
                      {slide.imageTag}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[#B8700E] text-[11px] font-bold">
                    <CheckCircle2 size={13} />
                    <span>Pure</span>
                  </div>
                </div>

              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
