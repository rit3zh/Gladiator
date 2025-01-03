import firestore from "@react-native-firebase/firestore";

export async function deleteProfile(chatProfileId: string) {
  const profileQueryShot = await firestore()
    .collection("profiles")
    .where("chatProfileId", "==", chatProfileId)
    .get();
  const data = await profileQueryShot?.docs[0];

  if (data) {
    return await data.ref.delete();
  } else {
    return;
  }
}
