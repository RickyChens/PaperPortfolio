import React, { useContext, useEffect } from 'react'
import Login from '../../components/Login/Login'
import Register from '../../components/Register/Register'
import './LoginPage.css'
import ContextProvider, { Context } from '../../context/context'
import Particle from '../../components/Particles/particles'

const LoginPage = () => {
  const {isLogin} = useContext(Context)
  console.log(isLogin)
  
  useEffect(() => {
    const mouseMove = e => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
    }

    window.addEventListener("mousemove", mouseMove)

    return () => {
      window.removeEventListener("mousemove", mouseMove)
    } 
  }, [])

  return (
    <>
      <Particle color="#ff0000" size={3} />
      <div className='Login-Container'>
          { 
            isLogin ? <Login></Login> : 
            <Register></Register>
          }
      </div>
      <div className="cursor"></div>
    </>
  )
}

export default LoginPage