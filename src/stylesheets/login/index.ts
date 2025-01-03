import { StyleSheet, Dimensions } from "react-native";

const WIDTH = Dimensions.get("window").width;

export const loginStyles = StyleSheet.create({
  container: {
    width: WIDTH - 50,
    // height: 50,
    // justifyContent: "center",
    backgroundColor: "#121212",
    borderRadius: 30.0,
    height: 50.0,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5.0,
    marginBottom: 10,
  },
  logo: {
    width: 450,
    height: 200,
  },
});
