import "./global.css";
import * as React from "react";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";

import { useTheme, useSetupPlayer } from "@/hooks/index";
import { NavigationFlow } from "@/index";

export default function App<T extends React.ReactNode>(): React.ReactNode &
  JSX.Element &
  React.FunctionComponentElement<T> {
  const { theme } = useTheme();
  useSetupPlayer();

  return (
    <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      <NavigationFlow />
    </NavigationContainer>
  );
}
