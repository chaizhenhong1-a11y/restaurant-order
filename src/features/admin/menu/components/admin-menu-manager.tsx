"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  demoAdminMenuCategories,
  demoAdminMenuItems
} from "@/features/admin/menu/data/demo-admin-menu";
import type {
  AdminMenuCategory,
  AdminMenuItem,
  AdminMenuItemInput,
  AdminMenuOptionGroup
} from "@/features/admin/menu/types/admin-menu";
import styles from "./admin-menu-manager.module.css";

type MenuPayload = {
  demoMode?: boolean;
  categories: AdminMenuCategory[];
  items: AdminMenuItem[];
};

type EditorMode = "create" | "edit";

type EditorState = {
  mode: EditorMode;
  itemId?: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  categoryId: string;
  isAvailable: boolean;
  isPopular: boolean;
  optionGroups: AdminMenuOptionGroup[];
};

function makeLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyEditor(categories: AdminMenuCategory[]): EditorState {
  return {
    mode: "create",
    name: "",
    description: "",
    imageUrl: "",
    price: "0.00",
    categoryId: categories[0]?.id ?? "",
    isAvailable: true,
    isPopular: false,
    optionGroups: []
  };
}

function editorFromItem(item: AdminMenuItem): EditorState {
  return {
    mode: "edit",
    itemId: item.id,
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl,
    price: item.price.toFixed(2),
    categoryId: item.categoryId,
    isAvailable: item.isAvailable,
    isPopular: item.isPopular,
    optionGroups: item.optionGroups.map((group) => ({
      ...group,
      choices: group.choices.map((choice) => ({ ...choice }))
    }))
  };
}

function toPayload(editor: EditorState): AdminMenuItemInput {
  return {
    name: editor.name.trim(),
    description: editor.description.trim(),
    imageUrl: editor.imageUrl.trim(),
    price: Number(editor.price),
    categoryId: editor.categoryId,
    isAvailable: editor.isAvailable,
    isPopular: editor.isPopular,
    optionGroups: editor.optionGroups.map((group) => ({
      label: group.label.trim(),
      required: group.required,
      multiple: group.multiple,
      choices: group.choices.map((choice) => ({
        label: choice.label.trim(),
        priceDelta: Number(choice.priceDelta) || 0
      }))
    }))
  };
}

