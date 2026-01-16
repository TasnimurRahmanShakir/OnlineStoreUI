import { getCategoriesForProductAction } from "@/app/actions/categories";
import ProductForm from "./_components/product-form";

export default async function CreateProductPage() {
  const categories = await getCategoriesForProductAction();

  console.log(categories);
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create Product</h2>
      </div>
      <ProductForm categories={categories.items} />
    </div>
  );
}
