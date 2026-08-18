"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  demoCustomerTables,
  demoRestaurantOpen
} from "@/features/customer/entry/data/demo-customer-entry";
import type {
  CustomerEntryState,
  CustomerTablePreview
} from "@/features/customer/entry/types/customer-entry";
import styles from "./customer-entry-shell.module.css";

type Props = {
  children: React.ReactNode;
};

function resolveState(
  tableCode: string,
  table: CustomerTablePreview | undefined
): CustomerEntryState {
  if (!demoRestaurantOpen) return "CLOSED";
  if (!tableCode) return "NO_TABLE";
  if (!table) return "INVALID_TABLE";
  if (!table.enabled) return "DISABLED_TABLE";
  return "READY";
}

export function CustomerEntryShell({ children }: Props) {
  const params = useSearchParams();
  const tableCode = (params.get("table") ?? "").trim().toUpperCase();

  const table = useMemo(
    () => demoCustomerTables.find((item) => item.code === tableCode),
    [tableCode]
  );

  const state = resolveState(tableCode, table);

  if (state === "NO_TABLE") {
    return (
      <main className={styles.statePage}>
        <section className={styles.stateCard}>
          <div className={styles.logo}>M</div>
          <p className={styles.eyebrow}>Mellow Kitchen</p>
          <h1>Scan your table QR to order.</h1>
          <p className={styles.body}>
            This ordering page needs a table code so the kitchen knows where to
            send your food.
          </p>

          <div className={styles.helpBox}>
            <strong>What should I do?</strong>
            <span>
              Scan the QR code placed on your table, or ask a staff member for
              help.
            </span>
          </div>

          <a className={styles.secondaryAction} href="/?table=A01">
            Preview Table A01
          </a>
        </section>
      </main>
    );
  }

  if (state === "INVALID_TABLE") {
    return (
      <main className={styles.statePage}>
        <section className={styles.stateCard}>
          <div className={styles.stateIcon}>!</div>
          <p className={styles.eyebrow}>Table not found</p>
          <h1>This QR link isn&apos;t valid.</h1>
          <p className={styles.body}>
            We couldn&apos;t find table <strong>{tableCode}</strong>. The QR
            code may be outdated or typed incorrectly.
          </p>

          <div className={styles.helpBox}>
            <strong>Need help?</strong>
            <span>Ask a staff member to scan the correct table QR for you.</span>
          </div>
        </section>
      </main>
    );
  }

  if (state === "DISABLED_TABLE") {
    return (
      <main className={styles.statePage}>
        <section className={styles.stateCard}>
          <div className={styles.stateIcon}>×</div>
          <p className={styles.eyebrow}>Ordering unavailable</p>
          <h1>Table {tableCode} is currently disabled.</h1>
          <p className={styles.body}>
            This table is not accepting QR orders right now. Please ask a staff
            member before placing an order.
          </p>
        </section>
      </main>
    );
  }

  if (state === "CLOSED") {
    return (
      <main className={styles.statePage}>
        <section className={styles.stateCard}>
          <div className={styles.logo}>M</div>
          <p className={styles.eyebrow}>Mellow Kitchen</p>
          <h1>We&apos;re not accepting orders right now.</h1>
          <p className={styles.body}>
            You can still browse the menu later when the restaurant reopens.
          </p>

          <div className={styles.closedBadge}>Ordering paused</div>
        </section>
      </main>
    );
  }

  return (
    <div className={styles.readyShell}>
      <div className={styles.tableBar}>
        <div>
          <span>Ordering for</span>
          <strong>Table {table?.code}</strong>
        </div>

        <div className={styles.tableMeta}>
          <span>{table?.zone}</span>
          <span>·</span>
          <span>{table?.seats} seats</span>
        </div>

        <div className={styles.openBadge}>● Open</div>
      </div>

      {children}
    </div>
  );
}
