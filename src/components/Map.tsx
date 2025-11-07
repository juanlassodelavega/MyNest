import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Importar iconos de Leaflet usando import para TypeScript
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configurar icono por defecto
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Map({ markers, setMarkers }: any) {
  const [center, setCenter] = useState({ lat: 40.4168, lng: -3.7038 }); // Madrid por defecto

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log("No se pudo obtener ubicación, usando Madrid por defecto");
        }
      );
    }
  }, []);

  function ClickHandler() {
    useMapEvents({
      click(e) {
        setMarkers([...markers, e.latlng]);
      },
    });
    return null;
  }

  return (
    <MapContainer center={center} zoom={12} style={{ width: "100%", height: "400px", marginBottom: "16px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {markers.map((m: any, i: number) => (
        <Marker key={i} position={m} />
      ))}
      <ClickHandler />
    </MapContainer>
  );
}
