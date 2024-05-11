import { Circle, MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet'
import Floating from './components/Floating';
import Spinner from './components/Spinner';
import { useDataFetcher } from './contexts/DataFetcher';
import { useEffect, useState } from 'react';
import cities from './mocks/cities'
import Icon from './common/Icon';

const TIME_THRESHOLD = 5_000;
const LISBON = [38.7223, -9.1393]

const LAYERS = ["NEWS", "TRENDS"]

function LayerRenderer({ data }) {
  return (
    <>
      {data.map((layer) => {
        return (
          <Circle
            key={layer.id}
            center={[layer.lat, layer.lng]}
            pathOptions={{ color: "orange" }}
            radius={layer.radius}
          />
        )
      })}
    </>
  )
}

function MapWrapper({ children, setHoverPoint }) {
  const [time, setTime] = useState(() => Date.now())


  const uploadData = (position) => {
    const remaining = (Date.now() - time);
    if (remaining > TIME_THRESHOLD) {
      console.log("Uploading data", position)
      setTime(Date.now())
    } else {
      console.log("Did not upload data")
    }
  }

  const map = useMapEvents({
    click: (e) => {
      uploadData(e.latlng)
      console.log("Bounds", map.getBounds())
    },
    mousemove: (e) => {
      console.log("Mouseover", e.latlng)
      setHoverPoint(e.latlng)
    }
  })

  return (
    <>
      {children}
    </>
  )
}

function SearchBar() {
  const [queryResults, setQueryResults] = useState([])

  const handleSearch = (e) => {
    fetch("/query", {
      method: "POST",
      body: JSON.stringify({ query: e.target.value })
    })
      .then(res => res.json())
      .then(data => setQueryResults(data))
      .catch(err => console.log(err))

    // TODO implement 
    console.log("Searching for", e.target.value);
  };

  return (
    <div className='fixed h-8 w-[300px] z-[1000] top-2 right-2 flex bg-slate-300 rounded-sm'>
      <input onChange={handleSearch} className='grow px-2 py-1 bg-transparent outline-none' type="text" />
      <button className='flex items-center justify-center h-full w-8'><Icon icon="search" /></button>

      {queryResults.length > 0 && (
        <div className='fixed w-[300px] top-11 right-2 p-2 h-[200px] overflow-y-scroll bg-slate-300 rounded-sm'>
          {/* Generate search results */}
          {queryResults.map(result => (
            <div>{result}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function App() {
  const { data } = useDataFetcher();
  const [activeLayers, setActiveLayers] = useState(LAYERS);
  const [hoverPoint, setHoverPoint] = useState(null)

  const handleLayerChange = (layer) => {
    setActiveLayers()
  }

  useEffect(() => {

  }, [])

  return (
    <>
      <SearchBar />
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
          {data && activeLayers.map((layer) => {
            const layerData = data[layer];
            console.log(layerData)
            return layerData && <LayerRenderer key={layer} data={layerData} />
          })}

          <div className='z-[2000] fixed bottom-0 left-0 h-14 bg-gray-100 p-6'>
            Point: Lat: {hoverPoint?.lat}, Lng:{hoverPoint?.lng}
          </div>
        </MapWrapper>
      </MapContainer >
      L
    </>
  );
}

export default App;
