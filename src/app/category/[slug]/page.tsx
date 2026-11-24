import { db } from "@/db";
import { navigationMenu, pageSections, products, homepageCategories, productVariations } from "@/db/schema";
import { eq, inArray, asc, or, and, sql } from "drizzle-orm";
import CategoryFilterSection from "@/components/CategoryFilterSection";
import Link from "next/link";
import { getFallbackCategory, getFallbackProductsByCategory } from "@/data/fallbackDairyData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();
  const normalizedSlug = decodedSlug.toLowerCase().replace(/^\/category\//, "");

  let categoryName = "";
  let isFromNav = false;
  let filterTypes: string | null = null;
  let bannerImage: string | null = null;
  let matchedMenuId: number | null = null;

  try {
    // 1. Fetch from navigation menu
    const menuResult = await db.select()
      .from(navigationMenu)
      .where(eq(navigationMenu.isActive, true));

    const matchedNav = menuResult.find((m) => {
      const hrefSlug = m.href?.replace(/^\/category\//, "").toLowerCase().trim();
      const labelSlug = m.label?.toLowerCase().trim().replace(/\s+/g, "-");
      return (
        hrefSlug === normalizedSlug ||
        labelSlug === normalizedSlug ||
        m.label?.toLowerCase() === normalizedSlug ||
        hrefSlug === decodedSlug.toLowerCase()
      );
    });

    // 2. Fetch from homepage categories
    const homeCatResult = await db.select()
      .from(homepageCategories)
      .where(eq(homepageCategories.isActive, true));

    const matchedHomeCat = homeCatResult.find((item) => {
      const linkSlug = item.link?.replace(/^\/category\//, "").toLowerCase().trim();
      const nameSlug = item.name.toLowerCase().trim().replace(/\s+/g, "-");
      return (
        linkSlug === normalizedSlug ||
        nameSlug === normalizedSlug ||
        item.name.toLowerCase() === normalizedSlug ||
        linkSlug === decodedSlug.toLowerCase()
      );
    });

    if (matchedNav) {
      categoryName = matchedNav.label;
      isFromNav = true;
      matchedMenuId = matchedNav.id;
      filterTypes = matchedNav.filterTypes;
      bannerImage = matchedNav.imageUrl || matchedHomeCat?.imageUrl || null;
    } else if (matchedHomeCat) {
      categoryName = matchedHomeCat.name;
      filterTypes = matchedHomeCat.filterTypes;
      bannerImage = matchedHomeCat.imageUrl || null;
    }
  } catch (err) {
    console.error("Error querying category tables from DB:", err);
  }

  // 3. Fallback to predefined Dairy category mapping if not resolved from DB
  if (!categoryName) {
    const fallback = getFallbackCategory(normalizedSlug);
    if (fallback) {
      categoryName = fallback.name;
      filterTypes = fallback.filterTypes;
      bannerImage = fallback.imageUrl;
    } else {
      // Capitalize slug as fallback title
      categoryName = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);
    }
  }

  // 4. Fetch sections for this category (if it is a navigation item in DB)
  let sectionsWithProducts: any[] = [];
  if (isFromNav && matchedMenuId) {
    try {
      const sections = await db.select()
        .from(pageSections)
        .where(eq(pageSections.menuId, matchedMenuId))
        .orderBy(asc(pageSections.displayOrder));

      sectionsWithProducts = await Promise.all(
        sections.map(async (section) => {
          const productIds = section.productIds
            .split(",")
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));

          let hydratedProducts: any[] = [];
          if (productIds.length > 0) {
            hydratedProducts = await db.select()
              .from(products)
              .where(and(inArray(products.id, productIds), eq(products.isActive, true)));
          }

          return {
            ...section,
            products: hydratedProducts
          };
        })
      );
    } catch (err) {
      console.error("Error fetching category sections:", err);
    }
  }

  // 5. Query products for this category from database
  let displayProducts: any[] = [];
  if (sectionsWithProducts.length === 0) {
    try {
      const categorySlug = categoryName.toLowerCase().trim().replace(/\s+/g, "-");
      displayProducts = await db.select()
        .from(products)
        .where(
          and(
            or(
              sql`lower(${products.category}) = ${categoryName.toLowerCase()}`,
              sql`lower(${products.category}) = ${normalizedSlug}`,
              sql`lower(${products.category}) = ${categorySlug}`
            ),
            eq(products.isActive, true)
          )
        );
    } catch (err) {
      console.error("Error fetching category products from DB:", err);
    }
  }

  // 6. If no products in DB (e.g. database unseeded on fresh deploy), use rich fallback dairy products
  if (sectionsWithProducts.length === 0 && displayProducts.length === 0) {
    displayProducts = getFallbackProductsByCategory(categoryName);
    if (displayProducts.length === 0) {
      displayProducts = getFallbackProductsByCategory(normalizedSlug);
    }
  }

  // 7. Query sizes (variations) for DB products
  const allProductIds = [
    ...displayProducts.map((p) => p.id).filter(id => typeof id === "number"),
    ...sectionsWithProducts.flatMap((s) => (s.products || []).map((p: any) => p.id)).filter(id => typeof id === "number"),
  ];

  let allVariations: any[] = [];
  if (allProductIds.length > 0) {
    try {
      allVariations = await db.select()
        .from(productVariations)
        .where(inArray(productVariations.productId, allProductIds));
    } catch (err) {
      console.error("Error fetching variations:", err);
    }
  }

  // Group sizes and calculate total stock by product ID
  const sizeMap = new Map<number, string[]>();
  const stockMap = new Map<number, number>();
  allVariations.forEach((v) => {
    if (!v.productId) return;
    
    // Group sizes
    if (v.size) {
      const currentSizes = sizeMap.get(v.productId) || [];
      const normalizedSize = v.size.trim();
      if (normalizedSize && !currentSizes.includes(normalizedSize)) {
        currentSizes.push(normalizedSize);
      }
      sizeMap.set(v.productId, currentSizes);
    }

    // Accumulate stock
    const currentStock = stockMap.get(v.productId) || 0;
    stockMap.set(v.productId, currentStock + (v.stock || 0));
  });

  // Attach sizes and totalStock to displayProducts
  displayProducts = displayProducts.map((p) => ({
    ...p,
    sizes: p.sizes || sizeMap.get(p.id) || ["Standard"],
    totalStock: p.totalStock !== undefined ? p.totalStock : (stockMap.has(p.id) ? stockMap.get(p.id) : 100),
  }));

  // Attach sizes and totalStock to sectionsWithProducts
  sectionsWithProducts = sectionsWithProducts.map((s) => ({
    ...s,
    products: (s.products || []).map((p: any) => ({
      ...p,
      sizes: p.sizes || sizeMap.get(p.id) || ["Standard"],
      totalStock: p.totalStock !== undefined ? p.totalStock : (stockMap.has(p.id) ? stockMap.get(p.id) : 100),
    })),
  }));

  return (
    <div className="w-full bg-brand-light min-h-[calc(100vh-48px)] flex flex-col">
      <CategoryFilterSection
        initialSections={sectionsWithProducts}
        initialDisplayProducts={displayProducts}
        categoryName={categoryName}
        slug={slug}
        filterTypes={filterTypes}
        categoryImages={bannerImage}
      />
    </div>
  );
}
