import { StrictMode, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import './index.css'
import { Login, Profile, Signup, store, Electronics, Grocery, Clothing, ProductDetail, Cart, Layout, Home, Ordersummary } from './index.js'
import { fetchCurrentUser } from './redux/authActions';
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/ordersummary" element={<Ordersummary/>} />
        <Route path="/electronics" element={<Electronics/>} />
        <Route path="/grocery" element={<Grocery/>} />
         <Route path="/profile" element={<Profile/>} />
        <Route path="/clothing" element={<Clothing/>} />
        <Route path="/product/:id" element={<ProductDetail/>} />
      </Route>
    </>
  )
)

function AuthBootstrapper({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  return children;
}
// HydrationGate blocks rendering until hydration is complete
// HydrationGate: shows skeleton UI (no text) while auth hydration runs
function HydrationGate({ children }) {
  const isHydrating = useSelector((state) => state.auth.isHydrating);
  if (isHydrating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start pt-24 px-6 md:px-10">
        {/* Banner skeleton */}
        <div className="w-full max-w-6xl">
          <div className="relative w-full h-50 md:h-70 overflow-hidden rounded-2xl border border-black/5 bg-gray-200 shadow-md animate-pulse" />
        </div>
        {/* Featured cards skeleton row */}
        <div className="w-full max-w-7xl mt-8">
          <div className="flex gap-4 md:gap-6 min-w-max animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-45 md:w-60 shrink-0 bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
                <div className="w-full h-45 md:h-55 bg-gray-200" />
                <div className="p-4 md:p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-9 bg-gray-200 rounded-lg w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return children;
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthBootstrapper>
        <HydrationGate>
          <RouterProvider router={router} />
        </HydrationGate>
      </AuthBootstrapper>
    </Provider>
  </StrictMode>
)
