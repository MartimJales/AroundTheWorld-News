import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import { useLayers } from "../contexts/LayersContext";

const TIME_THRESHOLD = 5_000;

function MapWrapper({ children, setHoverPoint }) {
    const { setNews, setLoading } = useLayers()
    const [time, setTime] = useState(() => Date.now())


    const uploadData = (e) => {
        setLoading(true)
        fetch(`/api/city?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
            .then(res => res.json())
            .then(currentCity => {
                console.log("Current City", currentCity.city)
                fetch(`/api/news?city=${currentCity.city}`)
                    .then(res => res.json())
                    .then(news => {
                        console.log("Position News", news)
                        setNews(news)
                    })
                    .catch(err => setNews([]))
                    .finally(() => setLoading(false))
            })
            .catch(err => {
                setNews([])
                setLoading(false)
            })
    }

    const map = useMapEvents({

        click: (e) => {
            console.log("Click", e.originalEvent.shiftKey)
            if (!e.originalEvent.shiftKey)
                return;
            console.log(e)
            uploadData(e)
        },
        mousemove: (e) => {
            // console.log("Mouseover", e.latlng)
            fetch(`/api/city?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
                .then(res => res.json())
                .then(data => {
                    setHoverPoint({ lat: e.latlng.lat, lng: e.latlng.lng, city: data.city })
                })
                .catch(err => {
                    setHoverPoint({ lat: e.latlng.lat, lng: e.latlng.lng, city: "" })
                })
        }
    })

    return (
        <>
            {children}
        </>
    )
}

export default MapWrapper;