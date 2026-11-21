"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, CreditCard, ShieldCheck, CheckCircle2, Sparkles, MapPin, AlertTriangle, ChevronDown, X, Ticket, MessageCircle, Phone, Truck, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { checkPincodeServiceability, PincodeCheckResult } from "@/utils/pincode";

function CartContent() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart, setQuantity, updateItemVariant } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [productDetailsMap, setProductDetailsMap] = useState<Record<number, { variations: any[] }>>({});
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState<{
    orderId: number;
    whatsappUrl: string;
    totalAmount: number;
    deliverySlot: string;
    customerName: string;
    pincode: string;
    areaName?: string;
  } | null>(null);
  const [pincodeStatus, setPincodeStatus] = useState<PincodeCheckResult | null>(null);
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "",
    phone: "",
    deliveryNotes: ""
  });
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load saved customer details from localStorage for seamless repeat ordering
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hdd_customer_info");
      if (saved) {
        const parsed = JSON.parse(saved);
        setAddress(prev => ({
          ...prev,
          fullName: parsed.fullName || "",
          phone: parsed.phone || "",
          pincode: parsed.pincode || "",
          street: parsed.street || "",
        }));
        if (parsed.pincode && parsed.pincode.length === 6) {
          setPincodeStatus(checkPincodeServiceability(parsed.pincode));
        }
      }
    } catch (e) {}
  }, []);

  // Read URL params for return callback payment errors
  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "payment_failed") {
      setCheckoutError("Payment was cancelled or failed on PhonePe. Please try again.");
    } else if (err === "status_verification_failed") {
      setCheckoutError("Could not verify payment status with PhonePe. If money was debited, please check your orders page.");
    } else if (err === "missing_order_id" || err === "order_not_found") {
      setCheckoutError("Order reference error. Please check your cart or order history.");
    } else if (err === "internal_server_error") {
      setCheckoutError("An error occurred during payment processing. Please try again.");
    } else if (err) {
      setCheckoutError(`Checkout notice: ${err}`);
    }
  }, [searchParams]);

  // Coupon States
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [showPromoSection, setShowPromoSection] = useState(false);

  // Fetch Available Coupons based on cart items
  useEffect(() => {
    async function fetchAvailableCoupons() {
      if (items.length === 0) {
        setAvailableCoupons([]);
        return;
      }
      try {
        const res = await fetch("/api/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
              color: item.color
            }))
          })
        });
        const data = await res.json();
        if (data.success) {
          setAvailableCoupons(data.data);
        }
      } catch (err) {
        console.error("Error fetching applicable coupons:", err);
      }
    }
    fetchAvailableCoupons();
  }, [items]);

  // Apply Coupon Handler
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError("");
    setCouponSuccess("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: couponInput.trim().toUpperCase(),
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color
          }))
        })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setDiscountAmount(data.discountAmount);
        setCouponSuccess(`Coupon "${data.coupon.code}" applied! Saved ₹${data.discountAmount.toLocaleString()}`);
        setCouponInput("");
      } else {
        setCouponError(data.error || "Failed to validate coupon.");
      }
    } catch (err) {
      setCouponError("Unable to apply coupon. Please try again.");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Remove Coupon Handler
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponSuccess("");
    setCouponError("");
    setCouponInput("");
  };

  // Revalidate coupon dynamically on cart item updates
  useEffect(() => {
    if (!appliedCoupon) return;

    const revalidateCoupon = async () => {
      try {
        const res = await fetch("/api/coupons/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            couponCode: appliedCoupon.code,
            items: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
              color: item.color
            }))
          })
        });
        const data = await res.json();
        if (data.success) {
          setDiscountAmount(data.discountAmount);
          setCouponSuccess(`Coupon "${data.coupon.code}" applied! Saved ₹${data.discountAmount.toLocaleString()}`);
        } else {
          setAppliedCoupon(null);
          setDiscountAmount(0);
          setCouponSuccess("");
          setCouponError(`Coupon removed: ${data.error}`);
        }
      } catch (err) {
        console.error("Error revalidating coupon:", err);
      }
    };

    revalidateCoupon();
  }, [items, appliedCoupon?.code]);

  // Size/Qty Popups
  const [activeSizeItemId, setActiveSizeItemId] = useState<string | null>(null);
  const [activeQtyItemId, setActiveQtyItemId] = useState<string | null>(null);
  const [tempSize, setTempSize] = useState<string>("");
  const [tempQty, setTempQty] = useState<number>(1);

  const openSizeModal = (item: any) => {
    setActiveSizeItemId(item.id);
    setTempSize(item.size);
  };

  const openQtyModal = (item: any) => {
    setActiveQtyItemId(item.id);
    setTempQty(item.quantity);
  };

  // Handle hydration to avoid mismatch with SSR
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const serializedProductIds = JSON.stringify(Array.from(new Set(items.map(item => item.productId))).sort());

  useEffect(() => {
    async function fetchAllProductDetails() {
      if (items.length === 0) {
        setLoadingDetails(false);
        return;
      }

      const uniqueProductIds = Array.from(new Set(items.map(item => item.productId)));
      const details: Record<number, any> = {};

      try {
        await Promise.all(
          uniqueProductIds.map(async (productId) => {
            const res = await fetch(`/api/products/${productId}`);
            if (res.ok) {
              const data = await res.json();
              details[productId] = data;
            }
          })
        );
        setProductDetailsMap(details);
      } catch (err) {
        console.error("Error fetching product variations in cart:", err);
      } finally {
        setLoadingDetails(false);
      }
    }

    fetchAllProductDetails();
  }, [serializedProductIds]);

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-brand/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="text-black/20" size={40} />
        </div>
        <h1 className="text-3xl font-playfair font-bold text-black mb-4">Your cart is empty</h1>
        <p className="text-black/60 mb-10 text-center max-w-md leading-relaxed">
          Looks like you haven't added any fresh dairy items yet. Explore our pure farm milk, bilona A2 ghee, fresh paneer, and farmhouse curd.
        </p>
        <Link
          href="/"
          className="bg-brand text-white px-10 py-4 rounded-2xl font-bold tracking-widest uppercase text-sm hover:bg-brand-hover transition-all shadow-xl active:scale-95"
        >
          Explore Fresh Dairy
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = 0;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handlePincodeChange = (pin: string) => {
    const cleanPin = pin.replace(/\D/g, "").slice(0, 6);
    setAddress(prev => ({ ...prev, pincode: cleanPin }));
    if (cleanPin.length === 6) {
      const result = checkPincodeServiceability(cleanPin);
      setPincodeStatus(result);
    } else {
      setPincodeStatus(null);
    }
  };

  const handleCheckout = () => {
    setBookingSuccessData(null);
    setIsCheckoutModalOpen(true);
    if (address.pincode && address.pincode.length === 6) {
      setPincodeStatus(checkPincodeServiceability(address.pincode));
    }
  };

  const processCodOrder = async () => {
    if (!pincodeStatus?.serviceable) {
      alert("Please enter a valid Hyderabad delivery pincode to book your delivery.");
      return;
    }
    if (!address.fullName.trim() || address.phone.length !== 10 || !address.street.trim()) {
      alert("Please enter your name, 10-digit mobile number, and street address.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      const fullDeliveryAddress = `${address.street.trim()}${address.deliveryNotes ? ` (Instruction: ${address.deliveryNotes.trim()})` : ""}`;

      const res = await fetch("/api/checkout/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totalAmount: total,
          customerName: address.fullName.trim(),
          customerPhone: address.phone.trim(),
          pincode: address.pincode.trim(),
          address: fullDeliveryAddress,
          deliverySlot: "Tomorrow Morning 5:30 AM – 7:30 AM",
          couponCode: appliedCoupon?.code || null,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Booking failed: " + (data.error || "Please check details and try again."));
        setIsProcessingPayment(false);
        return;
      }

      // Save customer info in localStorage for repeat orders
      try {
        localStorage.setItem("hdd_customer_info", JSON.stringify({
          fullName: address.fullName,
          phone: address.phone,
          pincode: address.pincode,
          street: address.street,
        }));
      } catch (e) {}

      // Open WhatsApp order chat immediately
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank");
      }

      setBookingSuccessData({
        orderId: data.orderId,
        whatsappUrl: data.whatsappUrl,
        totalAmount: total,
        deliverySlot: "Tomorrow Morning 5:30 AM – 7:30 AM",
        customerName: address.fullName,
        pincode: address.pincode,
        areaName: pincodeStatus.areaName,
      });

      clearCart();
      setIsProcessingPayment(false);
    } catch (error) {
      console.error("Error booking WhatsApp order:", error);
      alert("Something went wrong booking your order. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  const processPhonePePayment = async () => {
    setIsProcessingPayment(true);

    try {
      const fullDeliveryAddress = `Name: ${address.fullName}, Street: ${address.street}, City: ${address.city}, State: ${address.state}, Pincode: ${address.pincode}, Contact: ${address.phone}`;

      const res = await fetch("/api/checkout/phonepe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: fullDeliveryAddress,
          couponCode: appliedCoupon?.code || null,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Payment initialization failed: " + data.error);
        setIsProcessingPayment(false);
        return;
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (error) {
      console.error("Error starting checkout:", error);
      alert("Something went wrong initializing PhonePe payment.");
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
      {checkoutError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-red-700 animate-in fade-in duration-300">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">Payment Status Notice</h4>
              <p className="text-xs font-medium mt-0.5">{checkoutError}</p>
            </div>
          </div>
          <button
            onClick={() => setCheckoutError(null)}
            className="p-1 hover:bg-red-100 rounded-lg transition-colors text-red-500"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="flex items-center space-x-4 mb-10">
        <h1 className="text-4xl font-playfair font-bold text-black">Shopping Cart</h1>
        <span className="bg-brand/5 text-black/60 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          {getTotalItems()} Items
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-6 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-4 no-scrollbar">
          {items.map((item) => {
            const isBespoke = item.customizations?.type === "Bespoke";
            const productVariationsList = productDetailsMap[item.productId]?.variations || [];
            const itemColor = (item.color || "").toLowerCase();
            const colorMatchedVariations = productVariationsList.filter(
              (v: any) => !v.color || v.color.toLowerCase() === itemColor
            );
            const activeVariations = colorMatchedVariations.length > 0 ? colorMatchedVariations : productVariationsList;
            const availableSizes = activeVariations.length > 0
              ? Array.from(new Set(activeVariations.map((v: any) => v.size)))
              : [item.size];
            const currentVariation = activeVariations.find(
              (v: any) => v.size.toLowerCase() === item.size.toLowerCase()
            );
            const maxStock = currentVariation ? currentVariation.stock : 10;
            const stockLimit = Math.max(item.quantity, maxStock, 1);

            return (
              <div
                key={item.id}
                className={`rounded-3xl p-6 shadow-sm border flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 hover:shadow-md transition-all duration-300 ${isBespoke
                  ? 'bg-[#F9F6EE] border-[#C5A059]/30 ring-1 ring-[#C5A059]/10'
                  : 'bg-white border-brand/5'
                  }`}
              >
                {/* Product Image */}
                <div className="w-32 h-32 bg-brand/5 rounded-2xl overflow-hidden flex-shrink-0 border border-brand/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Item Info */}
                <div className="flex-1 flex flex-col h-full text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-bold text-black leading-tight uppercase">{item.name.toUpperCase()}</h3>
                      </div>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-[#3B82C4] bg-[#3B82C4]/10 border border-[#3B82C4]/20">
                          {item.size || "Standard Pack"}
                        </span>
                        <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-200">
                          Fresh Farm Batch
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 text-xl font-bold text-black">
                      ₹{item.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center justify-between border-t border-brand/5">
                    {/* Size & Quantity Buttons */}
                    <div className="flex flex-wrap gap-3 items-center">
                      {!isBespoke && availableSizes.length > 0 && (
                        <button
                          type="button"
                          onClick={() => openSizeModal(item)}
                          className="bg-brand/5 hover:bg-brand/10 text-black text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-colors outline-none border border-brand/10 flex items-center space-x-1"
                        >
                          <span>Size: {item.size}</span>
                          <ChevronDown size={14} className="text-black/50" />
                        </button>
                      )}

                      {isBespoke && (
                        <span className="text-xs font-bold text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20 px-4 py-2.5 rounded-xl">
                          Size: Custom
                        </span>
                      )}

                      <div className="flex items-center border border-brand/20 bg-brand/5 rounded-xl overflow-hidden h-9">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 1) {
                              setQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          className="px-3 h-full hover:bg-brand/10 transition-colors flex items-center justify-center text-black/50 hover:text-black cursor-pointer"
                        >
                          <Minus size={12} className="stroke-[3]" />
                        </button>
                        <span className="px-3 text-xs font-black text-black select-none text-center min-w-[2.5rem]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setQuantity(item.id, item.quantity + 1);
                          }}
                          className="px-3 h-full hover:bg-brand/10 transition-colors flex items-center justify-center text-black/50 hover:text-black cursor-pointer"
                        >
                          <Plus size={12} className="stroke-[3]" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="mt-4 sm:mt-0 flex items-center space-x-2 text-red-400 hover:text-red-500 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                        <Trash2 size={16} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Price Summary */}
        <div className="lg:col-span-4">
          <div className="bg-[#8c6239] rounded-3xl p-6 shadow-2xl text-white sticky top-28">
            <h2 className="text-lg font-bold mb-6 tracking-tight uppercase border-b border-white/5 pb-4">Price Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-white/50">
                <span className="text-[10px] font-bold tracking-widest uppercase">Subtotal</span>
                <span className="text-sm font-bold tracking-widest">₹{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-green-400">
                  <span className="text-[10px] font-bold tracking-widest uppercase">Discount</span>
                  <span className="text-sm font-bold tracking-widest">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-white/50 pb-3 border-b border-white/10">
                <span className="text-[10px] font-bold tracking-widest uppercase">Shipping</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFFDF6]">Free</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-black tracking-widest uppercase">Total Amount</span>
                <span className="text-lg font-black text-[#FFFDF6] tracking-widest">₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Toggle Coupon Section Link/Button */}
            {!appliedCoupon && !showPromoSection && (
              <button
                onClick={() => setShowPromoSection(true)}
                className="w-full mt-4 py-3 border border-dashed border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#C5A059] hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket size={14} className="text-[#C5A059]" /> Apply Coupons / Offers
              </button>
            )}

            {/* Coupon Code Panel */}
            {(showPromoSection || appliedCoupon) && (
              <div className="border-t border-b border-white/10 py-4 my-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/50 flex items-center gap-1.5">
                    <Ticket size={12} className="text-[#C5A059]" /> Promo Code
                  </span>
                  <div className="flex gap-3">
                    {appliedCoupon && (
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 flex items-center gap-0.5"
                      >
                        Remove
                      </button>
                    )}
                    {!appliedCoupon && (
                      <button
                        onClick={() => setShowPromoSection(false)}
                        className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-0.5"
                      >
                        Hide
                      </button>
                    )}
                  </div>
                </div>

                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER CODE"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError("");
                        setCouponSuccess("");
                      }}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#C5A059] flex-1 placeholder:text-white/20 uppercase"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponInput.trim()}
                      className="bg-[#C5A059] hover:bg-[#C5A059]/90 disabled:opacity-50 text-[#8c6239] font-black text-[9px] uppercase tracking-widest px-4 py-2 rounded-xl transition-all flex items-center justify-center min-w-[70px]"
                    >
                      {isValidatingCoupon ? <Loader2 size={12} className="animate-spin" /> : "Apply"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-white/5 border border-white/15 px-3 py-2.5 rounded-xl">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-[#FFFDF6] font-mono tracking-wider">{appliedCoupon.code}</span>
                      <span className="text-[9px] text-[#C5A059] font-medium max-w-[180px] truncate">{appliedCoupon.description}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
                      <CheckCircle2 size={14} className="text-green-400" /> Applied
                    </div>
                  </div>
                )}

                {couponError && (
                  <p className="text-red-400 text-[10px] font-bold flex items-center gap-1 animate-in fade-in duration-200">
                    <AlertTriangle size={10} /> {couponError}
                  </p>
                )}
                {couponSuccess && (
                  <p className="text-green-400 text-[10px] font-bold flex items-center gap-1 animate-in fade-in duration-200">
                    <CheckCircle2 size={10} /> {couponSuccess}
                  </p>
                )}

                {/* List of Available Offers */}
                {!appliedCoupon && availableCoupons.length > 0 && (() => {
                  const sortedCoupons = [...availableCoupons].sort((a, b) => {
                    if (a.applicable && !b.applicable) return -1;
                    if (!a.applicable && b.applicable) return 1;
                    return 0;
                  });

                  return (
                    <div className="pt-2 border-t border-white/5 space-y-2">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Available Offers:</p>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 dark-scrollbar">
                        {sortedCoupons.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              if (!c.applicable) return;
                              setCouponInput(c.code);
                              // Auto-apply immediately
                              setIsValidatingCoupon(true);
                              setCouponError("");
                              setCouponSuccess("");
                              fetch("/api/coupons/validate", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  couponCode: c.code,
                                  items: items.map(item => ({
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    price: item.price,
                                    size: item.size,
                                    color: item.color
                                  }))
                                })
                              })
                                .then(res => res.json())
                                .then(data => {
                                  if (data.success) {
                                    setAppliedCoupon(data.coupon);
                                    setDiscountAmount(data.discountAmount);
                                    setCouponSuccess(`Coupon "${data.coupon.code}" applied! Saved ₹${data.discountAmount.toLocaleString()}`);
                                    setCouponInput("");
                                  } else {
                                    setCouponError(data.error || "Failed to validate coupon.");
                                  }
                                })
                                .catch(() => setCouponError("Unable to apply coupon."))
                                .finally(() => setIsValidatingCoupon(false));
                            }}
                            className={`p-2.5 rounded-xl border transition-all text-left group flex items-center justify-between ${c.applicable
                              ? "bg-white/5 border-white/5 hover:border-[#C5A059]/40 hover:bg-white/10 cursor-pointer"
                              : "bg-white/[0.02] border-white/5 opacity-55 cursor-not-allowed"
                              }`}
                          >
                            <div className="flex-grow min-w-0 pr-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-bold text-[#FFFDF6] font-mono tracking-wider">{c.code}</span>
                                {c.applicable ? (
                                  <span className="text-[8px] font-black uppercase text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                                    Save ₹{c.discountAmount.toLocaleString()}
                                  </span>
                                ) : (
                                  <span className="text-[8px] font-black uppercase text-white/30 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                    Locked
                                  </span>
                                )}
                              </div>
                              <p className="text-[9px] text-white/50 mt-1 leading-tight">{c.description}</p>
                              {!c.applicable && c.error && (
                                <p className="text-[8.5px] text-amber-400/80 font-bold mt-1 flex items-center gap-1">
                                  <AlertTriangle size={8} /> {c.error}
                                </p>
                              )}
                            </div>
                            {c.applicable && (
                              <span className="text-[8px] font-black uppercase text-[#C5A059] group-hover:underline flex-shrink-0">
                                Apply
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <button
              onClick={handleCheckout}
              className="w-full bg-[#25D366] hover:bg-[#20b858] text-white py-4 rounded-2xl font-black tracking-widest uppercase text-xs transition-all shadow-xl flex items-center justify-center group active:scale-[0.98] gap-2"
            >
              <MessageCircle size={18} className="fill-white/20" />
              <span>Book Order (WhatsApp &amp; COD)</span>
              <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-5 flex items-center justify-center space-x-3 text-black/50 text-[10px] font-bold tracking-wider">
              <span>Pay on Delivery</span>
              <div className="h-1 w-1 rounded-full bg-black/30"></div>
              <span>5:30 AM – 7:30 AM Slot</span>
              <div className="h-1 w-1 rounded-full bg-black/30"></div>
              <span>Hyderabad Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hyderabad Dairy Booking Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-md animate-in fade-in duration-300">
          <div
            className="bg-white rounded-[2.5rem] w-full max-w-xl p-7 shadow-2xl relative overflow-hidden max-h-[92vh] overflow-y-auto no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {bookingSuccessData ? (
              <div className="py-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-[#25D366] rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <CheckCircle2 size={44} className="stroke-[2.5]" />
                </div>
                
                <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200 mb-2">
                  Order Logged • #{bookingSuccessData.orderId}
                </span>
                <h3 className="text-2xl font-playfair font-bold text-black mb-1">
                  Dairy Delivery Booked!
                </h3>
                <p className="text-xs text-black/60 max-w-sm mb-6">
                  We have logged your order for <span className="font-bold text-black">{bookingSuccessData.customerName}</span>. Your details have been sent to WhatsApp for instant confirmation.
                </p>

                <div className="w-full bg-[#F4F8FC] border border-[#3B82C4]/20 rounded-2xl p-5 mb-6 text-left space-y-3">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-[#3B82C4]/15">
                    <span className="text-black/60 font-semibold">Morning Delivery Slot</span>
                    <span className="font-extrabold text-[#3B82C4]">{bookingSuccessData.deliverySlot}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-[#3B82C4]/15">
                    <span className="text-black/60 font-semibold">Delivery Locality</span>
                    <span className="font-bold text-black">{bookingSuccessData.pincode} {bookingSuccessData.areaName ? `(${bookingSuccessData.areaName})` : ''}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-black/60 font-semibold">Total to Pay (On Arrival)</span>
                    <span className="text-base font-extrabold text-black">₹{bookingSuccessData.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <a
                    href={bookingSuccessData.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#25D366] hover:bg-[#20b858] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    <span>Open WhatsApp Chat with Dairy</span>
                  </a>
                  <button
                    onClick={() => {
                      setIsCheckoutModalOpen(false);
                      setBookingSuccessData(null);
                      router.push("/");
                    }}
                    className="w-full py-3.5 border border-brand/20 hover:bg-brand/5 text-black/70 rounded-xl text-xs font-bold transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-4 border-b border-brand/10 mb-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 bg-blue-50 text-[#3B82C4] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <ShoppingBag size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-black leading-tight">Book Fresh Morning Delivery</h3>
                      <p className="text-xs text-black/50 font-medium mt-0.5">Hyderabad &amp; Secunderabad Morning Milk Run</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="p-1.5 text-black/40 hover:text-black hover:bg-brand/5 rounded-full transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Step 1: Pincode Check (The Core Requirement) */}
                  <div className="bg-[#FAFBFD] rounded-2xl p-4 border border-brand/15 shadow-sm">
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#3B82C4]" />
                        <span>1. Delivery Pincode <span className="text-red-500">*</span></span>
                      </span>
                      <span className="text-[10px] text-black/40 font-bold uppercase">Hyderabad Network</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        value={address.pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        placeholder="Enter 6-digit Pincode (e.g. 500032, 500081, 500034)"
                        className="w-full bg-white border-2 border-brand/20 rounded-xl py-3 px-4 text-sm font-bold text-black focus:outline-none focus:border-[#3B82C4] transition-all tracking-wider"
                      />
                      {address.pincode.length === 6 && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                          {pincodeStatus?.serviceable ? (
                            <CheckCircle2 size={20} className="text-emerald-500" />
                          ) : (
                            <AlertTriangle size={20} className="text-rose-500" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Pincode Feedback Card */}
                    {address.pincode.length === 6 && pincodeStatus && (
                      <div className={`mt-3 p-3.5 rounded-xl border flex items-start space-x-3 animate-in fade-in duration-200 ${
                        pincodeStatus.serviceable
                          ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                          : "bg-rose-50 border-rose-200 text-rose-900"
                      }`}>
                        {pincodeStatus.serviceable ? (
                          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="text-xs">
                          {pincodeStatus.serviceable ? (
                            <>
                              <p className="font-black text-emerald-800">
                                Delivery Available in {pincodeStatus.areaName}!
                              </p>
                              <p className="text-emerald-700 font-medium mt-0.5">
                                Morning Slot: Tomorrow 5:30 AM – 7:30 AM • FREE Fresh Delivery
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-black text-rose-800">
                                Unable to serve pincode {address.pincode}
                              </p>
                              <p className="text-rose-700 font-medium mt-0.5">
                                We currently deliver across Greater Hyderabad &amp; Secunderabad (500xxx pincodes). For special inquiries, call <a href="tel:+919876543210" className="underline font-bold">+91 98765 43210</a>.
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {address.pincode.length < 6 && (
                      <p className="text-[11px] text-black/50 font-medium mt-2">
                        Serving Gachibowli, Madhapur, Jubilee Hills, Banjara Hills, Kukatpally, Secunderabad &amp; all 500xxx pincodes.
                      </p>
                    )}
                  </div>

                  {/* Step 2: Customer Details */}
                  <div className="bg-white rounded-2xl p-4 border border-brand/15 shadow-sm space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                      <Phone size={14} className="text-[#3B82C4]" />
                      <span>2. Customer &amp; Delivery Details</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-black/60 uppercase">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={address.fullName}
                          onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                          placeholder="e.g. Rajesh Kumar"
                          className="w-full bg-[#F8FAFC] border border-brand/15 rounded-xl py-2.5 px-3.5 text-xs font-bold text-black focus:outline-none focus:border-[#3B82C4] focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-black/60 uppercase">WhatsApp Mobile No *</label>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          value={address.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setAddress({ ...address, phone: val });
                          }}
                          placeholder="10-digit number"
                          className="w-full bg-[#F8FAFC] border border-brand/15 rounded-xl py-2.5 px-3.5 text-xs font-bold text-black focus:outline-none focus:border-[#3B82C4] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-black/60 uppercase">Flat / House No, Street, Apartment, Landmark *</label>
                      <input
                        type="text"
                        required
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="e.g. Flat 304, Fortune Residency, Near Police Station"
                        className="w-full bg-[#F8FAFC] border border-brand/15 rounded-xl py-2.5 px-3.5 text-xs font-bold text-black focus:outline-none focus:border-[#3B82C4] focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-black/60 uppercase">Delivery Instruction (Optional)</label>
                      <input
                        type="text"
                        value={address.deliveryNotes}
                        onChange={(e) => setAddress({ ...address, deliveryNotes: e.target.value })}
                        placeholder="e.g. Leave milk packet in basket outside door / ring bell"
                        className="w-full bg-[#F8FAFC] border border-brand/15 rounded-xl py-2 px-3.5 text-xs font-medium text-black focus:outline-none focus:border-[#3B82C4] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Step 3: Order Breakdown */}
                  <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-brand/10 space-y-2">
                    <div className="flex justify-between items-center text-xs text-black/70 font-semibold">
                      <span>Cart Items ({getTotalItems()})</span>
                      <span className="font-bold text-black">₹{subtotal.toLocaleString()}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center text-xs text-emerald-600 font-bold">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span>- ₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs text-black/70 font-semibold">
                      <span>Morning Delivery (5:30 AM – 7:30 AM)</span>
                      <span className="text-emerald-600 font-extrabold uppercase">FREE</span>
                    </div>
                    <div className="border-t border-brand/10 pt-2 flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-wider text-black">Total to Pay (On Delivery)</span>
                      <span className="text-xl font-black text-black">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={() => setIsCheckoutModalOpen(false)}
                      className="flex-1 py-3.5 border border-brand/20 hover:bg-brand/5 text-black/60 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Cancel
                    </button>

                    {/* Dynamic Book Button */}
                    {(() => {
                      const isPinChecked = address.pincode.length === 6;
                      const isServiceable = pincodeStatus?.serviceable;
                      const isFormValid = isPinChecked && isServiceable && address.fullName.trim() && address.phone.length === 10 && address.street.trim();

                      if (!isPinChecked) {
                        return (
                          <button
                            type="button"
                            disabled
                            className="flex-[2] py-3.5 bg-gray-200 text-gray-500 rounded-xl text-xs font-black uppercase tracking-wider cursor-not-allowed"
                          >
                            Enter 6-Digit Pincode
                          </button>
                        );
                      }

                      if (!isServiceable) {
                        return (
                          <button
                            type="button"
                            disabled
                            className="flex-[2] py-3.5 bg-rose-100 text-rose-500 rounded-xl text-xs font-black uppercase tracking-wider cursor-not-allowed"
                          >
                            Unable to Serve Pincode
                          </button>
                        );
                      }

                      return (
                        <button
                          type="button"
                          disabled={!isFormValid || isProcessingPayment}
                          onClick={processCodOrder}
                          className="flex-[2] py-3.5 bg-[#25D366] hover:bg-[#20b858] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          {isProcessingPayment ? (
                            <>
                              <Loader2 size={16} className="animate-spin text-white" />
                              <span>Booking Delivery...</span>
                            </>
                          ) : (
                            <>
                              <MessageCircle size={16} className="fill-white/20" />
                              <span>Confirm &amp; Book on WhatsApp</span>
                            </>
                          )}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Size Edit Modal */}
      {activeSizeItemId !== null && (() => {
        const item = items.find(i => i.id === activeSizeItemId);
        if (!item) return null;

        const productVariationsList = productDetailsMap[item.productId]?.variations || [];
        const itemColor = (item.color || "").toLowerCase();
        const colorMatchedVariations = productVariationsList.filter(
          (v: any) => !v.color || v.color.toLowerCase() === itemColor
        );
        const activeVariations = colorMatchedVariations.length > 0 ? colorMatchedVariations : productVariationsList;
        const availableSizes = activeVariations.length > 0
          ? Array.from(new Set(activeVariations.map((v: any) => v.size)))
          : [item.size];

        return (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={() => setActiveSizeItemId(null)} />
            <div className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-brand/5 animate-in zoom-in-95 duration-200 flex flex-col">
              {/* Close Button */}
              <button
                onClick={() => setActiveSizeItemId(null)}
                className="absolute top-4 right-4 p-1.5 text-black/40 hover:text-black hover:bg-brand/5 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              {/* Product Info Block */}
              <div className="flex space-x-4 mb-6">
                <div className="w-20 h-20 bg-brand/5 rounded-xl overflow-hidden flex-shrink-0 border border-brand/5">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-black mt-0.5 leading-snug line-clamp-2 uppercase">{item.name}</h4>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-sm font-bold text-black">₹{item.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-brand/5 pt-4 mb-6">
                <h4 className="text-xs font-black text-black uppercase tracking-wider mb-4">Select Size</h4>
                <div className="flex flex-wrap gap-2.5">
                  {availableSizes.map((sz) => {
                    const isSelected = tempSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setTempSize(sz)}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${isSelected
                          ? "border-brand text-black bg-brand/5 shadow-sm scale-105"
                          : "border-brand/10 text-black/60 hover:border-brand/30 hover:text-black bg-white"
                          }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Done Button */}
              <button
                type="button"
                onClick={() => {
                  const variation = activeVariations.find((v: any) => v.size === tempSize);
                  const price = variation ? (variation.salePrice || variation.mrp || item.price) : item.price;
                  updateItemVariant(item.id, tempSize, price);
                  setActiveSizeItemId(null);
                }}
                className="w-full bg-brand hover:bg-brand-hover text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-brand/10"
              >
                DONE
              </button>
            </div>
          </div>
        );
      })()}

      {/* Quantity Edit Modal */}
      {activeQtyItemId !== null && (() => {
        const item = items.find(i => i.id === activeQtyItemId);
        if (!item) return null;

        const productVariationsList = productDetailsMap[item.productId]?.variations || [];
        const itemColor = (item.color || "").toLowerCase();
        const colorMatchedVariations = productVariationsList.filter(
          (v: any) => !v.color || v.color.toLowerCase() === itemColor
        );
        const activeVariations = colorMatchedVariations.length > 0 ? colorMatchedVariations : productVariationsList;
        const currentVariation = activeVariations.find(
          (v: any) => v.size.toLowerCase() === item.size.toLowerCase()
        );
        const maxStock = currentVariation ? currentVariation.stock : 10;
        const stockLimit = Math.max(item.quantity, maxStock, 1);
        const displayLimit = Math.max(10, stockLimit); // Always show at least 10, or more if stock is higher

        return (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={() => setActiveQtyItemId(null)} />
            <div className="relative bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl border border-brand/5 animate-in zoom-in-95 duration-200 flex flex-col">
              {/* Close Button */}
              <button
                onClick={() => setActiveQtyItemId(null)}
                className="absolute top-6 right-6 p-1 text-black/40 hover:text-black hover:bg-brand/5 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <h3 className="text-base font-bold text-black mb-6">Select Quantity</h3>

              <div className="grid grid-cols-5 gap-3.5 mb-8">
                {Array.from({ length: displayLimit }, (_, i) => i + 1).map((qty) => {
                  const isSelected = tempQty === qty;
                  const isOutOfStock = qty > stockLimit;

                  return (
                    <button
                      key={qty}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setTempQty(qty)}
                      className={`w-11 h-11 rounded-full text-xs font-bold border flex items-center justify-center transition-all ${isSelected
                        ? "border-brand text-black bg-brand/5 shadow-sm scale-110"
                        : isOutOfStock
                          ? "border-brand/5 text-black/10 cursor-not-allowed bg-brand/[0.02]"
                          : "border-brand/10 text-black/60 hover:border-brand/30 hover:text-black bg-white"
                        }`}
                    >
                      {qty}
                    </button>
                  );
                })}
              </div>

              {/* Done Button */}
              <button
                type="button"
                onClick={() => {
                  setQuantity(item.id, tempQty);
                  setActiveQtyItemId(null);
                }}
                className="w-full bg-brand hover:bg-brand-hover text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-brand/10"
              >
                DONE
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}
