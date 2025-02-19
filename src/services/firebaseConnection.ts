import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCTDlEyT4pFrjVfpVBg4anWvZtOXiAPM-s',
  authDomain: 'tasksproject-c9cd3.firebaseapp.com',
  projectId: 'tasksproject-c9cd3',
  storageBucket: 'tasksproject-c9cd3.firebasestorage.app',
  messagingSenderId: '995145582768',
  appId: '1:995145582768:web:c92118d993388977209375',
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };
