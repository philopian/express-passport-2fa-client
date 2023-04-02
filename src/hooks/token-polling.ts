import { useAtom } from 'jotai'
import { useState, useEffect } from 'react'

import { accessTokenStorage, refreshTokenStorage } from '../store'
import { getRequest } from '../util/request'

type TimerProps = {
  isTokenPollingRunning: boolean
  startTokenPolling: () => void
  stopTokenPolling: () => void
}

function useFetchNewTokens() {
  const [, setAccessToken] = useAtom(accessTokenStorage)
  const [currentRefreshToken, setRefreshToken] = useAtom(refreshTokenStorage)

  const fetchNewTokens = async () => {
    console.log('🔐 [FETCH TOKENS]')
    // Get new accessToken/refreshToken
    const { accessToken, refreshToken } = await getRequest({
      token: currentRefreshToken,
      route: '/auth/refresh',
    })

    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
  }

  return { fetchNewTokens }
}

export function useTokenPolling(): TimerProps {
  const [timerId, setTimerId] = useState<number | null>(null)
  const [isTokenPollingRunning, setIsTokenPollingRunning] = useState<boolean>(false)
  const { fetchNewTokens } = useFetchNewTokens()

  const pollingInterval = 14 * 60 * 1000 // 14 minutes in milliseconds
  // const pollingInterval = 60 * 1000 // 1 minute in milliseconds

  const startTokenPolling = () => {
    if (!isTokenPollingRunning) {
      const id = setInterval(() => {
        fetchNewTokens()
      }, pollingInterval)
      setTimerId(id)
      setIsTokenPollingRunning(true)
    }
  }

  const stopTokenPolling = () => {
    if (isTokenPollingRunning) {
      clearInterval(timerId!)
      setTimerId(null)
      setIsTokenPollingRunning(false)
    }
  }

  useEffect(() => {
    return () => {
      stopTokenPolling()
    }
  }, [])

  return { isTokenPollingRunning, startTokenPolling, stopTokenPolling }
}
