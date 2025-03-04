import { GetStaticProps } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image';

import heroImg from '../../public/assets/hero.png';
import { db } from '../services/firebaseConnection';
import { collection, getDocs } from 'firebase/firestore';

interface HomeProps {
  posts: number;
  comments: number;
}

export default function Home({ posts, comments }: HomeProps) {
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
            <span>+{posts} posts</span>
          </section>
          <section className={styles.box}>
            <span>+{comments} comments</span>
          </section>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const commentRef = collection(db, 'comments');
  const postRef = collection(db, 'tasks');

  const commentSnapshot = await getDocs(commentRef);
  const postSnapshot = await getDocs(postRef);

  return {
    props: { posts: postSnapshot.size || 0, comments: commentSnapshot.size || 0 },
  };
};
