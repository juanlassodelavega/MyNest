export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,               // ocupa el espacio restante
        width: "100%",
        textAlign: "center",
        padding: "0 16px",
        boxSizing: "border-box",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: 16 }}>Bienvenido a MyNest 🐾</h1>
      <p style={{ fontSize: "1rem", maxWidth: 400 }}>
        Conéctate con otros dueños de mascotas y comparte tus experiencias.
      </p>
    </main>
  );
}
