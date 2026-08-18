"use client";

import { useMemo, useState } from "react";
import { CartDrawer } from "@/features/cart/components/cart-drawer";
import type { CartLine } from "@/features/cart/types/cart";
import { CheckoutReview } from "@/features/checkout/components/checkout-review";
import { ItemCustomizer } from "@/features/menu/components/item-customizer";
import { categories, menuItems } from "@/features/menu/data/demo-menu";
import type { MenuItem } from "@/features/menu/types/menu";
import { OrderStatus } from "@/features/orders/components/order-status";
import type { CreateOrderResponse } from "@/features/orders/types/order-api";
import type { PlacedOrder } from "@/features/orders/types/order";
import styles from "./restaurant-order-app.module.css";

type RestaurantOrderAppProps = {
  tableCode: string;
};

type View = "menu" | "checkout" | "order-status";

export function RestaurantOrderApp({
  tableCode
}: RestaurantOrderAppProps) {
  const [view, setView] = useState<View>("menu");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  const visibleItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "all"
          ? item.popular
          : item.categoryId === activeCategory;

      const matchesSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const cartLines = useMemo(() => Object.values(cart), [cart]);

  const cartSummary = useMemo(() => {
    return cartLines.reduce(
      (summary, line) => ({
        count: summary.count + line.quantity,
        total: summary.total + line.unitPrice * line.quantity
      }),
      { count: 0, total: 0 }
    );
  }, [cartLines]);

  function addConfiguredLine(line: CartLine) {
    setCart((current) => {
      const existing = current[line.id];

      return {
        ...current,
        [line.id]: existing
          ? {
              ...existing,
              quantity: existing.quantity + line.quantity
            }
          : line
      };
    });

    setSelectedItem(null);
  }

  function changeQuantity(lineId: string, quantity: number) {
    setCart((current) => {
      if (quantity <= 0) {
        const next = { ...current };
        delete next[lineId];
        return next;
      }

      const line = current[lineId];

      if (!line) {
        return current;
      }

      return {
        ...current,
        [lineId]: {
          ...line,
          quantity
        }
      };
    });
  }

  async function confirmOrder(payload: {
    dinerName: string;
    orderNote: string;
    total: number;
  }) {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        restaurantSlug: "mellow-kitchen",
        tableCode,
        dinerName: payload.dinerName,
        orderNote: payload.orderNote,
        lines: cartLines.map((line) => ({
          menuItemId: line.item.id,
          quantity: line.quantity,
          note: line.note,
          selections: line.selections.map((selection) => ({
            choiceId: selection.choiceId
          }))
        }))
      })
    });

    const result = (await response.json()) as
      | CreateOrderResponse
      | {
          error: string;
          message: string;
        };

    if (!response.ok || "error" in result) {
      throw new Error(
        "message" in result ? result.message : "Unable to place order."
      );
    }

    const order: PlacedOrder = {
      orderNumber: result.orderNumber,
      tableCode,
      dinerName: payload.dinerName,
      note: payload.orderNote,
      total: result.total,
      createdAt: result.createdAt,
      lines: cartLines,
      status: result.status
    };

    setPlacedOrder(order);
    setCart({});
    setView("order-status");
  }

  if (view === "checkout") {
    return (
      <CheckoutReview
        tableCode={tableCode}
        lines={cartLines}
        onBack={() => setView("menu")}
        onConfirm={confirmOrder}
      />
    );
  }

  if (view === "order-status" && placedOrder) {
    return (
      <OrderStatus
        order={placedOrder}
        onNewOrder={() => {
          setPlacedOrder(null);
          setView("menu");
        }}
      />
    );
  }

  return (
    <main className={styles.shell}>
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.brandGroup}>
            <div className={styles.logo} aria-hidden="true">
              M
            </div>
            <div>
              <p className={styles.brandName}>Mellow Kitchen</p>
              <p className={styles.openStatus}>
                <span aria-hidden="true">●</span> Open · 10:00 AM – 10:00 PM
              </p>
            </div>
          </div>

          <div className={styles.tableBadge}>
            <span>Table</span>
            <strong>{tableCode}</strong>
          </div>
        </header>

        <section className={styles.heroCopy}>
          <p className={styles.eyebrow}>Dine-in ordering</p>
          <h1>Good food, ordered from your table.</h1>
          <p>
            Browse the menu, customise your meal and send the order straight
            to the kitchen.
          </p>
        </section>

        {tableCode === "--" && (
          <div className={styles.tableWarning}>
            No table was detected. Open this page with
            <code>?table=A01</code> to simulate a table QR code.
          </div>
        )}

        <div className={styles.searchBox}>
          <span aria-hidden="true">⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search dishes..."
            aria-label="Search dishes"
          />
        </div>

        <nav className={styles.categoryRail} aria-label="Menu categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={
                activeCategory === category.id
                  ? `${styles.categoryButton} ${styles.categoryButtonActive}`
                  : styles.categoryButton
              }
              onClick={() => setActiveCategory(category.id)}
              type="button"
            >
              <span aria-hidden="true">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </nav>

        <section className={styles.specialCard}>
          <div className={styles.specialOverlay}>
            <span className={styles.specialBadge}>Today&apos;s special</span>
            <h2>Truffle Mushroom Pizza</h2>
            <p>Wild mushrooms, mozzarella and truffle cream.</p>
            <strong>From RM 26.90</strong>
          </div>
        </section>

        <section className={styles.menuSection}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Our menu</p>
              <h2>
                {activeCategory === "all"
                  ? "Popular dishes"
                  : categories.find((item) => item.id === activeCategory)
                      ?.label ?? "Menu"}
              </h2>
            </div>
            <span>{visibleItems.length} items</span>
          </div>

          <div className={styles.menuList}>
            {visibleItems.map((item) => (
              <article className={styles.foodCard} key={item.id}>
                <button
                  className={styles.foodImageButton}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  aria-label={`Customize ${item.name}`}
                >
                  <span
                    className={styles.foodImage}
                    style={{ backgroundImage: `url("${item.imageUrl}")` }}
                    role="img"
                    aria-label={item.name}
                  />
                </button>

                <div className={styles.foodContent}>
                  <button
                    className={styles.foodTextButton}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                  >
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </button>

                  <div className={styles.rating}>
                    <span aria-hidden="true">★</span>
                    {item.rating.toFixed(1)}
                    <small>· {item.orderCount} orders</small>
                  </div>

                  <div className={styles.foodFooter}>
                    <strong>RM {item.price.toFixed(2)}</strong>
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      aria-label={`Customize ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {visibleItems.length === 0 && (
            <div className={styles.emptyState}>
              <span aria-hidden="true">🍽️</span>
              <h3>No dishes found</h3>
              <p>Try another category or search term.</p>
            </div>
          )}
        </section>
      </div>

      <div className={styles.cartDock}>
        <div className={styles.cartBar}>
          <div className={styles.cartSummary}>
            <span className={styles.cartCount}>{cartSummary.count}</span>
            <div>
              <small>Your order</small>
              <strong>RM {cartSummary.total.toFixed(2)}</strong>
            </div>
          </div>

          <button
            type="button"
            className={styles.cartButton}
            onClick={() => setCartOpen(true)}
            disabled={cartSummary.count === 0}
          >
            View cart
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {selectedItem && (
        <ItemCustomizer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAdd={addConfiguredLine}
        />
      )}

      {cartOpen && (
        <CartDrawer
          lines={cartLines}
          tableCode={tableCode}
          onClose={() => setCartOpen(false)}
          onChangeQuantity={changeQuantity}
          onReviewOrder={() => {
            setCartOpen(false);
            setView("checkout");
          }}
        />
      )}
    </main>
  );
}
