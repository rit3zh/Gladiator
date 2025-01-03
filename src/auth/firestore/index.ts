import type { User } from "@/typings/index";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const getCredential = (idToken: string) => {
  return auth.GoogleAuthProvider.credential(idToken);
};
export const checkUserExists = async (userId: string): Promise<boolean> => {
  const userDoc = await firestore().collection("users").doc(userId).get();
  return userDoc.exists;
};
export const createUserInFirestore = async (userId: string, userData: any) => {
  await firestore().collection("users").doc(userId).set(userData);
  return userData;
};
export const signInWithGoogle = async (): Promise<string> => {
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();
  return response.data?.idToken as string;
};

export const getAccountViaToken = async <T extends string>(
  token: T
): Promise<User> => {
  const userDoc = await firestore().collection("users").doc(token).get();
  return userDoc.data() as User;
};
