import Link from 'next/link';
import styles from './styles.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href={'/'}>
            <h1 className={styles.logo}>
              Tasks <span>+</span>
            </h1>
          </Link>
          <Link href="/dashboard" className={styles.dashboardLink}>
            My dashboard
          </Link>
        </nav>
        <button className={styles.loginButton}>Access</button>
      </section>
    </header>
  );
}
