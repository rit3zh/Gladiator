import React, { useState } from "react";
import { View, Text, SafeAreaView, Image, TextInput } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { loginStyles as styles } from "@/stylesheets/login";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { AnimatedButton, SocialButton } from "@/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Bounceable from "@freakycoder/react-native-bounceable";
import useTextInput from "@/hooks/components/input/useTextInput";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Error, GoogleConfig } from "@/enums";
import { useAuthStore } from "@/store/context";
import { ACCOUNT_NOT_LINKED } from "@/constants/app";
import { signInWithGoogle } from "@/auth/firestore";
import { getAccountViaToken, getCredential } from "@/auth/firestore";
import { checkUserExists } from "@/auth/firestore";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { toast } from "@baronha/ting";
import firestore from "@react-native-firebase/firestore";
import { emailValidator, passwordValidator } from "@/validators/z/index";
import { getUser, setUser } from "@/storage";

GoogleSignin.configure({
  webClientId: GoogleConfig.WEB_CLIENT_ID,
});

export const Login: React.FC<NativeStackHeaderProps> &
  React.FunctionComponent<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode & JSX.Element => {
  const [hidden, setHidden] = useState<boolean>(false);
  const email = useTextInput("");
  const password = useTextInput("");

  const onSignUpPress = () => props.navigation?.navigate("SignUpScreen");
  const onForgotPassword = () =>
    props.navigation?.navigate("ForgotPasswordScreen");
  const { login, createUserInFirestoreViaGoogle, loading, logingWithGoogle } =
    useAuthStore();

  const onGoogleButtonPress = async () => {
    try {
      const idToken = await signInWithGoogle();
      const credential = getCredential(idToken);
      const result = await logingWithGoogle(credential);

      const userId = result?.user?.uid as string satisfies string;
      const userDocExists = await checkUserExists(userId);

      if (userDocExists) {
        const checkForLinking = await getAccountViaToken(userId);
        if (checkForLinking?.linked as boolean) {
          const userKey = await getUser();
          !userKey ? await setUser(checkForLinking) : null;
          return props.navigation.navigate("AppStack", {
            ...checkForLinking,
          });
        } else {
          return toast({
            title: "Error",
            message: ACCOUNT_NOT_LINKED,
            preset: "error",
          });
        }
      } else {
        const user = await createUserInFirestoreViaGoogle(
          result?.user as FirebaseAuthTypes.User satisfies FirebaseAuthTypes.User
        );
        const userKey = await getUser();
        !userKey ? await setUser(user) : null;

        return props.navigation.navigate("AppStack", {
          ...user,
        });
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const onButtonPress = async () => {
    const response = await login(email.value, password.value);

    if (!email.value || email?.value.length === 0) {
      return toast({
        title: "Error",
        preset: "error",
        message: "Email cannot be empty",
      });
    }

    const { error: emailError } = emailValidator(email.value);

    if (emailError) {
      return toast({
        title: "Error",
        preset: "error",
        message: emailError,
      });
    }

    if (!password.value || password?.value.length === 0) {
      return toast({
        title: "Error",
        preset: "error",
        message: "Password cannot be empty",
      });
    }

    const { error: passwordError } = passwordValidator(password.value);

    if (emailError) {
      return toast({
        title: "Error",
        preset: "error",
        message: passwordError as string,
      });
    }

    switch (response.error!) {
      case Error.InvalidCredentials:
        return toast({
          title: "Error",
          message: "The credentials are invalid.",
          preset: "error",
        });
      case Error.InvalidEmail:
        return toast({
          title: "Error",
          message: "The email ID is invalid.",
          preset: "error",
        });
      case Error.InvalidPassword:
        return toast({
          title: "Error",
          message: "The password is invalid.",
          preset: "error",
        });
      case Error.NotFound:
        return toast({
          title: "Error",
          message: "The user does not exist.",
          preset: "error",
        });
      default:
        await firestore().collection("users").doc(response.user?.uid).update({
          password: password,
        });
        const userCredentials = await getAccountViaToken(
          response.user?.uid as string
        );

        return props.navigation.navigate("AppStack", {
          ...userCredentials,
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
            source={require("assets/signup.png")}
            style={{
              width: 170,
              height: 170,
            }}
          />
        </View>
        <View className="ml-5 mt-10">
          <View>
            <Text className="text-white font-bold text-5xl">Login</Text>
          </View>
          <View className="mt-2">
            <Text className="text-gray-300 font-medium text-md">
              Welcome back, we are soo glad to see you back!
            </Text>
          </View>

          <View className="mt-10">
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
          </View>
        </View>
        <View className="items-end mr-10">
          <Bounceable onPress={onForgotPassword}>
            <Text className="text-[12px] text-[#c5fae5]">Forgot Password?</Text>
          </Bounceable>
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
              login={true}
            />
          </View>

          <Bounceable onPress={onSignUpPress}>
            <View className="items-center justify-center mt-10 mb-10">
              <Text className="text-[12px] text-gray-500">
                Don't have an account?{" "}
                <Text className="text-[#c5fae5]">Sign Up</Text>
              </Text>
            </View>
          </Bounceable>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};
