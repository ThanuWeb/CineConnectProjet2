import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-gray-100 py-10 px-6 border-t border-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Cineconnect</h3>
          <p className="text-slate-300 leading-relaxed">Regardez des films avec vos amis en temps réel et partagez l'expérience cinéma, même à distance. Créez des salles privées, discutez, et notez vos coups de cœur.
          </p>
          <p className="mt-4 text-slate-400 text-sm">contact@cineconnect.com</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Informations</h4>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li><a href="/privacy" className="hover:text-white transition">Politique de confidentialité</a></li>
            <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
            <li><a href="/help" className="hover:text-white transition">Centre d'aide</a></li>
            <li><a href="/support" className="hover:text-white transition">Support</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Newsletter</h4>
          <p className="text-slate-300 text-sm">Restez informé des nouveautés et offres exclusives.</p>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
            <input type="email" placeholder="Ton email" className="w-full sm:flex-1 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button className="w-full sm:w-auto px-4 py-2 bg-slate-500 hover:bg-slate-400 text-slate-900 rounded font-medium transition">
              S'inscrire
            </button>
          </div>

          <h4 className="text-lg font-semibold text-white mt-7 mb-3">Suivez-nous</h4>
          <div className="flex gap-3 text-slate-300 text-sm">
            <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              Twitter
            </a>
            <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              Facebook
            </a>
            <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              Tiktok
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 border-t border-slate-800 pt-4 text-center text-slate-400 text-xs">
        © {new Date().getFullYear()} Cineconnect. Tous droits réservés.
      </div>
    </footer>
  )
}

export default Footer
