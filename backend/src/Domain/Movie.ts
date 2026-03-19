export type Movie = {
  id: string;
  omdbId: string | null;
  title: string;
  year: number | null;
  director: string | null;
  posterUrl: string | null;
  plot: string | null;
  runtimeMinutes: number | null;
  createdAt: Date;
  updatedAt: Date;
};
