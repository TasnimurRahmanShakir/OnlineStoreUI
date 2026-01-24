"use client";

import { useVariantSelector } from "@/hooks/use-variant-selector";
import { Product, NewArrivals } from "@/lib/types";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductShowcaseSection } from "@/components/main/product-showcase-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProductDetailsProps {
  product: Product;
  similarProducts: NewArrivals[];
  userId?: string;
}

export function ProductDetails({
  product,
  similarProducts,
  userId,
}: ProductDetailsProps) {
  const {
    colors,
    sizes,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    currentVariant,
    currentPrice,
    isOutOfStock,
    isVariantAvailable,
    discountPercentage,
  } = useVariantSelector({ product });

  return (
    <div className="container w-full max-w-7xl mx-auto overflow-x-hidden px-4 py-6 md:px-6 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
        {/* Left Column: Gallery */}
        <div className="h-fit md:sticky md:top-24 w-full">
          <ProductImageGallery
            product={product}
            selectedVariant={currentVariant}
          />
        </div>

        {/* Right Column: Info */}
        <div className="w-full">
          <ProductInfo
            product={product}
            colors={colors}
            sizes={sizes}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            currentPrice={currentPrice}
            isOutOfStock={isOutOfStock}
            isVariantAvailable={isVariantAvailable}
            discountPercentage={discountPercentage}
            userId={userId}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12 md:mt-24">
        <Tabs defaultValue="description" className="w-full">
          <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent inline-flex min-w-full md:min-w-0">
              <TabsTrigger
                id="description"
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm md:text-base whitespace-nowrap"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm md:text-base whitespace-nowrap"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm md:text-base whitespace-nowrap"
              >
                Reviews ({product.reviewCount || 0})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="description" className="pt-6 md:pt-8">
            <div className="prose prose-sm md:prose-base max-w-none text-gray-600 wrap-break-word">
              {product.description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p>No description available.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="pt-6 md:pt-8">
            <div className="border rounded-lg p-4 md:p-6 bg-gray-50">
              <h3 className="font-semibold mb-4 text-base md:text-lg">
                Product Specifications
              </h3>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex justify-between py-2 border-b last:border-0">
                  <span className="text-muted-foreground mr-2">Brand</span>
                  <span className="font-medium text-right wrap-break-word">
                    {product.brand}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b last:border-0">
                  <span className="text-muted-foreground mr-2">SKU</span>
                  <span className="font-medium text-right break-all">
                    {currentVariant?.sku || product.variants?.[0]?.sku || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b last:border-0">
                  <span className="text-muted-foreground mr-2">Category</span>
                  <span className="font-medium text-right wrap-break-word">
                    {product.categoryName || "General"}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="pt-6 md:pt-8">
            <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, i) => (
                  <div key={i} className="border-b pb-6 last:border-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {review.Name || review.user}
                        </span>
                        {review.datePosted && (
                          <span className="text-xs text-muted-foreground">
                            {review.datePosted}
                          </span>
                        )}
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, starIndex) => (
                          <span
                            key={starIndex}
                            className={cn(
                              "text-lg",
                              starIndex < review.rating
                                ? "text-yellow-400"
                                : "text-gray-200",
                            )}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-gray-600">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-lg">
                  No reviews yet. Be the first to review this product!
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {similarProducts.length > 0 && (
        <div className="mt-12 md:mt-24">
          <ProductShowcaseSection
            title="You Might Also Like"
            products={similarProducts}
            viewAllLink="/products"
          />
        </div>
      )}
    </div>
  );
}
