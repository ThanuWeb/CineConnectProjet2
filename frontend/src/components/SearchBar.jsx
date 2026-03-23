export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un film..."
        className="w-full bg-white text-black rounded-full px-6 py-3 outline-none"
      />
    </div>
  );
}