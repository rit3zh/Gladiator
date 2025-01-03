import React from "react";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";
import { SettingsScreen } from "@/pages/screens/index";
import { ThemeEnum } from "@/enums";
import { useTheme } from "@/hooks";

const { Navigator, Screen } = createNativeStackNavigator();

export const SettingsStack: React.FC<NativeStackHeaderProps> &
  React.FunctionComponent<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode => {
  const { theme } = useTheme();
  return (
    <Navigator>
      <Screen
        initialParams={props?.route?.params as any}
        name="SettingsScreen"
        component={SettingsScreen as any}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "Settings",
          headerBackVisible: false,
          headerLargeTitle: true,

          headerBlurEffect: "systemUltraThinMaterialDark",
          headerLargeStyle: {
            backgroundColor: theme === ThemeEnum.Dark ? "#000" : "#fff",
          },
        }}
      />
    </Navigator>
  );
};
