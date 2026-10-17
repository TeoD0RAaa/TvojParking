/*
  Резервации — три режими:
  - 'firebase': Firestore (frontend/src/utils/firebase.js) → сите корисници гледаат исти резервации, во живо,
                работи и на GitHub Pages без наш сервер
  - 'server'  : FastAPI backend-от (папка backend/) е вклучен → исти резервации за сите на таа мрежа
  - 'local'   : ништо од горното → резервациите се чуваат во прелистувачот (демо режим)
  Апликацијата сама проверува кој режим да го користи (detectMode), по тој редослед.
*/
import { localApi } from './localApi.js'
import { isServerUp, serverApi } from './serverApi.js'
import { firebaseApi, isFirebaseUp } from './firebaseApi.js'

export { GRACE_MIN, isActive, graceMinutesLeft, mineOnly, qrPayload } from './reservation.js'
export { isServerUp } from './serverApi.js'

export const detectMode = async () => {
  if (await isFirebaseUp()) return 'firebase'
  return (await isServerUp()) ? 'server' : 'local'
}

const APIS = { firebase: firebaseApi, server: serverApi, local: localApi }
export const getApi = (mode) => APIS[mode] || localApi
