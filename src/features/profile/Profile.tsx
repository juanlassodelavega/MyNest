import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc, collection, addDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
}

interface Pet {
  id?: string;
  name: string;
  type: string;
  dob: string;
}

export default function Profile() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petBirthdate, setPetBirthdate] = useState("");

  const [editingUser, setEditingUser] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // ---------- Load user and pets ----------
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserData;
        setUserData(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setDob(data.dob);
      }
    };

    const fetchPets = async () => {
      if (!user) return;
      const petsRef = collection(db, "pets");
      const q = query(petsRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const petsData: Pet[] = [];
      snapshot.forEach((doc) => petsData.push({ id: doc.id, ...(doc.data() as Pet) }));
      setPets(petsData);
    };

    fetchUserData();
    fetchPets();
  }, [user]);

  // ---------- Funciones mascotas ----------
  const handleAddPet = async () => {
    if (!petName || !petType || !petBirthdate) {
      alert("Completa todos los campos de la mascota");
      return;
    }
    try {
      const petsRef = collection(db, "pets");
      const docRef = await addDoc(petsRef, {
        userId: user!.uid,
        name: petName,
        type: petType,
        dob: petBirthdate,
      });
      setPets([...pets, { id: docRef.id, name: petName, type: petType, dob: petBirthdate }]);
      setPetName(""); setPetType(""); setPetBirthdate("");
      alert("Mascota añadida!");
    } catch (error) {
      console.error("Error al añadir mascota:", error);
    }
  };

  const handleDeletePet = async (id: string) => {
    try {
      await deleteDoc(doc(db, "pets", id));
      setPets(pets.filter((pet) => pet.id !== id));
    } catch (error) { console.error("Error al borrar mascota:", error); }
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPetId(pet.id || null);
    setPetName(pet.name); setPetType(pet.type); setPetBirthdate(pet.dob);
  };

  const handleSaveEditPet = async () => {
    if (!editingPetId) return;
    try {
      const petRef = doc(db, "pets", editingPetId);
      await updateDoc(petRef, { name: petName, type: petType, dob: petBirthdate });
      setPets(pets.map((pet) => pet.id === editingPetId ? { ...pet, name: petName, type: petType, dob: petBirthdate } : pet));
      setEditingPetId(null); setPetName(""); setPetType(""); setPetBirthdate("");
      alert("Mascota actualizada!");
    } catch (error) { console.error("Error al actualizar mascota:", error); }
  };

  // ---------- Funciones usuario ----------
  const handleSaveUser = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { firstName, lastName, dob });
      setUserData({ ...userData!, firstName, lastName, dob });
      setEditingUser(false);
      alert("Datos de usuario actualizados!");
    } catch (error) { console.error("Error al actualizar usuario:", error); }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("Completa todos los campos");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("Las nuevas contraseñas no coinciden");
      return;
    }
    if (!user) return;

    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      alert("Contraseña cambiada correctamente!");
      setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("");
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      alert("Error cambiando contraseña");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!window.confirm("¿Seguro que quieres borrar tu cuenta? Esto eliminará todos tus datos.")) return;
    try {
      const petsRef = collection(db, "pets");
      const q = query(petsRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const batchDeletes = snapshot.docs.map(docSnap => deleteDoc(doc(db, "pets", docSnap.id)));
      await Promise.all(batchDeletes);
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      alert("Cuenta eliminada");
    } catch (error) { console.error("Error al borrar cuenta:", error); alert("Error eliminando cuenta"); }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const diffMs = Date.now() - birthDate.getTime();
    return Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
  };

  if (!user) return <p style={{ textAlign: "center", marginTop: 50 }}>No estás logueado.</p>;
  if (!userData) return <p style={{ textAlign: "center", marginTop: 50 }}>Cargando perfil...</p>;

  // ---------- Estilos ----------
  const pageStyle: React.CSSProperties = { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: 16, backgroundColor: "#1e1e2f", color: "#fff", boxSizing: "border-box" };
  const containerStyle: React.CSSProperties = { width: "100%", maxWidth: 700, display: "flex", flexDirection: "column", padding: 24, borderRadius: 12, backgroundColor: "#2a2a3d", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", marginBottom: 24 };
  const titleStyle: React.CSSProperties = { marginBottom: 24, textAlign: "center" };
  const sectionTitleStyle: React.CSSProperties = { marginBottom: 16, fontSize: 20, fontWeight: 600 };
  const userInfoStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4, marginBottom: 24 };
  const inputStyle: React.CSSProperties = { width: "100%", padding: 10, borderRadius: 8, border: "1px solid #555", backgroundColor: "#1a1a2b", color: "#fff", boxSizing: "border-box", marginBottom: 12 };
  const buttonStyle: React.CSSProperties = { width: "100%", padding: 12, backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, marginBottom: 12 };
  const smallButtonStyle: React.CSSProperties = { padding: "6px 12px", marginLeft: 8, borderRadius: 6, border: "none", cursor: "pointer" };
  const deleteButtonStyle: React.CSSProperties = { ...smallButtonStyle, backgroundColor: "#e74c3c", color: "#fff" };
  const editButtonStyle: React.CSSProperties = { ...smallButtonStyle, backgroundColor: "#3498db", color: "#fff" };
  const petListStyle: React.CSSProperties = { listStyle: "none", padding: 0, margin: 0 };
  const petItemStyle: React.CSSProperties = { padding: "12px 16px", marginBottom: 8, borderRadius: 8, backgroundColor: "#3a3a5a", display: "flex", justifyContent: "space-between", alignItems: "center" };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Perfil de usuario</h1>

      <div style={containerStyle}>
        {/* Datos usuario */}
        <h2 style={sectionTitleStyle}>Datos del Usuario</h2>
        {editingUser ? (
          <>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nombre" style={inputStyle} />
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Apellidos" style={inputStyle} />
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={inputStyle} />
            <button style={buttonStyle} onClick={handleSaveUser}>Guardar cambios</button>
            <button style={{...buttonStyle, backgroundColor: "#555"}} onClick={() => setEditingUser(false)}>Cancelar</button>
          </>
        ) : (
          <>
            <div style={userInfoStyle}>
              <p><strong>Nombre:</strong> {userData.firstName}</p>
              <p><strong>Apellidos:</strong> {userData.lastName}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Fecha de nacimiento:</strong> {new Date(userData.dob).toLocaleDateString()}</p>
            </div>
            <button style={buttonStyle} onClick={() => setEditingUser(true)}>Editar Datos</button>
          </>
        )}

        {/* Cambiar contraseña */}
        <h2 style={sectionTitleStyle}>Cambiar Contraseña</h2>
        <input type="password" placeholder="Contraseña actual" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Confirmar nueva contraseña" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} style={inputStyle} />
        <button style={buttonStyle} onClick={handleChangePassword}>Cambiar Contraseña</button>

        {/* Borrar cuenta */}
        <h2 style={sectionTitleStyle}>Eliminar Cuenta</h2>
        <button style={{...buttonStyle, backgroundColor: "#e74c3c"}} onClick={handleDeleteAccount}>Borrar Cuenta</button>

        {/* Mascotas */}
        <h2 style={sectionTitleStyle}>{editingPetId ? "Editar Mascota" : "Añadir Mascota"}</h2>
        <input type="text" placeholder="Nombre de la mascota" value={petName} onChange={(e) => setPetName(e.target.value)} style={inputStyle} />
        <select value={petType} onChange={(e) => setPetType(e.target.value)} style={inputStyle}>
          <option value="" disabled>Selecciona tipo de mascota</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
          <option value="Ave">Ave</option>
          <option value="Roedor">Roedor</option>
          <option value="Otro">Otro</option>
        </select>
        <input type="date" value={petBirthdate} onChange={(e) => setPetBirthdate(e.target.value)} style={inputStyle} />
        {editingPetId ? (
          <button style={buttonStyle} onClick={handleSaveEditPet}>Guardar Cambios</button>
        ) : (
          <button style={buttonStyle} onClick={handleAddPet}>Añadir Mascota</button>
        )}

        <h2 style={sectionTitleStyle}>Mis Mascotas</h2>
        {pets.length === 0 ? <p>No tienes mascotas añadidas aún.</p> : (
          <ul style={petListStyle}>
            {pets.map((pet) => (
              <li key={pet.id} style={petItemStyle}>
                <div>
                  <strong>{pet.name}</strong> - {pet.type} - {calculateAge(pet.dob)} años
                </div>
                <div>
                  <button style={editButtonStyle} onClick={() => handleEditPet(pet)}>Editar</button>
                  <button style={deleteButtonStyle} onClick={() => pet.id && handleDeletePet(pet.id)}>Borrar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
