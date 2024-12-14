import { React, useContext, useState, useEffect } from 'react'
import { Context } from '../../context/context'
import axios from 'axios'
import toast from 'react-hot-toast'
import './BuySellStock.css'

const BuySellStock = () => {
  const {isBuy, setBuy} = useContext(Context)
  const {isSell, setSell} = useContext(Context)
  const {stockSelect} = useContext(Context)
  const [latestClosePrice, setLatestClosePrice] = useState(null);
  const [stockAmount, setStockAmount] = useState(1)  
  const [chartData, setChartData] = useState([])
  const [cost, setCost] = useState(null)

  const loadStockData = async (stock) => {
    try {
      const data = await import(`../../../Data/${stock}_data.json`);
      setChartData(data.default);
    } catch (error) {
      console.error("Error loading stock data:", error);
      setChartData([]);
    }
  };

  useEffect(() => {
    if (stockSelect.acronym) {
      loadStockData(stockSelect.acronym);
      const latestClose = chartData[chartData.length - 1]?.close
      setCost(latestClose)
      setLatestClosePrice(latestClose)
    }
  }, [stockSelect.acronym]);

  console.log(cost)

  const handlePriceChange = (e) => {
    const regex = /^\d+\.?\d{0,2}$/;

    const value = e.target.value;
    console.log(regex.test(value))
    if (regex.test(value)) {
      setCost(value);
      setStockAmount((value / latestClosePrice).toFixed(5));
    }
  }
  const handleUnitChange = (e) => {
    const regex = /^(\d*\.{0,1}\d*)$/;

    const value = e.target.value;
    if (regex.test(value)) {
      setStockAmount(value);
      setCost((value * latestClosePrice).toFixed(2));
    }
  }

  const buyStock = async (stock, amount, price) => {
    try {
        const response = await axios.put('/buy', {
          stock: stock,
          amount: amount,
          cost: price
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        console.log(response)
        if (!response) {
            toast.error("No response")
            return
        }
        
        if (response.error) {
            toast.error(response.error);
            return;
        }

        toast.success(response.data.message);
    } catch (err) {
        console.error('Error updating balance:', err);
        toast.error(err.response.data.error);
    }
  };

  const sellStock = async (stock, amount, price) => {
    try {
        const response = await axios.put('/sell', {
          stock: stock,
          amount: amount,
          cost: price
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        console.log(response)
        if (!response) {
            toast.error("No response")
            return
        }
        
        if (response.error) {
            toast.error(response.error);
            return;
        }

        toast.success(response.data.message);
    } catch (err) {
        toast.error(err.response.data.error);
    }
  };


  return (
    <div className="buysell-container">
        <div className="top-buttons">
          <p className={`left ${isBuy ? 'active' : ''}`} onClick={()=>{ setBuy(true); setSell(false);}}>Buy <span className='name'>Stock Price</span></p>
          <p className={`right ${isSell ? 'active' : ''}`} onClick={()=>{ setBuy(false); setSell(true);}}>Sell <span className='name'>Stock Price</span></p>
        </div>
        <div className="inputs">
          <div className="Input-Container">
            <p>Price</p>
            <input className="PriceInput" placeholder={latestClosePrice} value={cost} onChange={handlePriceChange}/>
          </div>
          <div className="Input-Container">
            <p>Units</p>
            <input className="UnitInput" placeholder='1' value={stockAmount} onChange={handleUnitChange}/>
          </div>
        </div>
        <div className="buysell">
          <button onClick={()=>{
            isBuy ? buyStock(stockSelect.stock, stockAmount, cost) :
            sellStock(stockSelect.stock, stockAmount, cost)
          }}>Buy or Sell</button>
        </div>
    </div>
  )
}

export default BuySellStock