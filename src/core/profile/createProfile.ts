import firestore from "@react-native-firebase/firestore";
import type { ChatProfile } from "@/typings";

export async function createProfile(profile: ChatProfile) {
  await firestore()
    .collection("profiles")
    .add({
      ...profile,
    });
}
