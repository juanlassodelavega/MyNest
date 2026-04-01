import { useEffect, useState, useRef } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import Map from "../../components/Map";
import type { MarkerData } from "../../components/Map";

interface Pet {
  id: string;
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

interface Reminder {
  id: string;
  type: string;
  date: string;
  notes?: string;
}

const PLACE_OPTIONS: { label: string; value: Place["type"] }[] = [
  { label: "Veterinary", value: "veterinary" },
  { label: "Pet shops", value: "shop" },
  { label: "Parks", value: "park" },
  { label: "Grooming", value: "grooming" },
];

const getOverpassQuery = (
  type: Place["type"],
  latMin: number,
  lonMin: number,
  latMax: number,
  lonMax: number
) => {
  switch (type) {
    case "veterinary":
      return `[out:json][timeout:25]; node["amenity"="veterinary"](${latMin},${lonMin},${latMax},${lonMax}); out body;`;
    case "shop":
      return `[out:json][timeout:25]; node["shop"="pet"](${latMin},${lonMin},${latMax},${lonMax}); out body;`;
    case "park":
      return `[out:json][timeout:25];
        (
          node["leisure"="park"](${latMin},${lonMin},${latMax},${lonMax});
          way["leisure"="park"](${latMin},${lonMin},${latMax},${lonMax});
          relation["leisure"="park"](${latMin},${lonMin},${latMax},${lonMax});
        );
        out center;`;
    case "grooming":
      return `[out:json][timeout:25]; node["shop"="pet_grooming"](${latMin},${lonMin},${latMax},${lonMax}); out body;`;
    default:
      return "";
  }
};

export default function Dashboard() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [filters, setFilters] = useState<Place["type"][]>([]);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 40.4168,
    lng: -3.7038,
  });
  const [zoom] = useState(12);
  const [loading, setLoading] = useState(false);
  const [mapHeight, setMapHeight] = useState(400);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [remindersMap, setRemindersMap] = useState<{
    [petId: string]: Reminder[];
  }>({});
  const [newReminderMap, setNewReminderMap] = useState<{
    [petId: string]: { type: string; date: string; notes: string };
  }>({});

  useEffect(() => {
    const updateMapHeight = () => {
      if (window.innerWidth < 600) {
        setMapHeight(window.innerHeight * 0.4);
      } else {
        setMapHeight(400);
      }
    };
    updateMapHeight();
    window.addEventListener("resize", updateMapHeight);
    return () => window.removeEventListener("resize", updateMapHeight);
  }, []);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => console.log("Location not available, using Madrid as default")
    );
  }, []);

  useEffect(() => {
    const fetchPets = async () => {
      if (!auth.currentUser) return;
      try {
        const petsRef = collection(db, "pets");
        const q = query(petsRef, where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const petsData: Pet[] = [];
        const tempRemindersMap: { [petId: string]: Reminder[] } = {};

        for (const docSnap of querySnapshot.docs) {
          const petData = {
            id: docSnap.id,
            ...(docSnap.data() as Omit<Pet, "id">),
          };
          petsData.push(petData);

          const remindersRef = collection(db, "pets", docSnap.id, "reminders");
          const remindersSnapshot = await getDocs(
            query(remindersRef, orderBy("date", "asc"))
          );
          const reminders: Reminder[] = remindersSnapshot.docs.map((rDoc) => ({
            id: rDoc.id,
            ...(rDoc.data() as Omit<Reminder, "id">),
          }));
          tempRemindersMap[docSnap.id] = reminders;
        }

        setPets(petsData);
        setRemindersMap(tempRemindersMap);
      } catch (error) {
        console.error("Failed to load pets:", error);
      }
    };
    fetchPets();
  }, []);

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

        const overpassQuery = getOverpassQuery(
          type,
          latMin,
          lonMin,
          latMax,
          lonMax
        );
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
          overpassQuery
        )}`;

        try {
          const res = await fetch(url);
          const data = await res.json();
          if (data.elements) {
            data.elements.forEach((el: { id: string; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: { name?: string } }) => {
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
          console.error("Failed to search places:", err);
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

  const handleAddReminder = async (petId: string) => {
    const newReminder = newReminderMap[petId];
    if (!newReminder?.type || !newReminder.date) return;

    try {
      const remindersRef = collection(db, "pets", petId, "reminders");
      const docRef = await addDoc(remindersRef, newReminder);
      setRemindersMap((prev) => ({
        ...prev,
        [petId]: [...(prev[petId] || []), { id: docRef.id, ...newReminder }],
      }));
      setNewReminderMap((prev) => ({
        ...prev,
        [petId]: { type: "", date: "", notes: "" },
      }));
    } catch (error) {
      console.error("Failed to add reminder:", error);
    }
  };

  const handleDeleteReminder = async (petId: string, reminderId: string) => {
    try {
      await deleteDoc(doc(db, "pets", petId, "reminders", reminderId));
      setRemindersMap((prev) => ({
        ...prev,
        [petId]: prev[petId].filter((r) => r.id !== reminderId),
      }));
    } catch (error) {
      console.error("Failed to delete reminder:", error);
    }
  };

  const pageStyle: React.CSSProperties = {
    minHeight: "calc(100vh - 150px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
    color: "var(--ink)",
    boxSizing: "border-box",
  };
  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 820,
    display: "flex",
    flexDirection: "column",
    padding: 24,
    borderRadius: 16,
    backgroundColor: "var(--surface)",
    boxShadow: "var(--shadow)",
    marginBottom: 24,
  };
  const mapStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
    height: mapHeight,
  };
  const spinnerStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    border: "4px solid rgba(0, 109, 119, 0.2)",
    borderTop: "4px solid var(--brand)",
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
    backgroundColor: "var(--surface-soft)",
    padding: "4px 8px",
    borderRadius: 6,
    cursor: "pointer",
  };
  const petListContainerStyle: React.CSSProperties = {
    maxHeight: "60vh",
    overflowY: "auto",
    paddingRight: 4,
  };
  const petListStyle: React.CSSProperties = {
    listStyle: "none",
    padding: 0,
    margin: 0,
  };
  const petItemStyle: React.CSSProperties = {
    padding: "12px 16px",
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "var(--surface-soft)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };
  const reminderListStyle = (count: number): React.CSSProperties => ({
    maxHeight: count > 4 ? 150 : "auto",
    overflowY: count > 4 ? "auto" : "visible",
    marginTop: 4,
    paddingRight: 4,
  });
  const reminderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#e4e8f7",
    padding: "4px 8px",
    borderRadius: 6,
    marginBottom: 4,
    flexWrap: "wrap",
    gap: 4,
  };
  const inputStyle: React.CSSProperties = {
    padding: 6,
    borderRadius: 6,
    border: "1px solid var(--line)",
    backgroundColor: "var(--surface)",
    color: "var(--ink)",
    width: "100%",
    boxSizing: "border-box",
  };
  const addButtonStyle: React.CSSProperties = {
    cursor: "pointer",
    color: "var(--brand)",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ marginBottom: 24 }}>My Dashboard</h1>
      <div style={containerStyle}>
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

        <div style={mapStyle}>
          {loading && <div style={spinnerStyle}></div>}
          <Map
            markers={places}
            center={center}
            zoom={zoom}
            setCenter={setCenter}
          />
        </div>

        <div style={petListContainerStyle}>
          <h2 style={{ marginBottom: 16 }}>My Pets</h2>
          {pets.length === 0 ? (
            <p>No pets added yet.</p>
          ) : (
            <ul style={petListStyle}>
              {pets.map((pet) => {
                const reminderCount = remindersMap[pet.id]?.length || 0;
                return (
                  <li key={pet.id} style={petItemStyle}>
                    <div>
                      <strong>{pet.name}</strong> - {pet.type}
                    </div>
                    <div>
                      {calculateAge(pet.dob)} years old -{" "}
                      {new Date(pet.dob).toLocaleDateString()}
                    </div>

                    <div>
                      <strong>Reminders:</strong>
                      <div style={reminderListStyle(reminderCount)}>
                        {(remindersMap[pet.id] || []).map((r) => (
                          <div key={r.id} style={reminderStyle}>
                            <span>
                              {r.type} — {r.date}
                            </span>
                            <span
                              style={{ cursor: "pointer", color: "var(--danger)" }}
                              onClick={() => handleDeleteReminder(pet.id, r.id)}
                            >
                              🗑
                            </span>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(120px, 1fr))",
                          gap: 4,
                          marginTop: 4,
                          alignItems: "center",
                        }}
                      >
                        <select
                          style={{ ...inputStyle }}
                          value={newReminderMap[pet.id]?.type || ""}
                          onChange={(e) =>
                            setNewReminderMap((prev) => ({
                              ...prev,
                              [pet.id]: {
                                ...prev[pet.id],
                                type: e.target.value,
                              },
                            }))
                          }
                        >
                          <option value="">Type</option>
                          <option value="Rabies">Rabies</option>
                          <option value="Deworming">Deworming</option>
                          <option value="Core vaccine">Core vaccine</option>
                          <option value="Distemper">Distemper</option>
                          <option value="Other">Other</option>
                        </select>
                        <input
                          type="date"
                          style={inputStyle}
                          value={newReminderMap[pet.id]?.date || ""}
                          onChange={(e) =>
                            setNewReminderMap((prev) => ({
                              ...prev,
                              [pet.id]: {
                                ...prev[pet.id],
                                date: e.target.value,
                              },
                            }))
                          }
                        />
                        <input
                          type="text"
                          placeholder="Notes"
                          style={inputStyle}
                          value={newReminderMap[pet.id]?.notes || ""}
                          onChange={(e) =>
                            setNewReminderMap((prev) => ({
                              ...prev,
                              [pet.id]: {
                                ...prev[pet.id],
                                notes: e.target.value,
                              },
                            }))
                          }
                        />
                        <span
                          style={addButtonStyle}
                          onClick={() => handleAddReminder(pet.id)}
                        >
                          ➕ Add
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
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
