import { create } from "zustand";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";
import { type AuthState } from "@/typings/index";
import { type User } from "@/typings/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ASYNC_STORAGE_USER_KEY_NAME } from "#/keys/AsyncStorageKey";
import { getAccountViaToken } from "@/auth/firestore/index";
import { type NativeStackHeaderProps } from "@react-navigation/native-stack";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  createAccount: async (user: User) => {
    const userData: User = {
      uid: user.uid,
      email: user.email as string,
      displayName: user.displayName as string,
      photoURL: user.photoURL as string,
      password: user.password,
      username: user.username,
      lastSeen: "",
      linked: user.linked,
      online: true,
    };
    try {
      await firestore().collection("users").doc(user.uid).set(userData);
      console.log("User created in Firestore:", userData);
    } catch (error) {
      console.error("Error creating user in Firestore:", error);
    }
  },
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;
      set({ user, loading: false, error: null });
      return {
        user,
        error: null,
      };
    } catch (error: any | unknown) {
      set({ user: null, error: error.code, loading: false });
      return {
        user: null,
        error: error.code,
      };
    }
  },
  logingWithGoogle: async (
    authCredentials: FirebaseAuthTypes.AuthCredential
  ) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await auth().signInWithCredential(authCredentials);
      const user = userCredential.user;

      set({ user, loading: false });
      return { user, error: null };
    } catch (error: any) {
      set({ loading: false });
      return { user: null, error: error.message };
    }
  },
  login: async (email, password, props?: NativeStackHeaderProps) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      const account = await getAccountViaToken(
        userCredential?.user?.uid as string satisfies string
      );
      const user = userCredential.user;
      await AsyncStorage.setItem(ASYNC_STORAGE_USER_KEY_NAME, account?.uid);
      props?.navigation.navigate("HomeStack", {
        ...account,
      });
      set({ user, loading: false });

      return { user, error: null };
    } catch (error: any) {
      set({ loading: false });
      return { user: null, error: error.code };
    }
  },

  logout: async () => {
    try {
      await auth().signOut();
      set({ user: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
  setUser: (user) => set({ user }),
  createUserInFirestoreViaGoogle: async (user) => {
    const userData: User = {
      uid: user.uid,
      linked: true,
      email: user.email as string,
      displayName: user.displayName as string,
      photoURL: user.photoURL as string,
      password: uuid.v4(),
      username: user.displayName?.toLowerCase().trim(),
      lastSeen: "",
      online: true,
    };
    await firestore().collection("users").doc(user.uid).set(userData);
    return userData;
  },
}));
