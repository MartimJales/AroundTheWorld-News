import { Circle, MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import Floating from './components/Floating';
import Spinner from './components/Spinner';
import { useDataFetcher } from './contexts/DataFetcher';
import { useState } from 'react';
import cities from './mocks/cities'

const TIME_THRESHOLD = 5_000;
const LISBON = [38.7223, -9.1393]

const LAYERS = ["NEWS", "TRENDS"]

function LayerRenderer({ data }) {
  return (
    <>
      {data.map((layer) => (
        <Circle
          key={layer.id}
          center={[cities[layer.city].lat, cities[layer.city].lng]}
          pathOptions={{ color: layer.color }}
          radius={layer.radius}
        />
      ))}
    </>
  )
}

function MapWrapper({ children }) {
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
    },
    move: () => {
      console.log("Moved", map.getBounds())
    },
  })

  return (
    <>
      {children}
    </>
  )
}


function App() {
  const { data } = useDataFetcher();
  const [activeLayers, setActiveLayers] = useState(LAYERS);

  const handleLayerChange = (layer) => {
    setActiveLayers()
  }

  return (
    <>
      <MapContainer
        className='fixed z-0 top-0 left-0 w-full h-full'
        center={LISBON}
        zoom={2}
        scrollWheelZoom={true}
        minZoom={2}
        maxZoom={7}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        <MapWrapper>
          {data && activeLayers.map((layer) => {
            const layerData = data[layer];
            console.log(layerData)
            return <LayerRenderer key={layer} data={layerData} />
          })}
        </MapWrapper>
      </MapContainer >
    </>
  );
}

export default App;
