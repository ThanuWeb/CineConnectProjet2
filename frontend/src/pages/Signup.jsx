import { Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";

const Login = () => {

  const [emailValue, setEmailValue] = useState(null)
  const [pwdValue, setPwdValue] = useState(null)
  const navigate = useNavigate();
  // Partie vers le backend 
  function handleSubmit() {

  }
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      

      <div className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-8 sm:p-12">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
            CineConnect
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Créez à votre espace personnel
          </p>
        </div>

       
        <form className="space-y-6">
          
         
          <div className="relative">
            <input type="text" placeholder="Votre identifiant" className="w-full border-b-2 border-gray-300 focus:border-black outline-none py-3 text-black bg-transparent transition"/>
          </div>

          <div className="relative">
            <input type="password" placeholder="Votre mot de passe" value={pwdValue} onChange={(e) => setPwdValue(e.target.value)} className="w-full border-b-2 border-gray-300 focus:border-black outline-none py-3 text-black bg-transparent transition"
            />
          </div>
          <button type="submit" className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition duration-200"onClick={handleSubmit()}
          >
            Se connecter
          </button>
          <div className="flex justify-between items-center text-black underline">
            <p>Mot de passe oublié ? </p>
           <Link to="/login"> <p>Vous avez déja un compte ?</p> </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
