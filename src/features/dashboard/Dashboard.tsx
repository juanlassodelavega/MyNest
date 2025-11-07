import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Map from "../../components/Map";

interface Pet {
  name: string;
  type: string;
  age: number;
}

export default function Dashboard() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);

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
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  };

  const petListStyle: React.CSSProperties = {
    listStyle: "none",
    padding: 0,
    margin: 0,
  };

  const petItemStyle: React.CSSProperties = {
    padding: "12px 16px",
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#3a3a5a",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  // ---------- Fin estilos ----------

  return (
    <div style={pageStyle}>
      <h1 style={{ marginBottom: 24 }}>Mi Dashboard</h1>

      {/* Contenedor principal */}
      <div style={containerStyle}>
        {/* Mapa */}
        <div style={mapStyle}>
          <Map markers={markers} setMarkers={setMarkers} />
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
                  <span>
                    <strong>{pet.name}</strong> - {pet.type}
                  </span>
                  <span>{pet.age} años</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
