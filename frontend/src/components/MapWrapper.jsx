import { useState } from "react";
import { useMapEvents } from "react-leaflet";

const TIME_THRESHOLD = 5_000;

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
            // console.log("Bounds", map.getBounds())
        },
        mousemove: (e) => {
            // console.log("Mouseover", e.latlng)
            setHoverPoint(e.latlng)
        }
    })

    return (
        <>
            {children}
        </>
    )
}

export default MapWrapper;