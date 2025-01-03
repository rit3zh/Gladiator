import { View, Text, Image } from "react-native";
import React from "react";

import Bounceable from "@freakycoder/react-native-bounceable";
import {
  GOOGLE_LOGO,
  GOOGLE_SIGNUP_TEXT,
  GOOGLE_LOGIN_TEXT,
} from "#/app/index";

type SocialButtonType = "google" | "facebook" | "apple";

interface SocialButtonProps {
  type: SocialButtonType;
  login?: boolean;
  onPress: () => void | any;
}

export const SocialButton: React.FC<SocialButtonProps> = (
  props: SocialButtonProps
): React.ReactNode => {
  return (
    <Bounceable onPress={props.onPress}>
      <View className="bg-gray-200 rounded-full w-[280px] h-[55px] flex-row items-center justify-start">
        <View className="ml-5 justify-center flex-1">
          <View className="flex-row items-center ml-4">
            <Image
              source={{
                uri: GOOGLE_LOGO,
              }}
              className="w-10 h-10"
            />
            <View className="ml-5">
              <Text
                className="font-medium
              text-gray-600
              text-[16px]"
              >
                {props.login ? GOOGLE_LOGIN_TEXT : GOOGLE_SIGNUP_TEXT}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Bounceable>
  );
};
