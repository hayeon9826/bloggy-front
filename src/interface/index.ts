export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  posts?: Post[];
  imageUrl?: string;
}
