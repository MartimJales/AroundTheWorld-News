import {Circle, MapContainer, TileLayer, useMapEvents, useMap} from 'react-leaflet'
import {useDataFetcher} from './contexts/DataFetcher';
import {useEffect, useRef, useState} from 'react';
import Icon from './common/Icon';
import {feed} from "./mocks/mock";

const TIME_THRESHOLD = 5_000;
const LISBON = [38.7223, -9.1393]

const LAYERS = ["NEWS", "TRENDS"]

function LayerRenderer({data}) {
    return (
        <>
            {data.map((layer) => {
                return (
                    <Circle
                        key={layer.id}
                        center={[layer.lat, layer.lng]}
                        pathOptions={{color: "orange"}}
                        radius={layer.radius}
                    />
                )
            })}
        </>
    )
}

function MapWrapper({children, setHoverPoint}) {
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
            // console.log("Bounds", map.getBounds())
        },
        mousemove: (e) => {
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

function App() {
    const {data} = useDataFetcher();
    const [activeLayers, setActiveLayers] = useState(LAYERS);
    const [hoverPoint, setHoverPoint] = useState(null)

    const handleLayerChange = (layer) => {
        setActiveLayers()
    }

    useEffect(() => {

    }, [])

    return (
        <>
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
                        return layerData && <LayerRenderer key={layer} data={layerData}/>
                    })}
                    <SearchBar/>
                    <div className='z-[2000] fixed bottom-0 left-0 h-14 bg-gray-100 p-6'>
                        Point: Lat: {hoverPoint?.lat}, Lng:{hoverPoint?.lng}
                    </div>

                </MapWrapper>
            </MapContainer>
            L
        </>
    );
}

export default App;
