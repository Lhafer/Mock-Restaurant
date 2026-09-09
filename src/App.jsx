import AdminApp from "./AdminApp";
import { CartProvider } from "./context/CartContext";
import PublicMenu from "./components/PublicMenu";

function App() {
  return window.location.pathname.startsWith("/admin") ? (
    <AdminApp />
  ) : (
    <CartProvider
      storageKey={`restaurant-cart:${import.meta.env.VITE_RESTAURANT_SLUG || "public"}`}
    >
      <PublicMenu />
    </CartProvider>
  );
}

export default App;
