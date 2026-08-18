"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { demoAdminAnalytics } from "@/features/admin/analytics/data/demo-admin-analytics";
import styles from "./admin-analytics-page.module.css";

type RangeKey = "7D" | "30D" | "90D";

const ranges: Array<{ key: RangeKey; label: string }> = [
  { key: "7D", label: "7 days" },
  { key: "30D", label: "30 days" },
  { key: "90D", label: "90 days" }
];

export function AdminAnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("7D");
  const data = demoAdminAnalytics;

  const maxSales = useMemo(
    () => Math.max(...data.sales.map((point) => point.value), 1),
    [data.sales]
  );

  const maxHourly = useMemo(
    () => Math.max(...data.hourlyOrders.map((point) => point.orders), 1),
    [data.hourlyOrders]
  );

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
          <Link className={`${styles.navItem} ${styles.navItemActive}`} href="/admin/analytics">
            Analytics
          </Link>
          <Link className={styles.navItem} href="/admin/settings">Settings</Link>
          <Link className={styles.navItem} href="/kitchen">Kitchen</Link>
        </nav>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Reports</p>
            <h1>Analytics</h1>
            <p>Understand sales, demand and table performance at a glance.</p>
          </div>

          <div className={styles.actions}>
            <span className={styles.demoBadge}>Demo mode</span>
            <div className={styles.rangePicker}>
              {ranges.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  data-active={range === item.key}
                  onClick={() => setRange(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className={styles.metrics}>
          {data.metrics.map((metric) => (
            <article key={metric.id}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.helper}</small>
            </article>
          ))}
        </section>

        <section className={styles.mainGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.eyebrow}>Revenue</p>
                <h2>Sales trend</h2>
              </div>
              <span>{range}</span>
            </div>

            <div className={styles.salesChart}>
              <div className={styles.axisLabels}>
                <span>RM {maxSales.toFixed(0)}</span>
                <span>RM {(maxSales / 2).toFixed(0)}</span>
                <span>RM 0</span>
              </div>

              <div className={styles.bars}>
                {data.sales.map((point) => (
                  <div className={styles.barItem} key={point.label}>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{
                          height: `${Math.max(8, (point.value / maxSales) * 100)}%`
                        }}
                        title={`RM ${point.value.toFixed(2)}`}
                      />
                    </div>
                    <strong>{point.label}</strong>
                    <span>RM {point.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.eyebrow}>Demand</p>
                <h2>Busiest hours</h2>
              </div>
            </div>

            <div className={styles.hourChart}>
              {data.hourlyOrders.map((point) => (
                <div className={styles.hourRow} key={point.hour}>
                  <span>{point.hour}:00</span>
                  <div className={styles.hourTrack}>
                    <div
                      className={styles.hourFill}
                      style={{
                        width: `${Math.max(4, (point.orders / maxHourly) * 100)}%`
                      }}
                    />
                  </div>
                  <strong>{point.orders}</strong>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className={styles.bottomGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.eyebrow}>Menu performance</p>
                <h2>Top dishes</h2>
              </div>
            </div>

            <div className={styles.rankList}>
              {data.popularDishes.map((dish, index) => (
                <div className={styles.rankRow} key={dish.id}>
                  <div className={styles.rank}>{index + 1}</div>
                  <div>
                    <strong>{dish.name}</strong>
                    <span>{dish.orders} orders</span>
                  </div>
                  <strong>RM {dish.revenue.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.eyebrow}>Dine-in</p>
                <h2>Top tables</h2>
              </div>
            </div>

            <div className={styles.tableList}>
              {data.tablePerformance.map((table, index) => (
                <div className={styles.tableRow} key={table.tableCode}>
                  <div className={styles.tableBadge}>{table.tableCode}</div>
                  <div>
                    <strong>#{index + 1} table</strong>
                    <span>{table.orders} orders</span>
                  </div>
                  <strong>RM {table.revenue.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className={`${styles.panel} ${styles.insightPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.eyebrow}>Insights</p>
                <h2>What stands out</h2>
              </div>
            </div>

            <div className={styles.insights}>
              <div>
                <span>Peak period</span>
                <strong>12:00 – 14:00</strong>
                <p>Lunch remains the strongest ordering window.</p>
              </div>
              <div>
                <span>Best seller</span>
                <strong>Signature Chicken Rice</strong>
                <p>Leads by volume across the selected period.</p>
              </div>
              <div>
                <span>Highest table revenue</span>
                <strong>Table A01</strong>
                <p>Generated RM 842.60 in demo revenue.</p>
              </div>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
