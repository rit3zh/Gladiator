import { View, Text } from "react-native";
import React from "react";
import { Bubble, IMessage } from "react-native-gifted-chat";
import { Reactions } from "../../reactions/Reactions";

export const AIBubble: React.FunctionComponent<Bubble<IMessage>["props"]> &
  React.FC<Bubble<IMessage>["props"]> = (
  props: Bubble<IMessage>["props"]
): React.ReactNode & React.JSX.Element => {
  return (
    <View>
      <Bubble {...props} />
      {props.position === "right" ? <></> : <Reactions />}
    </View>
  );
};
