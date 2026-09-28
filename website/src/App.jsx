
import { createBrowserRouter, RouterProvider,Navigate } from 'react-router'
import './App.css'


// Layouts
import MainLayout from './layouts/MainLayout.jsx'


// Pages
import Shop from './Pages/Shop.jsx'
import Product from './Pages/Product.jsx'
import Profile from './Pages/Profile.jsx'
import Order from './Pages/Order.jsx'
import Cart from './Pages/Cart.jsx'
import Home from './Pages/Home.jsx'
import About from './Pages/About.jsx'
import Privacy from './Pages/Privacy.jsx'
import Size from './Pages/Size.jsx'
import CheckOut from './Pages/CheckOut.jsx'

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
      { path: 'order', element: <Order /> },
      { path: 'cart', element: <Cart /> },
      { path: 'about-us', element: <About /> },
      { path: 'privacy-policy', element: <Privacy /> },
      { path: 'size-guide', element: <Size /> },
      { path: 'checkout', element: <CheckOut /> },
    ],
  },
   { path : '*', element: <h2>404 Not Found</h2> },
])

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}

