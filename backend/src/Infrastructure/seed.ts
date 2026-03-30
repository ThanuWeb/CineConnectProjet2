import "dotenv/config";
import { db } from "./drizzle";
import { films, categories, filmsCategories } from "./schema";
import { eq } from "drizzle-orm";

const seedFilms = [
  {
    omdbId: "tt0111161",
    title: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_SX300.jpg",
    plot: "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.",
    runtimeMinutes: 142,
    actors: "Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler",
    imdbRating: "9.3",
    categories: ["Drame"],
  },
  {
    omdbId: "tt0068646",
    title: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.",
    runtimeMinutes: 175,
    actors: "Marlon Brando, Al Pacino, James Caan, Diane Keaton",
    imdbRating: "9.2",
    categories: ["Drame", "Crime"],
  },
  {
    omdbId: "tt0468569",
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    runtimeMinutes: 152,
    actors: "Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine",
    imdbRating: "9.0",
    categories: ["Action", "Crime", "Drame"],
  },
  {
    omdbId: "tt0071562",
    title: "The Godfather Part II",
    year: 1974,
    director: "Francis Ford Coppola",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    plot: "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.",
    runtimeMinutes: 202,
    actors: "Al Pacino, Robert De Niro, Robert Duvall, Diane Keaton",
    imdbRating: "9.0",
    categories: ["Drame", "Crime"],
  },
  {
    omdbId: "tt0050083",
    title: "12 Angry Men",
    year: 1957,
    director: "Sidney Lumet",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BYjE4NzdmOTYtYjc5Yi00YzBiLWEzNDEtNTgxZGQ2MWVkN2NiXkEyXkFqcGc@._V1_SX300.jpg",
    plot: "The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to more carefully consider the evidence before voting.",
    runtimeMinutes: 96,
    actors: "Henry Fonda, Lee J. Cobb, Martin Balsam, John Fiedler",
    imdbRating: "9.0",
    categories: ["Drame"],
  },
  {
    omdbId: "tt0108052",
    title: "Schindler's List",
    year: 1993,
    director: "Steven Spielberg",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    plot: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    runtimeMinutes: 195,
    actors: "Liam Neeson, Ben Kingsley, Ralph Fiennes, Caroline Goodall",
    imdbRating: "8.9",
    categories: ["Drame", "Historique"],
  },
  {
    omdbId: "tt0167260",
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
    director: "Peter Jackson",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMTZkMjBjNWMtZGI5OC00MGU0LTk4ZTItODg2NWM3NTVmNWQ4XkEyXkFqcGc@._V1_SX300.jpg",
    plot: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    runtimeMinutes: 201,
    actors: "Elijah Wood, Viggo Mortensen, Ian McKellen, Orlando Bloom",
    imdbRating: "8.9",
    categories: ["Aventure", "Fantastique"],
  },
  {
    omdbId: "tt0110912",
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_SX300.jpg",
    plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    runtimeMinutes: 154,
    actors: "John Travolta, Uma Thurman, Samuel L. Jackson, Bruce Willis",
    imdbRating: "8.9",
    categories: ["Crime", "Drame"],
  },
  {
    omdbId: "tt0120737",
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
    director: "Peter Jackson",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOGY3NTVmNWQ4XkEyXkFqcGc@._V1_SX300.jpg",
    plot: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    runtimeMinutes: 178,
    actors: "Elijah Wood, Ian McKellen, Orlando Bloom, Sean Astin",
    imdbRating: "8.8",
    categories: ["Aventure", "Fantastique"],
  },
  {
    omdbId: "tt0137523",
    title: "Fight Club",
    year: 1999,
    director: "David Fincher",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_SX300.jpg",
    plot: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    runtimeMinutes: 139,
    actors: "Brad Pitt, Edward Norton, Meat Loaf, Zach Grenier",
    imdbRating: "8.8",
    categories: ["Drame", "Thriller"],
  },
  {
    omdbId: "tt0109830",
    title: "Forrest Gump",
    year: 1994,
    director: "Robert Zemeckis",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTYtZmU5YzQtYThmMmY4NWYwNjlkMTQ5MGEwNjlmODc1ODE5YzE3XkEyXkFqcGc@._V1_SX300.jpg",
    plot: "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.",
    runtimeMinutes: 142,
    actors: "Tom Hanks, Robin Wright, Gary Sinise, Sally Field",
    imdbRating: "8.8",
    categories: ["Drame", "Comédie"],
  },
  {
    omdbId: "tt0133093",
    title: "The Matrix",
    year: 1999,
    director: "Lana Wachowski, Lilly Wachowski",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZDYxZjlhZjhkXkEyXkFqcGc@._V1_SX300.jpg",
    plot: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth -- the life he knows is the elaborate deception of an evil cyber-intelligence.",
    runtimeMinutes: 136,
    actors: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving",
    imdbRating: "8.7",
    categories: ["Action", "Science-Fiction"],
  },
  {
    omdbId: "tt0080684",
    title: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
    director: "Irvin Kershner",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMTkxNGFlNDktZmJkNC00MDdhLTg0MTEtZjZiYWI3MGE5NWIwXkEyXkFqcGc@._V1_SX300.jpg",
    plot: "After the Rebels are overpowered by the Empire, Luke Skywalker begins his Jedi training with Yoda, while his friends are pursued across the galaxy by Darth Vader and bounty hunter Boba Fett.",
    runtimeMinutes: 124,
    actors: "Mark Hamill, Harrison Ford, Carrie Fisher, Billy Dee Williams",
    imdbRating: "8.7",
    categories: ["Action", "Aventure", "Science-Fiction"],
  },
  {
    omdbId: "tt1375666",
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    runtimeMinutes: 148,
    actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Tom Hardy",
    imdbRating: "8.7",
    categories: ["Action", "Science-Fiction", "Thriller"],
  },
  {
    omdbId: "tt0167261",
    title: "The Lord of the Rings: The Two Towers",
    year: 2002,
    director: "Peter Jackson",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMGQxMDdiOWUtYjc1Ni00YzM1LWE2NjMtZTg3Y2JkMjEzMTJjXkEyXkFqcGc@._V1_SX300.jpg",
    plot: "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
    runtimeMinutes: 179,
    actors: "Elijah Wood, Ian McKellen, Viggo Mortensen, Orlando Bloom",
    imdbRating: "8.7",
    categories: ["Aventure", "Fantastique"],
  },
  {
    omdbId: "tt0816692",
    title: "Interstellar",
    year: 2014,
    director: "Christopher Nolan",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg",
    plot: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    runtimeMinutes: 169,
    actors: "Matthew McConaughey, Anne Hathaway, Jessica Chastain, Bill Irwin",
    imdbRating: "8.6",
    categories: ["Aventure", "Science-Fiction", "Drame"],
  },
  {
    omdbId: "tt0114369",
    title: "Se7en",
    year: 1995,
    director: "David Fincher",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BY2IzNzMxZjctZjUxZi00YzAxLTk3ZjMtODFjOTdhN2IwMTAxXkEyXkFqcGc@._V1_SX300.jpg",
    plot: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
    runtimeMinutes: 127,
    actors: "Morgan Freeman, Brad Pitt, Kevin Spacey, Andrew Kevin Walker",
    imdbRating: "8.6",
    categories: ["Crime", "Thriller"],
  },
  {
    omdbId: "tt0245429",
    title: "Spirited Away",
    year: 2001,
    director: "Hayao Miyazaki",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    plot: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches and spirits, and where humans are changed into beasts.",
    runtimeMinutes: 125,
    actors: "Daveigh Chase, Suzanne Pleshette, Miyu Irino, Mari Natsuki",
    imdbRating: "8.6",
    categories: ["Animation", "Aventure", "Fantastique"],
  },
  {
    omdbId: "tt0120689",
    title: "The Green Mile",
    year: 1999,
    director: "Frank Darabont",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_SX300.jpg",
    plot: "A tale set on death row, where gentle giant John Coffey possesses the mysterious power to heal people's ailments. When the lead guard, Paul Edgecomb, recognizes John's gift, he tries to help stave off the condemned man's execution.",
    runtimeMinutes: 189,
    actors: "Tom Hanks, Michael Clarke Duncan, David Morse, Bonnie Hunt",
    imdbRating: "8.6",
    categories: ["Drame", "Fantastique"],
  },
  {
    omdbId: "tt0482571",
    title: "The Prestige",
    year: 2006,
    director: "Christopher Nolan",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_SX300.jpg",
    plot: "After a tragic accident, two stage magicians in 1890s London engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.",
    runtimeMinutes: 130,
    actors: "Christian Bale, Hugh Jackman, Scarlett Johansson, Michael Caine",
    imdbRating: "8.5",
    categories: ["Drame", "Thriller", "Science-Fiction"],
  },
];

