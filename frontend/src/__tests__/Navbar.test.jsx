import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../components/Navbar";

jest.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("Navbar", () => {
  it("devrait afficher le titre CineConnect", () => {
    render(<Navbar />);
    expect(screen.getByText("CineConnect")).toBeInTheDocument();
  });

  it("devrait afficher les liens S'identifier et S'inscrire", () => {
    render(<Navbar />);
    const identifierButtons = screen.getAllByText("S'identifier");
    const inscrireButtons = screen.getAllByText("S'inscrire");
    expect(identifierButtons.length).toBeGreaterThanOrEqual(1);
    expect(inscrireButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("devrait afficher les items de navigation", () => {
    render(<Navbar />);
    const films = screen.getAllByText("Films-Series");
    const docs = screen.getAllByText("Documentaires");
    const faq = screen.getAllByText("FAQ");
    expect(films.length).toBeGreaterThanOrEqual(1);
    expect(docs.length).toBeGreaterThanOrEqual(1);
    expect(faq.length).toBeGreaterThanOrEqual(1);
  });

  it("devrait ouvrir le menu mobile au clic sur le burger", () => {
    render(<Navbar />);
    const burger = screen.getByText("☰");
    fireEvent.click(burger);

    // After clicking, the sidebar should have translate-x-0 (open)
    const sidebar = screen.getByText("Menu").closest("div").parentElement;
    expect(sidebar.className).toContain("translate-x-0");
  });

  it("devrait fermer le menu mobile au clic sur ✕", () => {
    render(<Navbar />);
    // Open the menu first
    fireEvent.click(screen.getByText("☰"));

    // Close it
    fireEvent.click(screen.getByText("✕"));

    // Sidebar should have translate-x-full (closed)
    const sidebar = screen.getByText("Menu").closest("div").parentElement;
    expect(sidebar.className).toContain("translate-x-full");
  });
});
