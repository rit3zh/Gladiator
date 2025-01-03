import { View, Text } from "react-native";
import React from "react";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SymbolView } from "expo-symbols";
import { useTheme } from "@/hooks";
import { ThemeEnum } from "@/enums";

export const EmptyState: React.FC = (): React.ReactNode => {
  const { theme } = useTheme();

  const isDark = theme === ThemeEnum.Dark;

  return (
    <Animated.View
      layout={LinearTransition.springify()}
      className={"items-center justify-center"}
    >
      <View className="mt-32 items-center justify-center">
        <SymbolView
          name="bubble.fill"
          size={50}
          tintColor={isDark ? "gray" : "black"}
        />
        <View className="mt-4 items-center" style={{}}>
          <Text
            className="text-2xl font-bold"
            style={{
              color: isDark ? "white" : "black",
            }}
          >
            No Profiles!
          </Text>
          <View className="mt-3">
            <Text
              className="px-5"
              numberOfLines={2}
              style={{
                color: isDark ? "gray" : "black",
              }}
            >
              You have no profiles yet. Create a profile to start chatting with
              someone you think is important!
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
