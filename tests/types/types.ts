export type Article = {
  slug?: string;
  title: string;
  description: string;
  body: string;
  tagList?: string[];
  createdAt?: string;
  updatedAt?: string;
  favorited?: boolean;
  favoritesCount?: number;
  author?: User;
};

export type User = {
  id?: number;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  token?: string;
  password?: string;
};

export type Comment = {
  comment: {
    body: string
  }
}

export type CommentResponse = {
  comment: {
    id: string;
    createdAt: string;
    body: string;
    author: {
      username: string;
      image: string;
      following: boolean;
    };
  };
}