"use client";

import { useMemo, useState } from "react";
import type { CartLine, CartSelection } from "@/features/cart/types/cart";
import type { MenuItem } from "@/features/menu/types/menu";
import styles from "./item-customizer.module.css";

type ItemCustomizerProps = {
  item: MenuItem;
  onClose: () => void;
  onAdd: (line: CartLine) => void;
};

export function ItemCustomizer({
  item,
  onClose,
  onAdd
}: ItemCustomizerProps) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};

    item.optionGroups?.forEach((group) => {
      if (group.required && group.choices[0]) {
        initial[group.id] = [group.choices[0].id];
      }
    });

    return initial;
  });

  const selections = useMemo<CartSelection[]>(() => {
    const result: CartSelection[] = [];

    item.optionGroups?.forEach((group) => {
      const groupSelection = selected[group.id] ?? [];

      groupSelection.forEach((choiceId) => {
        const choice = group.choices.find((entry) => entry.id === choiceId);

        if (choice) {
          result.push({
            groupId: group.id,
            groupLabel: group.label,
            choiceId: choice.id,
            choiceLabel: choice.label,
            priceDelta: choice.priceDelta ?? 0
          });
        }
      });
    });

    return result;
  }, [item.optionGroups, selected]);

  const unitPrice = useMemo(
    () =>
      item.price +
      selections.reduce((total, selection) => total + selection.priceDelta, 0),
    [item.price, selections]
  );

  function toggleChoice(
    groupId: string,
    choiceId: string,
    multiple = false
  ) {
    setSelected((current) => {
      if (!multiple) {
        return {
          ...current,
          [groupId]: [choiceId]
        };
      }

      const currentGroup = current[groupId] ?? [];
      const exists = currentGroup.includes(choiceId);

      return {
        ...current,
        [groupId]: exists
          ? currentGroup.filter((id) => id !== choiceId)
          : [...currentGroup, choiceId]
      };
    });
  }

  function submit() {
    const id = [
      item.id,
      ...selections.map((entry) => `${entry.groupId}:${entry.choiceId}`),
      note.trim()
    ].join("|");

    onAdd({
      id,
      item,
      quantity,
      note: note.trim(),
      selections,
      unitPrice
    });
  }

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={`Customize ${item.name}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div
          className={styles.hero}
          style={{ backgroundImage: `url("${item.imageUrl}")` }}
        >
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.titleRow}>
            <div>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
            </div>
            <strong>RM {item.price.toFixed(2)}</strong>
          </div>

          <div className={styles.options}>
            {item.optionGroups?.map((group) => (
              <div className={styles.optionGroup} key={group.id}>
                <div className={styles.optionHeading}>
                  <div>
                    <h3>{group.label}</h3>
                    <span>
                      {group.multiple ? "Choose any" : "Choose one"}
                    </span>
                  </div>
                  {group.required && <em>Required</em>}
                </div>

                <div className={styles.choiceList}>
                  {group.choices.map((choice) => {
                    const active = (selected[group.id] ?? []).includes(choice.id);

                    return (
                      <button
                        type="button"
                        key={choice.id}
                        className={
                          active
                            ? `${styles.choice} ${styles.choiceActive}`
                            : styles.choice
                        }
                        onClick={() =>
                          toggleChoice(group.id, choice.id, group.multiple)
                        }
                      >
                        <span
                          className={
                            group.multiple
                              ? styles.checkbox
                              : styles.radio
                          }
                          aria-hidden="true"
                        >
                          {active ? "✓" : ""}
                        </span>

                        <span className={styles.choiceLabel}>
                          {choice.label}
                        </span>

                        {(choice.priceDelta ?? 0) > 0 && (
                          <small>
                            + RM {(choice.priceDelta ?? 0).toFixed(2)}
                          </small>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.noteSection}>
            <label htmlFor={`note-${item.id}`}>Special request</label>
            <textarea
              id={`note-${item.id}`}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Example: sauce on the side, no onion..."
              maxLength={160}
            />
            <small>{note.length}/160</small>
          </div>

          <div className={styles.footer}>
            <div className={styles.stepper}>
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <strong>{quantity}</strong>
              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={styles.addButton}
              onClick={submit}
            >
              Add to order
              <strong>RM {(unitPrice * quantity).toFixed(2)}</strong>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
