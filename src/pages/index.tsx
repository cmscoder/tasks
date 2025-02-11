import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image';

import heroImg from '../../public/assets/hero.png';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tasks+ | Organise your taks an easiest way</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image className={styles.hero} alt="Task logo" src={heroImg} priority />
        </div>
        <h1 className={styles.title}>
          A system to organize your tasks <br />
          in the easiest way possible.
        </h1>

        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+12 posts</span>
          </section>
          <section className={styles.box}>
            <span>+90 comments</span>
          </section>
        </div>
      </main>
    </div>
  );
}
