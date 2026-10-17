/*
  Резервации — два режими:
  - 'server': FastAPI backend-от (папка backend/) е вклучен → сите корисници гледаат исти резервации
  - 'local' : backend-от не е вклучен → резервациите се чуваат во прелистувачот (демо режим)
  Апликацијата сама проверува кој режим да го користи (detectMode).
*/
import { localApi } from './localApi.js'
import { isServerUp, serverApi } from './serverApi.js'

export { GRACE_MIN, isActive, graceMinutesLeft, mineOnly, qrPayload } from './reservation.js'

export const detectMode = async () => ((await isServerUp()) ? 'server' : 'local')

export const getApi = (mode) => (mode === 'server' ? serverApi : localApi)
