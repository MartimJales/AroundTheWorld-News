import { Circle } from "react-leaflet";
import { useLayers } from "../contexts/LayersContext";

function LayerRenderer() {
    const { points } = useLayers();

    return (
        <>
            {points.map((point) => {
                return (
                    <Circle
                        key={point.id}
                        center={[point.lat, point.lng]}
                        pathOptions={{ color: "orange" }}
                        radius={point.radius}
                    />
                )
            })}
        </>
    )
}

export default LayerRenderer;