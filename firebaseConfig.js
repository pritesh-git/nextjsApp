import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAo5EgtkTOr9RwwjJyPVgCzyZLMhFWUpG8',
  authDomain: 'nextcrud-156d9.firebaseapp.com',
  projectId: 'nextcrud-156d9',
  storageBucket: 'nextcrud-156d9.appspot.com',
  messagingSenderId: '594979488925',
  appId: '1:594979488925:web:bfd83f4b761eef0eadc074',
  measurementId: 'G-8TDFRXKLSE',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
