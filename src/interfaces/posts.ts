import type { Commenti } from "./commenti";
import type { UserI } from "./usert";

export interface PostI {
  _id: string;
  body: string;
  image: string;
  privacy: "public";
  user: UserI;
  sharedPost: null;
  likes: unknown[];
  createdAt: string;
  commentsCount: number;
  topComment: Commenti;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}