import { GetServerSideProps } from 'next';
import styles from './styles.module.css';
import Head from 'next/head';

import { getSession } from 'next-auth/react';

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <Head>
        <title>My dashboard</title>
      </Head>

      <h1>Dashboard Page</h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  // console.log('SESSION', session);

  if (!session?.user) {
    // If the user is not logged in, redirect to the login page
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
