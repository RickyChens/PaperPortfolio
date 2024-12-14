import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { UserContextProvider } from '../context/userContext'
import Home from './Pages/Home/Home'
import LoginPage from './Pages/LoginPage/LoginPage'
import Error404 from './Pages/Error404/Error404'
import StockPage from './Pages/StockPage/StockPage'
import GraphPage from './Pages/GraphPage/GraphPage'
import ProfilePage from './Pages/ProfilePage/ProfilePage'

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true

function App() {

  return (
    <UserContextProvider>
      <BrowserRouter>
        <Toaster position='bottom-right' toastOptions={{duration: 2000}} />
        <Routes>
          <Route index element={ <Home/> } />
          <Route path="/home" element={ <Home/> } />
          <Route path="/login" element={ <LoginPage/> } />
          <Route path="/stocks" element={ <StockPage/> } />
          <Route path='/graph' element={ <GraphPage/> } />
          <Route path='/profile' element={ <ProfilePage/> } />
          <Route path="*" element={ <Error404/> } />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  )
}

export default App
