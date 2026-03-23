import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("../api", () => ({
  apiFetch: jest.fn(),
  getToken: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

import Signup from "../pages/Signup";
import { apiFetch } from "../api";

beforeEach(() => jest.clearAllMocks());

describe("Signup", () => {
  it("devrait afficher le formulaire d'inscription", () => {
    render(<Signup />);

    expect(
      screen.getByPlaceholderText("Votre nom d'utilisateur"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Votre email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Votre mot de passe"),
    ).toBeInTheDocument();
    expect(screen.getByText("S'inscrire")).toBeInTheDocument();
  });

  it("devrait afficher un message si champs vides", async () => {
    render(<Signup />);

    await userEvent.click(screen.getByText("S'inscrire"));

    expect(
      screen.getByText("Veuillez compléter tous les champs"),
    ).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("devrait appeler apiFetch et naviguer vers /login après inscription", async () => {
    apiFetch.mockResolvedValue({});

    render(<Signup />);

    await userEvent.type(
      screen.getByPlaceholderText("Votre nom d'utilisateur"),
      "john",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Votre email"),
      "john@test.com",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Votre mot de passe"),
      "secret123",
    );
    await userEvent.click(screen.getByText("S'inscrire"));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith("/signup", {
        method: "POST",
        body: JSON.stringify({
          username: "john",
          email: "john@test.com",
          password: "secret123",
        }),
      });
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
    });
  });

  it("devrait afficher un message d'erreur si inscription échoue", async () => {
    apiFetch.mockRejectedValue(new Error("Email déjà utilisé"));

    render(<Signup />);

    await userEvent.type(
      screen.getByPlaceholderText("Votre nom d'utilisateur"),
      "john",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Votre email"),
      "john@test.com",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Votre mot de passe"),
      "secret123",
    );
    await userEvent.click(screen.getByText("S'inscrire"));

    await waitFor(() => {
      expect(screen.getByText("Email déjà utilisé")).toBeInTheDocument();
    });
  });
});
