import { eq, ilike } from "drizzle-orm";
import { Movie } from "../../Domain/Movie";
import { db } from "../drizzle";
import { films } from "../schema";

export class MovieRepository {
  // Recuperer tous les films
  async getAllMovies(): Promise<Movie[]> {
    const result = await db.select().from(films);
    return result;
  }

  // Recuperer un film par son ID
  async getMovieById(id: string): Promise<Movie | null> {
    const result = await db
      .select()
      .from(films)
      .where(eq(films.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  }

  // Recuperer un film par son titre exact
  async getMovieByName(title: string): Promise<Movie | null> {
    const result = await db.select().from(films).where(eq(films.title, title));
    return result.length > 0 ? result[0] : null;
  }

  // Rechercher des films par titre partiel (pour la barre de recherche)
  async searchByTitle(title: string): Promise<Movie[]> {
    const result = await db
      .select()
      .from(films)
      .where(ilike(films.title, `%${title}%`));
    return result;
  }

  // Recuperer un film par son ID OMDB
  async getMovieByOmdbId(omdbId: string): Promise<Movie | null> {
    const result = await db
      .select()
      .from(films)
      .where(eq(films.omdbId, omdbId))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  }

  // Ajouter un nouveau film
  async addMovie(
    movie: Omit<Movie, "id" | "createdAt" | "updatedAt">,
  ): Promise<Movie> {
    const [newMovie] = await db.insert(films).values(movie).returning();
    return newMovie;
  }

  // Mettre à jour un film existant
  async updateMovie(
    id: string,
    updates: Partial<Omit<Movie, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Movie | null> {
    const [updatedMovie] = await db
      .update(films)
      .set(updates)
      .where(eq(films.id, id))
      .returning();
    return updatedMovie || null;
  }

  // Supprimer un film
  async deleteMovie(id: string): Promise<void> {
    await db.delete(films).where(eq(films.id, id));
  }
}
