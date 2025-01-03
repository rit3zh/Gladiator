export interface Bookmarks {
  content: string;
  date: Date | string;
  user: {
    name: string;
    avatar?: string;
  };
}
export interface User {
  linked: boolean;
  uid: string;
  email: string | null;
  displayName: string;
  photoURL: string;
  password: string;
  username?: string;
  online?: boolean;
  lastSeen?: string;
  bookmarks?: Bookmarks[];
}
