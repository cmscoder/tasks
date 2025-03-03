import { ChangeEvent, FormEvent, useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import styles from './styles.module.css';
import { GetServerSideProps } from 'next';

import { db } from '../../services/firebaseConnection';
import { doc, collection, query, where, getDoc, addDoc, getDocs } from 'firebase/firestore';
import { userAgent } from 'next/server';
import { Textarea } from '@/components/textarea';
import { FaTrash } from 'react-icons/fa';

interface TaskProps {
  item: {
    task: string;
    created: string;
    public: boolean;
    user: string;
    taskId: string;
  };
  allComments: CommentProps[];
}

interface CommentProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
}

export default function Task({ item, allComments }: TaskProps) {
  const { data: session } = useSession();

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<CommentProps[]>(allComments || []);

  async function handleComment(event: FormEvent) {
    event.preventDefault();

    if (comment === '') {
      return;
    }

    if (!session?.user?.email || !session?.user?.name) return;

    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        comment: comment,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item.taskId,
      });

      const data = {
        id: docRef.id,
        comment: comment,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      };

      setComments((oldItems) => [...oldItems, data]);
      setComment('');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Task Details</title>
      </Head>

      <main className={styles.main}>
        <h1>Task</h1>
        <article className={styles.task}>
          <p>{item.task}</p>
        </article>
      </main>

      <section className={styles.commentsContainer}>
        <h2>Let comments</h2>
        <form onSubmit={handleComment}>
          <Textarea
            placeholder="Type your comments"
            value={comment}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setComment(event.target.value)}
          />
          <button className={styles.button} disabled={!session?.user}>
            Send your comment
          </button>
        </form>
      </section>
      <section className={styles.commentsContainer}>
        <h2>All comments</h2>
        {comments.length === 0 && <span>No comments yet</span>}

        {comments.map((item) => (
          <article key={item.id} className={styles.comment}>
            <div className={styles.headComment}>
              <label className={styles.commentsLabel}>{item.name}</label>
              {item.user === session?.user?.email && (
                <button className={styles.buttonTrash}>
                  <FaTrash size={18} color="#EA3140" />
                </button>
              )}
            </div>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  const docRef = doc(db, 'tasks', id);
  const q = query(collection(db, 'comments'), where('taskId', '==', id));
  const snapshotComments = await getDocs(q);

  let allComments: CommentProps[] = [];
  snapshotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      user: doc.data().user,
      name: doc.data().name,
      taskId: doc.data().taskId,
    });
  });

  const snapshot = await getDoc(docRef);

  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const miliseconds = snapshot.data()?.created?.seconds * 1000;

  const task = {
    task: snapshot.data()?.task,
    created: new Date(miliseconds).toLocaleDateString(),
    public: snapshot.data()?.public,
    user: snapshot.data()?.user,
    taskId: id,
  };

  return {
    props: {
      item: task,
      allComments: allComments,
    },
  };
};
