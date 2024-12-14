import { React, useEffect } from 'react'
import AccountInfo from '../../components/AccountInfo/AccountInfo'
import Main from '../../components/Navbar/Navbar'
import AccountGraph from '../../components/AccountGraph/AccountGraph'
import './ProfilePage.css'

const ProfilePage = () => {
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
    <div className="Container-Profile">
        <div className="main"><Main /></div>
        <AccountInfo />
        <div className="graph"><AccountGraph /></div>
        <div className="cursor"></div>
    </div>
  )
}

export default ProfilePage