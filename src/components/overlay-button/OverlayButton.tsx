import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Bounceable from "@freakycoder/react-native-bounceable";

interface IProps {
  component: () => React.ReactNode & React.JSX.Element;
  onPress?: () => any | void;
  /**
   * Initial - 45
   */
  height?: number;
  /**
   * Initial - 45
   */
  width?: number;
}

export const OverlayButton: React.FunctionComponent<IProps> = (
  props: IProps
): React.JSX.Element & React.ReactNode => {
  const INITIAL_DIMENSION: number = 45;

  return (
    <Bounceable onPress={props.onPress}>
      <View
        style={[
          styles.container,
          {
            width: props?.width ?? INITIAL_DIMENSION,
            height: props?.height ?? INITIAL_DIMENSION,
          },
        ]}
      >
        {props?.component()}
      </View>
    </Bounceable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 1000,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
    shadowOpacity: 10,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: "white",
    shadowRadius: 5,
  },
});
