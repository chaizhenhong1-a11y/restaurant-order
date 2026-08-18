"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { demoLoginProfiles } from "@/features/auth/data/demo-login-profiles";
import type { DemoAdminRole } from "@/features/auth/types/admin-auth";
import styles from "./admin-auth.module.css";

export function AdminLoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<DemoAdminRole>("OWNER");
  const [email, setEmail] = useState("owner@mellowkitchen.demo");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const profile = useMemo(
    () => demoLoginProfiles.find((item) => item.role === role)!,
    [role]
  );

  function changeRole(nextRole: DemoAdminRole) {
    const next = demoLoginProfiles.find((item) => item.role === nextRole)!;
    setRole(nextRole);
    setEmail(next.email);
    setError("");
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    if (remember) {
      try {
        localStorage.setItem(
          "restaurant-order-demo-session",
          JSON.stringify({
            role,
            email: email.trim(),
            remember: true
          })
        );
      } catch {
        // Demo only.
      }
    }

    router.push(profile.landingPath);
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.field}>
        <label htmlFor="demo-role">Demo role</label>
        <select
          id="demo-role"
          value={role}
          onChange={(event) =>
            changeRole(event.target.value as DemoAdminRole)
          }
        >
          {demoLoginProfiles.map((item) => (
            <option key={item.role} value={item.role}>
              {item.label}
            </option>
          ))}
        </select>
        <small>
          Demo only · redirects to {profile.landingPath}
        </small>
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
          placeholder="you@restaurant.com"
        />
      </div>

      <div className={styles.field}>
        <div className={styles.passwordLabelRow}>
          <label htmlFor="password">Password</label>
          <a href="/admin/forgot-password">Forgot password?</a>
        </div>

        <div className={styles.passwordField}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            placeholder="Enter password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <label className={styles.rememberRow}>
        <input
          type="checkbox"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
        />
        <span>Remember me on this device</span>
      </label>

      {error && <div className={styles.error}>{error}</div>}

      <button className={styles.submitButton} type="submit">
        Sign in
      </button>

      <div className={styles.demoHint}>
        <strong>Demo password</strong>
        <span>Use any non-empty password while UI mode is active.</span>
      </div>
    </form>
  );
}
