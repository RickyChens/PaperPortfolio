import React, { useEffect, useState } from 'react'
import './AccountGraph.css'
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject,
         LineSeries, Legend, DateTime, Tooltip, AnnotationsDirective, AnnotationDirective, ChartAnnotation, 
         Highlight } from '@syncfusion/ej2-react-charts';
import axios from 'axios'
import toast from 'react-hot-toast'
import { Browser } from '@syncfusion/ej2-base';

const AccountGraph = () => {
  const [data, setData] = useState([{ x: new Date(2012, 6, 11), y: 13.5 }, { x: new Date(2013, 6, 11), y: 12.4 }, { x: new Date(2014, 6, 11), y: 12.7 }, 
    { x: new Date(2015, 6, 11), y: 12.5 }, { x: new Date(2016, 6, 11), y: 12.7 }, { x: new Date(2017, 6, 11), y: 13.7 }, 
    { x: new Date(2018, 6, 11), y: 13.4 }, { x: new Date(2019, 6, 11), y: 12.9 }, { x: new Date(2020, 6, 11), y: 11.0 }])
  
  useEffect (() => {
    const getGraph = async () => {
      try {
          const response = await axios.get('/profile', {},
          {
              withCredentials: true,
          });
  
          if (!response) {
              toast.error("No response")
              return
          }
          const history = response.data.history;
          const dynamicData = history.map(item => ({
            x: new Date(item.date),
            y: Number(item.balance.$numberDecimal)
          }));
  
          setData(dynamicData)
      
      } catch (err) {
          toast.error(err.response.data.error);
      }
    };
    getGraph();
  })
  
  return (
    <div>
        <ChartComponent id="charts" style={{ textAlign: 'center' }} primaryXAxis={{ valueType: 'DateTime', edgeLabelPlacement: 'Shift', majorGridLines: { width: 0 }, labelFormat: 'y' }}>
            <Inject services={[LineSeries, DateTime, Legend, Tooltip, Highlight]} />
            <SeriesCollectionDirective>
                <SeriesDirective dataSource={data} xName="x" yName="y" name="Portfolio History" width={1} marker={{ visible: true, width: 3, height: 3, shape: 'Circle', isFilled: true }} type="Line"></SeriesDirective>
            </SeriesCollectionDirective>
        </ChartComponent>
    </div>
  )
}

export default AccountGraph