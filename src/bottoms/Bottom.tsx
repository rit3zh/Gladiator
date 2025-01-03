import React from "react";
import { type NativeStackHeaderProps } from "@react-navigation/native-stack";
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import { BookmarkStack } from "@/stacks/home-stack/BookmarkStack";
import { HomeStack, SettingsStack } from "@/stacks";
import { useTheme, useUser } from "@/hooks";
import { theme as THEME } from "#/themes/Theme";

const { Screen, Navigator } = createNativeBottomTabNavigator();

export const Bottom: React.FC<NativeStackHeaderProps> &
  React.FunctionComponent<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode => {
  const { theme } = useTheme();
  const user = useUser();
  const appTheme = THEME[theme];

  return (
    <Navigator
      translucent={true}
      hapticFeedbackEnabled={true}
      tabBarActiveTintColor={appTheme.appColor}
    >
      <Screen
        name="HomeStack"
        component={HomeStack as any}
        options={{
          tabBarLabel: "Chats",
          tabBarIcon: ({ focused }: { focused: boolean }) => ({
            sfSymbol: focused ? "bubble.fill" : "bubble",
          }),
        }}
        initialParams={{
          ...user,
        }}
      />
      <Screen
        initialParams={user}
        name="BookmarkStack"
        component={BookmarkStack as any}
        options={{
          tabBarLabel: "Bookmarks",
          tabBarIcon: ({ focused }: { focused: boolean }) => ({
            sfSymbol: focused ? "bookmark.fill" : "bookmark",
          }),
        }}
      />
      <Screen
        initialParams={user}
        name="SettingsStack"
        component={SettingsStack as any}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused }: { focused: boolean }) => ({
            sfSymbol: "gear",
          }),
        }}
      />
    </Navigator>
  );
};
