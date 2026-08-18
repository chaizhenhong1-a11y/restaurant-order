"use client";

import { useState } from "react";
import styles from "./admin-auth.module.css";

export function AdminForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>✓</div>
        <h2>Check your inbox</h2>
        <p>
          If an account exists for <strong>{email}</strong>, a reset link would
          be sent there in the production system.
        </p>
        <a className={styles.submitButton} href="/admin/login">
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.field}>
        <label htmlFor="reset-email">Work email</label>
        <input
          id="reset-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@restaurant.com"
        />
      </div>

      <button className={styles.submitButton} type="submit">
        Send reset link
      </button>

      <a className={styles.backLink} href="/admin/login">
        ← Back to sign in
      </a>
    </form>
  );
}
