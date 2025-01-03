import { Message } from "@/typings";
import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

export function useMessages<T extends string>(id: T) {
  const [messages, setMessages] = useState<Message[]>();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("messages")
      .doc(id)
      .collection("chats")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const fetchedMessages = snapshot.docs.map((document) => ({
          ...document?.data(),
        })) as Message[];
        setMessages(fetchedMessages);
      });
    return unsubscribe;
  }, []);
  return messages;
}
