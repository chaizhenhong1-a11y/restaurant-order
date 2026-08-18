import { AdminForgotPasswordForm } from "@/features/auth/components/admin-forgot-password-form";
import styles from "@/features/auth/components/admin-auth.module.css";

export default function AdminForgotPasswordPage() {
  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>M</div>
          <div>
            <span>Restaurant OS</span>
            <strong>Mellow Kitchen</strong>
          </div>
        </div>

        <div className={styles.heroContent}>
          <p>Account recovery</p>
          <h1>Get back into your workspace.</h1>
          <p>
            The production system will send a secure time-limited password reset
            link. This screen is currently UI-only.
          </p>
        </div>

        <div className={styles.heroFooter}>
          Restaurant Order · Password Recovery · Demo UI
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.card}>
          <header className={styles.cardHeader}>
            <p className={styles.eyebrow}>Password recovery</p>
            <h2>Forgot password?</h2>
            <p>Enter your staff email to request a reset link.</p>
          </header>

          <AdminForgotPasswordForm />
        </div>
      </section>
    </main>
  );
}
