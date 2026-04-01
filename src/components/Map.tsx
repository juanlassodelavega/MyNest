import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface LatLng {
  lat: number;
  lng: number;
}

export interface MarkerData {
  position: LatLng;
  name: string;
  type: "veterinary" | "shop" | "park" | "grooming";
}

interface MapProps {
  markers: MarkerData[];
  center: LatLng;
  zoom: number;
  setCenter: (center: LatLng) => void;
}

function MapEvents({ setCenter }: { setCenter: (center: LatLng) => void }) {
  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      const c = map.getCenter();
      setCenter({ lat: c.lat, lng: c.lng });
    },
  });
  return null;
}

const getIcon = (type: MarkerData["type"]) => {
  switch (type) {
    case "veterinary":
      return new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    case "shop":
      return new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    case "park":
      return new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    case "grooming":
      return new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    default:
      return new L.Icon.Default();
  }
};

export default function Map({ markers, center, zoom, setCenter }: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: 12,
        marginBottom: 16,
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {markers.map((m, i) => (
        <Marker key={i} position={m.position} icon={getIcon(m.type)}>
          <Popup>{m.name}</Popup>
        </Marker>
      ))}
      <MapEvents setCenter={setCenter} />
    </MapContainer>
  );
}
