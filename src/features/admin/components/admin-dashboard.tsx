"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { demoAdminDashboard } from "@/features/admin/data/demo-admin-dashboard";
import type { AdminDashboardData } from "@/features/admin/types/admin-dashboard";
import styles from "./admin-dashboard.module.css";

const quickLinks = [
  {
    href: "/admin/orders",
    eyebrow: "Operations",
    title: "Orders",
    description: "Review live and completed orders.",
    icon: "⌁"
  },
  {
    href: "/admin/menu",
    eyebrow: "Catalogue",
    title: "Menu",
    description: "Manage dishes, categories and availability.",
    icon: "☷"
  },
  {
    href: "/admin/tables",
    eyebrow: "Dine-in",
    title: "Tables",
    description: "Manage table codes and QR access.",
    icon: "▦"
  },
  {
    href: "/admin/analytics",
    eyebrow: "Reports",
    title: "Analytics",
    description: "Review sales, demand and table performance.",
    icon: "↗"
  },
  {
    href: "/admin/settings",
    eyebrow: "Configuration",
    title: "Settings",
    description: "Manage restaurant rules and business hours.",
    icon: "⚙"
  },
  {
    href: "/kitchen",
    eyebrow: "Kitchen",
    title: "KDS",
    description: "Open the live kitchen display system.",
    icon: "→"
  }
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function statusLabel(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData>(demoAdminDashboard);
  const [demoMode, setDemoMode] = useState(true);
  const [syncing, setSyncing] = useState(false);

  async function loadDashboard() {
    setSyncing(true);

    try {
      const response = await fetch("/api/admin/dashboard", {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Admin API unavailable");
      }

      const result = (await response.json()) as AdminDashboardData & {
        demoMode?: boolean;
      };

      setData(result);
      setDemoMode(Boolean(result.demoMode));
    } catch {
      setData(demoAdminDashboard);
      setDemoMode(true);
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

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
          <Link className={`${styles.navItem} ${styles.navItemActive}`} href="/admin">
            <span>⌂</span>
            Dashboard
          </Link>
          <Link className={styles.navItem} href="/admin/orders">
            <span>⌁</span>
            Orders
          </Link>
          <Link className={styles.navItem} href="/admin/menu">
            <span>☷</span>
            Menu
          </Link>
          <Link className={styles.navItem} href="/admin/tables">
            <span>▦</span>
            Tables
          </Link>
          <Link className={styles.navItem} href="/admin/analytics">
            <span>↗</span>
            Analytics
          </Link>
          <Link className={styles.navItem} href="/admin/settings">
            <span>⚙</span>
            Settings
          </Link>
          <Link className={styles.navItem} href="/kitchen">
            <span>→</span>
            Kitchen
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <span>System status</span>
          <strong>{demoMode ? "Demo data" : "Connected"}</strong>
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Overview</p>
            <h1>Good afternoon.</h1>
            <p>Here&apos;s what&apos;s happening in your restaurant today.</p>
          </div>

          <div className={styles.topbarActions}>
            {demoMode && <span className={styles.demoBadge}>Demo mode</span>}
            <button type="button" onClick={() => void loadDashboard()}>
              {syncing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </header>

        <section className={styles.metrics}>
          {data.metrics.map((metric) => (
            <article className={styles.metricCard} key={metric.id}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.helper}</small>
            </article>
          ))}
        </section>

        <section className={styles.quickGrid}>
          {quickLinks.map((item) => (
            <Link className={styles.quickCard} href={item.href} key={item.href}>
              <div className={styles.quickIcon}>{item.icon}</div>
              <div>
                <span>{item.eyebrow}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              <strong>Open →</strong>
            </Link>
          ))}
        </section>

        <section className={styles.mainGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.eyebrow}>Live operations</p>
                <h2>Recent orders</h2>
              </div>
              <Link href="/admin/orders">View all</Link>
            </div>

            <div className={styles.orderTable}>
              <div className={styles.tableHeader}>
                <span>Order</span>
                <span>Table</span>
                <span>Status</span>
                <span>Total</span>
                <span>Time</span>
              </div>

              {data.recentOrders.map((order) => (
                <div className={styles.tableRow} key={order.id}>
                  <strong>#{order.orderNumber}</strong>
                  <span>{order.tableCode}</span>
                  <span>
                    <em data-status={order.status}>
                      {statusLabel(order.status)}
                    </em>
                  </span>
                  <span>RM {order.total.toFixed(2)}</span>
                  <span>{formatTime(order.createdAt)}</span>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.eyebrow}>Performance</p>
                <h2>Popular dishes</h2>
              </div>
            </div>

            <div className={styles.popularList}>
              {data.popularItems.map((item, index) => (
                <div className={styles.popularItem} key={item.id}>
                  <div className={styles.rank}>{index + 1}</div>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.orders} orders</span>
                  </div>
                  <strong>RM {item.revenue.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
