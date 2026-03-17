export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative mx-auto" style={{ width: "500px" }}>

      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un film..."
        style={{
          width: "100%",
          padding: "12px 20px 12px 40px",
          borderRadius: "999px",
          border: "1px solid #ccc",
          outline: "none",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}