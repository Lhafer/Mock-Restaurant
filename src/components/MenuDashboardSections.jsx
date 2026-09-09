import {
  BannerForm,
  CategoryForm,
  MenuItemForm,
  WorkerInviteForm,
} from "./MenuForms";

function SectionHeading({ eyebrow, title, count }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div>
        <p className="mb-[0.45rem] font-sans text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#a14f35]">
          {eyebrow}
        </p>
        <h2 className="mb-0 text-2xl">{title}</h2>
      </div>
      {count && <span className="text-[0.85rem] text-[#756e64]">{count}</span>}
    </div>
  );
}

export function BannerPanel({ restaurant, onSubmit, saving }) {
  return (
    <section className="mt-4 rounded-md border border-[#d8d0c2] bg-[rgba(255,253,249,0.7)] p-5">
      <SectionHeading eyebrow="Public website" title="Customer banner" />
      <BannerForm
        banner={restaurant.banner}
        bannerImageUrl={restaurant.banner_image_url}
        onSubmit={onSubmit}
        saving={saving}
      />
    </section>
  );
}

export function TeamPanel({ onSubmit, message, saving }) {
  return (
    <section className="mt-4 rounded-md border border-[#d8d0c2] bg-[rgba(255,253,249,0.7)] p-5">
      <SectionHeading eyebrow="Team access" title="Invite a worker" />
      <WorkerInviteForm onSubmit={onSubmit} saving={saving} />
      {message && <p className="mt-3 text-[#24533b]">{message}</p>}
    </section>
  );
}

export function CategoriesPanel({
  categories,
  items,
  onSubmit,
  onDelete,
  saving,
  canEdit,
}) {
  return (
    <section className="mt-4 rounded-md border border-[#d8d0c2] bg-[rgba(255,253,249,0.7)] p-5">
      <SectionHeading
        eyebrow="Menu structure"
        title="Categories"
        count={`${categories.length} total`}
      />
      {canEdit && <CategoryForm onSubmit={onSubmit} saving={saving} />}
      <div className="grid gap-[0.4rem]">
        {categories.map((category) => (
          <div
            className="flex items-center justify-between gap-4 border-t border-[#e1d9cd] py-[0.7rem]"
            key={category.id}
          >
            <strong>{category.name}</strong>
            <div className="flex items-center gap-3">
              <span>
                {
                  items.filter((item) => item.category_id === category.id)
                    .length
                }{" "}
                items
              </span>
              {canEdit && (
                <button
                  className="rounded border border-[#d6a99d] bg-transparent px-[0.65rem] py-[0.4rem] text-[0.85rem] text-[#9b3f2c]"
                  onClick={() => onDelete(category)}
                  type="button"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ItemsPanel({
  categories,
  items,
  onSubmit,
  onDelete,
  onAvailabilityChange,
  saving,
  canEdit,
}) {
  return (
    <section className="mt-4 rounded-md border border-[#d8d0c2] bg-[rgba(255,253,249,0.7)] p-5">
      <SectionHeading
        eyebrow="Menu content"
        title="Items"
        count={`${items.length} total`}
      />
      {canEdit && (
        <MenuItemForm
          categories={categories}
          onSubmit={onSubmit}
          saving={saving}
        />
      )}
      <div className="grid gap-[0.8rem]">
        {items.map((item) => (
          <article
            className="flex items-start justify-between gap-4 border-t border-[#e1d9cd] py-4 max-[560px]:flex-col"
            key={item.id}
          >
            <div>
              <p className="mb-[0.45rem] font-sans text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#a14f35]">
                {
                  categories.find(
                    (category) => category.id === item.category_id,
                  )?.name
                }
              </p>
              <h3 className="my-1 text-[1.15rem]">{item.name}</h3>
              <p className="mb-0 text-[#756e64]">
                {item.description || "No description"}
              </p>
            </div>
            <div className="grid justify-items-end gap-3 max-[560px]:w-full max-[560px]:justify-items-start">
              <strong>${Number(item.price).toFixed(2)}</strong>
              {canEdit && (
                <button
                  className="rounded border border-[#d6a99d] bg-transparent px-[0.65rem] py-[0.4rem] text-[0.85rem] text-[#9b3f2c] "
                  onClick={() => onDelete(item.id)}
                  type="button"
                >
                  Delete
                </button>
              )}
              <button
                className={
                  item.is_available
                    ? "rounded bg-[#dcecdf] px-[0.65rem] py-[0.4rem] text-[0.85rem] text-[#24533b] enabled:cursor-pointer disabled:cursor-wait disabled:opacity-55"
                    : "rounded bg-[#f5ddd4] px-[0.65rem] py-[0.4rem] text-[0.85rem] text-[#7d3021] enabled:cursor-pointer disabled:cursor-wait disabled:opacity-55"
                }
                onClick={() => onAvailabilityChange(item)}
              >
                {item.is_available ? "Available" : "Unavailable"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
