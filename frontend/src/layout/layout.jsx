import { Header, Footer } from "../index"
import { Outlet, useLocation } from "react-router-dom"
import { useEffect } from "react"

const Layout = () => {
  const location = useLocation()

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    })
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-24 text-black">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
