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
      return showMessage("Please complete all pet fields.");
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
        showMessage("Pet updated successfully.");
      } else {
        const docRef = await addDoc(collection(db, "pets"), {
          userId: user!.uid,
          name,
          type,
          dob,
        });
        setPets([...pets, { id: docRef.id, name, type, dob }]);
        showMessage("Pet added successfully.");
      }
      clearPetForm();
      setEditingPetId(null);
    } catch (error) {
      console.error(error);
      showMessage("Could not save pet information.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;
    try {
      setLoading(true);
      await deleteDoc(doc(db, "pets", id));
      setPets(pets.filter((p) => p.id !== id));
      showMessage("Pet deleted.");
    } catch (error) {
      console.error(error);
      showMessage("Could not delete pet.");
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
      showMessage("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      showMessage("Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const { current, new: newP, confirm } = passwordForm;
    if (!current || !newP || !confirm)
      return showMessage("Please complete all password fields.");
    if (newP !== confirm) return showMessage("Passwords do not match.");
    if (!user) return;
    try {
      setLoading(true);
      await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email!, current)
      );
      await updatePassword(user, newP);
      setPasswordForm({ current: "", new: "", confirm: "" });
      showMessage("Password changed successfully.");
    } catch (error) {
      console.error(error);
      showMessage("Could not change password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const password = prompt(
      "Enter your password to confirm account deletion:"
    );
    if (
      !password ||
      !window.confirm("This action will permanently delete all your data. Continue?")
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
      showMessage("Account deleted successfully.");
    } catch (error: { code?: string } | unknown) {
      console.error(error);
      showMessage(
        typeof error === "object" && error !== null && "code" in error && error.code === "auth/wrong-password"
          ? "Incorrect password."
          : "Could not delete account."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>You are not signed in.</p>
    );
  if (!userData)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>Loading profile...</p>
    );

  return (
    <div
      style={{
        padding: 16,
        minHeight: "calc(100vh - 150px)",
        color: "var(--ink)",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>
        User Profile
      </h1>

      {message && (
        <div
          style={{
            backgroundColor: "var(--ok)",
            padding: 10,
            borderRadius: 6,
            marginBottom: 16,
            textAlign: "center",
            color: "white",
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
          style={{ backgroundColor: "var(--surface)", padding: 24, borderRadius: 12 }}
        >
          <h2 style={{ marginBottom: 16 }}>User Details</h2>
          {editingUser ? (
            <div style={{ display: "grid", gap: 12 }}>
              <input
                style={inputStyle}
                placeholder="First name"
                value={userForm.firstName}
                onChange={(e) =>
                  setUserForm({ ...userForm, firstName: e.target.value })
                }
              />
              <input
                style={inputStyle}
                placeholder="Last name"
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
                  {loading ? "Saving..." : "Save changes"}
                </button>
                <button
                  style={{ ...buttonStyle, backgroundColor: "#555" }}
                  onClick={() => setEditingUser(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              <p>
                <strong>First name:</strong> {userData.firstName}
              </p>
              <p>
                <strong>Last name:</strong> {userData.lastName}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Date of birth:</strong>{" "}
                {new Date(userData.dob).toLocaleDateString()}
              </p>
              <button style={buttonStyle} onClick={() => setEditingUser(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </section>

        {/* Password */}
        <section
          style={{ backgroundColor: "var(--surface)", padding: 24, borderRadius: 12 }}
        >
          <h2 style={{ marginBottom: 16 }}>Change Password</h2>
          <div style={{ display: "grid", gap: 12 }}>
            <input
              style={inputStyle}
              type="password"
              placeholder="Current password"
              value={passwordForm.current}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, current: e.target.value })
              }
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="New password"
              value={passwordForm.new}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, new: e.target.value })
              }
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="Confirm new password"
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
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </section>

        {/* Delete Account */}
        <section
          style={{ backgroundColor: "var(--surface)", padding: 24, borderRadius: 12 }}
        >
          <h2 style={{ marginBottom: 16 }}>Delete Account</h2>
          <button
            style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </section>

        {/* Pets */}
        <section
          style={{ backgroundColor: "var(--surface)", padding: 24, borderRadius: 12 }}
        >
          <h2 style={{ marginBottom: 16 }}>
            {editingPetId ? "Edit Pet" : "Add Pet"}
          </h2>
          <div style={{ display: "grid", gap: 12 }}>
            <input
              style={inputStyle}
              placeholder="Pet name"
              value={petForm.name}
              onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
            />
            <select
              style={inputStyle}
              value={petForm.type}
              onChange={(e) => setPetForm({ ...petForm, type: e.target.value })}
            >
              <option value="" disabled>
                Select pet type
              </option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rodent">Rodent</option>
              <option value="Other">Other</option>
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
                ? "Saving..."
                : editingPetId
                ? "Save Changes"
                : "Add Pet"}
            </button>
          </div>

          <h2 style={{ marginTop: 24 }}>My Pets</h2>
          {pets.length === 0 ? (
            <p>No pets added yet.</p>
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
                    {calculateAge(pet.dob)} years old
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      style={editButtonStyle}
                      onClick={() => handleEditPet(pet)}
                    >
                      Edit
                    </button>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => pet.id && handleDeletePet(pet.id)}
                    >
                      Delete
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
