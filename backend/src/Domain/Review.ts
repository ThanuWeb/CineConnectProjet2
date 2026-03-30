export type Review = {
  id: string;
  userId: string;
  filmId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
};
