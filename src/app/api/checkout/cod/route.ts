import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, users } from "@/db/schema";
import { getVerifiedPhoneFromCookie } from "@/db/auth-helper";
import { eq } from "drizzle-orm";
import { validateAndCalculateCoupon } from "@/utils/coupon";
import { checkPincodeServiceability } from "@/utils/pincode";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      items, 
      totalAmount, 
      shippingAddress, 
      couponCode, 
      guestPhone, 
      guestName,
      customerName,
      customerPhone,
      pincode,
      address,
      deliverySlot
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart items are required" },
        { status: 400 }
      );
    }

    // Resolve customer details
    const resolvedName = (customerName || guestName || "Hyderabad Delight Customer").trim();
    let resolvedPhone = (customerPhone || guestPhone || "").replace(/\D/g, "").slice(-10);

    // Check if user has an auth session cookie
    if (!resolvedPhone) {
      const cookiePhone = await getVerifiedPhoneFromCookie("auth_session");
      if (cookiePhone) resolvedPhone = cookiePhone;
    }

    // Pincode validation if provided
    let areaName = "";
    if (pincode) {
      const pinResult = checkPincodeServiceability(pincode);
      if (!pinResult.serviceable) {
        return NextResponse.json(
          { 
            success: false, 
            error: pinResult.message || `Delivery is not available to pincode ${pincode}. We deliver within Hyderabad & Secunderabad.` 
          },
          { status: 400 }
        );
      }
      areaName = pinResult.areaName || "";
    }

    // Build consolidated shipping address string
    let resolvedShippingAddress = shippingAddress;
    if (!resolvedShippingAddress) {
      if (!address) {
        return NextResponse.json(
          { success: false, error: "Delivery address is required" },
          { status: 400 }
        );
      }
      resolvedShippingAddress = `Name: ${resolvedName}, Contact: ${resolvedPhone || "Not Provided"}, Address: ${address}, Pincode: ${pincode || "500032"}${areaName ? ` (${areaName})` : ""}, Slot: ${deliverySlot || "Tomorrow 5:30 AM – 7:30 AM"}`;
    }

    const finalPhone = resolvedPhone || "9876543210";

    // Find or create user record
    let userRows = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, finalPhone))
      .limit(1);

    let user;
    if (!userRows.length) {
      const [newUser] = await db
        .insert(users)
        .values({
          phoneNumber: finalPhone,
          fullName: resolvedName,
          role: "user",
          address: JSON.stringify([resolvedShippingAddress]),
        })
        .returning();
      user = newUser;
    } else {
      user = userRows[0];
      try {
        let addresses: string[] = [];
        if (user.address) {
          try {
            addresses = JSON.parse(user.address);
            if (!Array.isArray(addresses)) addresses = [user.address];
          } catch {
            addresses = [user.address];
          }
        }
        if (!addresses.includes(resolvedShippingAddress)) {
          addresses.push(resolvedShippingAddress);
          await db
            .update(users)
            .set({ address: JSON.stringify(addresses), fullName: resolvedName || user.fullName })
            .where(eq(users.id, user.id));
        }
      } catch (err) {
        console.error("Address update notice:", err);
      }
    }

    // Validate Coupon if provided
    let discountAmount = 0;
    if (couponCode) {
      const couponValidation = await validateAndCalculateCoupon(
        couponCode,
        items,
        user.id
      );
      if (couponValidation.valid) {
        discountAmount = couponValidation.discountAmount;
      }
    }

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const expectedTotal = Math.max(0, subtotal - discountAmount);

    // Create unique COD order ID
    const codOrderId = `HDD_COD_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Create Order with status for Cash / Pay on Delivery
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: user.id,
        totalAmount: expectedTotal,
        status: "pending", // Pending morning dispatch
        paymentStatus: "pending", // Pay on delivery
        paymentGateway: "cod",
        phonepeOrderId: codOrderId,
        shippingAddress: resolvedShippingAddress,
        couponCode: couponCode || null,
        discountAmount: discountAmount || 0,
        createdAt: new Date().toISOString(),
      })
      .returning();

    // Insert Order Items
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: item.size || "Standard",
        color: item.color || null,
        customizations: item.customizations
          ? JSON.stringify(item.customizations)
          : null,
      });
    }

    // Format Structured WhatsApp Message
    const itemsListText = items
      .map(
        (it: any) =>
          `• *${it.name}* (${it.size || "Standard"}) x ${it.quantity} — ₹${(it.price * it.quantity).toFixed(0)}`
      )
      .join("\n");

    const whatsappText = [
      `🥛 *NEW ORDER — HYDERABAD DELIGHT DAIRY*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `*Order ID:* #${newOrder.id}`,
      `*Customer:* ${resolvedName}`,
      `*Phone:* ${finalPhone}`,
      pincode ? `*Pincode:* ${pincode}${areaName ? ` (${areaName})` : ""}` : null,
      address ? `*Delivery Address:* ${address}` : `*Address:* ${resolvedShippingAddress}`,
      ``,
      `*Items Ordered:*`,
      itemsListText,
      ``,
      discountAmount > 0 ? `*Discount Applied:* -₹${discountAmount.toFixed(0)} (${couponCode})` : null,
      `*Total Amount:* ₹${expectedTotal.toFixed(0)} (Pay on Delivery / COD)`,
      `*Delivery Slot:* ${deliverySlot || "Tomorrow Morning 5:30 AM – 7:30 AM"}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Please confirm my fresh morning dairy order!`,
    ]
      .filter(Boolean)
      .join("\n");

    const storeWhatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
    const whatsappUrl = `https://wa.me/${storeWhatsAppNumber}?text=${encodeURIComponent(whatsappText)}`;

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      orderRef: codOrderId,
      totalAmount: expectedTotal,
      whatsappUrl,
      whatsappText,
      message: "Order placed successfully! Pay on delivery at your doorstep.",
    });
  } catch (error: any) {
    console.error("COD Checkout Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to place order" },
      { status: 500 }
    );
  }
}


