import { Circle, MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import {useEffect, useRef, useState} from 'react';
import LayerRenderer from './components/LayerRenderer';
import MapWrapper from './components/MapWrapper';
import SearchBar from './components/SearchBar';
import CategoriesBar from './components/CategoriesBar';
import {feed} from "./mocks/mock";
import {useDataFetcher} from './contexts/DataFetcher';

const LISBON = [38.7223, -9.1393]

function App() {
  const [hoverPoint, setHoverPoint] = useState(null)

  return (
    <>
      <CategoriesBar />
      <MapContainer
        className='fixed z-0 top-0 left-0 w-full h-full'
        center={LISBON}
        zoom={2}
        scrollWheelZoom={true}
        minZoom={2.45}
        maxZoom={9}
        maxBounds={[[90, 180], [-90, -180]]}
      >
        <TileLayer
          className='z-0'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        <MapWrapper setHoverPoint={setHoverPoint}>
          <LayerRenderer />
          <SearchBar />
          <div className='z-[2000] fixed bottom-0 left-0 h-8 bg-gray-100 p-2 flex items-center'>
            Lat: {hoverPoint?.lat.toFixed(4)}, Lng: {hoverPoint?.lng.toFixed(4)}
          </div>
        </MapWrapper>
      </MapContainer >
    </>
  );

function SearchBar() {
    const map = useMap()
    const [queryResults, setQueryResults] = useState([]);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const handleSearch = (e) => {
        if (e.target.value === "") {
            setQueryResults([]);
            setError(null);
            return
        }
        console.log("Searching for", e.target.value);
        const news = feed.NEWS;
        var topResults = [];
        var results = [];
        for (var i = 0; i < news.length; i++) {
            const obj = news[i];
            if (obj.id.includes(e.target.value) || obj.city.includes(e.target.value)) {

                topResults.push(obj)
                results.push(obj.id + " - " + obj.country)
            }
            if (topResults.length > 5) {
                break;
            }
        }
        if (results.length === 0) {
            setError("No results found.");
            setQueryResults([]);
            return
        }

        setError(null)
        setQueryResults(results);
    };

    const handleSelectResult = (city) => {
        const cityName = city.split(" - ")[0];
        const obj = feed.NEWS.find(obj => obj.id === cityName);
        map.flyTo([obj.lat, obj.lng], 8)
        setQueryResults([]);
        inputRef.current.value = city;
    };

    return (
        <div className='fixed h-8 w-[300px] z-[1000] top-2 right-2 flex bg-slate-300 rounded-sm'>
            <input ref={inputRef} onChange={handleSearch} className='grow px-2 py-1 bg-transparent outline-none'
                   type="text"/>
            <button className='flex items-center justify-center h-full w-8'><Icon icon="search"/></button>

            {error && (
                <div className='fixed w-[300px] top-11 right-2 p-2 bg-red-500 text-white rounded-sm'>
                    {error}
                </div>
            )}

            {queryResults.length > 0 && (
                <div
                    className='fixed w-[300px] top-11 right-2 p-2 max-h-[200px] overflow-y-auto bg-slate-300 rounded-sm'
                >
                    {/* Generate search results */}
                    <button className="w-full" onClick={(e) => handleSelectResult(e.target.value)}>
                        {queryResults.map(result => (
                            <option key={result} value={result}
                                    className='text-left font-sans capitalize border-b border-slate-400'>{result}</option>
                        ))}
                    </button>
                </div>
            )}
        </div>
    )
}

export default App;
