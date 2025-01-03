import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IntroStack } from "@/stacks";
import { useInitialRoute } from "@/hooks/core/useInitialRoute";
import { Bottom } from "@/bottoms/Bottom";
import { DrawerStack } from "@/stacks/index";

const { Navigator, Screen } = createNativeStackNavigator();

export const NavigationFlow: React.FunctionComponent = (): React.ReactNode &
  JSX.Element => {
  const { isReady, initialRoute } = useInitialRoute();

  if (!isReady || !initialRoute) {
    return null as any;
  }

  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Screen name="IntroStack" component={IntroStack as any} />
      <Screen name="AppStack" component={Bottom as any} />

      <Screen name="DrawerStack" component={DrawerStack as any} />
    </Navigator>
  );
};
