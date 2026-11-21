"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", comment: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error || "Failed to submit form. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[85vh] bg-[#F4F8FC] py-12 md:py-16 px-4 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-center text-[#1E242B] mb-2">
          Contact Hyderabad Delight Dairy
        </h1>
        <p className="text-center text-xs md:text-sm text-black/60 mb-8 md:mb-10">
          Have a question about daily morning milk delivery, Bilona ghee, or bulk dairy orders? Reach out to our team below.
        </p>

        {submitted ? (
          <div className="bg-white p-8 md:p-10 rounded-3xl text-center shadow-sm border border-[#3B82C4]/20 max-w-xl mx-auto">
            <h2 className="text-2xl font-playfair font-bold text-[#1E242B] mb-3">
              Thank You!
            </h2>
            <p className="text-black/70 text-sm leading-relaxed mb-6">
              Your message has been sent to the Hyderabad Delight Dairy care team. We will get back to you shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-[#3B82C4] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2B6CB0] transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {errorMessage && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F0] text-[#2C1D11] placeholder:text-[#6B5848] p-4 md:p-5 rounded-lg border border-transparent focus:border-[#C5A059] focus:outline-none transition-colors text-base shadow-sm"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F0] text-[#2C1D11] placeholder:text-[#6B5848] p-4 md:p-5 rounded-lg border border-transparent focus:border-[#C5A059] focus:outline-none transition-colors text-base shadow-sm"
                />
              </div>
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#FAF7F0] text-[#2C1D11] placeholder:text-[#6B5848] p-4 md:p-5 rounded-lg border border-transparent focus:border-[#C5A059] focus:outline-none transition-colors text-base shadow-sm"
              />
            </div>

            <div>
              <textarea
                name="comment"
                required
                rows={8}
                placeholder="Comment"
                value={formData.comment}
                onChange={handleChange}
                className="w-full bg-[#FAF7F0] text-[#2C1D11] placeholder:text-[#6B5848] p-4 md:p-5 rounded-lg border border-transparent focus:border-[#C5A059] focus:outline-none transition-colors text-base resize-y min-h-[220px] shadow-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white px-9 py-3.5 rounded-t-2xl rounded-b-xl text-base font-semibold hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-md cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
