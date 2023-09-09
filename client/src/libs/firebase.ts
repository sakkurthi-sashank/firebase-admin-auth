import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'


// Example API KEYS
const firebaseConfig = {
  apiKey: 'AIzaSyCiJSetFgX0RWfT-4GfS05ik1MCxTn4eYQ',
  authDomain: 'code-space-86218.firebaseapp.com',
  projectId: 'code-space-86218',
  storageBucket: 'code-space-86218.appspot.com',
  messagingSenderId: '1036226695481',
  appId: '1:1036226695481:web:b272f6bbb5763b4d4ed8e8',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
