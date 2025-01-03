import { useState, useEffect } from "react";
import { getUser } from "@/storage";
import firestore from "@react-native-firebase/firestore";

import type { User } from "@/typings/index";

export function useUser() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const key = await getUser();

        const userDocRef = firestore()
          .collection("users")
          .doc(key?.toString() as string);
        const unsubscribe = userDocRef?.onSnapshot((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data() as User);
          } else {
            return null;
          }
        });

        return unsubscribe;
      } catch (error) {}
    };

    fetchUser();
  }, []);

  return user;
}
