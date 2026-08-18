"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { demoRestaurantSettings } from "@/features/admin/settings/data/demo-restaurant-settings";
import type {
  PaymentMethodKey,
  RestaurantSettings
} from "@/features/admin/settings/types/restaurant-settings";
import styles from "./admin-settings-page.module.css";

const paymentOptions: Array<{
  key: PaymentMethodKey;
  title: string;
  description: string;
}> = [
  {
    key: "COUNTER",
    title: "Pay at counter",
    description: "Guests pay restaurant staff after dining."
  },
  {
    key: "CARD",
    title: "Card payment",
    description: "Reserved for future online card payment integration."
  },
  {
    key: "EWALLET",
    title: "E-wallet",
    description: "Reserved for QR / wallet payment integration."
  }
];

export function AdminSettingsPage() {
  const [settings, setSettings] =
    useState<RestaurantSettings>(demoRestaurantSettings);
  const [savedSettings, setSavedSettings] =
    useState<RestaurantSettings>(demoRestaurantSettings);
  const [savedMessage, setSavedMessage] = useState("");

  const dirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings]
  );

  function update<K extends keyof RestaurantSettings>(
    key: K,
    value: RestaurantSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value
    }));
    setSavedMessage("");
  }

  function togglePayment(key: PaymentMethodKey) {
    update(
      "paymentMethods",
      settings.paymentMethods.includes(key)
        ? settings.paymentMethods.filter((item) => item !== key)
        : [...settings.paymentMethods, key]
    );
  }

  function updateBusinessHour(
    index: number,
    patch: Partial<RestaurantSettings["businessHours"][number]>
  ) {
    update(
      "businessHours",
      settings.businessHours.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    );
  }

  function save() {
    setSavedSettings(settings);
    setSavedMessage("Settings saved locally in Demo mode.");
  }

  function reset() {
    setSettings(savedSettings);
    setSavedMessage("");
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
          <Link className={styles.navItem} href="/admin/orders">Orders</Link>
          <Link className={styles.navItem} href="/admin/menu">Menu</Link>
          <Link className={styles.navItem} href="/admin/tables">Tables</Link>
          <Link className={`${styles.navItem} ${styles.navItemActive}`} href="/admin/settings">
            Settings
          </Link>
          <Link className={styles.navItem} href="/kitchen">Kitchen</Link>
        </nav>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Configuration</p>
            <h1>Restaurant settings</h1>
            <p>Control ordering rules, business hours and guest-facing details.</p>
          </div>

          <div className={styles.topActions}>
            <span className={styles.demoBadge}>Demo mode</span>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={!dirty}
              onClick={reset}
            >
              Reset
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              disabled={!dirty}
              onClick={save}
            >
              Save changes
            </button>
          </div>
        </header>

        {savedMessage && (
          <div className={styles.savedMessage}>{savedMessage}</div>
        )}

        <section className={styles.layout}>
          <div className={styles.mainColumn}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span>01</span>
                  <div>
                    <h2>Restaurant profile</h2>
                    <p>Guest-facing restaurant information.</p>
                  </div>
                </div>
              </div>

              <div className={styles.fields}>
                <label>
                  <span>Restaurant name</span>
                  <input
                    value={settings.restaurantName}
                    onChange={(event) =>
                      update("restaurantName", event.target.value)
                    }
                  />
                </label>

                <label>
                  <span>Description</span>
                  <textarea
                    value={settings.description}
                    onChange={(event) =>
                      update("description", event.target.value)
                    }
                  />
                </label>

                <label>
                  <span>Guest announcement</span>
                  <textarea
                    value={settings.announcement}
                    onChange={(event) =>
                      update("announcement", event.target.value)
                    }
                  />
                </label>

                <div className={styles.twoColumns}>
                  <label>
                    <span>Currency</span>
                    <select
                      value={settings.currency}
                      onChange={(event) =>
                        update("currency", event.target.value)
                      }
                    >
                      <option value="MYR">MYR · Malaysian Ringgit</option>
                      <option value="SGD">SGD · Singapore Dollar</option>
                      <option value="USD">USD · US Dollar</option>
                    </select>
                  </label>

                  <label>
                    <span>Primary language</span>
                    <select
                      value={settings.language}
                      onChange={(event) =>
                        update("language", event.target.value)
                      }
                    >
                      <option>English</option>
                      <option>中文</option>
                      <option>Bahasa Melayu</option>
                    </select>
                  </label>
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span>02</span>
                  <div>
                    <h2>Business hours</h2>
                    <p>Set when guests are allowed to order.</p>
                  </div>
                </div>
              </div>

              <div className={styles.hoursList}>
                {settings.businessHours.map((day, index) => (
                  <div className={styles.hourRow} key={day.day}>
                    <label className={styles.dayToggle}>
                      <input
                        type="checkbox"
                        checked={day.enabled}
                        onChange={(event) =>
                          updateBusinessHour(index, {
                            enabled: event.target.checked
                          })
                        }
                      />
                      <strong>{day.day}</strong>
                    </label>

                    <input
                      type="time"
                      value={day.open}
                      disabled={!day.enabled}
                      onChange={(event) =>
                        updateBusinessHour(index, {
                          open: event.target.value
                        })
                      }
                    />

                    <span>to</span>

                    <input
                      type="time"
                      value={day.close}
                      disabled={!day.enabled}
                      onChange={(event) =>
                        updateBusinessHour(index, {
                          close: event.target.value
                        })
                      }
                    />

                    <em>{day.enabled ? "Open" : "Closed"}</em>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span>03</span>
                  <div>
                    <h2>Charges & ordering rules</h2>
                    <p>Configure totals and ordering behaviour.</p>
                  </div>
                </div>
              </div>

              <div className={styles.threeColumns}>
                <label>
                  <span>Service charge %</span>
                  <input
                    inputMode="decimal"
                    value={String(settings.serviceChargePercent)}
                    onChange={(event) =>
                      update(
                        "serviceChargePercent",
                        Math.max(0, Number(event.target.value) || 0)
                      )
                    }
                  />
                </label>

                <label>
                  <span>Tax %</span>
                  <input
                    inputMode="decimal"
                    value={String(settings.taxPercent)}
                    onChange={(event) =>
                      update(
                        "taxPercent",
                        Math.max(0, Number(event.target.value) || 0)
                      )
                    }
                  />
                </label>

                <label>
                  <span>Minimum order (RM)</span>
                  <input
                    inputMode="decimal"
                    value={String(settings.minimumOrder)}
                    onChange={(event) =>
                      update(
                        "minimumOrder",
                        Math.max(0, Number(event.target.value) || 0)
                      )
                    }
                  />
                </label>
              </div>

              <div className={styles.switchList}>
                <label>
                  <div>
                    <strong>Restaurant accepting orders</strong>
                    <span>Turn off to temporarily stop new orders.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.isOpen}
                    onChange={(event) =>
                      update("isOpen", event.target.checked)
                    }
                  />
                </label>

                <label>
                  <div>
                    <strong>Require table code</strong>
                    <span>Guest ordering link must contain a valid table.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.requireTableCode}
                    onChange={(event) =>
                      update("requireTableCode", event.target.checked)
                    }
                  />
                </label>

                <label>
                  <div>
                    <strong>Allow special requests</strong>
                    <span>Guests can send notes to the kitchen.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowSpecialRequests}
                    onChange={(event) =>
                      update("allowSpecialRequests", event.target.checked)
                    }
                  />
                </label>

                <label>
                  <div>
                    <strong>Allow repeat orders</strong>
                    <span>Guests may add another order after checkout.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowRepeatOrders}
                    onChange={(event) =>
                      update("allowRepeatOrders", event.target.checked)
                    }
                  />
                </label>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span>04</span>
                  <div>
                    <h2>Payment methods</h2>
                    <p>Choose which payment methods guests can use.</p>
                  </div>
                </div>
              </div>

              <div className={styles.paymentList}>
                {paymentOptions.map((option) => {
                  const active = settings.paymentMethods.includes(option.key);

                  return (
                    <button
                      type="button"
                      key={option.key}
                      data-active={active}
                      onClick={() => togglePayment(option.key)}
                    >
                      <div className={styles.paymentIcon}>
                        {active ? "✓" : "+"}
                      </div>
                      <div>
                        <strong>{option.title}</strong>
                        <span>{option.description}</span>
                      </div>
                      <em>{active ? "Enabled" : "Disabled"}</em>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className={styles.previewColumn}>
            <section className={styles.previewCard}>
              <p className={styles.eyebrow}>Guest preview</p>
              <div className={styles.previewLogo}>M</div>
              <h2>{settings.restaurantName || "Restaurant"}</h2>
              <p>{settings.description || "Restaurant description"}</p>

              <div className={styles.previewStatus}>
                <span data-open={settings.isOpen}>
                  ● {settings.isOpen ? "Accepting orders" : "Ordering paused"}
                </span>
              </div>

              {settings.announcement && (
                <div className={styles.previewAnnouncement}>
                  {settings.announcement}
                </div>
              )}

              <div className={styles.previewSummary}>
                <div>
                  <span>Currency</span>
                  <strong>{settings.currency}</strong>
                </div>
                <div>
                  <span>Service</span>
                  <strong>{settings.serviceChargePercent}%</strong>
                </div>
                <div>
                  <span>Tax</span>
                  <strong>{settings.taxPercent}%</strong>
                </div>
              </div>
            </section>

            <section className={styles.infoCard}>
              <strong>UI phase</strong>
              <p>
                These settings are currently local Demo Mode state. Database
                persistence will be connected after the complete UI is ready.
              </p>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
