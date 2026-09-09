import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "../lib/checkoutApi";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function CheckoutPanel({ restaurantSlug, items, onClose }) {
  const checkoutRef = useRef(null);
  const embeddedCheckoutRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function mountCheckout() {
      if (!stripePromise) {
        setError("Stripe checkout is not configured yet.");
        return;
      }

      const stripe = await stripePromise;
      if (!stripe || cancelled) return;

      const checkoutPage = await stripe.createEmbeddedCheckoutPage({
        fetchClientSecret: async () => {
          const { data, error: invokeError } = await createCheckoutSession(
            restaurantSlug,
            items,
          );
          if (invokeError) throw new Error(invokeError.message);
          if (!data?.clientSecret) throw new Error("Checkout could not start.");
          return data.clientSecret;
        },
      });

      if (cancelled) {
        checkoutPage.destroy();
        return;
      }
      embeddedCheckoutRef.current = checkoutPage;
      checkoutPage.mount(checkoutRef.current);
    }

    mountCheckout().catch((checkoutError) => {
      if (!cancelled) setError(checkoutError.message);
    });

    return () => {
      cancelled = true;
      embeddedCheckoutRef.current?.destroy();
    };
  }, [items, restaurantSlug]);

  return (
    <div
      className="tavern-overlay fixed inset-0 z-10 flex justify-end"
      role="presentation"
      onClick={onClose}
    >
      <aside
        className="tavern-panel h-full w-[min(100%,560px)] overflow-y-auto p-6"
        aria-label="Checkout"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="tavern-panel__header flex items-center justify-between gap-4">
          <div>
            <p className="public-kicker">Secure payment</p>
            <h2>Checkout</h2>
          </div>
          <button
            className="tavern-close"
            onClick={onClose}
            aria-label="Close checkout"
          >
            &times;
          </button>
        </div>
        {error && <p className="tavern-error my-4">{error}</p>}
        <div ref={checkoutRef} className="mt-4 min-h-[420px]" />
      </aside>
    </div>
  );
}
