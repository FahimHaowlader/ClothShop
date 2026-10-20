
import { createBrowserRouter, RouterProvider,Navigate } from 'react-router'
import './App.css'


// Layouts
import MainLayout from './layouts/MainLayout.jsx'


// pages
import Shop from './pages/Shop.jsx'
import Product from './pages/Product.jsx'
import Profile from './pages/Profile.jsx'
import Orders from './pages/Orders.jsx'
import Bag from './pages/Bag.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Privacy from './pages/Privacy.jsx'
import Size from './pages/Size.jsx'
import CheckOut from './pages/CheckOut.jsx'
import Addresses from './pages/Addresses.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element:<MainLayout /> ,
    children: [
      { path: '/', element: <Navigate to="/home" replace /> },
      { path: 'home', element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'product', element: <Product /> },
      { path: 'profile', element: <Profile /> },
      { path: 'orders', element: <Orders /> },
      { path: 'bag', element: <Bag /> },
      { path: 'about-us', element: <About /> },
      { path: 'privacy-policy', element: <Privacy /> },
      { path: 'size-guide', element: <Size /> },
      { path: 'check-out', element: <CheckOut /> },
      { path: 'addresses', element: <Addresses /> },
    ],
  },
   { path : '*', element: <h2>404 Not Found</h2> },
])

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}

