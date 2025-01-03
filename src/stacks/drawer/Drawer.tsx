import React from "react";
import { Chat } from "@/pages/screens";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
const Drawer = createDrawerNavigator();

export const DrawerStack: React.FC<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode & React.JSX.Element => {
  const params = props.route?.params as any;

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: true, drawerPosition: "right" }}
    >
      <Drawer.Screen
        name="ChatWithAi"
        component={Chat as any}
        initialParams={params}
      />
    </Drawer.Navigator>
  );
};
