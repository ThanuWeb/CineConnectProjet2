import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const faqItems = [
  {
    question: "CineConnect, c’est quoi ?",
    answer: "CineConnect est une plateforme gratuite dédiée aux films, séries et documentaires. Elle permet aussi de discuter en temps réel avec vos amis grâce à un chat intégré."
  },
  {
    question: "Est-ce gratuit ?",
    answer: "Oui, CineConnect est entièrement gratuit et sans limite d’utilisation."
  },
  {
    question: "Disponible sur mobile ?",
    answer: "Oui, CineConnect est compatible avec smartphones, tablettes et ordinateurs."
  },
  {
    question: "Créer un compte ?",
    answer: "Clique sur 'S’inscrire' et suis les étapes pour créer ton compte."
  },
  {
    question: "Modifier mon profil ?",
    answer: "Tu peux modifier ton profil depuis ton espace utilisateur."
  },
  {
    question: "Pourquoi un film manque ?",
    answer: "Le catalogue évolue selon les droits de diffusion et les ajouts réguliers."
  }
]

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen  text-white px-6 py-16">

        {/* HEADER */}
        <div className="max-w-5xl mx-auto mb-14 text-center">
          <h1 className="text-4xl font-bold mb-3">Questions fréquentes</h1>
          <p className="text-gray-400">
            Trouve rapidement les réponses aux questions courantes.
          </p>
        </div>

        {/* GRID FIX */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 items-start">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-300
                  ${isOpen
                    ? "bg-[#111] border-gray-600"
                    : "bg-black border-gray-800 hover:bg-[#111] hover:border-gray-600"
                  }`}
              >

                {/* HEADER */}
                <div
                  onClick={() => toggle(index)}
                  className="flex justify-between items-center cursor-pointer p-5"
                >
                  <h2 className="text-lg font-medium">
                    {item.question}
                  </h2>

                  <span className={`text-xl ${isOpen ? "text-white" : "text-gray-500"}`}>
                    {isOpen ? "−" : "+"}
                  </span>
                </div>

                {/* ANSWER */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-800">
                    <p className="text-gray-400 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}

              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="max-w-5xl mx-auto mt-20 text-center">
          <p className="text-gray-500 mb-4">
            Tu ne trouves pas ta réponse ?
          </p>
          <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:scale-105 transition">
            Contacter le support
          </button>
        </div>

      </main>

      <Footer />
    </>
  )
}

export default Faq