import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'

import { useTokenPolling } from '../hooks/token-polling'
import { mfaTokenStorage, accessTokenStorage, refreshTokenStorage } from '../store'
import { getRequest } from '../util/request'

export function useLogout() {
  const [, setMfaTokenStorage] = useAtom(mfaTokenStorage)
  const [accessToken, setAccessTokenStorage] = useAtom(accessTokenStorage)
  const [, setRefreshTokenStorage] = useAtom(refreshTokenStorage)
  const { stopTokenPolling } = useTokenPolling()
  const navigate = useNavigate()

  const logUserOut = async () => {
    setMfaTokenStorage(null)
    setAccessTokenStorage(null)
    setRefreshTokenStorage(null)

    if (accessToken) {
      try {
        // Get MFA token
        await getRequest({ token: accessToken, route: '/auth/logout' })

        // Cleanup
        navigate('/')

        // TODO: stop token-polling
        stopTokenPolling()
      } catch (error) {
        console.error({ code: 401, message: 'Unauthorized: failed logout' })
        navigate('/login')
        return
      }
    }
  }

  return { logUserOut }
}
