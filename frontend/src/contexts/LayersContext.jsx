import { useEffect, useState } from 'react'
import { icon } from 'leaflet'
import { createContext, useContext } from 'react'
import Spinner from '../common/Spinner'

const LayerContext = createContext()

const layers_default = [
    {
        id: "default",
        name: "All",
        icon: "map",
        active: true,
        color: "orange"
    },
    {
        id: "trends",
        name: "Trends",
        icon: "stacked_line_chart",
        active: false,
        color: "blue"
    },
    {
        id: "business",
        name: "Business",
        icon: "newspaper",
        active: false,
        color: "blue"
    },
    {
        id: "politics",
        name: "Politics",
        icon: "person",
        active: false,
        color: "blue"
    },
    {
        id: "health",
        name: "Health",
        icon: "health_metrics",
        active: false,
        color: "blue"
    },
    {
        id: "science",
        name: "Science",
        icon: "labs",
        active: false,
        color: "blue"
    },
    {
        id: "sports",
        name: "Sports",
        icon: "sports_basketball",
        active: false,
        color: "blue"
    },
    {
        id: "crime",
        name: "Crime",
        icon: "gavel",
        active: false,
        color: "blue"
    }
]

const getLayer = (layers, id) => {
    return layers.find(l => l.id === id)
}

function LayersContext({ children }) {
    const [loading, setLoading] = useState(true)
    const [layers, setLayers] = useState([...layers_default])
    const [points, setPoints] = useState([])
    const [feedPoints, setFeedPoints] = useState([])
    const [news, setNews] = useState([])

    /** Initial Load - (All Feed) */
    useEffect(() => {
        fetch("/api/feed")
            .then(res => res.json())
            .then(({ NEWS }) => {
                setPoints(NEWS)
                setFeedPoints(NEWS)
            })
            .catch(err => {
                setPoints([])
                setFeedPoints([])
            })
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        console.log("Layers State", layers)

        if (getLayer(layers, "default").active) {
            setPoints([...feedPoints])
            return
        }

        const layersString = layers.reduce((acc, layer) => {
            if (layer.active && layer.id !== "default") {
                acc.push(layer.id);  // Add the id to the accumulator array
            }
            return acc;
        }, []).join(",");

        console.log("Layers String", layersString)
        setPoints([])
        fetch(`/api/feed?layers=${layersString}`)
            .then(res => res.json())
            .then(({ NEWS }) => {
                setPoints(NEWS)
            })
            .catch(err => {
                setPoints([])
            })
    }, [layers])

    const handleToggleLayer = (layer) => {
        console.log("Toggling layer", layer)

        if (layer === "default") {
            setLayers(old => {
                return old.map((l) => {
                    if (l.id === layer) {
                        return { ...l, active: true }
                    }
                    return { ...l, active: false }
                })
            })
        } else {
            setLayers(old => {
                return old.map((l) => {
                    if (l.id === layer) {
                        console.log("Inner Layer", l)
                        return { ...l, active: !l.active }
                    }
                    if (l.id === "default") {
                        return { ...l, active: false }
                    }
                    return { ...l };
                })
            })
        }
    }

    return (
        <LayerContext.Provider value={{ layers, handleToggleLayer, points, setPoints, news, setNews, setLoading }}>
            {loading
                ? <Spinner />
                : children}
        </LayerContext.Provider>
    )
}

export default LayersContext

export const useLayers = () => useContext(LayerContext)