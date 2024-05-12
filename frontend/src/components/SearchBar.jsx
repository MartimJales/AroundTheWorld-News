import { useRef, useState } from "react";
import { useMap } from "react-leaflet";
import Icon from "../common/Icon";
// import { feed } from "../mocks/mock";
import { useLayers } from "../contexts/LayersContext";

function SearchBar() {
    const { points } = useLayers();
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
        const news = points;
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
        const obj = points.find(obj => obj.id === cityName);
        map.flyTo([obj.lat, obj.lng], 8)
        setQueryResults([]);
        inputRef.current.value = city;
    };

    return (
        <div className='fixed h-8 w-[300px] z-[1000] top-2 right-2 flex bg-slate-300 rounded-sm'>
            <input onClick={e => e.stopPropagation()} ref={inputRef} onChange={handleSearch} className='grow px-2 py-1 bg-transparent outline-none'
                type="text" />
            <div className='flex items-center justify-center h-full w-8'><Icon icon="search" /></div>

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
                    <button className="w-full" onClick={(e) => {
                        e.stopPropagation();
                        handleSelectResult(e.target.value)
                    }}>
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

export default SearchBar;