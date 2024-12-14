import { React, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import stock from '../../../../webscraping/stock_names.json';
import futures from '../../../../webscraping/futures_names.json';
import crypto from '../../../../webscraping/crypto_names.json';
import { Context } from '../../context/context';
import './StockSearch.css'

const StockSearch = () => {

  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const {stockSelect, setStock} = useContext(Context)

  const updateStock = async (selectedStock) => {
    try {
        await axios.post('/update', {
          stock: selectedStock.acronym,
          isCrypto: selectedStock.category
        },{
          headers: {
              'Content-Type': 'application/json',
          }
      });
    } catch (err) {
        console.error(err);
    }
  };

  const stockList = [
    ...Object.entries(stock).map(([symbol, name]) => ({ symbol, name, category: 'Stock' })),
    ...Object.entries(futures).map(([symbol, name]) => ({ symbol, name, category: 'Futures' })),
    ...Object.entries(crypto).map(([symbol, name]) => ({ symbol, name, category: 'Crypto' })),
  ];

  useEffect(() => {
    setFilteredData(stockList.slice(0, 11));
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      let filtered = stockList.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.symbol.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 11);
      setFilteredData(filtered);
      if (filtered.length === 0) {
        setFilteredData([{ name: "None Found", symbol: "Search Again" }]);
      }
    } else {
      setFilteredData(stockList.slice(0, 11));
    }
  };

  const handleItemClick = async (item) => {
    const selectedStock = {
      stock: item.name,
      acronym: item.symbol,
      category: item.category,
    };

    setQuery(item.name + ' (' + item.symbol + ')');
    setFilteredData([]);
    await updateStock(selectedStock)
  };

  return (
    <div className="search-container">
      <h1>Select Stock</h1>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search stocks..."
        className="search-input"
      />
      {filteredData.length > 0 && (
        <div className="dropdown">
          {filteredData.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setStock({
                  stock: item.name,
                  acronym: item.symbol,
                  category: item.category
                });
                handleItemClick(item);
              }}
              className="dropdown-item"
            >
              {item.name} ({item.symbol})
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StockSearch