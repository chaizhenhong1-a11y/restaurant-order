import { AdminLoginForm } from "@/features/auth/components/admin-login-form";
import styles from "@/features/auth/components/admin-auth.module.css";

export default function AdminLoginPage() {
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
          <p>Back office</p>
          <h1>Run the restaurant from one place.</h1>
          <p>
            Orders, menu, tables, kitchen, analytics and staff access are
            designed to work together in one professional operating system.
          </p>
        </div>

        <div className={styles.heroFooter}>
          Restaurant Order · Admin Portal · Demo UI
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.card}>
          <header className={styles.cardHeader}>
            <p className={styles.eyebrow}>Secure access</p>
            <h2>Sign in</h2>
            <p>Choose a demo role and continue into the matching workspace.</p>
          </header>

          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
