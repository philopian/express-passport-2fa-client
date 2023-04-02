import { atomWithStorage, createJSONStorage } from 'jotai/utils'

const storage = createJSONStorage(() => sessionStorage)

// create atoms with storage to persist tokens in localStorage
export const mfaTokenStorage = atomWithStorage('mfaToken', null, storage)
export const accessTokenStorage = atomWithStorage('accessToken', null, storage)
export const refreshTokenStorage = atomWithStorage('refreshToken', null, storage)
