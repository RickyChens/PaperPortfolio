import React from 'react'
import data from '../../../../webscraping/top10_cryptos.json'
import './StockDisplay.css'

const CryptoDisplay = () => {
  return (
    <div className="container">
        <h2>Crypto</h2>
        <ol className="List">
            <li>
                <a className='underline-bold'>Crypto</a>
                <span className='underline-bold'>Price</span>
            </li>
            {
                data.sort((a, b) => b.price_2002 - a.price_2002).slice(0, 10).map((data, i) => (
                        <li key={i}>
                            <a>{data.Name}</a>
                            <span>${data.Price}</span>
                        </li>
                ))
            }
        </ol>
    </div>
  )
}

export default CryptoDisplay