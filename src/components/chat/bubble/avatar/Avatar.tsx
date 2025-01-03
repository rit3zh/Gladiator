import { View, Text, Image, StyleProp, ImageStyle } from "react-native";
import React from "react";

interface AvatarPropsBubble {
  image: string;
  style?: StyleProp<ImageStyle>;
}

export const Avatar: React.FC<AvatarPropsBubble> = (
  props: AvatarPropsBubble
): React.ReactNode => {
  return (
    <View className="mt-5">
      <Image
        source={{ uri: props.image }}
        style={[props.style]}
        className="rounded-full"
      />
    </View>
  );
};
