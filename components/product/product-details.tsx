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
}

export function ProductDetails({
  product,
  similarProducts,
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
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
        {/* Left Column: Gallery */}
        <div className="h-fit sticky top-24">
          <ProductImageGallery
            product={product}
            selectedVariant={currentVariant}
          />
        </div>

        {/* Right Column: Info */}
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
        />
      </div>

      {/* Tabs Section */}
      <div className="mt-16 md:mt-24">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-base"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-base"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-base"
            >
              Reviews ({product.reviewCount || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-8">
            <div className="prose max-w-none text-gray-600">
              {product.description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p>No description available.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="pt-8">
            <div className="border rounded-lg p-6 bg-gray-50">
              <h3 className="font-semibold mb-4">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Brand</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-medium">
                    {currentVariant?.sku || product.variants?.[0]?.sku || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Material</span>
                  <span className="font-medium">Premium Cotton Blend</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Fit Type</span>
                  <span className="font-medium">Regular Fit</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="pt-8">
            <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, i) => (
                  <div key={i} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{review.user}</span>
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
                    <p className="text-gray-600">{review.comment}</p>
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

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-16 md:mt-24">
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
