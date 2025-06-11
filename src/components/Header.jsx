const Header = ({ count }) => (
  <header>
    <h1 style={{ fontFamily: "Poppins, system-ui, sans-serif" }}>
      E-Commerce Dashboard
    </h1>
    <span
      style={{
        color: "#64748b",
        fontSize: "1rem",
        fontWeight: 500,
      }}
    >
      Total Products:{" "}
      <span style={{ fontWeight: 700, color: "#4f46e5" }}>{count}</span>
    </span>
  </header>
);

export default Header;
