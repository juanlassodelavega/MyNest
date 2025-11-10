// src/components/Footer.tsx
export default function Footer() {
  const year = new Date().getFullYear();

  const footerStyle: React.CSSProperties = {
    width: "100%",
    padding: "16px 32px",
    backgroundColor: "#1a1a1a",
    color: "#aaa",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.9rem",
    boxSizing: "border-box",
    borderTop: "1px solid #333",
  };

  const textStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  return (
    <footer style={footerStyle}>
      <div style={textStyle}>
        <span>
          💡 Ideado por <strong>Miguel Lasso de la Vega</strong>
        </span>
        <span>
          👨‍💻 Desarrollado por <strong>Juan Lasso de la Vega</strong>
        </span>
      </div>
      <div style={textStyle}>
        <span>© {year} MyNest</span>
        <span>Todos los derechos reservados</span>
      </div>
    </footer>
  );
}
