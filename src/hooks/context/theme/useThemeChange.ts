import { useThemeStore } from "@/store/context";
import { useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";

export function useThemeChange(): ColorSchemeName {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  useEffect(() => {
    const listener = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      setTheme(colorScheme!);
    };

    const subscription = Appearance.addChangeListener(listener);

    return () => {
      subscription.remove();
    };
  }, []);

  return theme;
}
