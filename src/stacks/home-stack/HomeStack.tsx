import React from "react";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";

import { ChatScreen } from "@/pages/screens/index";
import { useTheme } from "@/hooks";
import { ThemeEnum } from "@/enums";
import { ProfileStack } from "./ProfileStack";

const { Navigator, Screen } = createNativeStackNavigator();

export const HomeStack: React.FC<NativeStackHeaderProps> &
  React.FunctionComponent<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode => {
  const { theme } = useTheme();
  const params = props.route.params as any;

  return (
    <Navigator>
      <Screen
        initialParams={params as any}
        name="ChatScreen"
        component={ChatScreen as any}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "Chats",
          headerBackVisible: false,
          headerLargeTitle: true,

          headerBlurEffect: "systemUltraThinMaterialDark",
          headerLargeStyle: {
            backgroundColor: theme === ThemeEnum.Dark ? "#000" : "#fff",
          },
        }}
      />

      <Screen
        name="ProfileStack"
        initialParams={props?.route?.params as any}
        component={ProfileStack as any}
        options={{
          sheetGrabberVisible: true,
          headerShown: false,
          presentation: "transparentModal",
        }}
      />
    </Navigator>
  );
};
