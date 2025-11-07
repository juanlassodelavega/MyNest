import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
}

export default function Profile() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petAge, setPetAge] = useState<number | "">("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) return <p>No estás logueado.</p>;
  if (!userData) return <p>Cargando perfil...</p>;

  const handleAddPet = async () => {
    if (!petName || !petType || petAge === "") {
      alert("Completa todos los campos de la mascota");
      return;
    }

    try {
      const petsRef = collection(db, "pets");
      await addDoc(petsRef, {
        userId: user.uid,
        name: petName,
        type: petType,
        age: Number(petAge),
      });

      alert("Mascota añadida!");
      setPetName("");
      setPetType("");
      setPetAge("");
    } catch (error) {
      console.error("Error al añadir mascota:", error);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 400, margin: "0 auto" }}>
      <h1>Perfil de usuario</h1>
      <p><strong>Nombre:</strong> {userData.firstName}</p>
      <p><strong>Apellidos:</strong> {userData.lastName}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Edad:</strong> {userData.age}</p>

      <h2>Añadir Mascota</h2>
      <input
        type="text"
        placeholder="Nombre de la mascota"
        value={petName}
        onChange={(e) => setPetName(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: "100%" }}
      />
      <input
        type="text"
        placeholder="Tipo de mascota"
        value={petType}
        onChange={(e) => setPetType(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: "100%" }}
      />
      <input
        type="number"
        placeholder="Edad de la mascota"
        value={petAge}
        onChange={(e) => setPetAge(Number(e.target.value))}
        style={{ display: "block", marginBottom: 8, width: "100%" }}
      />
      <button onClick={handleAddPet} style={{ width: "100%" }}>Añadir Mascota</button>
    </div>
  );
}
