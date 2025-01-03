import { useThemeStore, ThemeContextType } from "@/store/context";
import { ThemeEnum } from "@/enums/index";

interface ITheme {
  theme: ThemeEnum | ThemeContextType;
  setTheme: (theme: ThemeEnum | ThemeContextType) => void | any;
  toggleTheme: () => void | any;
}

export const useTheme = <T extends any>(): ITheme => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    return theme;
  };

  return {
    theme,
    setTheme,
    toggleTheme,
  };
};
