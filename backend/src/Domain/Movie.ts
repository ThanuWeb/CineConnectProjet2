export type Movie = {
  id: string;
  omdbId: string | null;
  title: string;
  year: number | null;
  director: string | null;
  posterUrl: string | null;
  plot: string | null;
  runtimeMinutes: number | null;
  actors: string | null;
  imdbRating: string | null;
  createdAt: Date;
  updatedAt: Date;
};
