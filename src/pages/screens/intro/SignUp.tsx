import { useState } from "react";
import { useEmailPassword } from "@/hooks";
import { useAuthStore } from "@/store/context";

import { View, Text, SafeAreaView, Image, TextInput } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { loginStyles as styles } from "@/stylesheets/login";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { AnimatedButton, SocialButton } from "@/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleConfig } from "@/enums";
import { signInWithGoogle } from "@/auth/firestore";
import { getCredential } from "@/auth/firestore";
import { checkUserExists } from "@/auth/firestore";
import { toast } from "@baronha/ting";
import { emailValidator, passwordValidator } from "@/validators/z/index";
import {
  ERROR_ALREADY_EXISTS,
  ERROR_ALREADY_EXISTS_GOOGLE,
  UNFORTUNATE_ACCOUNT_CREATION_ERROR,
} from "#/app/index";
import { ASYNC_STORAGE_USER_KEY_NAME } from "@/constants/keys/AsyncStorageKey";

import { findUserByEmail } from "@/validators/auth/index";

import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import type { IErrorState } from "@/typings";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Bounceable from "@freakycoder/react-native-bounceable";
import useTextInput from "@/hooks/components/input/useTextInput";

GoogleSignin.configure({
  webClientId: GoogleConfig.WEB_CLIENT_ID,
});

