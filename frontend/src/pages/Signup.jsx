import { Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { apiFetch } from "../api";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [pwdValue, setPwdValue] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!username.trim() || !emailValue.trim() || !pwdValue.trim()) {
      setMessage("Veuillez compléter tous les champs");
      return;
    }

    try {
      await apiFetch("/signup", {
        method: "POST",
        body: JSON.stringify({
          username,
          email: emailValue,
          password: pwdValue,
        }),
      });
      navigate({ to: "/login" });
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-8 sm:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
            CineConnect
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Créez votre espace personnel
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              placeholder="Votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:border-black outline-none py-3 text-black bg-transparent transition"
            />
          </div>
          <div className="relative">
            <input
              type="email"
              placeholder="Votre email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:border-black outline-none py-3 text-black bg-transparent transition"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={pwdValue}
              onChange={(e) => setPwdValue(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:border-black outline-none py-3 text-black bg-transparent transition"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition duration-200"
          >
            S'inscrire
          </button>
          <div className="flex justify-between items-center text-black underline">
            <p>Mot de passe oublié ?</p>
            <Link to="/login">
              <p>Vous avez déjà un compte ?</p>
            </Link>
          </div>
          {message && (
            <p className="text-red-500 mt-4 text-center">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
