import { View, Text, Image } from "react-native";
import React from "react";
import { IMessage, MessageImageProps } from "react-native-gifted-chat";

export const MessageBubbleImage: React.FC<MessageImageProps<IMessage>> &
  React.FunctionComponent<MessageImageProps<IMessage>> = (
  props: MessageImageProps<IMessage>
): React.ReactNode & React.JSX.Element => {
  return (
    <>
      <Image
        source={{ uri: props?.currentMessage?.image }}
        className="w-20 h-20"
      />
    </>
  );
};
