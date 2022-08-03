import './App.css';
import React, { useState, useEffect} from 'react';
import { Chart } from "react-google-charts";

export const options = {
  chart: {
    title: "Box Office Earnings in First Two Weeks of Opening",
    subtitle: "in millions of dollars (USD)",
  },
};
function App() {

  const pages = ["General Chart Visualization", "Data Table", "Geo Visualization"];
  const [page,SetPage] = useState(0)  

  const poiHeader = ["Id","Name","Latitude","Longitude"];
  const [poiTable,SetPoiTable] = useState(null)
  const [filteredPoi,SetFilteredPoi] = useState(null)
  
  const [poiGeo,SetPoiGeo] = useState(null)

  const [hourlyEvent,SetHourlyEvent] = useState(null)
  const [dailyEvent,SetDailyEvent] = useState(null)
  const visuals = ["Line", "Bar", "LineChart", "BarChart"];
  const [eventVisual,SetEventVisual] = useState("Line")  
  const [eventVisualSelected,SetEventVisualSelected] = useState(0)  
  
  useEffect(() => {
    hourlyEvent === null && fetch('/events/hourly').then(response => response.json()).then(data => {
      let array = [["Date","Events","Hour"]];
      data.forEach(element => {
        array.push([(new Date(element.date)).toDateString(),parseInt(element.events),element.hour])
      });
      SetHourlyEvent(array)
    });
  }, [hourlyEvent]);

  useEffect(() => {
    dailyEvent === null && fetch('/events/daily').then(response => response.json()).then(data => {
      let array = [["Date","Events"]];
      data.forEach(element => {
        array.push([(new Date(element.date)).toDateString(),parseInt(element.events)])
      });
      SetDailyEvent(array)
    });
  }, [dailyEvent]);

  useEffect(() => {
    poiTable === null && fetch('/poi').then(response => response.json()).then(data => {
      let arrTable = [];
      let arrGeo = [['Lat', 'Long', 'Name']];
      data.forEach(element => {
        arrTable.push([{ v: element.poi_id, f: element.poi_id.toString(), p: {style: ''} },{ v: element.name, f: element.name, p: {style: ''} },{ v: element.lat, f: element.lat.toString(), p: {style: ''} },{ v: element.lon, f: element.lon.toString(), p: {style: ''} } ]);

        arrGeo.push([element.lat , element.lon , element.name]);
      });
      SetFilteredPoi(arrTable)
      SetPoiTable(arrTable)
      SetPoiGeo(arrGeo)
    });
  }, [poiTable]);
  function searchFunc(val){
    poiTable.forEach(element => {
      element.forEach(item => {
        item.p.style = "";
      });
    });
    let filteredArr = poiTable.filter( element =>{ return element[0].f.includes(val) || element[1].f.toLowerCase().includes(val) || element[2].f.includes(val) || element[3].f.includes(val) });
    let unfilteredArr = poiTable.filter( element =>{ return !element[0].f.includes(val) && !element[1].f.toLowerCase().includes(val) && !element[2].f.includes(val) && !element[3].f.includes(val) });
    filteredArr.length > 0 && SetFilteredPoi(() => {
      let temp = [...filteredArr];
      if(val.length > 0){
        [...temp].forEach(element => {
          element.forEach(item => {
            item.p.style = "background-color:#baff9d;";
          });
        });
      }
      return [...temp, ...unfilteredArr];
    });
  }
  return (
    <div className="App">
      <ul className="topNav">
        {
          pages.map((item , index)=>{
            return (
              <li key={index}>
                <input type="button" value={item} className={page === index ? "selectedButton" : ''} onClick={() => { SetPage(index) }}/>
              </li>
            )
          })
        }
      </ul>
      {
        page === 0 && <div>
        <ul className="leftNav">
        {
          visuals.map((item , index)=>{
            return (
              <li key={index}>
                <input type="button" value={item} className={eventVisualSelected === index ? "selectedButton" : ''} onClick={() => { SetEventVisual(item); SetEventVisualSelected(index); }}/>
              </li>
            )
          })
        }
      </ul>
      <div className="view">
      {
        dailyEvent && <Chart chartType={eventVisual} width="100%" height="400px" data={dailyEvent} options={{
          chart: {
            title: "Events Daily"
          },
        }} />
      }
      <br /><br />
      {
        hourlyEvent && <Chart chartType={eventVisual} width="100%" height="400px" data={hourlyEvent} options={{
          chart: {
            title: "Events Hourly"
          },
        }} />
      }  
      </div> 
        </div>
      }
      {
        page === 1 && poiTable && poiTable.length && <div className='view noNav'>
          <input type="text" placeholder='Search here...' onChange={(e)=>{ searchFunc(e.target.value.toLowerCase()) }}/>
          <Chart chartType="Table" width="100%" height="100%" data={[poiHeader , ...filteredPoi]} options={{
            showRowNumber: false, 
            allowHtml: true,
          }} />
        </div>
      }
      {
        page === 2 && poiTable && poiTable.length && <div className='view noNav'>
          <input type="text" placeholder='Search here...' onChange={(e)=>{ searchFunc(e.target.value.toLowerCase()) }}/>
          <Chart chartType="GeoChart" width="100%" height="100%" data={poiGeo} options={{
            region: "CA",
            displayMode: 'markers',
            colorAxis: {colors: ['green', 'blue']},
            backgroundColor: "#81d4fa",
            datalessRegionColor: "#f3f3f3",
            geochartVersion: 11,
            resolution : "provinces",
            tooltip: {showColorCode: true , trigger : "selection"},
            magnifyingGlass : {enable: true, zoomFactor: 15},
            explorer : true
          }} />
        </div>
      }
    </div>
  );
}

export default App;
