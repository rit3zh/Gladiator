import { useFonts } from "expo-font";

export enum Fonts {
  RalewayBold = "RalewayBold",
  RalewayNormal = "RalewayNormal",
}

export function useInitialFonts<T>(): T {
  const [fontsLoaded] = useFonts({
    RalewayBold: require("@/fonts/Raleway/static/Raleway-Bold.ttf"),
    RalewayNormal: require("@/fonts/Raleway/static/Raleway-Medium.ttf"),
  });

  return fontsLoaded as T;
}
