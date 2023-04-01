import { NavLink } from 'react-router-dom'

type NavCss = {
  isActive: boolean
  isPending: boolean
}

const navLinks = [
  { name: 'Home', route: '/' },
  { name: 'Register', route: '/register' },
  { name: 'Login', route: '/login' },
  { name: 'QR', route: '/qr' },
  { name: 'Welcome', route: '/welcome' },
]
export default function Nav() {
  const navCss = ({ isActive, isPending }: NavCss) =>
    isPending ? 'pending' : isActive ? 'active' : ''

  return (
    <>
      <nav>
        <ul>
          <li>
            <strong>Brand</strong>
          </li>
        </ul>
        <ul>
          {navLinks.map(({ name, route }) => (
            <li key={name + route}>
              <NavLink to={route} className={navCss}>
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
