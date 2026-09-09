import { supabase } from "../../supabase";

export async function createCheckoutSession(restaurantSlug, items) {
  return supabase.functions.invoke("create-checkout", {
    body: {
      restaurantSlug,
      items: items.map(({ id, quantity }) => ({ id, quantity })),
    },
  });
}
