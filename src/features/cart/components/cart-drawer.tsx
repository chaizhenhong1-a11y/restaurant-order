"use client";

import type { CartLine } from "@/features/cart/types/cart";
import styles from "./cart-drawer.module.css";

type CartDrawerProps = {
  lines: CartLine[];
  tableCode: string;
  onClose: () => void;
  onChangeQuantity: (lineId: string, quantity: number) => void;
  onReviewOrder: () => void;
};

export function CartDrawer({
  lines,
  tableCode,
  onClose,
  onChangeQuantity,
  onReviewOrder
}: CartDrawerProps) {
  const total = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0
  );

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.handle} />

        <header className={styles.header}>
          <div>
            <span>Table {tableCode}</span>
            <h2>Your order</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </header>

        {lines.length === 0 ? (
          <div className={styles.empty}>
            <span aria-hidden="true">🛒</span>
            <h3>Your cart is empty</h3>
            <p>Add a dish to start your order.</p>
          </div>
        ) : (
          <>
            <div className={styles.lines}>
              {lines.map((line) => (
                <article className={styles.line} key={line.id}>
                  <div
                    className={styles.image}
                    style={{ backgroundImage: `url("${line.item.imageUrl}")` }}
                    aria-hidden="true"
                  />

                  <div className={styles.lineContent}>
                    <div className={styles.lineTop}>
                      <div>
                        <h3>{line.item.name}</h3>
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

                    {line.note && (
                      <p className={styles.note}>“{line.note}”</p>
                    )}

                    <div className={styles.lineBottom}>
                      <span>RM {line.unitPrice.toFixed(2)} each</span>

                      <div className={styles.stepper}>
                        <button
                          type="button"
                          onClick={() =>
                            onChangeQuantity(line.id, line.quantity - 1)
                          }
                          aria-label={`Decrease ${line.item.name}`}
                        >
                          −
                        </button>
                        <strong>{line.quantity}</strong>
                        <button
                          type="button"
                          onClick={() =>
                            onChangeQuantity(line.id, line.quantity + 1)
                          }
                          aria-label={`Increase ${line.item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.summary}>
              <div>
                <span>Subtotal</span>
                <strong>RM {total.toFixed(2)}</strong>
              </div>
              <div>
                <span>Service / tax</span>
                <strong>Calculated at checkout</strong>
              </div>
            </div>

            <footer className={styles.footer}>
              <div>
                <small>Total</small>
                <strong>RM {total.toFixed(2)}</strong>
              </div>

              <button type="button" onClick={onReviewOrder}>
                Review order
                <span aria-hidden="true">→</span>
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
