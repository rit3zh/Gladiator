import firestore from "@react-native-firebase/firestore";
import { createSystemInitialMessage } from "@/extra";

export async function createMessageCollection<T extends string>(chatId: T) {
  return await firestore()
    .collection("messages")
    .doc(chatId)
    .collection("chats");
}
