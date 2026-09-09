import { useEffect, useState } from "react";
import { getPublicMenu, getPublicRestaurant } from "../lib/menuApi";
import CartPanel from "./CartPanel";
import { useCart } from "../context/CartContext";

const restaurantSlug = import.meta.env.VITE_RESTAURANT_SLUG;

export default function PublicMenu() {
  const { addItem, itemCount, clearCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const checkoutSuccess =
    new URLSearchParams(window.location.search).get("checkout") === "success";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") !== "success") return;
    clearCart();
    window.history.replaceState({}, document.title, window.location.pathname);
  }, [clearCart]);

  useEffect(() => {
    async function loadPublicMenu() {
      if (!restaurantSlug) {
        setError("The public restaurant slug is not configured.");
        setLoading(false);
        return;
      }

      const restaurantResult = await getPublicRestaurant(restaurantSlug);
      if (restaurantResult.error || !restaurantResult.data) {
        setError(restaurantResult.error?.message || "Restaurant not found.");
        setLoading(false);
        return;
      }

      const menu = await getPublicMenu(restaurantResult.data.id);
      if (menu.error) setError(menu.error.message);
      else {
        setRestaurant(restaurantResult.data);
        setCategories(menu.categories);
        setItems(menu.items);
      }
      setLoading(false);
    }

    loadPublicMenu();
  }, []);

  if (loading) {
    return (
      <main className="public-site public-state">
        <p className="public-state__label">Opening the doors...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="public-site public-state">
        <p className="public-state__error">{error}</p>
      </main>
    );
  }

  return (
    <main className="public-site">
      <div className="public-cart-trigger">
        <button
          className="public-cart-button"
          onClick={() => {
            setIsCartOpen(true);
          }}
          aria-label={`Open cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
        >
          <span aria-hidden="true">Order</span>
          <span className="public-cart-count">{itemCount}</span>
        </button>
      </div>
      {checkoutSuccess && (
        <p className="public-success">
          Your payment was submitted successfully.
        </p>
      )}
      <header className="public-hero">
        <div className="public-hero__texture" />
        {restaurant.banner_image_url && (
          <img
            className="public-hero__image"
            src={restaurant.banner_image_url}
            alt=""
          />
        )}
        <div className="public-hero__content">
          <p className="public-kicker">Est. somewhere after dark</p>
          <div className="public-hero__rule" aria-hidden="true">
            *
          </div>
          <h1>{restaurant.name}</h1>
          <p className="public-hero__copy">
            {restaurant.banner ||
              "Good food, low light, and stories that stay at the table."}
          </p>
          <a className="public-hero__cta" href="#menu">
            See the menu <span aria-hidden="true">&#8595;</span>
          </a>
        </div>
      </header>
      <div className="public-intro">
        <p className="public-kicker">Tonight at the house</p>
        <p className="public-intro__note">
          A short menu for long evenings. Everything is made to be shared,
          savored, and ordered again.
        </p>
        <nav className="public-category-nav" aria-label="Menu categories">
          {categories.map((category) => (
            <a key={category.id} href={`#category-${category.id}`}>
              {category.name}
            </a>
          ))}
        </nav>
      </div>
      <section className="public-menu" id="menu" aria-label="Menu">
        {categories.map((category, categoryIndex) => {
          const categoryItems = items.filter(
            (item) => item.category_id === category.id,
          );
          if (!categoryItems.length) return null;

          return (
            <section
              className="public-menu-section"
              id={`category-${category.id}`}
              key={category.id}
            >
              <div className="public-menu-heading">
                <span>0{categoryIndex + 1}</span>
                <h2>{category.name}</h2>
                <i aria-hidden="true" />
              </div>
              <div className="public-menu-items">
                {categoryItems.map((item) => (
                  <article className="public-menu-item" key={item.id}>
                    <div className="public-menu-item__details">
                      <h3>{item.name}</h3>
                      {item.description && <p>{item.description}</p>}
                    </div>
                    <div className="public-menu-item__action">
                      <strong>${Number(item.price).toFixed(2)}</strong>
                      <button
                        className="public-add-button"
                        onClick={() => addItem(item)}
                      >
                        + Add
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </section>
      <footer className="public-footer">
        <span>Come as you are.</span>
        <span aria-hidden="true">*</span>
        <span>Stay past midnight.</span>
      </footer>
      {isCartOpen && <CartPanel onClose={() => setIsCartOpen(false)} />}
    </main>
  );
}
