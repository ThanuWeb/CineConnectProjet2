import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock api
jest.mock("../api", () => ({
  apiFetch: jest.fn(),
  setTokens: jest.fn(),
  getToken: jest.fn(),
}));

// Mock TanStack Router
const mockNavigate = jest.fn();
jest.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

import Login from "../pages/Login";
import { apiFetch, setTokens } from "../api";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Login", () => {
  it("devrait afficher le formulaire", () => {
    render(<Login />);

    expect(screen.getByPlaceholderText("Votre email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Votre mot de passe"),
    ).toBeInTheDocument();
    expect(screen.getByText("Se connecter")).toBeInTheDocument();
  });

  it("devrait afficher un message si champs vides", async () => {
    render(<Login />);

    await userEvent.click(screen.getByText("Se connecter"));

    expect(
      screen.getByText("Veuillez compléter tous les champs"),
    ).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("devrait appeler apiFetch et naviguer vers /film après login réussi", async () => {
    apiFetch.mockResolvedValue({
      accessToken: "jwt-token-123",
      refreshToken: "jwt-refresh-token-123",
    });

    render(<Login />);

    await userEvent.type(
      screen.getByPlaceholderText("Votre email"),
      "john@test.com",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Votre mot de passe"),
      "secret123",
    );
    await userEvent.click(screen.getByText("Se connecter"));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith("/login", {
        method: "POST",
        body: JSON.stringify({ email: "john@test.com", password: "secret123" }),
      });
      expect(setTokens).toHaveBeenCalledWith(
        "jwt-token-123",
        "jwt-refresh-token-123",
      );
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/film" });
    });
  });

  it("devrait afficher un message d'erreur si login échoue", async () => {
    apiFetch.mockRejectedValue(new Error("Email ou mot de passe incorrect"));

    render(<Login />);

    await userEvent.type(
      screen.getByPlaceholderText("Votre email"),
      "john@test.com",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Votre mot de passe"),
      "mauvais",
    );
    await userEvent.click(screen.getByText("Se connecter"));

    await waitFor(() => {
      expect(
        screen.getByText("Email ou mot de passe incorrect"),
      ).toBeInTheDocument();
    });
  });

  it("devrait naviguer vers / au clic sur Retour (history > 1)", async () => {
    Object.defineProperty(window, "history", {
      value: { length: 3 },
      writable: true,
    });

    render(<Login />);
    await userEvent.click(screen.getByText(">> Retour"));

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
  });

  it("devrait naviguer vers / au clic sur Retour (history <= 1)", async () => {
    Object.defineProperty(window, "history", {
      value: { length: 1 },
      writable: true,
    });

    render(<Login />);
    await userEvent.click(screen.getByText(">> Retour"));

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
  });
});
