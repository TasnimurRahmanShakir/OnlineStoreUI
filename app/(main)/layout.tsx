import { Header } from "@/components/main/layout/header";
import { BottomNav } from "@/components/main/layout/bottom-nav";
import { getAllCategoriesAction } from "@/app/actions/categories";
import { getAllBrandsAction } from "@/app/actions/brands";
import { buildCategoryTree } from "@/lib/utils";
import { Footer } from "@/components/main/layout/footer";
import { getSession } from "@/lib/session";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categoriesData, brandsData, session] = await Promise.all([
    getAllCategoriesAction(),
    getAllBrandsAction(),
    getSession(),
  ]);

  const categoryTree = buildCategoryTree(categoriesData);
  const cartCount = 2;
  const wishlistCount = 5;

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header categories={categoryTree} brands={brandsData} user={session} />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomNav cartCount={cartCount} wishlistCount={wishlistCount} />
    </div>
  );
}
