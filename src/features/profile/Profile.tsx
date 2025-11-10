import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

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
  const [petForm, setPetForm] = useState({ name: "", type: "", dob: "" });
  const [editingUser, setEditingUser] = useState(false);
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // ---------- Fetch user & pets ----------
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data() as UserData;
        setUserData(data);
        setUserForm({
          firstName: data.firstName,
          lastName: data.lastName,
          dob: data.dob,
        });
      }
    };

    const fetchPets = async () => {
      const q = query(collection(db, "pets"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const petsData: Pet[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Pet),
      }));
      setPets(petsData);
    };

    fetchUserData();
    fetchPets();
  }, [user]);

  // ---------- Helpers ----------
  const clearPetForm = () => setPetForm({ name: "", type: "", dob: "" });
  const calculateAge = (dob: string) =>
    Math.floor(
      (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  // ---------- Pets ----------
  const handleAddOrEditPet = async () => {
    const { name, type, dob } = petForm;
    if (!name || !type || !dob)
      return showMessage("Completa todos los campos de la mascota");
    try {
      setLoading(true);
      if (editingPetId) {
        const petRef = doc(db, "pets", editingPetId);
        await updateDoc(petRef, { name, type, dob });
        setPets(
          pets.map((p) =>
            p.id === editingPetId ? { ...p, name, type, dob } : p
          )
        );
        showMessage("Mascota actualizada!");
      } else {
        const docRef = await addDoc(collection(db, "pets"), {
          userId: user!.uid,
          name,
          type,
          dob,
        });
        setPets([...pets, { id: docRef.id, name, type, dob }]);
        showMessage("Mascota añadida!");
      }
      clearPetForm();
      setEditingPetId(null);
    } catch (error) {
      console.error(error);
      showMessage("Error al guardar la mascota");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta mascota?")) return;
    try {
      setLoading(true);
      await deleteDoc(doc(db, "pets", id));
      setPets(pets.filter((p) => p.id !== id));
      showMessage("Mascota eliminada");
    } catch (error) {
      console.error(error);
      showMessage("Error al eliminar mascota");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPetId(pet.id || null);
    setPetForm({ name: pet.name, type: pet.type, dob: pet.dob });
  };

  // ---------- User ----------
  const handleSaveUser = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, userForm);
      setUserData({ ...userData!, ...userForm });
      setEditingUser(false);
      showMessage("Datos de usuario actualizados!");
    } catch (error) {
      console.error(error);
      showMessage("Error al actualizar usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const { current, new: newP, confirm } = passwordForm;
    if (!current || !newP || !confirm)
      return showMessage("Completa todos los campos");
    if (newP !== confirm) return showMessage("Las contraseñas no coinciden");
    if (!user) return;
    try {
      setLoading(true);
      await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email!, current)
      );
      await updatePassword(user, newP);
      setPasswordForm({ current: "", new: "", confirm: "" });
      showMessage("Contraseña cambiada correctamente!");
    } catch (error) {
      console.error(error);
      showMessage("Error cambiando contraseña");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const password = prompt(
      "Introduce tu contraseña para confirmar la eliminación de tu cuenta:"
    );
    if (
      !password ||
      !window.confirm("⚠️ Esto eliminará todos tus datos. ¿Continuar?")
    )
      return;
    try {
      setLoading(true);
      await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email!, password)
      );
      const snapshot = await getDocs(
        query(collection(db, "pets"), where("userId", "==", user.uid))
      );
      await Promise.all(
        snapshot.docs.map((d) => deleteDoc(doc(db, "pets", d.id)))
      );
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      showMessage("Cuenta eliminada con éxito.");
    } catch (error: any) {
      console.error(error);
      showMessage(
        error.code === "auth/wrong-password"
          ? "Contraseña incorrecta"
          : "Error eliminando cuenta"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>No estás logueado.</p>
    );
  if (!userData)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>Cargando perfil...</p>
    );

  return (
    <div
      style={{
        padding: 16,
        minHeight: "100vh",
        backgroundColor: "#1e1e2f",
        color: "#fff",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>
        Perfil de usuario
      </h1>

      {message && (
        <div
          style={{
            backgroundColor: "#4caf50",
            padding: 10,
            borderRadius: 6,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{ maxWidth: 700, margin: "0 auto", display: "grid", gap: 24 }}
      >
        {/* User Info */}
        <section
          style={{ backgroundColor: "#2a2a3d", padding: 24, borderRadius: 12 }}
        >
          <h2 style={{ marginBottom: 16 }}>Datos del Usuario</h2>
          {editingUser ? (
            <div style={{ display: "grid", gap: 12 }}>
              <input
                style={inputStyle}
                placeholder="Nombre"
                value={userForm.firstName}
                onChange={(e) =>
                  setUserForm({ ...userForm, firstName: e.target.value })
                }
              />
              <input
                style={inputStyle}
                placeholder="Apellidos"
                value={userForm.lastName}
                onChange={(e) =>
                  setUserForm({ ...userForm, lastName: e.target.value })
                }
              />
              <input
                style={inputStyle}
                type="date"
                value={userForm.dob}
                onChange={(e) =>
                  setUserForm({ ...userForm, dob: e.target.value })
                }
              />
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  style={buttonStyle}
                  onClick={handleSaveUser}
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  style={{ ...buttonStyle, backgroundColor: "#555" }}
                  onClick={() => setEditingUser(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              <p>
                <strong>Nombre:</strong> {userData.firstName}
              </p>
              <p>
                <strong>Apellidos:</strong> {userData.lastName}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Fecha de nacimiento:</strong>{" "}
                {new Date(userData.dob).toLocaleDateString()}
              </p>
              <button style={buttonStyle} onClick={() => setEditingUser(true)}>
                Editar Datos
              </button>
            </div>
          )}
        </section>

        {/* Password */}
        <section
          style={{ backgroundColor: "#2a2a3d", padding: 24, borderRadius: 12 }}
        >
          <h2 style={{ marginBottom: 16 }}>Cambiar Contraseña</h2>
          <div style={{ display: "grid", gap: 12 }}>
            <input
              style={inputStyle}
              type="password"
              placeholder="Contraseña actual"
              value={passwordForm.current}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, current: e.target.value })
              }
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="Nueva contraseña"
              value={passwordForm.new}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, new: e.target.value })
              }
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={passwordForm.confirm}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirm: e.target.value })
              }
            />
            <button
              style={buttonStyle}
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? "Cambiando..." : "Cambiar Contraseña"}
            </button>
          </div>
        </section>

        {/* Delete Account */}
        <section
          style={{ backgroundColor: "#2a2a3d", padding: 24, borderRadius: 12 }}
        >
          <h2 style={{ marginBottom: 16 }}>Eliminar Cuenta</h2>
          <button
            style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Borrar Cuenta"}
          </button>
        </section>

        {/* Pets */}
        <section
          style={{ backgroundColor: "#2a2a3d", padding: 24, borderRadius: 12 }}
        >
          <h2 style={{ marginBottom: 16 }}>
            {editingPetId ? "Editar Mascota" : "Añadir Mascota"}
          </h2>
          <div style={{ display: "grid", gap: 12 }}>
            <input
              style={inputStyle}
              placeholder="Nombre de la mascota"
              value={petForm.name}
              onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
            />
            <select
              style={inputStyle}
              value={petForm.type}
              onChange={(e) => setPetForm({ ...petForm, type: e.target.value })}
            >
              <option value="" disabled>
                Selecciona tipo de mascota
              </option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Ave">Ave</option>
              <option value="Roedor">Roedor</option>
              <option value="Otro">Otro</option>
            </select>
            <input
              style={inputStyle}
              type="date"
              value={petForm.dob}
              onChange={(e) => setPetForm({ ...petForm, dob: e.target.value })}
            />
            <button
              style={buttonStyle}
              onClick={handleAddOrEditPet}
              disabled={loading}
            >
              {loading
                ? "Guardando..."
                : editingPetId
                ? "Guardar Cambios"
                : "Añadir Mascota"}
            </button>
          </div>

          <h2 style={{ marginTop: 24 }}>Mis Mascotas</h2>
          {pets.length === 0 ? (
            <p>No tienes mascotas añadidas aún.</p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                display: "grid",
                gap: 12,
              }}
            >
              {pets.map((pet) => (
                <li
                  key={pet.id}
                  style={{
                    backgroundColor: "#3a3a5a",
                    padding: 12,
                    borderRadius: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong>{pet.name}</strong> - {pet.type} -{" "}
                    {calculateAge(pet.dob)} años
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      style={editButtonStyle}
                      onClick={() => handleEditPet(pet)}
                    >
                      Editar
                    </button>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => pet.id && handleDeletePet(pet.id)}
                    >
                      Borrar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

// ---------- Styles ----------
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #555",
  backgroundColor: "#1a1a2b",
  color: "#fff",
};

const buttonStyle: React.CSSProperties = {
  padding: 12,
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const editButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  backgroundColor: "#3498db",
  color: "#fff",
};
const deleteButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  backgroundColor: "#e74c3c",
  color: "#fff",
};
