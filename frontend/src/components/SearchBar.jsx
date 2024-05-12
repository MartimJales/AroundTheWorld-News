import { useState } from "react";
import Icon from "../common/Icon";

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
        <div className='fixed h-10 w-[300px] z-[1000] top-4 right-4 flex bg-slate-100 rounded-sm'>
            <input onChange={handleSearch} className='grow px-2 py-1 bg-transparent outline-none' type="text" />
            <button className='flex items-center justify-center h-full w-8'><Icon icon="search" /></button>

            {queryResults.length > 0 && (
                <div className='fixed w-[300px] top-11 right-2 p-2 h-[200px] overflow-y-scroll bg-slate-300 rounded-sm'>
                    {queryResults.map(result => (
                        <div>{result}</div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchBar;