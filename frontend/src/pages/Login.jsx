import React from 'react'

const Login = () => {
  return (
    <>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[300px] lg:w-[350px]">
        {/* Container du card */}
        <span className=" block text-center font-bold text-xl">CineConnect</span>
        <hr className="my-4" />

        {/* Container Input */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="username">Votre identifiant</label>
            <input  type="text" id="username" placeholder="Identifiant" className="border p-2 rounded text-black"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password">Votre mot de passe</label>
            <input type="password" id="password" placeholder="Mot de passe" className="border p-2 rounded"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;