"use client";

import { useEffect, useMemo, useState } from "react";
import { demoKitchenOrders } from "@/features/kitchen/data/demo-kitchen-orders";
import type {
  KitchenOrder,
  KitchenOrderStatus
} from "@/features/kitchen/types/kitchen-order";
import styles from "./kitchen-board.module.css";

const columns: Array<{
  status: KitchenOrderStatus;
  title: string;
  subtitle: string;
}> = [
  {
    status: "CONFIRMED",
    title: "New orders",
    subtitle: "Waiting for kitchen"
  },
  {
    status: "PREPARING",
    title: "Preparing",
    subtitle: "Currently cooking"
  },
  {
    status: "READY",
    title: "Ready",
    subtitle: "Ready to serve"
  }
];

function nextStatus(
  status: KitchenOrderStatus
): KitchenOrderStatus | null {
  if (status === "CONFIRMED") {
    return "PREPARING";
  }

  if (status === "PREPARING") {
    return "READY";
  }

  if (status === "READY") {
    return "SERVED";
  }

  return null;
}

function nextActionLabel(status: KitchenOrderStatus) {
  if (status === "CONFIRMED") {
    return "Start preparing";
  }

  if (status === "PREPARING") {
    return "Mark ready";
  }

  if (status === "READY") {
    return "Mark served";
  }

  return "Update";
}

function minutesSince(iso: string) {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes === 1) {
    return "1 min";
  }

  return `${minutes} min`;
}

export function KitchenBoard() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [lastSync, setLastSync] = useState("Not synced");
  const [busyOrderNumber, setBusyOrderNumber] = useState<string | null>(null);

  async function loadOrders() {
    try {
      const response = await fetch("/api/kitchen/orders", {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Kitchen API unavailable");
      }

      const result = (await response.json()) as {
        orders: KitchenOrder[];
      };

      setOrders(result.orders);
      setDemoMode(false);
      setLastSync(
        `Synced ${new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })}`
      );
    } catch {
      setOrders((current) =>
        current.length > 0 && !demoMode ? current : demoKitchenOrders
      );
      setDemoMode(true);
      setLastSync("Demo mode");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();

    const timer = window.setInterval(() => {
      void loadOrders();
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  async function advanceOrder(order: KitchenOrder) {
    const targetStatus = nextStatus(order.status);

    if (!targetStatus) {
      return;
    }

    if (demoMode) {
      setOrders((current) =>
        current
          .map((entry) =>
            entry.orderNumber === order.orderNumber
              ? {
                  ...entry,
                  status: targetStatus
                }
              : entry
          )
          .filter((entry) => entry.status !== "SERVED")
      );
      return;
    }

    setBusyOrderNumber(order.orderNumber);

    try {
      const response = await fetch(
        `/api/kitchen/orders/${encodeURIComponent(order.orderNumber)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: targetStatus
          })
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      await loadOrders();
    } finally {
      setBusyOrderNumber(null);
    }
  }

  const grouped = useMemo(
    () =>
      Object.fromEntries(
        columns.map((column) => [
          column.status,
          orders.filter((order) => order.status === column.status)
        ])
      ) as Record<KitchenOrderStatus, KitchenOrder[]>,
    [orders]
  );

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <div className={styles.logo}>M</div>
          <div>
            <span>Kitchen Display System</span>
            <h1>Mellow Kitchen</h1>
          </div>
        </div>

        <div className={styles.topbarMeta}>
          {demoMode && (
            <span className={styles.demoBadge}>
              Demo mode
            </span>
          )}
          <span className={styles.syncText}>
            {loading ? "Loading..." : lastSync}
          </span>
          <button
            type="button"
            onClick={() => void loadOrders()}
          >
            Refresh
          </button>
        </div>
      </header>

      {demoMode && (
        <div className={styles.demoNotice}>
          PostgreSQL is not connected yet, so the kitchen is showing demo
          orders. Once the database is configured, this board will switch to
          real orders automatically.
        </div>
      )}

      <section className={styles.board}>
        {columns.map((column) => {
          const columnOrders = grouped[column.status] ?? [];

          return (
            <div className={styles.column} key={column.status}>
              <div className={styles.columnHeader}>
                <div>
                  <div className={styles.columnTitleRow}>
                    <h2>{column.title}</h2>
                    <span>{columnOrders.length}</span>
                  </div>
                  <p>{column.subtitle}</p>
                </div>
              </div>

              <div className={styles.orderList}>
                {columnOrders.length === 0 ? (
                  <div className={styles.emptyColumn}>
                    <span>✓</span>
                    <strong>All clear</strong>
                    <p>No orders in this stage.</p>
                  </div>
                ) : (
                  columnOrders.map((order) => (
                    <article
                      className={styles.orderCard}
                      key={order.orderNumber}
                    >
                      <div className={styles.orderHeader}>
                        <div>
                          <span className={styles.orderNumber}>
                            #{order.orderNumber}
                          </span>
                          <div className={styles.tableRow}>
                            <strong>Table {order.tableCode}</strong>
                            <span>·</span>
                            <span>{minutesSince(order.createdAt)}</span>
                          </div>
                        </div>

                        <div className={styles.tableBadge}>
                          {order.tableCode}
                        </div>
                      </div>

                      {order.customerName && (
                        <div className={styles.customerName}>
                          Guest: {order.customerName}
                        </div>
                      )}

                      <div className={styles.items}>
                        {order.items.map((item) => (
                          <div className={styles.item} key={item.id}>
                            <div className={styles.itemQuantity}>
                              {item.quantity}×
                            </div>

                            <div className={styles.itemBody}>
                              <strong>{item.name}</strong>

                              {item.selections.length > 0 && (
                                <p>
                                  {item.selections
                                    .map(
                                      (selection) =>
                                        `${selection.groupLabel}: ${selection.choiceLabel}`
                                    )
                                    .join(" · ")}
                                </p>
                              )}

                              {item.note && (
                                <div className={styles.itemNote}>
                                  {item.note}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.note && (
                        <div className={styles.orderNote}>
                          <span>Order note</span>
                          <strong>{order.note}</strong>
                        </div>
                      )}

                      <div className={styles.orderFooter}>
                        <div>
                          <small>Total</small>
                          <strong>RM {order.total.toFixed(2)}</strong>
                        </div>

                        <button
                          type="button"
                          disabled={
                            busyOrderNumber === order.orderNumber
                          }
                          onClick={() => void advanceOrder(order)}
                        >
                          {busyOrderNumber === order.orderNumber
                            ? "Updating..."
                            : nextActionLabel(order.status)}
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
