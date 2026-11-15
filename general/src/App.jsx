import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { RouterProvider ,createBrowserRouter} from 'react-router'

import './App.css'


import Home from './pages/Home'
import Staff from './Pages/Staff'
import Order from './pages/Order'
import Myorder from './pages/Myorder'
import Inventory from './pages/Inventory'
import Refund from './pages/Refund'
import Analytics from './pages/Analytics'
import Discount from './pages/Discount'
import Damage from './pages/Damage'
import Coupon from './pages/Coupon'

import MainLayout from './layouts/MainLayout'

const router = createBrowserRouter([
  { path: '/', element: <MainLayout /> ,children:[ 
  {path:'/staff',element:<Staff />},
  // {path:'/inventory',element:<Inventory />},
  {path:'/refund',element:<Refund />},
  {path:'/analytics',element:<Analytics />},
  {path:'/inventory',element:<Inventory />},
  {path:'/order',element:<Order />},
  {path:'/myorder',element:<Myorder />},
  {path:'/discount',element:<Discount />},
  {path:'/damage',element:<Damage />},
  {path:'/coupon',element:<Coupon />},
  {path:'/dashboard',element:<Home />},
  ]
},
  {path:'*',element:<h1>404 Not Found</h1>}

])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
