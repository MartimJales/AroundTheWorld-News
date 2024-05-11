import { createContext, useContext, useState } from 'react'
import Spinner from '../components/Spinner'
import useLoader from '../hooks/useLoader';

// import { feed } from '../mocks/mock'
// import { sleep } from '../util/functions';

const DataFetcherContext = createContext()

function DataFetcher({ children }) {
    const [data, setData] = useState(null);
    const { loading, setLoading } = useLoader();

    useState(async () => {
        fetch("/api/feed")
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))

        // await sleep(4000)

        // setData(feed)
        // setLoading(false)
    }, [])

    return (
        <DataFetcherContext.Provider value={{ data }}>
            {loading
                ? <Spinner />
                : children}
        </DataFetcherContext.Provider>
    )
}

export default DataFetcher

export const useDataFetcher = () => useContext(DataFetcherContext)