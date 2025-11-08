import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
}

interface Pet {
  name: string;
  type: string;
  dob: string;
}

export default function Profile() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petBirthdate, setPetBirthdate] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setUserData(docSnap.data() as UserData);
    };

    const fetchPets = async () => {
      if (!user) return;
      const petsRef = collection(db, "pets");
      const q = query(petsRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const petsData: Pet[] = [];
      snapshot.forEach((doc) => petsData.push(doc.data() as Pet));
      setPets(petsData);
    };

    fetchUserData();
    fetchPets();
  }, [user]);

  const handleAddPet = async () => {
    if (!petName || !petType || !petBirthdate) {
      alert("Completa todos los campos de la mascota");
      return;
    }

    try {
      const petsRef = collection(db, "pets");
      await addDoc(petsRef, {
        userId: user!.uid,
        name: petName,
        type: petType,
        dob: petBirthdate,
      });

      setPets([...pets, { name: petName, type: petType, dob: petBirthdate }]);
      setPetName("");
      setPetType("");
      setPetBirthdate("");
      alert("Mascota añadida!");
    } catch (error) {
      console.error("Error al añadir mascota:", error);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const diffMs = Date.now() - birthDate.getTime();
    return Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
  };

  if (!user) return <p style={{ textAlign: "center", marginTop: 50 }}>No estás logueado.</p>;
  if (!userData) return <p style={{ textAlign: "center", marginTop: 50 }}>Cargando perfil...</p>;

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

  const titleStyle: React.CSSProperties = {
    marginBottom: 24, // igual que Dashboard
    textAlign: "center",
  };

  const sectionTitleStyle: React.CSSProperties = {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 600,
  };

  const userInfoStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 24,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #555",
    backgroundColor: "#1a1a2b",
    color: "#fff",
    boxSizing: "border-box",
    marginBottom: 12,
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
      {/* Título fuera del contenedor, mismo estilo que Dashboard */}
      <h1 style={titleStyle}>Perfil de usuario</h1>

      <div style={containerStyle}>
        {/* Datos del usuario */}
        <div style={userInfoStyle}>
          <p><strong>Nombre:</strong> {userData.firstName}</p>
          <p><strong>Apellidos:</strong> {userData.lastName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Edad:</strong> {userData.age}</p>
        </div>

        {/* Añadir Mascota */}
        <h2 style={sectionTitleStyle}>Añadir Mascota</h2>
        <input
          type="text"
          placeholder="Nombre de la mascota"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          style={inputStyle}
        />

        <select
          value={petType}
          onChange={(e) => setPetType(e.target.value)}
          style={inputStyle}
        >
          <option value="" disabled>Selecciona tipo de mascota</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
          <option value="Ave">Ave</option>
          <option value="Roedor">Roedor</option>
          <option value="Otro">Otro</option>
        </select>

        <input
          type="date"
          value={petBirthdate}
          onChange={(e) => setPetBirthdate(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleAddPet} style={buttonStyle}>Añadir Mascota</button>

        {/* Lista de mascotas */}
        <h2 style={sectionTitleStyle}>Mis Mascotas</h2>
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
  );
}
