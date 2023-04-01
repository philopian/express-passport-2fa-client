import { createBrowserRouter, Outlet } from 'react-router-dom'

import Nav from './components/Nav'
import QRCode from './components/QRCode'
import Register from './components/Register'
import Auth from './pages/Auth'
import Landing from './pages/Landing'
import Welcome from './pages/Welcome'

function NavbarWrapper() {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  )
}

const routes = createBrowserRouter([
  {
    path: '/',
    element: <NavbarWrapper />,
    children: [
      {
        path: '/', // yes, again
        element: <Landing />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/login',
        element: <Auth />,
      },
      {
        path: '/qr',
        element: <QRCode />,
      },
      {
        path: '/welcome',
        element: <Welcome />,
      },
    ],
  },
])
export default routes
