import { getSession } from "@/lib/session";
import { CartPageContent } from "@/components/cart/cart-page-content";

export default async function CartPage() {
  const session = await getSession();

  return <CartPageContent userId={session?.id} />;
}
