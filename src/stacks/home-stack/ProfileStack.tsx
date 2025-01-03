import React from "react";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";

import { ProfileIntroScreen, ProfileScreen } from "@/pages/screens/index";
import { theme as THEME } from "#/themes/Theme";
import { ThemeEnum } from "@/enums/theme/Theme";
import { useTheme } from "@/hooks";

const { Navigator, Screen } = createNativeStackNavigator();

export const ProfileStack: React.FC<NativeStackHeaderProps> &
  React.FunctionComponent<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode => {
  const { theme } = useTheme();
  const appTheme = THEME[theme];
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen
        name="ProfileIntro"
        component={ProfileIntroScreen as any}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="ProfileScreen"
        component={ProfileScreen as any}
        options={{
          headerShown: true,
          title: "Profile",
          headerLargeTitle: false,
          headerTransparent: true,
          headerBackVisible: false,
          headerBackButtonDisplayMode: "generic",

          headerBlurEffect: "systemUltraThinMaterialDark",
          headerLargeStyle: {
            backgroundColor: theme === ThemeEnum.Dark ? "#000" : "#f2f2f2",
          },
        }}
      />
    </Navigator>
  );
};
