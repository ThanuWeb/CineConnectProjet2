import { Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { apiFetch, setToken } from "../api";

const Login = () => {
  const [emailValue, setEmailValue] = useState("");
  const [pwdValue, setPwdValue] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (emailValue.trim() === "" || pwdValue.trim() === "") {
      setMessage("Veuillez compléter tous les champs");
      return;
    }

    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email: emailValue, password: pwdValue }),
      });
      setToken(data.token);
      navigate({ to: "/film" });
    } catch (err) {
      setMessage(err.message);
    }
  }

  const goBack = () => {
    if (window.history.length > 1) {
      navigate({ to: "/" });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-8 sm:p-12">
        <p className="text-black cursor-pointer mb-4" onClick={goBack}>
          &gt;&gt; Retour
        </p>
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
            CineConnect
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Accédez à votre espace personnel
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
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
            Se connecter
          </button>
          <div className="flex justify-between items-center text-black underline">
            <p>Mot de passe oublié ?</p>
            <Link to="/signup">
              <p>Vous n'avez pas de compte ?</p>
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

export default Login;
