"use client";

import { useEffect, useState } from "react";
import type { OrderStatusResponse } from "@/features/orders/types/order-api";
import type { PlacedOrder } from "@/features/orders/types/order";
import styles from "./order-status.module.css";

type OrderStatusProps = {
  order: PlacedOrder;
  onNewOrder: () => void;
};

const steps = [
  {
    id: "CONFIRMED",
    title: "Order received",
    description: "The restaurant has received your order."
  },
  {
    id: "PREPARING",
    title: "Preparing",
    description: "The kitchen is preparing your dishes."
  },
  {
    id: "READY",
    title: "Ready",
    description: "Your order is ready to be served."
  }
] as const;

export function OrderStatus({
  order,
  onNewOrder
}: OrderStatusProps) {
  const [status, setStatus] = useState(order.status);
  const [lastUpdated, setLastUpdated] = useState("Updated now");

  useEffect(() => {
    let active = true;

    async function refreshStatus() {
      try {
        const response = await fetch(
          `/api/orders/${encodeURIComponent(order.orderNumber)}`,
          {
            cache: "no-store"
          }
        );

        if (!response.ok) {
          return;
        }

        const result = (await response.json()) as OrderStatusResponse;

        if (active) {
          setStatus(result.status);
          setLastUpdated(
            `Updated ${new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}`
          );
        }
      } catch {
        // Keep showing the last known state when a poll fails.
      }
    }

    void refreshStatus();

    const timer = window.setInterval(() => {
      void refreshStatus();
    }, 10000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [order.orderNumber]);

  const currentIndex =
    status === "SERVED"
      ? steps.length - 1
      : steps.findIndex((step) => step.id === status);

  return (
    <main className={styles.page}>
      <section className={styles.successCard}>
        <div className={styles.successIcon}>✓</div>
        <p className={styles.eyebrow}>Order sent</p>
        <h1>Thanks{order.dinerName ? `, ${order.dinerName}` : ""}.</h1>
        <p>
          Your order is stored in the restaurant system. Keep this page open
          to follow live kitchen status.
        </p>

        <div className={styles.orderMeta}>
          <div>
            <span>Order</span>
            <strong>#{order.orderNumber}</strong>
          </div>
          <div>
            <span>Table</span>
            <strong>{order.tableCode}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>RM {order.total.toFixed(2)}</strong>
          </div>
        </div>
      </section>

      <section className={styles.statusCard}>
        <div className={styles.cardHeading}>
          <div>
            <p className={styles.eyebrow}>Live status</p>
            <h2>What&apos;s happening</h2>
          </div>
          <span>{lastUpdated}</span>
        </div>

        <div className={styles.timeline}>
          {steps.map((step, index) => {
            const complete = currentIndex >= 0 && index <= currentIndex;

            return (
              <div className={styles.step} key={step.id}>
                <div
                  className={
                    complete
                      ? `${styles.stepDot} ${styles.stepDotActive}`
                      : styles.stepDot
                  }
                >
                  {complete ? "✓" : index + 1}
                </div>

                <div className={styles.stepBody}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {status === "CANCELLED" && (
          <div role="alert">
            This order was cancelled. Please speak with restaurant staff.
          </div>
        )}
      </section>

      <section className={styles.summaryCard}>
        <div className={styles.cardHeading}>
          <div>
            <p className={styles.eyebrow}>Order summary</p>
            <h2>Your dishes</h2>
          </div>
          <span>
            {order.lines.reduce((sum, line) => sum + line.quantity, 0)} items
          </span>
        </div>

        <div className={styles.orderLines}>
          {order.lines.map((line) => (
            <div className={styles.orderLine} key={line.id}>
              <span>{line.quantity}×</span>
              <div>
                <strong>{line.item.name}</strong>
                <p>
                  {line.selections
                    .map((selection) => selection.choiceLabel)
                    .join(" · ")}
                </p>
              </div>
              <strong>
                RM {(line.unitPrice * line.quantity).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
      </section>

      <button
        className={styles.newOrderButton}
        type="button"
        onClick={onNewOrder}
      >
        Add another order
      </button>
    </main>
  );
}
