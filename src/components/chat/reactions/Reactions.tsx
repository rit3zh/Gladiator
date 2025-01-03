import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { SFSymbol, SymbolView } from "expo-symbols";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@/hooks";
import { ThemeEnum } from "@/enums";
import * as Haptics from "expo-haptics";

interface IProps {
  onDislikePress?: () => any | void;
  onLikePress?: () => any | void;
  onCopyPress?: () => any | void;
}

export const Reactions: React.FC<IProps> & React.FunctionComponent<IProps> = (
  props: IProps
): React.JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === ThemeEnum.Dark;

  const [likeIcon, setLikeIcon] = useState("hand.thumbsup");
  const [dislikeIcon, setDislikeIcon] = useState("hand.thumbsdown");
  const [copyIcon, setCopyIcon] = useState("clipboard");

  const likeScale = useSharedValue(1);
  const dislikeScale = useSharedValue(1);
  const copyScale = useSharedValue(1);

  const animatedStyle = (scale: any) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

  const handlePress = async (type: "like" | "dislike" | "copy") => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    switch (type) {
      case "like":
        likeScale.value = withSpring(1.2, { stiffness: 200 }, () => {
          likeScale.value = withSpring(1);
        });
        setLikeIcon((prev) =>
          prev === "hand.thumbsup" ? "hand.thumbsup.fill" : "hand.thumbsup"
        );
        props.onLikePress?.();
        break;
      case "dislike":
        dislikeScale.value = withSpring(1.2, { stiffness: 200 }, () => {
          dislikeScale.value = withSpring(1);
        });
        setDislikeIcon((prev) =>
          prev === "hand.thumbsdown"
            ? "hand.thumbsdown.fill"
            : "hand.thumbsdown"
        );
        props.onDislikePress?.();
        break;
      case "copy":
        copyScale.value = withSpring(1.2, { stiffness: 200 }, () => {
          copyScale.value = withSpring(1);
        });
        setCopyIcon((prev) =>
          prev === "clipboard" ? "clipboard.fill" : "clipboard"
        );
        props.onCopyPress?.();
        break;
    }
  };

  return (
    <View className="mb-5">
      <View className="flex-row mt-5" style={styles.flexRow}>
        <View style={styles.leftContainer}>
          <Pressable onPress={() => handlePress("like")}>
            <Animated.View
              className="rounded-full w-12 h-12 items-center justify-center"
              style={[
                styles.container,
                animatedStyle(likeScale),
                { borderColor: isDark ? "#737373" : "#242424" },
              ]}
            >
              <SymbolView
                name={likeIcon as SFSymbol}
                tintColor={isDark ? "#e3e3e3" : "black"}
              />
            </Animated.View>
          </Pressable>

          <Pressable
            onPress={() => handlePress("dislike")}
            style={{ marginLeft: 12 }}
          >
            <Animated.View
              className="rounded-full w-12 h-12 items-center justify-center"
              style={[
                styles.container,
                animatedStyle(dislikeScale),
                { borderColor: isDark ? "#737373" : "#242424" },
              ]}
            >
              <SymbolView
                name={dislikeIcon as SFSymbol}
                tintColor={isDark ? "#e3e3e3" : "black"}
              />
            </Animated.View>
          </Pressable>
        </View>

        <View style={styles.rightContainer} className="mr-12">
          <Pressable onPress={() => handlePress("copy")}>
            <Animated.View
              className="rounded-full w-12 h-12 items-center justify-center"
              style={[
                styles.container,
                animatedStyle(copyScale),
                { borderColor: isDark ? "#737373" : "#242424" },
              ]}
            >
              <SymbolView
                name={copyIcon as SFSymbol}
                tintColor={isDark ? "#e3e3e3" : "black"}
              />
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftContainer: {
    flexDirection: "row",
    flexGrow: 1,
  },
  rightContainer: {
    justifyContent: "flex-end",
  },
});
