import { create } from "zustand";
import { ThemeEnum } from "@/enums/index";
import { Appearance } from "react-native";

export type ThemeContextType = "dark" | "light";

interface IThemeStore {
  theme: ThemeEnum | ThemeContextType;
  setTheme: (theme: ThemeEnum | ThemeContextType) => void | any;
}

export const useThemeStore = create<IThemeStore>((set) => ({
  theme: Appearance.getColorScheme()!,
  setTheme: (theme: ThemeEnum | ThemeContextType) => {
    Appearance.setColorScheme(theme);
    set({ theme });
  },
}));
