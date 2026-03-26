import { createFileRoute } from '@tanstack/react-router'
import Navbar from '../components/Navbar'
import newsLetterIcon from '../assets/icons/newsLetterIcon.svg'
import { useEffect, useState } from 'react'
import Footer from '../components/Footer'

const API_KEY = 'bbea3217'
const DEFAULT_SEARCH = 'movie'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [movies, setMovies] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchMovies = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${DEFAULT_SEARCH}&type=movie`
      )
      const data = await res.json()

      if (data.Response === 'True') {
        setMovies(data.Search.slice(0, 10))
      } else {
        setError(data.Error)
      }
    } catch {
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <section className="flex flex-col items-center text-center mt-12 px-6">
        <h1 className="text-[22px] md:text-[28px] lg:text-[34px] font-bold max-w-2xl animate-fadeInUp">
          Regardez, chatez et profitez avec vos amis en temps réel même à distance !
        </h1>

        <p className="text-gray-400 mt-3 max-w-md text-sm">
          Profitez de nouvelles offres et restez informé des nouveautés en vous inscrivant à notre newsletter.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <input className="w-full px-4 py-2 rounded-md text-black" type="email" placeholder="monmail@exemple.com"
          />

         <button className="bg-gray-600 hover:bg-gray-700 transition px-4 py-2 rounded-md flex items-center justify-center gap-2 whitespace-nowrap">
  <img src={newsLetterIcon} alt="" className="w-4 h-4 shrink-0" />
  <span className="truncate">S'inscrire</span>
</button>
        </div>

        <div className="mt-12 w-full flex justify-center">
          <svg viewBox="0 0 1440 200" className="w-[90%] h-32">
            <defs>
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>

            <path d="M0,150 Q720,20 1440,150" fill="transparent" stroke="url(#arcGradient)" strokeWidth="14" opacity="0.4" style={{ filter: 'blur(8px)' }}
            />

            <path d="M0,150 Q720,20 1440,150" fill="transparent" stroke="url(#arcGradient)" strokeWidth="3"
            />
          </svg>
        </div>


        <div className="mt-6 opacity-70 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      <section className="px-6 pb-16 mt-10">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-10 gap-x-12 max-w-7xl mx-auto justify-items-center">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-800 animate-pulse rounded-md" />
            ))}
          </div>
        )}

        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-10 gap-x-12 max-w-7xl mx-auto justify-items-center">
            {movies.map((movie) => (
              <div key={movie.imdbID} className="group relative cursor-pointer flex flex-col items-center">
                <img src={
                    movie.Poster !== 'N/A'
                      ? movie.Poster
                      : 'https://via.placeholder.com/300x450'
                  }
                  alt={movie.Title}
                  className="w-full h-56 object-cover rounded-lg transition duration-300 group-hover:scale-105 shadow-lg"
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition rounded-md flex items-end p-2">
                  <p className="text-[11px] mt-1 text-center leading-tight">{movie.Title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <style>
        {`
          .animate-fadeInUp {
            animation: fadeInUp 1s ease forwards;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <Footer />
    </div>
  )
}