export const SignUp: React.FC<NativeStackHeaderProps> &
  React.FunctionComponent<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode & JSX.Element => {
  const [hidden, setHidden] = useState<boolean>(false);
  const email = useTextInput("");
  const password = useTextInput("");
  const [error, setError] = useState<IErrorState>({
    email: null,
    password: null,
  });
  const onLoginPress = () => props.navigation?.navigate("LoginScreen");
  const { username, name, confirmPassword } = useEmailPassword();
  const {
    createAccount,
    createUserWithEmailAndPassword,
    createUserInFirestoreViaGoogle,
    loading,
    logingWithGoogle,
  } = useAuthStore();
  const onGoogleButtonPress = async () => {
    try {
      const findUser = await findUserByEmail(email.value);
      if (findUser) {
        return toast({
          title: "Error",
          message: ERROR_ALREADY_EXISTS,
          preset: "error",
        });
      } else {
        const idToken = await signInWithGoogle();

        const credential = getCredential(idToken);
        const result = await logingWithGoogle(credential);
        const userId = result?.user?.uid as string satisfies string;
        if (!userId) return;
        const userDocExists = await checkUserExists(userId);
        if (userDocExists) {
          return toast({
            title: "Error",
            message: ERROR_ALREADY_EXISTS_GOOGLE,
            preset: "error",
          });
        } else {
          try {
            const accountCredentials = await createUserInFirestoreViaGoogle(
              result?.user as FirebaseAuthTypes.User satisfies FirebaseAuthTypes.User
            );
            await AsyncStorage.setItem(ASYNC_STORAGE_USER_KEY_NAME, userId);

            return props.navigation.navigate("AppStack", {
              ...accountCredentials,
            });
          } catch (error) {
            return;
          }
        }
      }
    } catch (error) {
      return;
    }
  };

  const onButtonPress = async () => {
    setError({
      email: null,
      password: null,
      confirmPassword: null,
      username: null,
      name: null,
    });

    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const confirmPasswordError =
      password.value !== confirmPassword ? "Passwords do not match" : null;
    const usernameError =
      username.trim() === "" ? "Username is required" : null;
    const nameError = name === "" ? "Name is required" : null;
    if (emailError.error !== null) {
      setError((prev) => ({ ...prev, email: emailError.error }));
      toast({
        title: "Error",
        message: emailError.error as string,
        preset: "error",
      });
    }

    if (passwordError.error !== null) {
      setError((prev) => ({ ...prev, password: passwordError?.error }));
      toast({
        title: "Error",
        message: passwordError.error as string,
        preset: "error",
      });
    }

    if (confirmPasswordError) {
      setError((prev) => ({
        ...prev,
        confirmPassword: confirmPasswordError,
      }));
      toast({
        title: "Error",
        message: confirmPasswordError,
        preset: "error",
      });
    }

    if (usernameError) {
      setError((prev) => ({ ...prev, username: usernameError }));
      toast({
        title: "Error",
        message: usernameError,
        preset: "error",
      });
    }

    if (nameError) {
      setError((prev) => ({ ...prev, name: nameError }));
      toast({
        title: "Error",
        message: nameError,
        preset: "error",
      });
    }

    if (
      emailError.error ||
      passwordError.error ||
      confirmPasswordError ||
      usernameError ||
      nameError
    ) {
      return;
    }

    try {
      const filterAccount = await findUserByEmail(email.value);
      if (filterAccount) {
        return toast({
          title: "Error",
          message: "The user already exists.",
          preset: "error",
        });
      } else {
        const account = await createUserWithEmailAndPassword(
          email.value,
          password.value
        );
        const accountCredentials = {
          displayName: name,
          username: username,
          email: email.value,
          linked: false,
          password: password.value,
          photoURL: "",
          uid: account?.user?.uid as string,
          lastSeen: "",
          online: true,
        };
        await createAccount({
          ...accountCredentials,
        });
        await AsyncStorage.setItem(
          ASYNC_STORAGE_USER_KEY_NAME,
          account.user?.uid as string satisfies string
        );

        return props.navigation.navigate("AppStack", {
          ...accountCredentials,
        });
      }
    } catch (error) {
      console.log(error, "error during account creation");
      toast({
        title: "Error",
        message: UNFORTUNATE_ACCOUNT_CREATION_ERROR,
        preset: "error",
      });
    }
  };

  return (
    <KeyboardAwareScrollView
      contentInsetAdjustmentBehavior="always"
      contentContainerStyle={{ flexGrow: 1 }}
      className="flex-1 bg-black"
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView className="flex-1 bg-black">
        <View className="items-center">
          <Image
            source={require("assets/registration.png")}
            style={{
              width: 170,
              height: 170,
            }}
          />
        </View>
        <View className="ml-5 mt-10">
          <View>
            <Text className="text-white font-bold text-5xl">Sign Up</Text>
          </View>
          <View className="mt-2">
            <Text className="text-gray-300 font-medium text-md">
              Get started with{" "}
              <Text className="text-[#c5fae5]">Gladiator.</Text> Your AI
              companion for every challenge
            </Text>
          </View>

          <View className="mt-10">
            <Text className="text-white font-bold text-2xl">Display Name</Text>
            <View className="rounded-xl mt-5" style={styles.container}>
              <TextInput
                {...email}
                placeholder="Enter your display name"
                className="ml-5 text-gray-100"
                cursorColor={"white"}
                selectionColor={"white"}
              />
            </View>
            <Text className="text-white font-bold text-2xl">Username</Text>
            <View className="rounded-xl mt-5" style={styles.container}>
              <TextInput
                {...email}
                placeholder="Enter your username"
                className="ml-5 text-gray-100"
                cursorColor={"white"}
                selectionColor={"white"}
              />
            </View>
            <Text className="text-white font-bold text-2xl">Email</Text>
            <View className="rounded-xl mt-5" style={styles.container}>
              <TextInput
                {...email}
                placeholder="Enter your email"
                className="ml-5 text-gray-100"
                cursorColor={"white"}
                selectionColor={"white"}
              />
            </View>
            <View className="mt-5">
              <Text className="text-white font-bold text-2xl">Password</Text>
              <View className="rounded-xl mt-5" style={styles.container}>
                <View className="flex-1">
                  <TextInput
                    {...password}
                    placeholder="Enter your Password"
                    className="ml-5 text-gray-100"
                    cursorColor={"white"}
                    selectionColor={"white"}
                    secureTextEntry={!hidden}
                  />
                </View>
                <Bounceable onPress={() => setHidden(!hidden)}>
                  <View className="items-center justify-center mr-5">
                    <Ionicons
                      name={hidden ? "eye-off-sharp" : "eye-sharp"}
                      color={"#bababa"}
                      size={22}
                    />
                  </View>
                </Bounceable>
              </View>
            </View>
            <Text className="text-white font-bold text-2xl">
              Confirm Password
            </Text>
            <View className="rounded-xl mt-5" style={styles.container}>
              <View className="flex-1">
                <TextInput
                  {...password}
                  placeholder="Confirm your Password"
                  className="ml-5 text-gray-100"
                  cursorColor={"white"}
                  selectionColor={"white"}
                  secureTextEntry={!hidden}
                />
              </View>
              <Bounceable onPress={() => setHidden(!hidden)}>
                <View className="items-center justify-center mr-5">
                  <Ionicons
                    name={hidden ? "eye-off-sharp" : "eye-sharp"}
                    color={"#bababa"}
                    size={22}
                  />
                </View>
              </Bounceable>
            </View>
          </View>
        </View>
        <View className=" mt-5 items-center">
          <AnimatedButton
            title=""
            loading={loading}
            onPress={onButtonPress}
            color="#c5fae5"
            renderComponent={() => (
              <AntDesign name="login" size={24} color="black" />
            )}
          />

          <View className="mb-0 mt-10">
            <SocialButton
              onPress={onGoogleButtonPress}
              type="google"
              login={false}
            />
          </View>

          <Bounceable onPress={onLoginPress}>
            <View className="items-center justify-center mt-10 mb-10">
              <Text className="text-[12px] text-gray-500">
                Already have an account?{" "}
                <Text className="text-[#c5fae5]">Sign In</Text>
              </Text>
            </View>
          </Bounceable>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};
