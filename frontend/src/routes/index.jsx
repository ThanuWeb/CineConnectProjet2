import { createFileRoute } from '@tanstack/react-router'
import Navbar from '../components/Navbar'
import newsLetterIcon from '../assets/icons/newsLetterIcon.svg'
export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center mt-8">
        <h1
          className="text-[20px] md:text-[25px] lg:text-[30px] lg:w-[700px] font-bold text-center w-[400px]"style={{animationName: 'fadeInUp',animationDuration: '2s',
            animationFillMode: 'forwards',
          }}
        >
          Regardez, chatez et profitez avec vos amis en temps réel même à distance !
        </h1>

        <small className="text-gray-400 text-center text-[14px] w-[380px] mt-[10px]">
          Profitez de nouvelles offres et restez informé des nouveautés en vous inscrivant à notre newsletter.
        </small>

        <div className="mt-8 flex  sm:flex-row items-center gap-4">
          <input
            className="w-full sm:w-[350px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600  transition"
            type="email"
            name="mail"
            id="mail"
            placeholder="monmail@exemple.com"
          />
          <button
            className="w-full sm:w-auto bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition flex items-center"
            type="button"
          > <img className='mr-2' src={newsLetterIcon}></img>
            S'inscrire
          </button>
        </div>
      </div>
<section id="movies">

    {/* Affichier les films ici */} {/* Affichier les films ici */} {/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}{/* Affichier les films ici */}
</section>
<section id="">

</section>
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  )
}
