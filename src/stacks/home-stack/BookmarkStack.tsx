import React from "react";
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from "@react-navigation/native-stack";
import { BookmarkScreen } from "@/pages/screens/index";
import { useTheme } from "@/hooks";
import { ThemeEnum } from "@/enums";

const { Navigator, Screen } = createNativeStackNavigator();

export const BookmarkStack: React.FC<NativeStackHeaderProps> &
  React.FunctionComponent<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode => {
  const { theme } = useTheme();
  return (
    <Navigator>
      <Screen
        initialParams={props?.route?.params as any}
        name="BookmarkScreen"
        component={BookmarkScreen as any}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "Bookmarks",
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
