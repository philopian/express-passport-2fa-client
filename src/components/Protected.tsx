import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Protected({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  // Jotai session storage it too slow so going straight to the source
  const storedObject = JSON.parse(sessionStorage.getItem('accessToken'))

  useEffect(() => {
    if (!storedObject) navigate('/login')
  }, [])

  return <>{children}</>
}
