import { ASYNC_STORAGE_USER_KEY_NAME } from "@/constants/keys/AsyncStorageKey";
import { User } from "@/typings";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getUser(): Promise<string | undefined | null> {
  const userKey: string = (await AsyncStorage.getItem(
    ASYNC_STORAGE_USER_KEY_NAME
  )) as string;

  return userKey;
}
export async function deleteUser<T>(): Promise<boolean | undefined> {
  try {
    await AsyncStorage.removeItem(ASYNC_STORAGE_USER_KEY_NAME satisfies string);
    return true;
  } catch (error: any | void) {
    console.error({
      type: error?.name,
      message: error?.message,
      code: 401,
    });
    return undefined;
  }
}

export async function setUser<T extends User>(
  user: T
): Promise<boolean | undefined> {
  try {
    await AsyncStorage.setItem(ASYNC_STORAGE_USER_KEY_NAME, user.uid as string);
    return true;
  } catch (error: any | void) {
    console.error({
      type: error?.name,
      message: error?.message,
      code: 401,
    });
    return undefined;
  }
}
