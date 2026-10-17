/*
  Firebase (Firestore) — заеднички резервации без наш сервер, работи и на GitHub Pages.
  Овие вредности НЕ се тајни: секоја веб-апликација со Firebase ги праќа во прелистувачот.
  Базата ја штитат правилата во firestore.rules (во root на репото).
*/
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDyMvNG_8AyxtLdbZo6eQ6LOc9ZIdpdNco',
  authDomain: 'tvojparkking.firebaseapp.com',
  projectId: 'tvojparkking',
  storageBucket: 'tvojparkking.firebasestorage.app',
  messagingSenderId: '622023514613',
  appId: '1:622023514613:web:8460d28812c89f205d68bc',
}

export const db = getFirestore(initializeApp(firebaseConfig))
