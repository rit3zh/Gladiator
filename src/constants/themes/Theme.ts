interface ThemeScreens {
  backgroundColor: string;
  text: string;
  subtext: string;
  appColor: string;
}
interface Theme {
  light: ThemeScreens;
  dark: ThemeScreens;
}

export const theme: Theme = {
  light: {
    backgroundColor: "#f5f5f5",
    subtext: "#8f8f8f",
    text: "#000",
    appColor: "#b5e8d4",
  },
  dark: {
    backgroundColor: "#000",
    subtext: "#cfcfcf",
    text: "#fff",
    appColor: "#c5fae5",
  },
};
