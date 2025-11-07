import { useState } from "react";
import Map from "../../components/Map";

export default function Dashboard() {
  const [markers, setMarkers] = useState<any[]>([]);

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 16 }}>
      <h1 style={{ textAlign: "center", marginBottom: 16 }}>Mi Dashboard</h1>
      <Map markers={markers} setMarkers={setMarkers} />
      <div style={{ paddingTop: 16 }}>
        <h2>Mis Mascotas</h2>
        <ul>
          {markers.map((marker, i) => (
            <li key={i}>
              Mascota en Lat: {marker.lat.toFixed(4)}, Lng: {marker.lng.toFixed(4)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
