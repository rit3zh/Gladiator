import React from "react";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";
import {
  ForgotPassword,
  Login,
  OnBoardingScreen,
  SignUp,
} from "@/pages/screens/index";

const { Navigator, Screen } = createNativeStackNavigator();

export const IntroStack: React.FC<NativeStackHeaderProps> &
  React.FunctionComponent<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode => {
  return (
    <Navigator>
      <Screen
        name="OnBoardingScreen"
        component={OnBoardingScreen as any}
        options={{
          headerShown: false,
        }}
      />

      <Screen
        name="LoginScreen"
        component={Login as any}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerBackVisible: false,
          headerBlurEffect: "systemUltraThinMaterialDark",
          headerLargeStyle: {
            backgroundColor: "#000",
          },
        }}
      />

      <Screen
        name="SignUpScreen"
        component={SignUp as any}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerBackVisible: true,
          headerBlurEffect: "systemUltraThinMaterialDark",
          headerLargeStyle: {
            backgroundColor: "#000",
          },
          headerTintColor: "#c5fae5",
        }}
      />

      <Screen
        name="ForgotPasswordScreen"
        component={ForgotPassword as any}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "Forgot Password",
          headerBackVisible: true,
          headerBlurEffect: "systemUltraThinMaterialDark",
          headerLargeStyle: {
            backgroundColor: "#000",
          },
          headerTintColor: "#c5fae5",
        }}
      />
    </Navigator>
  );
};
