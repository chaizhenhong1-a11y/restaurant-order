"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { demoAdminTables } from "@/features/admin/tables/data/demo-admin-tables";
import type {
  AdminTable,
  AdminTableStatus
} from "@/features/admin/tables/types/admin-table";
import styles from "./admin-table-manager.module.css";

type EditorState = {
  mode: "create" | "edit";
  id?: string;
  code: string;
  seats: string;
  zone: string;
  status: AdminTableStatus;
};

function localId() {
  return `table-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function statusLabel(status: AdminTableStatus) {
  if (status === "AVAILABLE") return "Available";
  if (status === "OCCUPIED") return "Occupied";
  return "Disabled";
}

export function AdminTableManager() {
  const [tables, setTables] = useState<AdminTable[]>(demoAdminTables);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AdminTableStatus>("ALL");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [qrTable, setQrTable] = useState<AdminTable | null>(null);

  const visibleTables = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return tables.filter((table) => {
      const matchesSearch =
        !keyword ||
        table.code.toLowerCase().includes(keyword) ||
        table.zone.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" || table.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tables, search, statusFilter]);

  const summary = useMemo(
    () => ({
      total: tables.length,
      available: tables.filter((table) => table.status === "AVAILABLE").length,
      occupied: tables.filter((table) => table.status === "OCCUPIED").length,
      disabled: tables.filter((table) => table.status === "DISABLED").length
    }),
    [tables]
  );

  function openCreate() {
    setEditor({
      mode: "create",
      code: "",
      seats: "2",
      zone: "Main Hall",
      status: "AVAILABLE"
    });
  }

  function openEdit(table: AdminTable) {
    setEditor({
      mode: "edit",
      id: table.id,
      code: table.code,
      seats: String(table.seats),
      zone: table.zone,
      status: table.status
    });
  }

  function saveTable() {
    if (!editor) return;

    const code = editor.code.trim().toUpperCase();
    const seats = Math.max(1, Number(editor.seats) || 1);
    const zone = editor.zone.trim() || "Main Hall";

    if (!code) return;

    if (editor.mode === "create") {
      setTables((current) => [
        ...current,
        {
          id: localId(),
          code,
          seats,
          zone,
          status: editor.status
        }
      ]);
    } else {
      setTables((current) =>
        current.map((table) =>
          table.id === editor.id
            ? {
                ...table,
                code,
                seats,
                zone,
                status: editor.status
              }
            : table
        )
      );
    }

    setEditor(null);
  }

  function removeTable(tableId: string) {
    setTables((current) => current.filter((table) => table.id !== tableId));
  }

  function toggleEnabled(table: AdminTable) {
    setTables((current) =>
      current.map((entry) =>
        entry.id === table.id
          ? {
              ...entry,
              status:
                entry.status === "DISABLED" ? "AVAILABLE" : "DISABLED"
            }
          : entry
      )
    );
  }

  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

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
          <Link
            className={`${styles.navItem} ${styles.navItemActive}`}
            href="/admin/tables"
          >
            Tables
          </Link>
          <Link className={styles.navItem} href="/kitchen">Kitchen</Link>
        </nav>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Dine-in</p>
            <h1>Table management</h1>
            <p>Manage table codes, seats, zones and QR ordering links.</p>
          </div>

          <div className={styles.actions}>
            <span className={styles.demoBadge}>Demo mode</span>
            <button className={styles.primaryButton} type="button" onClick={openCreate}>
              + New table
            </button>
          </div>
        </header>

        <section className={styles.metrics}>
          <article>
            <span>Total tables</span>
            <strong>{summary.total}</strong>
          </article>
          <article>
            <span>Available</span>
            <strong>{summary.available}</strong>
          </article>
          <article>
            <span>Occupied</span>
            <strong>{summary.occupied}</strong>
          </article>
          <article>
            <span>Disabled</span>
            <strong>{summary.disabled}</strong>
          </article>
        </section>

        <section className={styles.toolbar}>
          <div className={styles.search}>
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search table code or zone..."
            />
          </div>

          <div className={styles.filters}>
            {(["ALL", "AVAILABLE", "OCCUPIED", "DISABLED"] as const).map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  data-active={statusFilter === filter}
                  onClick={() => setStatusFilter(filter)}
                >
                  {filter === "ALL" ? "All" : statusLabel(filter)}
                </button>
              )
            )}
          </div>
        </section>

        <section className={styles.grid}>
          {visibleTables.map((table) => (
            <article className={styles.card} key={table.id}>
              <div className={styles.cardHeader}>
                <div className={styles.tableCode}>{table.code}</div>
                <span data-status={table.status}>
                  {statusLabel(table.status)}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div>
                  <span>Zone</span>
                  <strong>{table.zone}</strong>
                </div>
                <div>
                  <span>Seats</span>
                  <strong>{table.seats}</strong>
                </div>
              </div>

              <div className={styles.qrPreview}>
                <div className={styles.fakeQr} aria-hidden="true">
                  {Array.from({ length: 36 }).map((_, index) => (
                    <i key={index} data-on={(index * 7 + table.code.charCodeAt(0)) % 5 < 2} />
                  ))}
                </div>
                <div>
                  <span>Ordering link</span>
                  <strong>?table={table.code}</strong>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button type="button" onClick={() => setQrTable(table)}>
                  QR
                </button>
                <button type="button" onClick={() => openEdit(table)}>
                  Edit
                </button>
                <button type="button" onClick={() => toggleEnabled(table)}>
                  {table.status === "DISABLED" ? "Enable" : "Disable"}
                </button>
                <button
                  className={styles.dangerButton}
                  type="button"
                  onClick={() => removeTable(table.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>

      {editor && (
        <div className={styles.backdrop}>
          <section className={styles.dialog}>
            <header>
              <div>
                <span>{editor.mode === "create" ? "New table" : "Edit table"}</span>
                <h2>{editor.code || "Untitled table"}</h2>
              </div>
              <button type="button" onClick={() => setEditor(null)}>×</button>
            </header>

            <div className={styles.dialogBody}>
              <label>
                <span>Table code</span>
                <input
                  value={editor.code}
                  placeholder="A01"
                  onChange={(event) =>
                    setEditor((current) =>
                      current
                        ? { ...current, code: event.target.value.toUpperCase() }
                        : current
                    )
                  }
                />
              </label>

              <div className={styles.twoCols}>
                <label>
                  <span>Seats</span>
                  <input
                    inputMode="numeric"
                    value={editor.seats}
                    onChange={(event) =>
                      setEditor((current) =>
                        current ? { ...current, seats: event.target.value } : current
                      )
                    }
                  />
                </label>

                <label>
                  <span>Status</span>
                  <select
                    value={editor.status}
                    onChange={(event) =>
                      setEditor((current) =>
                        current
                          ? {
                              ...current,
                              status: event.target.value as AdminTableStatus
                            }
                          : current
                      )
                    }
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="DISABLED">Disabled</option>
                  </select>
                </label>
              </div>

              <label>
                <span>Zone</span>
                <input
                  value={editor.zone}
                  placeholder="Main Hall"
                  onChange={(event) =>
                    setEditor((current) =>
                      current ? { ...current, zone: event.target.value } : current
                    )
                  }
                />
              </label>
            </div>

            <footer>
              <button type="button" onClick={() => setEditor(null)}>Cancel</button>
              <button
                className={styles.primaryButton}
                type="button"
                onClick={saveTable}
              >
                {editor.mode === "create" ? "Create table" : "Save changes"}
              </button>
            </footer>
          </section>
        </div>
      )}

      {qrTable && (
        <div className={styles.backdrop}>
          <section className={styles.qrDialog}>
            <header>
              <div>
                <span>Table QR</span>
                <h2>Table {qrTable.code}</h2>
              </div>
              <button type="button" onClick={() => setQrTable(null)}>×</button>
            </header>

            <div className={styles.qrLarge}>
              {Array.from({ length: 100 }).map((_, index) => (
                <i key={index} data-on={(index * 11 + qrTable.code.charCodeAt(0)) % 7 < 3} />
              ))}
            </div>

            <p>Scan to order from Table {qrTable.code}</p>
            <code>{origin}/?table={qrTable.code}</code>

            <div className={styles.qrActions}>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard?.writeText(
                    `${origin}/?table=${qrTable.code}`
                  )
                }
              >
                Copy link
              </button>
              <button
                type="button"
                onClick={() =>
                  window.open(`/?table=${encodeURIComponent(qrTable.code)}`, "_blank")
                }
              >
                Open customer page
              </button>
            </div>

            <small>
              QR artwork is UI preview for now. A real downloadable QR image will
              be wired in after the UI structure is complete.
            </small>
          </section>
        </div>
      )}
    </main>
  );
}
