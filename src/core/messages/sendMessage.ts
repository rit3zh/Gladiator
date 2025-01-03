import type { Message } from "@/typings";
import firestore from "@react-native-firebase/firestore";

type ID<T> = T;

export async function sendMessage<T extends string>(
  id: ID<T>,
  message: Message
) {
  return await firestore()
    .collection("messages")
    .doc(id)
    .collection("chats")
    .add({
      ...message,
    });
}
