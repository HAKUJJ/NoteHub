import { Outlet } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'
import AuthModal from '../auth/AuthModal'

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto w-full max-w-7xl flex-1 px-4">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
    </div>
  )
}
