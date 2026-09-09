import { useMenuDashboard } from "../hooks/useMenuDashboard";
import { useOrdersDashboard } from "../hooks/useOrdersDashboard";
import {
  BannerPanel,
  CategoriesPanel,
  ItemsPanel,
  TeamPanel,
} from "./MenuDashboardSections";
import OrdersPanel from "./OrdersPanel";
import { useState } from "react";

export default function MenuDashboard({ session, onSignOut, onError, error }) {
  const dashboard = useMenuDashboard(session.user.id, onError);
  const { role, restaurant, loading } = dashboard;
  const isManager = role === "manager";
  const ordersDashboard = useOrdersDashboard(restaurant?.id, onError);
  const [activeTab, setActiveTab] = useState("orders");

  if (loading)
    return (
      <main className="mx-auto w-[min(100%-2rem,960px)] py-12 pb-20">
        <p>Loading menu...</p>
      </main>
    );

  return (
    <main className="mx-auto w-[min(100%-2rem,960px)] py-12 pb-20">
      <header className="mb-8 flex items-center justify-between gap-4 max-[560px]:items-start max-[560px]:flex-col">
        <div>
          <p className="mb-[0.45rem] font-sans text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#a14f35]">
            {role === "worker" ? "Restaurant staff" : "Restaurant admin"}
          </p>
          <h1 className="mb-0 text-[clamp(2rem,5vw,3.5rem)]">
            {restaurant?.name || "Menu dashboard"}
          </h1>
        </div>
        <button
          className="rounded border border-[#2d5548] bg-transparent px-4 py-[0.7rem] text-[#2d5548] enabled:cursor-pointer disabled:cursor-wait disabled:opacity-55"
          onClick={onSignOut}
        >
          Sign out
        </button>
      </header>
      {error && (
        <p className="my-4 border-l-[3px] border-[#a14f35] bg-[#f5ddd4] p-3 text-[#7d3021]">
          {error}
        </p>
      )}
      <nav
        className="mb-4 flex gap-[0.35rem] border-b border-[#d8d0c2]"
        aria-label="Admin sections"
      >
        <button
          className={
            activeTab === "orders"
              ? "rounded-t border-b-[3px] border-[#2d5548] bg-transparent px-4 py-[0.7rem] text-[#2d5548]"
              : "rounded-t border-b-[3px] border-transparent bg-transparent px-4 py-[0.7rem] text-[#756e64]"
          }
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={
            activeTab === "menu"
              ? "rounded-t border-b-[3px] border-[#2d5548] bg-transparent px-4 py-[0.7rem] text-[#2d5548]"
              : "rounded-t border-b-[3px] border-transparent bg-transparent px-4 py-[0.7rem] text-[#756e64]"
          }
          onClick={() => setActiveTab("menu")}
        >
          Menu
        </button>
        {isManager && (
          <button
            className={
              activeTab === "team"
                ? "rounded-t border-b-[3px] border-[#2d5548] bg-transparent px-4 py-[0.7rem] text-[#2d5548]"
                : "rounded-t border-b-[3px] border-transparent bg-transparent px-4 py-[0.7rem] text-[#756e64]"
            }
            onClick={() => setActiveTab("team")}
          >
            Team
          </button>
        )}
      </nav>
      {activeTab === "menu" && (
        <>
          {isManager && (
            <BannerPanel
              restaurant={restaurant}
              onSubmit={dashboard.handleBannerSubmit}
              saving={dashboard.saving}
            />
          )}
          <CategoriesPanel
            categories={dashboard.categories}
            items={dashboard.items}
            onSubmit={dashboard.handleCategorySubmit}
            onDelete={dashboard.handleCategoryDelete}
            saving={dashboard.saving}
            canEdit={isManager}
          />
          <ItemsPanel
            categories={dashboard.categories}
            items={dashboard.items}
            onSubmit={dashboard.handleItemSubmit}
            onDelete={dashboard.handleDelete}
            onAvailabilityChange={dashboard.handleAvailabilityChange}
            saving={dashboard.saving}
            canEdit={isManager}
          />
        </>
      )}
      {activeTab === "team" && isManager && (
        <TeamPanel
          onSubmit={dashboard.handleWorkerInvite}
          message={dashboard.inviteMessage}
          saving={dashboard.saving}
        />
      )}
      {activeTab === "orders" && <OrdersPanel dashboard={ordersDashboard} />}
    </main>
  );
}
