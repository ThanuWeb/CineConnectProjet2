import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

const API_KEY = 'bbea3217'
const DEFAULT_SEARCH = 'movie' // mot-clé par défaut

const Film = () => {
  const [movies, setMovies] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchMovies = async (searchTerm) => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}&type=movie`
      )
      const data = await response.json()

      if (data.Response === 'True') {
        setMovies(data.Search)
      } else {
        setError(data.Error)
      }
    } catch (err) {
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  // 🔥 chargement automatique
  useEffect(() => {
    fetchMovies(DEFAULT_SEARCH)
  }, [])

  return (
    <>
      <Navbar />

      <div style={{ padding: '20px' }}>
        <h2>Films par défaut 🎬</h2>

        {loading && <p>Chargement...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {movies.map((movie) => (
            <div key={movie.imdbID}>
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : ''}
                alt={movie.Title}
                width="150"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Film
