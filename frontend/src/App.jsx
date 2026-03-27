import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Film from "./pages/Film";
import FilmDetail from "./pages/FilmDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* redirection vers films */}
        <Route path="/" element={<Navigate to="/film" />} />

        {/* page films */}
        <Route path="/film" element={<Film />} />

        {/* page détail */}
        <Route path="/film/:id" element={<FilmDetail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;