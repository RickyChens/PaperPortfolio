import React, { useEffect, useRef, useState } from 'react'
import Main from '../../components/Navbar/Navbar'
import StockDisplay from '../../components/StockDisplay/StockDisplay'
import CryptoDisplay from '../../components/StockDisplay/CryptoDisplay'
import FuturesDisplay from '../../components/StockDisplay/FuturesDisplay'
import Particle from '../../components/Particles/particles'
import "./StockPage.css"

const StockPage = () => {

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
    <div className="Container">
        <Particle />
        <div className="navbar"><Main /></div>
        <h1>Stocks</h1>
        <div className="stockContainer">
          <StockDisplay/>
          <CryptoDisplay />
          <FuturesDisplay />
        </div>
        <div className="cursor"></div>
    </div>
  )
}

export default StockPage