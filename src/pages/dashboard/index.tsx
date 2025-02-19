import { GetServerSideProps } from 'next';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import styles from './styles.module.css';
import Head from 'next/head';

import { getSession } from 'next-auth/react';
import { Textarea } from '@/components/textarea';
import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';

import { db } from '../../services/firebaseConnection';

import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import Link from 'next/link';

interface HomeProps {
  user: {
    email: string;
  };
}

interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  task: string;
  user: string;
}

export default function Dashboard({ user }: HomeProps) {
  const [input, setInput] = useState('');
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  useEffect(() => {
    async function loadTasks() {
      const tasksRef = collection(db, 'tasks');
      const q = query(tasksRef, orderBy('created', 'desc'), where('user', '==', user?.email));

      onSnapshot(q, (snapshot) => {
        let list = [] as TaskProps[];

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            task: doc.data().task,
            created: doc.data().created.toDate(),
            public: doc.data().public,
            user: doc.data().user,
          });
        });
        setTasks(list);
      });
    }

    loadTasks();
  }, [user?.email]);

  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }

  async function handleRegisterTask(event: FormEvent) {
    event.preventDefault();

    if (input === '') return;
    try {
      await addDoc(collection(db, 'tasks'), {
        task: input,
        created: new Date(),
        user: user?.email,
        public: publicTask,
      });

      setInput('');
      setPublicTask(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/task/${id}`);
  }

  async function handleDeleteTask(id: string) {
    const docRef = doc(db, 'tasks', id);
    await deleteDoc(docRef);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>My dashboard</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>What's your task ? </h1>
            <form onSubmit={handleRegisterTask}>
              <Textarea
                placeholder="Type your task"
                value={input}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label>Do you want let the task as public ?</label>
              </div>
              <button type="submit" className={styles.button}>
                Add Task
              </button>
            </form>
          </div>
        </section>
        <section className={styles.taskContainer}>
          <h1>Dashboard Page</h1>
          {tasks.map((item) => (
            <article className={styles.task} key={item.id}>
              {item.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PUBLIC</label>
                  <button className={styles.shareButton} onClick={() => handleShare(item.id)}>
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}
              <div className={styles.taskContent}>
                {item.public ? (
                  <Link href={`/task/${item.id}`}>
                    <p>{item.task}</p>
                  </Link>
                ) : (
                  <p>{item.task}</p>
                )}

                <button className={styles.trashButton} onClick={() => handleDeleteTask(item.id)}>
                  <FaTrash size={24} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
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
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  };
};
