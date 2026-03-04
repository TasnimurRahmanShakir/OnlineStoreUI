import { HeroSection } from "@/components/main/hero-section";
import { ProductShowcaseSection } from "@/components/main/product-showcase-section";
import { TrustStrip } from "@/components/main/trust-strip";
import { CategoryGrid } from "@/components/main/category-grid";
import { PromotionalBanner } from "@/components/main/promotional-banner";
import { SeoFooterText } from "@/components/main/seo-footer-text";

export const dynamic = "force-dynamic";



import { getAllCategoriesAction } from "@/app/actions/categories";
import { getNewArrivalsAction } from "@/app/actions/product";

export default async function MainPage() {
  const newArrivals = await getNewArrivalsAction();
  const categories = await getAllCategoriesAction();

  return (
    <div className="flex flex-col gap-0 pb-0">
      {/* 1. Attract */}
      <HeroSection />

      {/* 2. Assure */}
      <TrustStrip />

      {/* 3. Guide */}
      <CategoryGrid categories={categories} />

      {/* 4. Discover */}
      <ProductShowcaseSection
        title="New Arrivals"
        products={newArrivals}
        viewAllLink="/store?sort=newest"
        className="bg-gray-50/50"
      />

      {/* 5. Re-engage */}
      <PromotionalBanner />

      {/* 6. Validate */}
      {/* <ProductShowcaseSection
        title="Best Sellers"
        products={popularProducts}
        viewAllLink="/store?sort=popular"
      /> */}

      {/* 7. Upsell */}
      {/* <ProductShowcaseSection
        title="Trending Now"
        products={trendingProducts}
        viewAllLink="/store?sort=trending"
        className="bg-gray-50/50"
      /> */}

      {/* 8. Inform */}
      <SeoFooterText />
    </div>
  );
}
