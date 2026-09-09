import { useState } from "react";

function formatDate(value) {
  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function OrderList({ orders, onFulfill, showFulfill }) {
  if (!orders.length)
    return <p className="py-4 text-[#756e64]">No orders to show.</p>;

  return (
    <div className="mb-4 grid gap-3">
      {orders.map((order) => (
        <article className="border-t border-[#e1d9cd] py-4" key={order.id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-[0.45rem] font-sans text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#a14f35]">
                Order {order.id.slice(0, 8)}
              </p>
              <h3 className="mt-0 text-[1.15rem]">
                {formatDate(order.created_at)}
              </h3>
            </div>
            <strong>Total: ${(order.subtotal_cents / 100).toFixed(2)}</strong>
          </div>
          <p className="text-[0.85rem] capitalize text-[#756e64]">
            Status: {order.status}
          </p>
          <ul className="my-[0.6rem] pl-5">
            Order:
            {order.order_items?.map((item) => (
              <li key={item.id} className="ml-10">
                {item.quantity} x {item.name}
              </li>
            ))}
          </ul>
          {order.customer_email && (
            <p className="mb-3 text-[#756e64]">Email: {order.customer_email}</p>
          )}
          {showFulfill && (
            <button
              className="rounded bg-[#2d5548] px-4 py-[0.7rem] text-white enabled:cursor-pointer disabled:cursor-wait disabled:opacity-55"
              onClick={() => onFulfill(order.id)}
            >
              Mark fulfilled
            </button>
          )}
          {!showFulfill && order.fulfilled_at && (
            <p className="text-[0.85rem] capitalize text-[#756e64]">
              Fulfilled {formatDate(order.fulfilled_at)}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}

export default function OrdersPanel({ dashboard }) {
  const [showAll, setShowAll] = useState(false);
  const {
    recentOrders,
    allOrders,
    allOrdersPage,
    allOrdersTotal,
    loading,
    allOrdersLoading,
    loadAllOrders,
    handleFulfill,
    pageSize,
  } = dashboard;
  const totalPages = Math.max(1, Math.ceil(allOrdersTotal / pageSize));

  function openAllOrders() {
    setShowAll(true);
    loadAllOrders(0);
  }

  return (
    <section className="mt-4 rounded-md border border-[#d8d0c2] bg-[rgba(255,253,249,0.7)] p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="mb-[0.45rem] font-sans text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#a14f35]">
            Order history
          </p>
          <h2 className="mb-0 text-2xl">
            {showAll ? "All orders" : "Recent orders"}
          </h2>
        </div>
        {!showAll && (
          <span className="text-[0.85rem] text-[#756e64]">
            {recentOrders.length} open today
          </span>
        )}
      </div>
      {showAll ? (
        <>
          <button
            className="mb-2 rounded border border-[#2d5548] bg-transparent px-4 py-[0.7rem] text-[#2d5548] enabled:cursor-pointer disabled:cursor-wait disabled:opacity-55"
            onClick={() => setShowAll(false)}
          >
            Back to recent orders
          </button>
          {allOrdersLoading ? (
            <p>Loading orders...</p>
          ) : (
            <OrderList
              orders={allOrders}
              onFulfill={handleFulfill}
              showFulfill={false}
            />
          )}
          <div className="mt-4 flex items-center justify-between gap-4">
            <button
              className="mr-2 rounded border border-[#2d5548] bg-transparent px-4 py-[0.7rem] text-[#2d5548] enabled:cursor-pointer disabled:cursor-wait disabled:opacity-55"
              disabled={allOrdersPage === 0 || allOrdersLoading}
              onClick={() => loadAllOrders(allOrdersPage - 1)}
            >
              Previous
            </button>
            <span>
              Page {allOrdersPage + 1} of {totalPages}
            </span>
            <button
              className="ml-2 rounded border border-[#2d5548] bg-transparent px-4 py-[0.7rem] text-[#2d5548] enabled:cursor-pointer disabled:cursor-wait disabled:opacity-55"
              disabled={allOrdersPage + 1 >= totalPages || allOrdersLoading}
              onClick={() => loadAllOrders(allOrdersPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : loading ? (
        <p>Loading recent orders...</p>
      ) : (
        <>
          <OrderList
            orders={recentOrders}
            onFulfill={handleFulfill}
            showFulfill
          />
          <button
            className="rounded border border-[#2d5548] bg-transparent px-4 py-[0.7rem] text-[#2d5548] enabled:cursor-pointer disabled:cursor-wait disabled:opacity-55"
            onClick={openAllOrders}
          >
            Show all orders
          </button>
        </>
      )}
    </section>
  );
}
