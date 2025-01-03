import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  ViewProps,
  StyleProp,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks";
import { ThemeEnum } from "@/enums";
import Shimmer from "react-native-shimmer";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  LinearTransition,
  useAnimatedStyle,
  Easing,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

interface Props {
  name: string;
  style?: StyleProp<ViewStyle>;
}

export const SystemMessage: React.FC<Props> = ({
  name,
  style,
}: Props): React.ReactNode => {
  const { theme } = useTheme();
  const isDark = theme === ThemeEnum.Dark;

  const FAKE_SHIMMER_COLORS_LIGHT_TOP: string[] = [
    "#ebebeb",
    "#c5c5c5",
    "#ebebeb",
  ];
  const FAKE_SHIMMER_COLORS_LIGHT_BOTTOM: string[] = [
    "#e6e6e6",
    "#f0f0f0",
    "#e6e6e6",
  ];

  const FAKE_CIRCLE_TOP: string = isDark ? "#474747" : "#858585";
  const FAKE_CIRCLE_BOTTOM: string = isDark ? "#3b3b3b" : "#b5b5b5";
  const FAKE_LINE_TOP: string = isDark ? "#292929" : "";
  const FAKE_LINE_BOTTOM: string = ``;

  const texts = ["Interesting", "Beautiful", "Engaging", "Amazing"];
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);

  const animationValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(animationValue.value, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    }),
    transform: [
      {
        translateY: withSpring(animationValue.value === 1 ? 0 : -20, {
          damping: 10,
          stiffness: 90,
        }),
      },
    ],
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      animationValue.value = 0;
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        animationValue.value = 1;
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [animationValue, texts.length]);

  return (
    <Animated.View style={[styles.container, style]} layout={LinearTransition}>
      <View style={styles.empty}>
        <Animated.View
          style={styles.fake}
          entering={FadeInDown.delay(200).springify(2000).stiffness(2)}
        >
          <ShimmerPlaceholder
            style={[styles.fakeCircle, {}]}
            shimmerColors={
              isDark
                ? ["#1c1c1c", "#404040", "#1c1c1c"]
                : FAKE_SHIMMER_COLORS_LIGHT_TOP
            }
          />
          <View>
            <ShimmerPlaceholder
              shimmerColors={
                isDark
                  ? ["#1c1c1c", "#404040", "#1c1c1c"]
                  : FAKE_SHIMMER_COLORS_LIGHT_TOP
              }
              style={[
                styles.fakeLine,
                { width: 120, backgroundColor: FAKE_LINE_TOP },
              ]}
            />
            <ShimmerPlaceholder
              shimmerColors={
                isDark
                  ? ["#1c1c1c", "#404040", "#1c1c1c"]
                  : FAKE_SHIMMER_COLORS_LIGHT_TOP
              }
              style={[styles.fakeLine, { backgroundColor: FAKE_LINE_TOP }]}
            />
            <ShimmerPlaceholder
              shimmerColors={
                isDark
                  ? ["#1c1c1c", "#404040", "#1c1c1c"]
                  : FAKE_SHIMMER_COLORS_LIGHT_TOP
              }
              style={[
                styles.fakeLine,
                { width: 70, marginBottom: 0, backgroundColor: FAKE_LINE_TOP },
              ]}
            />
          </View>
        </Animated.View>
        <Animated.View
          style={[styles.fake]}
          entering={FadeInDown.delay(400).springify(2000).stiffness(2)}
        >
          <ShimmerPlaceholder
            style={[styles.fakeCircle, {}]}
            shimmerColors={
              isDark
                ? ["#141414", "#1a1a1a", "#141414"]
                : FAKE_SHIMMER_COLORS_LIGHT_BOTTOM
            }
          />
          <View>
            <ShimmerPlaceholder
              shimmerColors={
                isDark
                  ? ["#141414", "#1a1a1a", "#141414"]
                  : FAKE_SHIMMER_COLORS_LIGHT_BOTTOM
              }
              style={[
                styles.fakeLine,
                { width: 120, backgroundColor: "#404040" },
              ]}
            />
            <ShimmerPlaceholder
              style={styles.fakeLine}
              shimmerColors={
                isDark
                  ? ["#141414", "#1a1a1a", "#141414"]
                  : FAKE_SHIMMER_COLORS_LIGHT_BOTTOM
              }
            />
            <ShimmerPlaceholder
              shimmerColors={
                isDark
                  ? ["#141414", "#1a1a1a", "#141414"]
                  : FAKE_SHIMMER_COLORS_LIGHT_BOTTOM
              }
              style={[styles.fakeLine, { width: 70, marginBottom: 0 }]}
            />
          </View>
        </Animated.View>
        <Animated.View
          layout={LinearTransition}
          className={"flex-row items-center"}
          style={{ marginBottom: 8, marginTop: 12 }}
        >
          <Text
            className="ml-1"
            style={[
              styles.emptyTitle,
              {
                color: isDark ? "#c7c7c7" : "#1f1f1f",
              },
            ]}
          >
            Start your
          </Text>

          <Animated.View style={[animatedStyle]} className="ml-2">
            <Shimmer>
              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color: isDark ? "#c7c7c7" : "#1f1f1f",
                  },
                ]}
              >
                {texts[currentTextIndex]}
              </Text>
            </Shimmer>
          </Animated.View>

          <Animated.View className={"ml-2"}>
            <Text
              style={[
                styles.emptyTitle,
                {
                  color: isDark ? "#c7c7c7" : "#1f1f1f",
                },
              ]}
            >
              Conversation
            </Text>
          </Animated.View>
        </Animated.View>
        <Text
          style={[
            styles.emptyDescription,
            {
              color: isDark ? "#404040" : "#808080",
            },
          ]}
        >
          Start your conversation with {name} also, do not forgot to use `/`
          commands
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTop: {
    marginHorizontal: -6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 35,
    fontWeight: "700",
    color: "#1d1d1d",
  },
  empty: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#222",
  },
  emptyDescription: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
    color: "#8c9197",
    textAlign: "center",
    maxWidth: 350,
  },
  fake: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  fakeCircle: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: "#e8e9ed",
    marginRight: 16,
  },
  fakeLine: {
    width: 200,
    height: 10,
    borderRadius: 4,
    backgroundColor: "#e8e9ed",
    marginBottom: 8,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#266EF1",
    borderColor: "#266EF1",
    marginTop: "auto",
    marginHorizontal: 24,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});
