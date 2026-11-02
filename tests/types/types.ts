export type Article = {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
};

export type PublishedArticle = Required<Article> & {
  slug: string;
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: { username: string; image: string | null; following: boolean };
};

export type Registration = {
  username: string;
  email: string;
  password: string;
};

export type Comment = {
  comment: { body: string };
};
