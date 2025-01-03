import { StyleSheet } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SpinnerType } from "@/@types";
import LoaderKit from "react-native-loader-kit";
import Animated, {
  LinearTransition,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  FadeIn,
} from "react-native-reanimated";
import Shimmer from "react-native-shimmer";
import { getRandomQuote } from "@/functions";

interface TypingIndicatorProps {
  isTyping: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  isTyping,
}: TypingIndicatorProps): React.ReactNode => {
  const opacity = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(20);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [content, setContent] = useState<string>();

  useLayoutEffect(() => {
    async function RandomQuote() {
      const randomQuote = await getRandomQuote();
      setContent(randomQuote.toString());
    }
    RandomQuote();
  }, []);

  useEffect(() => {
    if (isTyping) {
      setShouldRender(true);
      opacity.value = withTiming(1, { duration: 450 });
      translateY.value = withTiming(0, { duration: 550 });
    } else {
      opacity.value = withTiming(0, {
        duration: 400,
      });
      translateY.value = withTiming(
        20,
        {
          duration: 500,
        },
        (finished: boolean | undefined) => {
          if (finished) {
            runOnJS(setShouldRender)(false);
          }
        }
      );
    }
  }, [isTyping]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!shouldRender) {
    return null;
  }

  return (
    <Animated.View
      layout={LinearTransition}
      style={[style.container, animatedStyle]}
      className={"ml-5"}
    >
      <Animated.View className="mb-3">
        <Shimmer duration={500}>
          <LoaderKit
            name={SpinnerType.BallPulseSync}
            style={style.loaderKit}
            color="#e8e8e8"
          />
        </Shimmer>
        <Shimmer direction="right" duration={2000}>
          <Animated.Text
            entering={FadeIn.mass(3).stiffness(0.54).duration(2000)}
            className="text-white text-[15px]"
            style={{
              fontFamily: "Gill Sans",
            }}
          >
            {content}
          </Animated.Text>
        </Shimmer>
      </Animated.View>
    </Animated.View>
  );
};

const style = StyleSheet.create({
  container: {},
  loaderKit: {
    width: 40,
    height: 40,
  },
});
