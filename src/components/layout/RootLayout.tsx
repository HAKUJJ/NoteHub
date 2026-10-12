import { Outlet } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'
import AuthModal from '../auth/AuthModal'

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
    </div>
  )
}
