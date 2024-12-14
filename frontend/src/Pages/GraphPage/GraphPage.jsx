import { React, useEffect, useContext, useState } from 'react'
import {
  StockChartComponent, StockChartSeriesCollectionDirective, StockChartSeriesDirective, Inject, DateTime, Tooltip,
  RangeTooltip, Crosshair, LineSeries, SplineSeries, CandleSeries, HiloOpenCloseSeries, HiloSeries, RangeAreaSeries,
  Trendlines
} from '@syncfusion/ej2-react-charts';
import {
  EmaIndicator, RsiIndicator, BollingerBands, TmaIndicator, MomentumIndicator, SmaIndicator, AtrIndicator,
  AccumulationDistributionIndicator, MacdIndicator, StochasticIndicator, Export, Border
} from '@syncfusion/ej2-react-charts';
//import { chartData } from '../../../Data/data'
import Main from '../../components/Navbar/Navbar';
import StockSearch from '../../components/StockSearch/StockSearch';
import BuySellStock from '../../components/BuySellStock/BuySellStock';
import { Context } from '../../context/context';
import './GraphPage.css';

const GraphPage = () => {
  const {stockSelect} = useContext(Context)
  const [chartData, setChartData] = useState([])

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
    }
  }, [stockSelect.acronym]);

  useEffect(() => {
    const bootstrap5Dark = document.createElement('link');
    bootstrap5Dark.href = "https://cdn.syncfusion.com/ej2/27.1.48/bootstrap5.3-dark.css";
    bootstrap5Dark.rel = "stylesheet";
    bootstrap5Dark.id = "bootstrap5.3-dark.css";
    
    const bootstrap3 = document.createElement('link');
    bootstrap3.href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    bootstrap3.rel = "stylesheet";

    document.head.appendChild(bootstrap5Dark);
    document.head.appendChild(bootstrap3);

    return () => {
      document.head.removeChild(bootstrap5Dark);
      document.head.removeChild(bootstrap3);
    };
  }, []);

  const load = (args) => {
    let selectedTheme = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Tailwind';
    args.stockChart.theme = (selectedTheme.charAt(0).toUpperCase() +
        selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i, 'Contrast');
  };

  return (
    <div className="Graph-Container">
      <div className="main">
        <Main />
      </div>
      <div className="graph-middle-container">
        <div className="graph" style={{ width: 'calc(100% - 300px)' }}>
          <StockChartComponent key={stockSelect.stock + " (" + stockSelect.acronym + ")"} title={stockSelect.stock + " (" + stockSelect.acronym + ")"} crosshair={{ enable: true, lineType: 'Both' }}
            primaryYAxis={{ lineStyle: { color: 'transparent' }, majorTickLines: { color: 'transparent', height: 1 } }} 
            primaryXAxis={{ crosshairTooltip: { enable: true }, majorGridLines: { width: 0 }, valueType: 'DateTime' }}
            border={{width: 0}}
            tooltip={{ enable: true }}
            titleStyle={{
              color: 'white',
            }}
            height='800px'
            load={load.bind(this)}
          >
            <StockChartSeriesCollectionDirective>
              <StockChartSeriesDirective type='Candle' dataSource={chartData} xName='x'/>
            </StockChartSeriesCollectionDirective>
            <Inject services={[DateTime, Tooltip, RangeTooltip, Crosshair, LineSeries, SplineSeries, CandleSeries, HiloOpenCloseSeries,
              HiloSeries, RangeAreaSeries, Trendlines, EmaIndicator, RsiIndicator, BollingerBands, TmaIndicator, MomentumIndicator,
              SmaIndicator, AtrIndicator, Export, AccumulationDistributionIndicator, MacdIndicator, StochasticIndicator]} />
          </StockChartComponent>
        </div>
        <div className="right-side">
          <BuySellStock />
          <StockSearch />
        </div>
      </div>
    </div>
  )
}

export default GraphPage