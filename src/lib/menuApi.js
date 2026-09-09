import { supabase } from "../../supabase";

const assignmentSelect =
  "restaurant_id, restaurants(id, name, slug, banner, banner_image_url)";

export async function getPublicRestaurant(slug) {
  const result = await supabase
    .from("restaurants")
    .select("id, name, slug, banner, banner_image_url")
    .eq("slug", slug)
    .maybeSingle();
  return result;
}

export async function getPublicMenu(restaurantId) {
  const [categories, items] = await Promise.all([
    supabase
      .from("menu_categories")
      .select("id, restaurant_id, name, sort_order")
      .eq("restaurant_id", restaurantId)
      .order("sort_order"),
    supabase
      .from("menu_items")
      .select(
        "id, category_id, name, description, price, sort_order, menu_categories!inner(restaurant_id)",
      )
      .eq("menu_categories.restaurant_id", restaurantId)
      .eq("is_published", true)
      .eq("is_available", true)
      .order("sort_order"),
  ]);
  return {
    categories: categories.data || [],
    items: (items.data || []).filter((item) =>
      categories.data?.some((category) => category.id === item.category_id),
    ),
    error: categories.error || items.error,
  };
}

export async function getRestaurantContext(userId) {
  const { data: manager, error: managerError } = await supabase
    .from("restaurant_managers")
    .select(assignmentSelect)
    .eq("user_id", userId)
    .maybeSingle();
  if (managerError) return { error: managerError };
  if (manager) return { assignment: manager, role: "manager" };

  const { data: worker, error: workerError } = await supabase
    .from("restaurant_workers")
    .select(assignmentSelect)
    .eq("user_id", userId)
    .maybeSingle();
  if (workerError) return { error: workerError };
  return { assignment: worker, role: "worker" };
}

export async function getMenu(restaurantId) {
  const [categories, items] = await Promise.all([
    supabase
      .from("menu_categories")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("sort_order"),
    supabase
      .from("menu_items")
      .select("*, menu_categories!inner(restaurant_id)")
      .eq("menu_categories.restaurant_id", restaurantId)
      .order("sort_order"),
  ]);
  return {
    categories: categories.data || [],
    items: items.data || [],
    error: categories.error || items.error,
  };
}

export async function updateRestaurantBanner(restaurantId, banner) {
  return supabase
    .from("restaurants")
    .update({ banner })
    .eq("id", restaurantId)
    .select("id, name, slug, banner, banner_image_url")
    .single();
}

async function compressBannerImage(file) {
  const image = await createImageBitmap(file);
  const maxWidth = 1600;
  const scale = Math.min(1, maxWidth / image.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Image processing failed")),
      "image/webp",
      0.82,
    );
  });
}

export async function uploadRestaurantBannerImage(restaurantId, file) {
  const image = await compressBannerImage(file);
  const path = `${restaurantId}/banner-${Date.now()}.webp`;
  const { error: uploadError } = await supabase.storage
    .from("restaurant-images")
    .upload(path, image, { contentType: "image/webp", upsert: false });
  if (uploadError) return { data: null, error: uploadError };

  const { data: publicImage } = supabase.storage
    .from("restaurant-images")
    .getPublicUrl(path);
  const result = await supabase
    .from("restaurants")
    .update({ banner_image_url: publicImage.publicUrl })
    .eq("id", restaurantId)
    .select("id, name, slug, banner, banner_image_url")
    .single();

  if (result.error) {
    await supabase.storage.from("restaurant-images").remove([path]);
  }
  return result;
}

export async function createCategory(restaurantId, name, sortOrder) {
  return supabase
    .from("menu_categories")
    .insert({ restaurant_id: restaurantId, name, sort_order: sortOrder })
    .select()
    .single();
}

export async function deleteCategory(id) {
  return supabase.from("menu_categories").delete().eq("id", id);
}

export async function createMenuItem(
  categoryId,
  name,
  description,
  price,
  sortOrder,
) {
  return supabase
    .from("menu_items")
    .insert({
      category_id: categoryId,
      name,
      description,
      price,
      sort_order: sortOrder,
    })
    .select()
    .single();
}

export async function deleteMenuItem(id) {
  return supabase.from("menu_items").delete().eq("id", id);
}

export async function setItemAvailability(id, isAvailable) {
  return supabase
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", id)
    .select()
    .single();
}

export async function inviteWorker(email) {
  const response = await supabase.functions.invoke("super-handler", {
    body: { email },
  });
  if (!response.error) return response;

  let message = response.error.message;
  if (response.error.context) {
    try {
      const body = await response.error.context.json();
      message = body.error || message;
    } catch {
      // Keep the SDK error when the function did not return JSON.
    }
  }
  return { data: null, error: new Error(message) };
}

const orderSelect =
  "id, status, currency, subtotal_cents, customer_email, created_at, paid_at, fulfilled_at, order_items(id, menu_item_id, name, unit_price_cents, quantity)";

export async function getRecentOrders(restaurantId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return supabase
    .from("orders")
    .select(orderSelect)
    .eq("restaurant_id", restaurantId)
    .is("fulfilled_at", null)
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: false });
}

export async function getAllOrders(restaurantId, page = 0, pageSize = 10) {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  return supabase
    .from("orders")
    .select(orderSelect, { count: "exact" })
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })
    .range(from, to);
}

export async function markOrderFulfilled(orderId) {
  return supabase
    .from("orders")
    .update({ fulfilled_at: new Date().toISOString() })
    .eq("id", orderId)
    .select(orderSelect)
    .single();
}
