import { atom } from 'jotai'

const store = {
  tempToken: atom(''),
  accessToken: atom(''),
  refreshToken: atom(''),
}
export default store
