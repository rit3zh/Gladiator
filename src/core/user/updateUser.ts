import firestore from "@react-native-firebase/firestore";

interface IProps<T> {
  userId: string;
  data?: T;
}

export async function updateUser<T>(props: IProps<T>) {
  return await firestore()
    .collection("users")
    .doc(props?.userId)
    .update({
      ...props.data,
    });
}
