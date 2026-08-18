"use client";

import { useMemo, useState } from "react";
import type { CartLine } from "@/features/cart/types/cart";
import styles from "./checkout-review.module.css";

type CheckoutReviewProps = {
  tableCode: string;
  lines: CartLine[];
  onBack: () => void;
  onConfirm: (payload: {
    dinerName: string;
    orderNote: string;
    total: number;
  }) => Promise<void>;
};

export function CheckoutReview({
  tableCode,
  lines,
  onBack,
  onConfirm
}: CheckoutReviewProps) {
  const [dinerName, setDinerName] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const subtotal = useMemo(
    () =>
      lines.reduce(
        (sum, line) => sum + line.unitPrice * line.quantity,
        0
      ),
    [lines]
  );

  const serviceCharge = 0;
  const tax = 0;
  const total = subtotal + serviceCharge + tax;

  async function submitOrder() {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      await onConfirm({
        dinerName: dinerName.trim(),
        orderNote: orderNote.trim(),
        total
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to place your order."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to cart"
          disabled={submitting}
        >
          ←
        </button>
        <div>
          <span>Table {tableCode}</span>
          <h1>Review order</h1>
        </div>
        <div className={styles.headerSpacer} />
      </header>

      <main className={styles.content}>
        <section className={styles.card}>
          <div className={styles.sectionTitle}>
            <div>
              <span>01</span>
              <div>
                <h2>Order items</h2>
                <p>Check your customisations before sending.</p>
              </div>
            </div>
            <strong>{lines.reduce((sum, line) => sum + line.quantity, 0)} items</strong>
          </div>

          <div className={styles.items}>
            {lines.map((line) => (
              <article className={styles.item} key={line.id}>
                <div className={styles.quantity}>{line.quantity}×</div>
                <div className={styles.itemBody}>
                  <div className={styles.itemTop}>
                    <h3>{line.item.name}</h3>
                    <strong>
                      RM {(line.unitPrice * line.quantity).toFixed(2)}
                    </strong>
                  </div>

                  {line.selections.length > 0 && (
                    <p>
                      {line.selections
                        .map((selection) => selection.choiceLabel)
                        .join(" · ")}
                    </p>
                  )}

                  {line.note && (
                    <small>Special request: {line.note}</small>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionTitle}>
            <div>
              <span>02</span>
              <div>
                <h2>Order details</h2>
                <p>Optional details help the staff serve you.</p>
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="dinerName">Name</label>
            <input
              id="dinerName"
              value={dinerName}
              onChange={(event) => setDinerName(event.target.value)}
              placeholder="Optional"
              maxLength={40}
              disabled={submitting}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="orderNote">Note for the restaurant</label>
            <textarea
              id="orderNote"
              value={orderNote}
              onChange={(event) => setOrderNote(event.target.value)}
              placeholder="Example: We're sharing the dishes."
              maxLength={200}
              disabled={submitting}
            />
            <small>{orderNote.length}/200</small>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionTitle}>
            <div>
              <span>03</span>
              <div>
                <h2>Payment</h2>
                <p>Payment method will be configured by the restaurant.</p>
              </div>
            </div>
          </div>

          <div className={styles.paymentOption}>
            <div className={styles.paymentIcon}>⌁</div>
            <div>
              <strong>Pay at counter</strong>
              <span>Settle your bill with restaurant staff.</span>
            </div>
            <div className={styles.selectedDot}>✓</div>
          </div>
        </section>

        <section className={styles.totalCard}>
          <div>
            <span>Subtotal</span>
            <strong>RM {subtotal.toFixed(2)}</strong>
          </div>
          <div>
            <span>Service charge</span>
            <strong>RM {serviceCharge.toFixed(2)}</strong>
          </div>
          <div>
            <span>Tax</span>
            <strong>RM {tax.toFixed(2)}</strong>
          </div>
          <div className={styles.grandTotal}>
            <span>Total</span>
            <strong>RM {total.toFixed(2)}</strong>
          </div>
        </section>

        {submitError && (
          <div className={styles.submitError} role="alert">
            <strong>Order not sent</strong>
            <span>{submitError}</span>
          </div>
        )}

        <label className={styles.confirmation}>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            disabled={submitting}
          />
          <span>
            I have checked the table number and order details.
          </span>
        </label>
      </main>

      <footer className={styles.footer}>
        <div>
          <small>Total</small>
          <strong>RM {total.toFixed(2)}</strong>
        </div>

        <button
          type="button"
          disabled={
            !accepted ||
            lines.length === 0 ||
            tableCode === "--" ||
            submitting
          }
          onClick={submitOrder}
        >
          {submitting ? "Sending..." : "Place order"}
          <span aria-hidden="true">{submitting ? "…" : "→"}</span>
        </button>
      </footer>
    </div>
  );
}
