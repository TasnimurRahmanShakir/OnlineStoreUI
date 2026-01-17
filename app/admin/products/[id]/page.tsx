import { api } from "@/lib/api-client";
import { getCategoriesForProductAction } from "@/app/actions/categories";
import ProductForm from "../new/_components/product-form";
import { notFound } from "next/navigation";

// Define the type for the full product detail response
// Only defining what's needed for the form
type ProductDetail = {
  id: string;
  name: string;
  description?: string;
  brand: string;
  categoryId: string;
  isActive: boolean;
  baseImage: string; // URL
  variants: Array<{
    color: string;
    size: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
  }>;
};

async function getProduct(id: string): Promise<ProductDetail | null> {
  try {
    const result = await api.get<ProductDetail>(`/Product/${id}`);
    if (result.success && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
}

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const [categories, product] = await Promise.all([
    getCategoriesForProductAction(),
    getProduct(params.id),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
      </div>
      <ProductForm categories={categories.items} initialData={product} />
    </div>
  );
}
