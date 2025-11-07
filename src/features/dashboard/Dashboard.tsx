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
  const [markers, setMarkers] = useState<any[]>([]); // mantiene el mapa si quieres

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

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 16 }}>
      <h1 style={{ textAlign: "center", marginBottom: 16 }}>Mi Dashboard</h1>

      {/* Mapa */}
      <Map markers={markers} setMarkers={setMarkers} />

      {/* Lista de mascotas */}
      <div style={{ paddingTop: 16 }}>
        <h2>Mis Mascotas</h2>
        {pets.length === 0 ? (
          <p>No tienes mascotas añadidas aún.</p>
        ) : (
          <ul>
            {pets.map((pet, i) => (
              <li key={i}>
                <strong>{pet.name}</strong> - {pet.type} - {pet.age} años
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
