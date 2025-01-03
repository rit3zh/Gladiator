import firestore from "@react-native-firebase/firestore";

export const findUserByEmail = async <T extends string>(email: T) => {
  const filteredUser = await await firestore()
    .collection("users")
    .where("email", "==", email)
    ?.get();
  return filteredUser.docs.length > 0 ? true : false;
};
