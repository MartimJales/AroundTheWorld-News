import { MapContainer, TileLayer } from 'react-leaflet'
import { useState } from 'react';
import LayerRenderer from './components/LayerRenderer';
import MapWrapper from './components/MapWrapper';
import SearchBar from './components/SearchBar';
import CategoriesBar from './components/CategoriesBar';
import CityNews from './components/CityNews';

const LISBON = [38.7223, -9.1393]

function App() {
    const [hoverPoint, setHoverPoint] = useState(null)

    return (
        <>
            <CityNews />
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
                        Lat: {hoverPoint?.lat.toFixed(4)}, Lng: {hoverPoint?.lng.toFixed(4)}, City: {hoverPoint?.city}
                    </div>
                </MapWrapper>
            </MapContainer >
        </>
    );
}

export default App;
