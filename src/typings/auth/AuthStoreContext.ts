import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { type User } from "../user/User";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

export interface AuthState {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  createUserWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<{ user: FirebaseAuthTypes.User | null; error: string | null }>;

  createAccount: (user: User) => any;
  error: string | null;
  login: (
    email: string,
    password: string,
    navigation?: NativeStackHeaderProps
  ) => Promise<{ user: FirebaseAuthTypes.User | null; error: string | null }>;
  logingWithGoogle: (
    authCredentials: FirebaseAuthTypes.AuthCredential
  ) => Promise<{ user: FirebaseAuthTypes.User | null; error: string | null }>;
  logout: () => Promise<void>;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  createUserInFirestoreViaGoogle: (
    user: FirebaseAuthTypes.User
  ) => Promise<User>;
}
