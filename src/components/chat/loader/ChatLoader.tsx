import { SafeAreaView } from "react-native";
import React from "react";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import Loader from "react-native-loader-kit";
import { SpinnerType } from "@/@types";

export const LoaderChat: React.FunctionComponent &
  React.FC = (): React.ReactNode => {
  return (
    <SafeAreaView className="flex-1">
      <Animated.View
        layout={LinearTransition.mass(1).springify()}
        className="flex-1 items-center justify-center"
      >
        <Animated.View entering={FadeIn.delay(500)}>
          <Loader
            name={SpinnerType.BallClipRotatePulse}
            style={{ width: 100, height: 100 }}
            color="#c2c2c2"
          />
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};