export function AdminMenuManager() {
  const [categories, setCategories] = useState(demoAdminMenuCategories);
  const [items, setItems] = useState(demoAdminMenuItems);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [demoMode, setDemoMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [categoryModal, setCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  async function loadMenu() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/menu", {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Menu API unavailable");
      }

      const result = (await response.json()) as MenuPayload;

      setCategories(result.categories);
      setItems(result.items);
      setDemoMode(Boolean(result.demoMode));
    } catch {
      setCategories(demoAdminMenuCategories);
      setItems(demoAdminMenuItems);
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMenu();
  }, []);

  const visibleItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const categoryMatch =
        activeCategory === "all" || item.categoryId === activeCategory;

      const searchMatch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);

      return categoryMatch && searchMatch;
    });
  }, [items, activeCategory, search]);

  function addOptionGroup() {
    setEditor((current) =>
      current
        ? {
            ...current,
            optionGroups: [
              ...current.optionGroups,
              {
                id: makeLocalId("group"),
                label: "New option",
                required: false,
                multiple: false,
                choices: [
                  {
                    id: makeLocalId("choice"),
                    label: "Option 1",
                    priceDelta: 0
                  }
                ]
              }
            ]
          }
        : current
    );
  }

  function updateGroup(
    groupId: string,
    updater: (group: AdminMenuOptionGroup) => AdminMenuOptionGroup
  ) {
    setEditor((current) =>
      current
        ? {
            ...current,
            optionGroups: current.optionGroups.map((group) =>
              group.id === groupId ? updater(group) : group
            )
          }
        : current
    );
  }

  function removeGroup(groupId: string) {
    setEditor((current) =>
      current
        ? {
            ...current,
            optionGroups: current.optionGroups.filter(
              (group) => group.id !== groupId
            )
          }
        : current
    );
  }

  function addChoice(groupId: string) {
    updateGroup(groupId, (group) => ({
      ...group,
      choices: [
        ...group.choices,
        {
          id: makeLocalId("choice"),
          label: `Option ${group.choices.length + 1}`,
          priceDelta: 0
        }
      ]
    }));
  }

  function removeChoice(groupId: string, choiceId: string) {
    updateGroup(groupId, (group) => ({
      ...group,
      choices: group.choices.filter((choice) => choice.id !== choiceId)
    }));
  }

  function updateChoice(
    groupId: string,
    choiceId: string,
    patch: Partial<{ label: string; priceDelta: number }>
  ) {
    updateGroup(groupId, (group) => ({
      ...group,
      choices: group.choices.map((choice) =>
        choice.id === choiceId ? { ...choice, ...patch } : choice
      )
    }));
  }

  async function saveEditor() {
    if (!editor) return;

    const payload = toPayload(editor);

    if (!payload.name) {
      setMessage("Dish name is required.");
      return;
    }

    if (!Number.isFinite(payload.price) || payload.price < 0) {
      setMessage("Please enter a valid price.");
      return;
    }

    if (!payload.categoryId) {
      setMessage("Please choose a category.");
      return;
    }

    setSaving(true);
    setMessage("");

    if (demoMode) {
      const categoryName =
        categories.find((category) => category.id === payload.categoryId)?.name ??
        "Category";

      const localItem: AdminMenuItem = {
        id: editor.itemId ?? makeLocalId("dish"),
        ...payload,
        categoryName,
        optionGroups: payload.optionGroups.map((group) => ({
          id: makeLocalId("group"),
          ...group,
          choices: group.choices.map((choice) => ({
            id: makeLocalId("choice"),
            ...choice
          }))
        }))
      };

      setItems((current) =>
        editor.mode === "create"
          ? [localItem, ...current]
          : current.map((item) =>
              item.id === editor.itemId ? localItem : item
            )
      );

      setEditor(editorFromItem(localItem));
      setMessage(
        editor.mode === "create"
          ? "Dish created locally in Demo mode."
          : "Changes saved locally in Demo mode."
      );
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(
        editor.mode === "create"
          ? "/api/admin/menu"
          : `/api/admin/menu/${encodeURIComponent(editor.itemId ?? "")}`,
        {
          method: editor.mode === "create" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const result = (await response.json()) as
        | AdminMenuItem
        | { message?: string };

      if (!response.ok || !("id" in result)) {
        throw new Error(
          "message" in result && result.message
            ? result.message
            : "Unable to save dish."
        );
      }

      setItems((current) =>
        editor.mode === "create"
          ? [result, ...current]
          : current.map((item) =>
              item.id === result.id ? result : item
            )
      );

      setEditor(editorFromItem(result));
      setMessage(editor.mode === "create" ? "Dish created." : "Changes saved.");
      await loadMenu();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save dish."
      );
    } finally {
      setSaving(false);
    }
  }

  async function createCategory() {
    const name = newCategoryName.trim();

    if (!name) return;

    if (demoMode) {
      const category: AdminMenuCategory = {
        id: makeLocalId("category"),
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        itemCount: 0
      };

      setCategories((current) => [...current, category]);
      setNewCategoryName("");
      setCategoryModal(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      });

      const result = (await response.json()) as
        | AdminMenuCategory
        | { message?: string };

      if (!response.ok || !("id" in result)) {
        throw new Error(
          "message" in result && result.message
            ? result.message
            : "Unable to create category."
        );
      }

      setCategories((current) => [...current, result]);
      setNewCategoryName("");
      setCategoryModal(false);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to create category."
      );
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
          <Link className={styles.navItem} href="/admin/orders">Orders</Link>
          <Link className={`${styles.navItem} ${styles.navItemActive}`} href="/admin/menu">Menu</Link>
          <Link className={styles.navItem} href="/admin/tables">Tables</Link>
          <Link className={styles.navItem} href="/kitchen">Kitchen</Link>
        </nav>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Catalogue</p>
            <h1>Menu management</h1>
            <p>Create dishes, categories, pricing and customisation rules.</p>
          </div>

          <div className={styles.actions}>
            {demoMode && <span className={styles.demoBadge}>Demo mode</span>}
            <button type="button" onClick={() => void loadMenu()}>
              {loading ? "Loading..." : "Refresh"}
            </button>
            <button type="button" onClick={() => setCategoryModal(true)}>
              + Category
            </button>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => {
                setEditor(emptyEditor(categories));
                setMessage("");
              }}
            >
              + New dish
            </button>
          </div>
        </header>

        <section className={styles.toolbar}>
          <div className={styles.search}>
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search dishes..."
            />
          </div>

          <div className={styles.categories}>
            <button
              className={activeCategory === "all" ? styles.categoryActive : ""}
              type="button"
              onClick={() => setActiveCategory("all")}
            >
              All <span>{items.length}</span>
            </button>

            {categories.map((category) => (
              <button
                className={
                  activeCategory === category.id ? styles.categoryActive : ""
                }
                type="button"
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name} <span>{category.itemCount}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.grid}>
          {visibleItems.map((item) => (
            <article className={styles.card} key={item.id}>
              <div
                className={styles.image}
                style={{
                  backgroundImage: item.imageUrl
                    ? `url("${item.imageUrl}")`
                    : undefined
                }}
              >
                <div className={styles.imageBadges}>
                  {item.isPopular && <span>Popular</span>}
                  {!item.isAvailable && <em>Unavailable</em>}
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardHeading}>
                  <div>
                    <span>{item.categoryName}</span>
                    <h2>{item.name}</h2>
                  </div>
                  <strong>RM {item.price.toFixed(2)}</strong>
                </div>

                <p>{item.description}</p>

                <div className={styles.optionSummary}>
                  <span>
                    {item.optionGroups.length} option group
                    {item.optionGroups.length === 1 ? "" : "s"}
                  </span>
                  {item.optionGroups.slice(0, 3).map((group) => (
                    <em key={group.id}>{group.label}</em>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.quickToggles}>
                    <button type="button" data-active={item.isAvailable}>
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </button>
                    <button type="button" data-active={item.isPopular}>
                      {item.isPopular ? "Popular" : "Standard"}
                    </button>
                  </div>

                  <button
                    className={styles.editButton}
                    type="button"
                    onClick={() => {
                      setEditor(editorFromItem(item));
                      setMessage("");
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </section>

      {editor && (
        <div className={styles.editorBackdrop}>
          <section className={styles.editor}>
            <header className={styles.editorHeader}>
              <div>
                <span>{editor.mode === "create" ? "New dish" : "Edit dish"}</span>
                <h2>{editor.name || "Untitled dish"}</h2>
              </div>
              <button
                type="button"
                onClick={() => !saving && setEditor(null)}
              >
                ×
              </button>
            </header>

            <div className={styles.editorBody}>
              <label>
                <span>Name</span>
                <input
                  value={editor.name}
                  onChange={(event) =>
                    setEditor((current) =>
                      current ? { ...current, name: event.target.value } : current
                    )
                  }
                />
              </label>

              <label>
                <span>Description</span>
                <textarea
                  value={editor.description}
                  onChange={(event) =>
                    setEditor((current) =>
                      current
                        ? { ...current, description: event.target.value }
                        : current
                    )
                  }
                />
              </label>

              <div className={styles.twoColumns}>
                <label>
                  <span>Price (RM)</span>
                  <input
                    value={editor.price}
                    inputMode="decimal"
                    onChange={(event) =>
                      setEditor((current) =>
                        current ? { ...current, price: event.target.value } : current
                      )
                    }
                  />
                </label>

                <label>
                  <span>Category</span>
                  <select
                    value={editor.categoryId}
                    onChange={(event) =>
                      setEditor((current) =>
                        current
                          ? { ...current, categoryId: event.target.value }
                          : current
                      )
                    }
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                <span>Image URL</span>
                <input
                  value={editor.imageUrl}
                  onChange={(event) =>
                    setEditor((current) =>
                      current
                        ? { ...current, imageUrl: event.target.value }
                        : current
                    )
                  }
                />
              </label>

              <div className={styles.switchRows}>
                <label>
                  <div>
                    <strong>Available</strong>
                    <span>Guests can order this dish.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editor.isAvailable}
                    onChange={(event) =>
                      setEditor((current) =>
                        current
                          ? { ...current, isAvailable: event.target.checked }
                          : current
                      )
                    }
                  />
                </label>

                <label>
                  <div>
                    <strong>Popular</strong>
                    <span>Show in the Popular section.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editor.isPopular}
                    onChange={(event) =>
                      setEditor((current) =>
                        current
                          ? { ...current, isPopular: event.target.checked }
                          : current
                      )
                    }
                  />
                </label>
              </div>

              <section className={styles.optionsBuilder}>
                <div className={styles.optionsBuilderHeader}>
                  <div>
                    <span>Customisation</span>
                    <strong>Option groups</strong>
                  </div>
                  <button type="button" onClick={addOptionGroup}>
                    + Add group
                  </button>
                </div>

                {editor.optionGroups.length === 0 && (
                  <div className={styles.noOptions}>
                    No customisation yet. Add Size, Spice level, Add-ons and more.
                  </div>
                )}

                {editor.optionGroups.map((group, groupIndex) => (
                  <article className={styles.optionEditor} key={group.id}>
                    <div className={styles.optionEditorTop}>
                      <strong>Group {groupIndex + 1}</strong>
                      <button
                        type="button"
                        onClick={() => removeGroup(group.id)}
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      value={group.label}
                      placeholder="Example: Size"
                      onChange={(event) =>
                        updateGroup(group.id, (current) => ({
                          ...current,
                          label: event.target.value
                        }))
                      }
                    />

                    <div className={styles.optionFlags}>
                      <label>
                        <input
                          type="checkbox"
                          checked={group.required}
                          onChange={(event) =>
                            updateGroup(group.id, (current) => ({
                              ...current,
                              required: event.target.checked
                            }))
                          }
                        />
                        Required
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={group.multiple}
                          onChange={(event) =>
                            updateGroup(group.id, (current) => ({
                              ...current,
                              multiple: event.target.checked
                            }))
                          }
                        />
                        Multiple choices
                      </label>
                    </div>

                    <div className={styles.choiceList}>
                      {group.choices.map((choice) => (
                        <div className={styles.choiceRow} key={choice.id}>
                          <input
                            value={choice.label}
                            placeholder="Option name"
                            onChange={(event) =>
                              updateChoice(group.id, choice.id, {
                                label: event.target.value
                              })
                            }
                          />
                          <input
                            value={String(choice.priceDelta)}
                            inputMode="decimal"
                            aria-label="Price add-on"
                            onChange={(event) =>
                              updateChoice(group.id, choice.id, {
                                priceDelta: Number(event.target.value) || 0
                              })
                            }
                          />
                          <button
                            type="button"
                            onClick={() => removeChoice(group.id, choice.id)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      className={styles.addChoiceButton}
                      type="button"
                      onClick={() => addChoice(group.id)}
                    >
                      + Add choice
                    </button>
                  </article>
                ))}
              </section>

              {message && <div className={styles.message}>{message}</div>}
            </div>

            <footer className={styles.editorFooter}>
              <button
                type="button"
                onClick={() => !saving && setEditor(null)}
              >
                Cancel
              </button>
              <button
                className={styles.saveButton}
                type="button"
                disabled={saving}
                onClick={() => void saveEditor()}
              >
                {saving
                  ? "Saving..."
                  : editor.mode === "create"
                    ? "Create dish"
                    : "Save changes"}
              </button>
            </footer>
          </section>
        </div>
      )}

      {categoryModal && (
        <div className={styles.categoryBackdrop}>
          <section className={styles.categoryDialog}>
            <h2>New category</h2>
            <p>Create a category for grouping dishes.</p>
            <input
              autoFocus
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="Example: Desserts"
            />
            <div>
              <button type="button" onClick={() => setCategoryModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void createCategory()}
              >
                Create category
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
