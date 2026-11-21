import { db } from "./index";
import {
  navigationMenu,
  homepageCategories,
  products,
  productVariations,
  pageSections,
  offerBanners,
  siteSettings,
  coupons,
  faqs,
  reviews,
  users,
} from "./schema";

async function seedDairy() {
  console.log("Starting Hyderabad Delight Dairy database seed...");

  try {
    // 1. Ensure System Admin user exists
    await db
      .insert(users)
      .values({
        phoneNumber: "9876543210",
        fullName: "Hyderabad Delight Dairy Admin",
        email: "admin@hyderabaddelightdairy.com",
        role: "admin",
      })
      .onConflictDoNothing();

    // 2. Clear old test data cleanly
    await db.delete(productVariations);
    await db.delete(pageSections);
    await db.delete(products);
    await db.delete(navigationMenu);
    await db.delete(homepageCategories);
    await db.delete(offerBanners);
    await db.delete(coupons);
    await db.delete(faqs);
    await db.delete(reviews);

    console.log("Cleared old data.");

    // 3. Navigation Menu (Categories)
    const navItems = await db
      .insert(navigationMenu)
      .values([
        {
          label: "Milk",
          href: "/category/Milk",
          imageUrl:
            "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
          order: 1,
          isActive: true,
          filterTypes: "Buffalo Milk,Cow Milk,Toned Milk",
        },
        {
          label: "Ghee",
          href: "/category/Ghee",
          imageUrl:
            "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80",
          order: 2,
          isActive: true,
          filterTypes: "Desi Cow Ghee,Bilona Ghee,Buffalo Ghee",
        },
        {
          label: "Paneer",
          href: "/category/Paneer",
          imageUrl:
            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
          order: 3,
          isActive: true,
          filterTypes: "Malai Paneer,Low Fat Paneer",
        },
        {
          label: "Butter",
          href: "/category/Butter",
          imageUrl:
            "https://images.unsplash.com/photo-1589985270762-b9e3a6773a97?w=600&auto=format&fit=crop&q=80",
          order: 4,
          isActive: true,
          filterTypes: "White Makkhan,Table Butter",
        },
        {
          label: "Curd",
          href: "/category/Curd",
          imageUrl:
            "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
          order: 5,
          isActive: true,
          filterTypes: "Farmhouse Dahi,Probiotic Curd,Buttermilk",
        },
      ])
      .returning();

    // 4. Homepage Categories Cards
    await db.insert(homepageCategories).values([
      {
        name: "Farm Fresh Milk",
        promoText: "Pure unadulterated cow & buffalo milk delivered daily by 7 AM.",
        actionText: "Order Milk",
        link: "/category/Milk",
        imageUrl:
          "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
        order: 1,
        isActive: true,
      },
      {
        name: "Traditional Bilona Ghee",
        promoText: "Aroma of pure heritage churned from whole curd.",
        actionText: "Shop Pure Ghee",
        link: "/category/Ghee",
        imageUrl:
          "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80",
        order: 2,
        isActive: true,
      },
      {
        name: "Fresh Malai Paneer",
        promoText: "Soft, melt-in-the-mouth cottage cheese crafted every morning.",
        actionText: "Get Fresh Paneer",
        link: "/category/Paneer",
        imageUrl:
          "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
        order: 3,
        isActive: true,
      },
      {
        name: "Artisanal Makkhan & Butter",
        promoText: "Hand-churned white butter and salted table butter.",
        actionText: "Shop Butter",
        link: "/category/Butter",
        imageUrl:
          "https://images.unsplash.com/photo-1589985270762-b9e3a6773a97?w=600&auto=format&fit=crop&q=80",
        order: 4,
        isActive: true,
      },
      {
        name: "Thick Farmhouse Curd",
        promoText: "Naturally sweet and thick set curd packed with natural probiotics.",
        actionText: "Order Curd",
        link: "/category/Curd",
        imageUrl:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
        order: 5,
        isActive: true,
      },
    ]);

    // 5. Offer Banners
    await db.insert(offerBanners).values([
      {
        text: "ESTD 2008 | Delivering Pure Farm Fresh Dairy Across Hyderabad Every Morning!",
        link: "/my-story",
        order: 1,
      },
      {
        text: "100% Unadulterated Milk & Bilona Ghee Direct From Local Farms",
        link: "/all",
        order: 2,
      },
      {
        text: "Flat 10% Off on Your First Order! Use Code: DELIGHT10",
        link: null,
        order: 3,
      },
    ]);

    // 6. Site Settings
    await db
      .insert(siteSettings)
      .values({
        key: "homepage_banner",
        value:
          "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&auto=format&fit=crop&q=80",
      })
      .onConflictDoNothing();

    // 7. Seed Products & Variations
    const insertedProducts = [];

    // --- Product 1: Farm Fresh Whole Buffalo Milk ---
    const p1 = await db
      .insert(products)
      .values({
        name: "Farm Fresh Whole Buffalo Milk",
        description:
          "Rich, creamy 100% pure whole buffalo milk with naturally high fat (6.5%+). Freshly milked and delivered chilled within hours to your doorstep in Hyderabad. Free from preservatives, hormonal injections, or milk powder.",
        basePrice: 45,
        salePrice: 42,
        avgRating: 4.9,
        numReviews: 84,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&auto=format&fit=crop&q=80",
        ]),
        gender: "unisex",
        category: "Milk",
        filterCategory: "Milk",
        tags: "Buffalo Milk, Fresh Milk, High Fat, Raw Milk",
        isFeatured: true,
        isCustomizable: false,
        specifications: JSON.stringify({
          Fat: "6.5% - 7.0%",
          SNF: "9.0% Min",
          Source: "Grass-Fed Buffaloes",
          Delivery: "Daily 5:30 AM - 7:30 AM",
        }),
      })
      .returning();

    await db.insert(productVariations).values([
      {
        productId: p1[0].id,
        size: "500 ml",
        stock: 100,
        sku: "HDD-BM-500",
        mrp: 45,
        salePrice: 42,
      },
      {
        productId: p1[0].id,
        size: "1 Litre",
        stock: 150,
        sku: "HDD-BM-1L",
        mrp: 85,
        salePrice: 80,
      },
      {
        productId: p1[0].id,
        size: "2 Litres",
        stock: 50,
        sku: "HDD-BM-2L",
        mrp: 170,
        salePrice: 155,
      },
    ]);
    insertedProducts.push(p1[0]);

    // --- Product 2: Pure Desi Cow Milk (A2) ---
    const p2 = await db
      .insert(products)
      .values({
        name: "Pure Desi Cow Milk (A2)",
        description:
          "Nutritious and light A2 cow milk from indigenous grass-fed cows. Packed with natural vitamins, minerals, and easily digestible A2 beta-casein proteins. Perfect for children, seniors, and holistic health.",
        basePrice: 50,
        salePrice: 48,
        avgRating: 4.8,
        numReviews: 62,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80",
        ]),
        gender: "unisex",
        category: "Milk",
        filterCategory: "Milk",
        tags: "Cow Milk, A2 Milk, Pure, Desi Cow",
        isFeatured: true,
        isCustomizable: false,
        specifications: JSON.stringify({
          Fat: "4.0% - 4.5%",
          SNF: "8.5% Min",
          Protein: "100% A2 Beta-Casein",
          Delivery: "Daily 5:30 AM - 7:30 AM",
        }),
      })
      .returning();

    await db.insert(productVariations).values([
      {
        productId: p2[0].id,
        size: "500 ml",
        stock: 80,
        sku: "HDD-CM-500",
        mrp: 50,
        salePrice: 48,
      },
      {
        productId: p2[0].id,
        size: "1 Litre",
        stock: 120,
        sku: "HDD-CM-1L",
        mrp: 95,
        salePrice: 90,
      },
    ]);
    insertedProducts.push(p2[0]);

    // --- Product 3: Traditional Bilona A2 Desi Cow Ghee ---
    const p3 = await db
      .insert(products)
      .values({
        name: "Traditional Bilona A2 Desi Cow Ghee",
        description:
          "Handcrafted following ancient Ayurvedic Vedic Bilona method: curd is churned with wooden churners to extract makkhan, which is then slow-cooked over a mild fire. Granular golden texture with unforgettable aroma and high nutritional value.",
        basePrice: 499,
        salePrice: 469,
        avgRating: 5.0,
        numReviews: 128,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&auto=format&fit=crop&q=80",
        ]),
        gender: "unisex",
        category: "Ghee",
        filterCategory: "Ghee",
        tags: "Bilona Ghee, Desi Cow Ghee, A2 Ghee, Vedic",
        isFeatured: true,
        isCustomizable: false,
        specifications: JSON.stringify({
          Process: "Bilona Churned (Curd-based)",
          Texture: "Granular Golden Danedar",
          ShelfLife: "12 Months",
          Storage: "Store in cool dry place away from sunlight",
        }),
      })
      .returning();

    await db.insert(productVariations).values([
      {
        productId: p3[0].id,
        size: "250 ml",
        stock: 60,
        sku: "HDD-GHEE-250",
        mrp: 499,
        salePrice: 469,
      },
      {
        productId: p3[0].id,
        size: "500 ml",
        stock: 80,
        sku: "HDD-GHEE-500",
        mrp: 950,
        salePrice: 890,
      },
      {
        productId: p3[0].id,
        size: "1 Litre",
        stock: 40,
        sku: "HDD-GHEE-1L",
        mrp: 1850,
        salePrice: 1720,
      },
    ]);
    insertedProducts.push(p3[0]);

    // --- Product 4: Pure Buffalo Ghee ---
    const p4 = await db
      .insert(products)
      .values({
        name: "Pure Farmhouse Buffalo Ghee",
        description:
          "Rich, aromatic granular white buffalo ghee slow-cooked to perfection. Renowned for its rich mouthfeel and authentic aroma, perfect for Hyderabadi biryanis, traditional sweets, and daily cooking.",
        basePrice: 399,
        salePrice: 375,
        avgRating: 4.8,
        numReviews: 45,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&auto=format&fit=crop&q=80",
        ]),
        gender: "unisex",
        category: "Ghee",
        filterCategory: "Ghee",
        tags: "Buffalo Ghee, Pure Ghee, Biryani Ghee",
        isFeatured: false,
        isCustomizable: false,
      })
      .returning();

    await db.insert(productVariations).values([
      {
        productId: p4[0].id,
        size: "500 ml",
        stock: 50,
        sku: "HDD-BG-500",
        mrp: 399,
        salePrice: 375,
      },
      {
        productId: p4[0].id,
        size: "1 Litre",
        stock: 60,
        sku: "HDD-BG-1L",
        mrp: 780,
        salePrice: 720,
      },
    ]);
    insertedProducts.push(p4[0]);

    // --- Product 5: Fresh Soft Malai Paneer ---
    const p5 = await db
      .insert(products)
      .values({
        name: "Fresh Soft Malai Paneer",
        description:
          "Crafted every morning from pure whole milk. Luxuriously soft, velvety, and spongy without rubberiness. 100% natural, free from starch, palm oil, or added chemicals.",
        basePrice: 110,
        salePrice: 105,
        avgRating: 4.9,
        numReviews: 95,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
        ]),
        gender: "unisex",
        category: "Paneer",
        filterCategory: "Paneer",
        tags: "Malai Paneer, Fresh Paneer, High Protein",
        isFeatured: true,
        isCustomizable: false,
        specifications: JSON.stringify({
          Type: "Malai Paneer",
          ShelfLife: "3 Days refrigerated (2-4°C)",
          Protein: "18g per 100g",
        }),
      })
      .returning();

    await db.insert(productVariations).values([
      {
        productId: p5[0].id,
        size: "200 g",
        stock: 75,
        sku: "HDD-PAN-200",
        mrp: 110,
        salePrice: 105,
      },
      {
        productId: p5[0].id,
        size: "500 g",
        stock: 50,
        sku: "HDD-PAN-500",
        mrp: 260,
        salePrice: 245,
      },
      {
        productId: p5[0].id,
        size: "1 kg",
        stock: 30,
        sku: "HDD-PAN-1KG",
        mrp: 490,
        salePrice: 460,
      },
    ]);
    insertedProducts.push(p5[0]);

    // --- Product 6: Artisanal White Makkhan (Cultured Butter) ---
    const p6 = await db
      .insert(products)
      .values({
        name: "Artisanal White Makkhan (Cultured Butter)",
        description:
          "Fresh unsalted white butter churned from wholesome cultured cream. Soft, pure, and naturally fragrant just like grandma made at home. Delicious on warm rotis, parathas, and dal makhani.",
        basePrice: 160,
        salePrice: 150,
        avgRating: 4.9,
        numReviews: 38,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1589985270762-b9e3a6773a97?w=800&auto=format&fit=crop&q=80",
        ]),
        gender: "unisex",
        category: "Butter",
        filterCategory: "Butter",
        tags: "White Butter, Makkhan, Unsalted Butter, Desi Makkhan",
        isFeatured: true,
        isCustomizable: false,
      })
      .returning();

    await db.insert(productVariations).values([
      {
        productId: p6[0].id,
        size: "250 g",
        stock: 40,
        sku: "HDD-BUT-250",
        mrp: 160,
        salePrice: 150,
      },
      {
        productId: p6[0].id,
        size: "500 g",
        stock: 35,
        sku: "HDD-BUT-500",
        mrp: 310,
        salePrice: 290,
      },
    ]);
    insertedProducts.push(p6[0]);

    // --- Product 7: Traditional Salted Table Butter ---
    const p7 = await db
      .insert(products)
      .values({
        name: "Traditional Salted Table Butter",
        description:
          "Golden, creamy, and spreadable table butter made with fresh cream and a dash of natural sea salt. Elevates your morning dosas, parathas, and breakfast toasts.",
        basePrice: 130,
        salePrice: 125,
        avgRating: 4.7,
        numReviews: 29,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1589985270762-b9e3a6773a97?w=800&auto=format&fit=crop&q=80",
        ]),
        gender: "unisex",
        category: "Butter",
        filterCategory: "Butter",
        tags: "Table Butter, Salted Butter",
        isFeatured: false,
        isCustomizable: false,
      })
      .returning();

    await db.insert(productVariations).values([
      {
        productId: p7[0].id,
        size: "250 g",
        stock: 45,
        sku: "HDD-SB-250",
        mrp: 130,
        salePrice: 125,
      },
      {
        productId: p7[0].id,
        size: "500 g",
        stock: 30,
        sku: "HDD-SB-500",
        mrp: 250,
        salePrice: 235,
      },
    ]);
    insertedProducts.push(p7[0]);

    // --- Product 8: Thick Farmhouse Dahi (Set Curd) ---
    const p8 = await db
      .insert(products)
      .values({
        name: "Thick Farmhouse Dahi (Set Curd)",
        description:
          "Thick, velvety, and sweet dahi prepared from whole farm milk using traditional starter cultures. Mild and non-sour, perfect for curd rice, raita, or healthy daily consumption.",
        basePrice: 50,
        salePrice: 48,
        avgRating: 4.8,
        numReviews: 76,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80",
        ]),
        gender: "unisex",
        category: "Curd",
        filterCategory: "Curd",
        tags: "Dahi, Set Curd, Fresh Curd, Probiotic",
        isFeatured: true,
        isCustomizable: false,
        specifications: JSON.stringify({
          Texture: "Thick Claypot Style Set Curd",
          Cultures: "Live Probiotic Lactic Acid Bacteria",
          ShelfLife: "5 Days refrigerated",
        }),
      })
      .returning();

    await db.insert(productVariations).values([
      {
        productId: p8[0].id,
        size: "500 g",
        stock: 90,
        sku: "HDD-CURD-500",
        mrp: 50,
        salePrice: 48,
      },
      {
        productId: p8[0].id,
        size: "1 kg",
        stock: 70,
        sku: "HDD-CURD-1KG",
        mrp: 95,
        salePrice: 90,
      },
    ]);
    insertedProducts.push(p8[0]);

    // --- Product 9: Refreshing Spiced Masala Buttermilk (Chaas) ---
    const p9 = await db
      .insert(products)
      .values({
        name: "Refreshing Spiced Masala Buttermilk (Chaas)",
        description:
          "Traditional cooling chaas freshly churned from set curd, seasoned with roasted jeera (cumin), ginger, curry leaves, and green chillies. Instant hydration and digestion aid for hot Hyderabad days.",
        basePrice: 30,
        salePrice: 28,
        avgRating: 4.9,
        numReviews: 53,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80",
        ]),
        gender: "unisex",
        category: "Curd",
        filterCategory: "Curd",
        tags: "Buttermilk, Chaas, Summer Drink, Cooling",
        isFeatured: false,
        isCustomizable: false,
      })
      .returning();

    await db.insert(productVariations).values([
      {
        productId: p9[0].id,
        size: "300 ml",
        stock: 60,
        sku: "HDD-CHAAS-300",
        mrp: 30,
        salePrice: 28,
      },
      {
        productId: p9[0].id,
        size: "1 Litre",
        stock: 40,
        sku: "HDD-CHAAS-1L",
        mrp: 80,
        salePrice: 75,
      },
    ]);
    insertedProducts.push(p9[0]);

    // 8. Page Sections linking to categories and products
    if (navItems.length > 0) {
      await db.insert(pageSections).values([
        {
          menuId: navItems[0].id, // Milk
          title: "Daily Morning Farm Milk",
          productIds: `${p1[0].id},${p2[0].id}`,
          displayOrder: 1,
        },
        {
          menuId: navItems[1].id, // Ghee
          title: "Traditional Bilona & Farm Ghee",
          productIds: `${p3[0].id},${p4[0].id}`,
          displayOrder: 2,
        },
        {
          menuId: navItems[2].id, // Paneer
          title: "Artisanal Fresh Paneer & Butter",
          productIds: `${p5[0].id},${p6[0].id},${p7[0].id}`,
          displayOrder: 3,
        },
        {
          menuId: navItems[4].id, // Curd
          title: "Farmhouse Dahi & Buttermilk",
          productIds: `${p8[0].id},${p9[0].id}`,
          displayOrder: 4,
        },
      ]);
    }

    // 9. Welcome Coupons
    await db.insert(coupons).values([
      {
        code: "DELIGHT10",
        description: "10% off on all fresh dairy products for new customers!",
        discountType: "percentage",
        discountValue: 10,
        minPurchaseAmount: 199,
        targetType: "all",
        isActive: true,
      },
      {
        code: "FREEDELIVERY",
        description: "Free delivery across Hyderabad on orders over ₹299",
        discountType: "flat",
        discountValue: 40,
        minPurchaseAmount: 299,
        targetType: "all",
        isActive: true,
      },
    ]);

    // 10. FAQs
    await db.insert(faqs).values([
      {
        question: "How is Hyderabad Delight Dairy milk different from regular packet milk?",
        answer:
          "Hyderabad Delight Dairy delivers 100% pure, unadulterated milk sourced directly from local dairy farms within hours of milking. Unlike industrial packaged milk, our milk has no chemical preservatives, no reconstituted milk powder, and retains its full natural cream.",
        displayOrder: 1,
      },
      {
        question: "What time is morning delivery completed?",
        answer:
          "All orders placed by 9:00 PM are delivered fresh between 5:30 AM and 7:30 AM the next morning across Hyderabad.",
        displayOrder: 2,
      },
      {
        question: "Do you offer Cash on Delivery (COD)?",
        answer:
          "Yes! You can choose 'Pay on Delivery' during checkout and pay via Cash or UPI when your fresh dairy arrives at your door.",
        displayOrder: 3,
      },
      {
        question: "How is Traditional Bilona Ghee made?",
        answer:
          "Our Bilona Ghee is made the Vedic way: fresh A2 milk is converted to whole curd, churned with wooden churners to extract makkhan (butter), and slow-simmered on low flame until it turns into golden, aromatic granular ghee.",
        displayOrder: 4,
      },
      {
        question: "How long can fresh Paneer and Milk be stored?",
        answer:
          "Because our dairy has zero artificial preservatives, please store it in your refrigerator (2°C to 4°C). Milk should be boiled upon delivery. Paneer stays fresh for up to 3 days when refrigerated in water.",
        displayOrder: 5,
      },
    ]);

    // 11. Customer Reviews
    await db.insert(reviews).values([
      {
        userName: "Suresh Varma",
        rating: 5,
        designation: "Jubilee Hills, Hyderabad",
        comment:
          "The buffalo milk reminds me of my village days. Thick cream forms on boiling and the morning delivery is always before 7 AM like clockwork!",
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        buttonText: "ORDER MILK",
        buttonLink: "/category/Milk",
      },
      {
        userName: "Priya Reddy",
        rating: 5,
        designation: "Banjara Hills, Hyderabad",
        comment:
          "The Bilona A2 cow ghee has that heavenly traditional aroma. You can see the granular golden texture immediately. Worth every rupee for health.",
        imageUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        buttonText: "SHOP GHEE",
        buttonLink: "/category/Ghee",
      },
      {
        userName: "Vikram K.",
        rating: 5,
        designation: "Gachibowli, Hyderabad",
        comment:
          "The fresh malai paneer is so soft, it literally melts in your mouth! No rubbery texture like supermarket brands. Our weekend palak paneer was unforgettable.",
        imageUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        buttonText: "ORDER PANEER",
        buttonLink: "/category/Paneer",
      },
    ]);

    console.log("Hyderabad Delight Dairy seed completed successfully!");
  } catch (error) {
    console.error("Seeding failed with error:", error);
    throw error;
  }
}

seedDairy();

