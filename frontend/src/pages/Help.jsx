import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const supportOptions = [
  {
    type: "Email",
    description: "Envoyez-nous un message via email.",
    info: "support@cineconnect.com"
  },
  {
    type: "Chat",
    description: "Discutez avec notre équipe en direct.",
    info: "Ouvrir le chat"
  },
  {
    type: "Téléphone",
    description: "Appelez-nous directement.",
    info: "+33 1 23 45 67 89"
  }
]

const Support = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [activeOption, setActiveOption] = useState(null)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Merci ${formData.name}, votre message a été envoyé !`)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen text-white px-6 py-16">

        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Besoin d'aide ?</h1>
          <p className="text-gray-400 text-lg">
            Contactez notre équipe via le moyen de votre choix ou envoyez un message direct.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">

          <div className="space-y-6">
            {supportOptions.map((opt, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl border border-gray-700 bg-[#0f0f0f] cursor-pointer hover:bg-gray-900 transition`}
                onClick={() => setActiveOption(idx === activeOption ? null : idx)}
              >
                <h2 className="text-xl font-semibold mb-1">{opt.type}</h2>
                <p className="text-gray-400 mb-2">{opt.description}</p>
                <span className="text-gray-300 font-medium">{opt.info}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#0f0f0f] p-8 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6">Envoyez un message</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Votre nom" className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-gray-600 text-gray-100 placeholder-gray focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition outline-none"
                required
              />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Votre email" className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-gray-600 text-gray-100 placeholder-gray focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition outline-none" required
              />
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Votre message" rows="5" className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-gray-600 text-gray-100 placeholder-gray focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition outline-none" required
              ></textarea>

              <button type="submit" className="w-full bg-white text-black px-4 py-3 rounded-lg font-medium hover:scale-105 transition" >Envoyer </button>
            </form>
          </div>

        </div>
        <div className="max-w-5xl mx-auto mt-16 text-center">
          <p className="text-gray-500">
            Vous ne trouvez pas votre réponse ? <span className="text-white underline cursor-pointer">Contactez le support</span>
          </p>
        </div>

      </div>
      <Footer />
    </>
  )
}

export default Support