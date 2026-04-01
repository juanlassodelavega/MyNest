export default function Footer() {
  const year = new Date().getFullYear();

  const footerStyle: React.CSSProperties = {
    width: "100%",
    padding: "16px 32px",
    backgroundColor: "var(--surface)",
    color: "var(--ink-muted)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.9rem",
    boxSizing: "border-box",
    borderTop: "1px solid var(--line)",
    gap: 10,
    flexWrap: "wrap",
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
          Product concept by <strong>Miguel Lasso de la Vega</strong>
        </span>
        <span>
          Built by <strong>Juan Lasso de la Vega</strong>
        </span>
      </div>
      <div style={textStyle}>
        <span>© {year} MyNest</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
}
