import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { ChatProfile } from "@/typings";
import { getUser } from "@/storage";

export function useProfiles<T>(): ChatProfile[] {
  const [profiles, setProfiles] = useState<ChatProfile[]>([]);

  useEffect(() => {
    const fetchInitialProfiles = async () => {
      try {
        const key = await getUser();

        const querySnapshot = await firestore()
          .collection("profiles")
          .where("chatProfileId", "==", key)
          .get();

        const initialProfiles = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as ChatProfile[];

        setProfiles(initialProfiles);

        const unsubscribe = firestore()
          .collection("profiles")
          .where("chatProfileId", "==", key)
          .onSnapshot((snapshot) => {
            const updatedProfiles = snapshot.docs.map((doc) => ({
              ...doc.data(),
            })) as ChatProfile[];

            setProfiles(updatedProfiles);
          });

        return () => unsubscribe();
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
        setProfiles([]);
      }
    };

    fetchInitialProfiles();
  }, []);

  return profiles;
}
