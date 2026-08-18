"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { demoAdminOrders } from "@/features/admin/orders/data/demo-admin-orders";
import type {
  AdminOrder,
  AdminOrderStatus
} from "@/features/admin/orders/types/admin-order";
import styles from "./admin-orders-manager.module.css";

const statusOptions: Array<"ALL" | AdminOrderStatus> = [
  "ALL",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "SERVED",
  "CANCELLED"
];

function statusLabel(status: AdminOrderStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString([], {
    month: "short",
    day: "numeric"
  });
}

function nextStatus(status: AdminOrderStatus): AdminOrderStatus | null {
  if (status === "CONFIRMED") return "PREPARING";
  if (status === "PREPARING") return "READY";
  if (status === "READY") return "SERVED";
  return null;
}

function nextLabel(status: AdminOrderStatus) {
  if (status === "CONFIRMED") return "Start preparing";
  if (status === "PREPARING") return "Mark ready";
  if (status === "READY") return "Mark served";
  return "";
}

export function AdminOrdersManager() {
  const [orders, setOrders] = useState<AdminOrder[]>(demoAdminOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AdminOrderStatus>("ALL");
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const visibleOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      const matchesSearch =
        !keyword ||
        order.orderNumber.toLowerCase().includes(keyword) ||
        order.tableCode.toLowerCase().includes(keyword) ||
        order.customerName.toLowerCase().includes(keyword) ||
        order.items.some((item) => item.name.toLowerCase().includes(keyword));

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const summary = useMemo(() => {
    const active = orders.filter((order) =>
      ["CONFIRMED", "PREPARING", "READY"].includes(order.status)
    ).length;

    const sales = orders
      .filter((order) => order.status !== "CANCELLED")
      .reduce((sum, order) => sum + order.total, 0);

    return {
      total: orders.length,
      active,
      served: orders.filter((order) => order.status === "SERVED").length,
      sales
    };
  }, [orders]);

  function updateStatus(orderId: string, status: AdminOrderStatus) {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );

    setSelected((current) =>
      current?.id === orderId ? { ...current, status } : current
    );
  }

  function advance(order: AdminOrder) {
    const next = nextStatus(order.status);

    if (next) {
      updateStatus(order.id, next);
    }
  }

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logo}>M</div>
          <div>
            <span>Restaurant OS</span>
            <strong>Mellow Kitchen</strong>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link className={styles.navItem} href="/admin">Dashboard</Link>
          <Link
            className={`${styles.navItem} ${styles.navItemActive}`}
            href="/admin/orders"
          >
            Orders
          </Link>
          <Link className={styles.navItem} href="/admin/menu">Menu</Link>
          <Link className={styles.navItem} href="/admin/tables">Tables</Link>
          <Link className={styles.navItem} href="/kitchen">Kitchen</Link>
        </nav>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Operations</p>
            <h1>Order management</h1>
            <p>Search, review and manage every dine-in order from one place.</p>
          </div>

          <div className={styles.actions}>
            <span className={styles.demoBadge}>Demo mode</span>
            <Link className={styles.kitchenButton} href="/kitchen">
              Open Kitchen
            </Link>
          </div>
        </header>

        <section className={styles.metrics}>
          <article>
            <span>Total orders</span>
            <strong>{summary.total}</strong>
          </article>
          <article>
            <span>Active</span>
            <strong>{summary.active}</strong>
          </article>
          <article>
            <span>Served</span>
            <strong>{summary.served}</strong>
          </article>
          <article>
            <span>Sales</span>
            <strong>RM {summary.sales.toFixed(2)}</strong>
          </article>
        </section>

        <section className={styles.toolbar}>
          <div className={styles.search}>
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order, table, guest or dish..."
            />
          </div>

          <div className={styles.filters}>
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                data-active={statusFilter === status}
                onClick={() => setStatusFilter(status)}
              >
                {status === "ALL" ? "All" : statusLabel(status)}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.tablePanel}>
          <div className={styles.tableHeader}>
            <span>Order</span>
            <span>Table</span>
            <span>Guest</span>
            <span>Status</span>
            <span>Items</span>
            <span>Total</span>
            <span>Time</span>
            <span />
          </div>

          {visibleOrders.map((order) => (
            <button
              type="button"
              className={styles.orderRow}
              key={order.id}
              onClick={() => setSelected(order)}
            >
              <strong>#{order.orderNumber}</strong>
              <span>{order.tableCode}</span>
              <span>{order.customerName || "Walk-in"}</span>
              <span>
                <em data-status={order.status}>{statusLabel(order.status)}</em>
              </span>
              <span>
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
              <span>RM {order.total.toFixed(2)}</span>
              <span>
                {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
              </span>
              <span className={styles.chevron}>→</span>
            </button>
          ))}

          {visibleOrders.length === 0 && (
            <div className={styles.empty}>
              <strong>No orders found</strong>
              <span>Try another search or status filter.</span>
            </div>
          )}
        </section>
      </section>

      {selected && (
        <div className={styles.backdrop} onMouseDown={() => setSelected(null)}>
          <aside
            className={styles.drawer}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className={styles.drawerHeader}>
              <div>
                <span>Order details</span>
                <h2>#{selected.orderNumber}</h2>
              </div>
              <button type="button" onClick={() => setSelected(null)}>×</button>
            </header>

            <div className={styles.drawerBody}>
              <section className={styles.orderMeta}>
                <div>
                  <span>Table</span>
                  <strong>{selected.tableCode}</strong>
                </div>
                <div>
                  <span>Guest</span>
                  <strong>{selected.customerName || "Walk-in"}</strong>
                </div>
                <div>
                  <span>Time</span>
                  <strong>{formatTime(selected.createdAt)}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{statusLabel(selected.status)}</strong>
                </div>
              </section>

              <section className={styles.itemsPanel}>
                <div className={styles.sectionHeading}>
                  <span>Order items</span>
                  <strong>
                    {selected.items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}{" "}
                    items
                  </strong>
                </div>

                {selected.items.map((item) => (
                  <article className={styles.item} key={item.id}>
                    <div className={styles.quantity}>{item.quantity}×</div>

                    <div className={styles.itemBody}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          RM {(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>

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
                        <em>Item note: {item.note}</em>
                      )}
                    </div>
                  </article>
                ))}
              </section>

              {selected.note && (
                <section className={styles.noteCard}>
                  <span>Order note</span>
                  <strong>{selected.note}</strong>
                </section>
              )}

              <section className={styles.paymentCard}>
                <div>
                  <span>Payment</span>
                  <strong>{selected.paymentMethod}</strong>
                </div>
                <div>
                  <span>Total</span>
                  <strong>RM {selected.total.toFixed(2)}</strong>
                </div>
              </section>

              <section className={styles.statusPanel}>
                <span>Manual status</span>
                <div>
                  {(["CONFIRMED", "PREPARING", "READY", "SERVED"] as AdminOrderStatus[]).map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        data-active={selected.status === status}
                        disabled={selected.status === "CANCELLED"}
                        onClick={() => updateStatus(selected.id, status)}
                      >
                        {statusLabel(status)}
                      </button>
                    )
                  )}
                </div>
              </section>
            </div>

            <footer className={styles.drawerFooter}>
              <button
                className={styles.cancelButton}
                type="button"
                disabled={selected.status === "CANCELLED"}
                onClick={() => updateStatus(selected.id, "CANCELLED")}
              >
                Cancel order
              </button>

              {nextStatus(selected.status) && (
                <button
                  className={styles.primaryButton}
                  type="button"
                  onClick={() => advance(selected)}
                >
                  {nextLabel(selected.status)} →
                </button>
              )}
            </footer>
          </aside>
        </div>
      )}
    </main>
  );
}