const seedCategories = [
  { name: "Action", description: "Films d'action et de combats" },
  { name: "Aventure", description: "Films d'aventure et d'exploration" },
  { name: "Animation", description: "Films d'animation" },
  { name: "Comédie", description: "Films comiques" },
  { name: "Crime", description: "Films policiers et criminels" },
  { name: "Drame", description: "Films dramatiques" },
  { name: "Fantastique", description: "Films fantastiques et de fantasy" },
  { name: "Historique", description: "Films historiques" },
  { name: "Horreur", description: "Films d'horreur" },
  { name: "Romance", description: "Films romantiques" },
  { name: "Science-Fiction", description: "Films de science-fiction" },
  { name: "Thriller", description: "Films à suspense" },
];

async function seed() {
  // 1. Seed des catégories
  console.log("Seeding categories...");
  for (const cat of seedCategories) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }
  console.log(`${seedCategories.length} catégories insérées !`);

  // 2. Seed des films
  console.log("Seeding films...");
  for (const film of seedFilms) {
    const { categories: filmCats, ...filmData } = film;
    await db.insert(films).values(filmData).onConflictDoNothing();
  }
  console.log(`${seedFilms.length} films insérés !`);

  // 3. Seed des associations films <-> catégories
  console.log("Seeding films_categories...");
  for (const film of seedFilms) {
    // Récupérer le film par omdbId
    const [dbFilm] = await db
      .select()
      .from(films)
      .where(eq(films.omdbId, film.omdbId))
      .limit(1);
    if (!dbFilm) continue;

    for (const catName of film.categories) {
      const [dbCat] = await db
        .select()
        .from(categories)
        .where(eq(categories.name, catName))
        .limit(1);
      if (!dbCat) continue;

      await db
        .insert(filmsCategories)
        .values({ filmId: dbFilm.id, categoryId: dbCat.id })
        .onConflictDoNothing();
    }
  }
  console.log("Associations films/catégories insérées !");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Erreur lors du seed:", err);
  process.exit(1);
});
