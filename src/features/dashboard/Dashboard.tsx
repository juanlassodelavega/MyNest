import { useEffect, useState, useRef } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Map from "../../components/Map";
import type { MarkerData } from "../../components/Map";

interface Pet {
  name: string;
  type: string;
  dob: string;
}

interface Place {
  id: string;
  name: string;
  type: MarkerData["type"];
  position: { lat: number; lng: number };
}

// Filtros
const PLACE_OPTIONS: { label: string; value: Place["type"] }[] = [
  { label: "Veterinarios", value: "veterinario" },
  { label: "Tiendas de mascotas", value: "tienda" },
  { label: "Parques", value: "parque" },
  { label: "Peluquería canina", value: "peluqueria" },
];

// Función para generar query Overpass por tipo
const getOverpassQuery = (
  type: Place["type"],
  latMin: number,
  lonMin: number,
  latMax: number,
  lonMax: number
) => {
  switch (type) {
    case "veterinario":
      return `[out:json][timeout:25]; node["amenity"="veterinary"](${latMin},${lonMin},${latMax},${lonMax}); out body;`;
    case "tienda":
      return `[out:json][timeout:25]; node["shop"="pet"](${latMin},${lonMin},${latMax},${lonMax}); out body;`;
    case "parque":
      return `[out:json][timeout:25];
        (
          node["leisure"="park"](${latMin},${lonMin},${latMax},${lonMax});
          way["leisure"="park"](${latMin},${lonMin},${latMax},${lonMax});
          relation["leisure"="park"](${latMin},${lonMin},${latMax},${lonMax});
        );
        out center;`;
    case "peluqueria":
      return `[out:json][timeout:25]; node["shop"="pet_grooming"](${latMin},${lonMin},${latMax},${lonMax}); out body;`;
    default:
      return "";
  }
};

export default function Dashboard() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [filters, setFilters] = useState<Place["type"][]>([]);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 40.4168, lng: -3.7038 });
  const [zoom] = useState(12);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ubicación inicial
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => console.log("Ubicación no disponible, usando Madrid por defecto")
    );
  }, []);

  // Cargar mascotas
  useEffect(() => {
    const fetchPets = async () => {
      if (!auth.currentUser) return;
      try {
        const petsRef = collection(db, "pets");
        const q = query(petsRef, where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const petsData: Pet[] = [];
        querySnapshot.forEach((doc) => petsData.push(doc.data() as Pet));
        setPets(petsData);
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
      }
    };
    fetchPets();
  }, []);

  // Buscar lugares con Overpass
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (filters.length === 0) {
        setPlaces([]);
        return;
      }

      setLoading(true);
      const results: Place[] = [];

      for (const type of filters) {
        const latMin = center.lat - 0.05;
        const latMax = center.lat + 0.05;
        const lonMin = center.lng - 0.05;
        const lonMax = center.lng + 0.05;

        const overpassQuery = getOverpassQuery(type, latMin, lonMin, latMax, lonMax);
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

        try {
          const res = await fetch(url);
          const data = await res.json();
          if (data.elements) {
            data.elements.forEach((el: any) => {
              const lat = el.lat ?? el.center?.lat;
              const lng = el.lon ?? el.center?.lon;
              if (lat && lng) {
                results.push({
                  id: `${type}-${el.id}`,
                  name: el.tags?.name || type,
                  type,
                  position: { lat, lng },
                });
              }
            });
          }
        } catch (err) {
          console.error("Error buscando lugares:", err);
        }
      }

      setPlaces(results);
      setLoading(false);
    }, 500);
  }, [filters, center]);

  const handleFilterToggle = (value: Place["type"]) => {
    setFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const diffMs = Date.now() - birthDate.getTime();
    return Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
  };

  // ---------- Estilos ----------
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1e1e2f",
    color: "#fff",
    boxSizing: "border-box",
  };
  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 700,
    display: "flex",
    flexDirection: "column",
    padding: 24,
    borderRadius: 12,
    backgroundColor: "#2a2a3d",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    marginBottom: 24,
  };
  const mapStyle: React.CSSProperties = {
    width: "100%",
    height: 400,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  };
  const spinnerStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    border: "4px solid rgba(255,255,255,0.3)",
    borderTop: "4px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    zIndex: 1000,
  };
  const checkboxContainerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: 16,
  };
  const checkboxLabelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "#3a3a5a",
    padding: "4px 8px",
    borderRadius: 6,
    cursor: "pointer",
  };
  const petListStyle: React.CSSProperties = { listStyle: "none", padding: 0, margin: 0 };
  const petItemStyle: React.CSSProperties = {
    padding: "12px 16px",
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#3a3a5a",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ marginBottom: 24 }}>Mi Dashboard</h1>
      <div style={containerStyle}>
        {/* Filtros */}
        <div style={checkboxContainerStyle}>
          {PLACE_OPTIONS.map((option) => (
            <label key={option.value} style={checkboxLabelStyle}>
              <input
                type="checkbox"
                checked={filters.includes(option.value)}
                onChange={() => handleFilterToggle(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>

        {/* Mapa */}
        <div style={mapStyle}>
          {loading && <div style={spinnerStyle}></div>}
          <Map markers={places} center={center} zoom={zoom} setCenter={setCenter} />
        </div>

        {/* Lista de mascotas */}
        <div>
          <h2 style={{ marginBottom: 16 }}>Mis Mascotas</h2>
          {pets.length === 0 ? (
            <p>No tienes mascotas añadidas aún.</p>
          ) : (
            <ul style={petListStyle}>
              {pets.map((pet, i) => (
                <li key={i} style={petItemStyle}>
                  <div>
                    <strong>{pet.name}</strong> - {pet.type}
                  </div>
                  <div>
                    {calculateAge(pet.dob)} años - {new Date(pet.dob).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
}
