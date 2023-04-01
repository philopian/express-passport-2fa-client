import { atom } from 'jotai'

const store = {
  mfaToken: atom(''),
  accessToken: atom(''),
  refreshToken: atom(''),
}
export default store
