import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { useLogout } from '../hooks/logout'
import { useTokenPolling } from '../hooks/token-polling'
import { accessTokenStorage } from '../store'
import { now } from '../util/time'

type NavCss = {
  isActive: boolean
  isPending: boolean
}
const navLoginLinks = [
  { name: 'Register', route: '/register' },
  { name: 'Login', route: '/login' },
  { name: 'QR', route: '/qr' },
]
const navLinks = [{ name: 'Welcome', route: '/welcome' }]

export default function Nav() {
  const { startTokenPolling, stopTokenPolling } = useTokenPolling()
  const [accessToken] = useAtom(accessTokenStorage)
  const isLoggedIn = !!accessToken

  useEffect(() => {
    if (accessToken) {
      console.log('🚀🚀🚀 ~ Polling ON!', now())
      startTokenPolling()
    } else {
      console.log('🛑🛑🛑 ~ Polling OFF!')
      stopTokenPolling()
    }
  }, [accessToken])

  // TODO: start/stop timmer
  // { isRunning, startTimer, stopTimer }
  const navCss = ({ isActive, isPending }: NavCss) =>
    isPending ? 'pending' : isActive ? 'active' : ''

  const { logUserOut } = useLogout()

  const handleLogout = () => {
    logUserOut()
  }

  return (
    <>
      <nav>
        <ul>
          <li>
            <strong>Brand</strong>
          </li>
        </ul>
        <ul>
          <>
            <li>
              <NavLink to="/" className={navCss}>
                Home
              </NavLink>
            </li>
          </>
          <>
            {!isLoggedIn &&
              navLoginLinks.map(({ name, route }) => (
                <li key={name + route}>
                  <NavLink to={route} className={navCss}>
                    {name}
                  </NavLink>
                </li>
              ))}
          </>
          <>
            {isLoggedIn &&
              navLinks.map(({ name, route }) => (
                <li key={name + route}>
                  <NavLink to={route} className={navCss}>
                    {name}
                  </NavLink>
                </li>
              ))}
          </>
          <>
            {isLoggedIn && (
              <li className="navLogout" onClick={handleLogout}>
                Logout
              </li>
            )}
          </>
        </ul>
      </nav>
    </>
  )
}
