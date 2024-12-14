import React from 'react'
import data from '../../../../webscraping/top10_futures.json'
import './StockDisplay.css'

const FuturesDisplay = () => {
  return (
    <div className="container">
        <h2>Futures</h2>
        <ol className="List">
            <li>
                <a className='underline-bold'>Company</a>
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

export default FuturesDisplay