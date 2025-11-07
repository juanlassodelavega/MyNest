export default function Home() {
  // ---------- Estilos ----------
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1e1e2f",
    boxSizing: "border-box",
  };

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 500,
    padding: 40,
    borderRadius: 12,
    backgroundColor: "#2a2a3d",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    color: "#fff",
    textAlign: "center",
  };

  const headingStyle: React.CSSProperties = {
    marginBottom: 16,
  };

  const textStyle: React.CSSProperties = {
    fontSize: 18,
    lineHeight: 1.5,
  };
  // ---------- Fin estilos ----------

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>Bienvenido a MyNest</h1>
        <p style={textStyle}>La red social para dueños de mascotas.</p>
      </div>
    </div>
  );
}
