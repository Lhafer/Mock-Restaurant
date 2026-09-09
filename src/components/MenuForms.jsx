export function CategoryForm({ onSubmit, saving }) {
  return (
    <form
      className="mb-4 flex gap-[0.6rem] max-[560px]:flex-col"
      onSubmit={onSubmit}
    >
      <input
        className="w-full rounded border border-[#c9c0b2] bg-[#fffdf9] p-[0.7rem]"
        name="name"
        placeholder="New category name"
        required
      />
      <button
        className="whitespace-nowrap rounded bg-[#2d5548] px-4 py-[0.7rem] text-white enabled:cursor-pointer disabled:cursor-wait disabled:opacity-55"
        disabled={saving}
      >
        Add category
      </button>
    </form>
  );
}

export function MenuItemForm({ categories, onSubmit, saving }) {
  return (
    <form className="mb-6 grid gap-3.5 sm:grid-cols-2" onSubmit={onSubmit}>
      <select
        className="w-full rounded border border-[#c9c0b2] bg-[#fffdf9] p-[0.7rem] sm:col-span-2"
        name="categoryId"
        required
        defaultValue=""
      >
        <option value="" disabled>
          Choose a category
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        className="w-full rounded border border-[#c9c0b2] bg-[#fffdf9] p-[0.7rem]"
        name="name"
        placeholder="Item name"
        required
      />
      <input
        className="w-full rounded border border-[#c9c0b2] bg-[#fffdf9] p-[0.7rem]"
        name="description"
        placeholder="Description"
      />
      <input
        className="w-full rounded border border-[#c9c0b2] bg-[#fffdf9] p-[0.7rem]"
        name="price"
        type="number"
        min="0"
        step="0.01"
        placeholder="Price"
        required
      />
      <button
        className="rounded bg-[#2d5548] px-4 py-[0.7rem] text-white enabled:cursor-pointer disabled:cursor-wait disabled:opacity-55 sm:col-span-2"
        disabled={saving}
      >
        Add menu item
      </button>
    </form>
  );
}

export function WorkerInviteForm({ onSubmit, saving }) {
  return (
    <form
      className="mb-4 flex gap-[0.6rem] max-[560px]:flex-col"
      onSubmit={onSubmit}
    >
      <input
        className="w-full rounded border border-[#c9c0b2] bg-[#fffdf9] p-[0.7rem]"
        name="email"
        type="email"
        placeholder="Worker email address"
        required
      />
      <button
        className="whitespace-nowrap rounded bg-[#2d5548] px-4 py-[0.7rem] text-white enabled:cursor-pointer disabled:cursor-wait disabled:opacity-55"
        disabled={saving}
      >
        {saving ? "Sending..." : "Invite worker"}
      </button>
    </form>
  );
}

export function BannerForm({ banner, bannerImageUrl, onSubmit, saving }) {
  return (
    <form className="mx-auto grid max-w-[640px] gap-3.5" onSubmit={onSubmit}>
      <label className="grid gap-1.5 text-[0.9rem]">
        Customer-facing banner
        <textarea
          className="w-full rounded border border-[#c9c0b2] bg-[#fffdf9] p-[0.7rem]"
          name="banner"
          defaultValue={banner || ""}
          placeholder="A short welcome message for your customers"
          rows="3"
          maxLength="240"
        />
      </label>
      <label className="grid gap-1.5 text-[0.9rem]">
        Banner image
        <input
          className="w-full rounded border border-[#c9c0b2] bg-[#fffdf9] p-[0.7rem]"
          name="bannerImage"
          type="file"
          accept="image/*"
        />
      </label>
      {bannerImageUrl && (
        <img
          className="w-full max-h-[220px] rounded object-cover"
          src={bannerImageUrl}
          alt="Current banner"
        />
      )}
      <button
        className="rounded bg-[#2d5548] px-4 py-[0.7rem] text-white enabled:cursor-pointer disabled:cursor-wait disabled:opacity-55"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save banner"}
      </button>
    </form>
  );
}
