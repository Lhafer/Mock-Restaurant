import { useEffect, useState } from "react";
import {
  createCategory,
  createMenuItem,
  deleteCategory,
  deleteMenuItem,
  getMenu,
  getRestaurantContext,
  inviteWorker,
  setItemAvailability,
  updateRestaurantBanner,
  uploadRestaurantBannerImage,
} from "../lib/menuApi";

export function useMenuDashboard(userId, onError) {
  const [role, setRole] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inviteMessage, setInviteMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      onError(null);
      const context = await getRestaurantContext(userId);
      if (cancelled) return;
      if (context.error) {
        onError(context.error.message);
        setLoading(false);
        return;
      }
      if (!context.assignment) {
        onError("This account is not assigned to a restaurant yet.");
        setLoading(false);
        return;
      }

      const menu = await getMenu(context.assignment.restaurant_id);
      if (cancelled) return;
      if (menu.error) onError(menu.error.message);
      else {
        setRole(context.role);
        setRestaurant(context.assignment.restaurants);
        setCategories(menu.categories);
        setItems(menu.items);
      }
      setLoading(false);
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [onError, userId]);

  async function handleCategorySubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value.trim();
    if (!name || !restaurant) return;
    setSaving(true);
    const { data, error } = await createCategory(
      restaurant.id,
      name,
      categories.length,
    );
    if (error) onError(error.message);
    else {
      setCategories((current) => [...current, data]);
      event.target.reset();
    }
    setSaving(false);
  }

  async function handleCategoryDelete(category) {
    if (!window.confirm(`Delete ${category.name} and all of its menu items?`)) {
      return;
    }
    const { error } = await deleteCategory(category.id);
    if (error) onError(error.message);
    else {
      setCategories((current) =>
        current.filter((currentCategory) => currentCategory.id !== category.id),
      );
      setItems((current) =>
        current.filter((item) => item.category_id !== category.id),
      );
    }
  }

  async function handleItemSubmit(event) {
    event.preventDefault();
    const { categoryId, name, description, price } = event.target.elements;
    setSaving(true);
    const { data, error } = await createMenuItem(
      categoryId.value,
      name.value.trim(),
      description.value.trim(),
      Number(price.value) || 0,
      items.length,
    );
    if (error) onError(error.message);
    else {
      setItems((current) => [...current, data]);
      event.target.reset();
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    const { error } = await deleteMenuItem(id);
    if (error) onError(error.message);
    else setItems((current) => current.filter((item) => item.id !== id));
  }

  async function handleAvailabilityChange(item) {
    const { data, error } = await setItemAvailability(
      item.id,
      !item.is_available,
    );
    if (error) onError(error.message);
    else {
      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id ? data : currentItem,
        ),
      );
    }
  }

  async function handleWorkerInvite(event) {
    event.preventDefault();
    const email = event.target.elements.email.value.trim();
    setSaving(true);
    setInviteMessage(null);
    const { data, error } = await inviteWorker(email);
    if (error) onError(error.message);
    else {
      setInviteMessage(data?.message || "Worker invitation sent.");
      event.target.reset();
    }
    setSaving(false);
  }

  async function handleBannerSubmit(event) {
    event.preventDefault();
    if (!restaurant) return;
    setSaving(true);
    try {
      const banner = event.target.elements.banner.value.trim();
      const image = event.target.elements.bannerImage.files[0];
      let result = await updateRestaurantBanner(restaurant.id, banner || null);
      if (!result.error && image) {
        result = await uploadRestaurantBannerImage(restaurant.id, image);
      }
      if (result.error) onError(result.error.message);
      else setRestaurant((current) => ({ ...current, ...result.data }));
    } catch (submitError) {
      onError(submitError.message);
    }
    setSaving(false);
  }

  return {
    role,
    restaurant,
    categories,
    items,
    loading,
    saving,
    inviteMessage,
    handleCategorySubmit,
    handleCategoryDelete,
    handleItemSubmit,
    handleDelete,
    handleAvailabilityChange,
    handleWorkerInvite,
    handleBannerSubmit,
  };
}
