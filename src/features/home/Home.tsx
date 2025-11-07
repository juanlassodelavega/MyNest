export default function Home() {
  const pageStyle = { 
    height: "100%", 
    flex: 1, 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: "16px", 
    boxSizing: "border-box" as const 
  };

  const containerStyle = { 
    width: "100%", 
    maxWidth: 600,  // <-- más ancho
    padding: 40,    // <-- un poco más de padding
    borderRadius: 8, 
    border: "1px solid #ddd", 
    backgroundColor: "#1a1a1a", 
    color: "#fff", 
    textAlign: "center" as const,
    boxSizing: "border-box" as const 
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1>Bienvenido a MyNest</h1>
        <p>La red social para dueños de mascotas.</p>
      </div>
    </div>
  );
}
