import { useCart } from "../context/CartContext";
import { useState } from "react";
import CheckoutPanel from "./CheckoutPanel";

const restaurantSlug = import.meta.env.VITE_RESTAURANT_SLUG;

export default function CartPanel({ onClose }) {
  const { cartItems, subtotal, changeQuantity, removeItem } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div
      className="tavern-overlay fixed inset-0 z-10 flex justify-end"
      role="presentation"
      onClick={onClose}
    >
      <aside
        className="tavern-panel h-full w-[min(100%,420px)] overflow-y-auto p-6"
        aria-label="Shopping cart"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="tavern-panel__header flex items-center justify-between gap-4">
          <div>
            <p className="public-kicker">Your order</p>
            <h2>Cart</h2>
          </div>
          <button
            className="tavern-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="tavern-muted">Your cart is empty.</p>
        ) : (
          <>
            <div className="grid">
              {cartItems.map((item) => (
                <article className="tavern-cart-item flex items-start justify-between gap-4">
                  <div>
                    <h3>{item.name}</h3>
                    <p className="tavern-muted">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="grid justify-items-end gap-2">
                    <div
                      className="flex items-center gap-[0.7rem]"
                      aria-label={`Quantity for ${item.name}`}
                    >
                      <button
                        className="tavern-quantity"
                        onClick={() =>
                          changeQuantity(item.id, item.quantity - 1)
                        }
                        aria-label={`Remove one ${item.name}`}
                      >
                        &minus;
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="tavern-quantity"
                        onClick={() =>
                          changeQuantity(item.id, item.quantity + 1)
                        }
                        aria-label={`Add one ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="tavern-remove"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="tavern-subtotal mt-4 flex items-start justify-between gap-4">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <button
              className="tavern-checkout mt-5 w-full"
              onClick={() => {
                alert(
                  "This is a demo website! No real orders can be placed, nor will payments be processed.",
                );
                setIsCheckoutOpen(true);
              }}
            >
              Continue to checkout
            </button>
          </>
        )}
      </aside>
      {isCheckoutOpen && (
        <CheckoutPanel
          restaurantSlug={restaurantSlug}
          items={cartItems}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </div>
  );
}
