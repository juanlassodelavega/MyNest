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

  if (!user) return <p style={{ textAlign: "center", marginTop: 50 }}>No estás logueado.</p>;
  if (!userData) return <p style={{ textAlign: "center", marginTop: 50 }}>Cargando perfil...</p>;

  // ---------- Estilos ----------
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#1e1e2f",
    color: "#fff",
    boxSizing: "border-box",
  };

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 700,
    padding: 32,
    borderRadius: 12,
    backgroundColor: "#2a2a3d",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    gap: 24, // separación entre bloques (datos, inputs, botón)
  };

  const userInfoStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4, // los <p> estarán más juntos
    marginBottom: 16,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #555",
    backgroundColor: "#1a1a2b",
    color: "#fff",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: 12,
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  };
  // ---------- Fin estilos ----------

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
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1>Perfil de usuario</h1>

        {/* Datos del usuario */}
        <div style={userInfoStyle}>
          <p><strong>Nombre:</strong> {userData.firstName}</p>
          <p><strong>Apellidos:</strong> {userData.lastName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Edad:</strong> {userData.age}</p>
        </div>

        {/* Añadir mascota */}
        <h2>Añadir Mascota</h2>
        <input
          type="text"
          placeholder="Nombre de la mascota"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Tipo de mascota"
          value={petType}
          onChange={(e) => setPetType(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Edad de la mascota"
          value={petAge}
          onChange={(e) => setPetAge(Number(e.target.value))}
          style={inputStyle}
        />
        <button onClick={handleAddPet} style={buttonStyle}>Añadir Mascota</button>
      </div>
    </div>
  );
}
