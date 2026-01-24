import {
  getUserAddressesAction,
  getUserProfileAction,
} from "@/app/actions/user";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";

export default async function CheckoutPage() {
  const userProfile = await getUserProfileAction();

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Checkout
        </h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section className="lg:col-span-7">
            <CheckoutForm userProfile={userProfile} />
          </section>

          <section className="mt-16 lg:col-span-5 lg:mt-0">
            <OrderSummary />
          </section>
        </div>
      </div>
    </div>
  );
}
