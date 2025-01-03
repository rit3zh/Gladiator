import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { OverlayButton } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedButton } from "~/index";

export const ProfileIntroScreen: React.FC<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode & React.JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);

  const onButtonPress = () => props.navigation?.navigate("ProfileScreen");

  const onClosePress = () => props.navigation?.goBack();
  const [refreshing, setRefreshing] = React.useState(true);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const [scrollOffset, setScrollOffset] = useState(0);

  const handleScroll = (event: any) => {
    const offset = event.nativeEvent.contentOffset.y;
    setScrollOffset(offset);
    console.log("Scroll Offset:", offset);
  };

  return (
    <ScrollView
      contentContainerClassName="flex-grow bg-[#0d0d0d]"
      className="flex-1 bg-[#0d0d0d]"
      contentInsetAdjustmentBehavior="always"
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView className="flex-1 bg-[#0d0d0d]">
        <View className="items-center mt-10">
          <View className="right-7 absolute">
            <OverlayButton
              onPress={onClosePress}
              component={() => (
                <Ionicons name="close" color={"black"} size={22} />
              )}
            />
          </View>
          <View className="mt-20 items-center">
            <View className="items-center mt-20">
              <View className="justify-end">
                <Image
                  source={require("assets/profile-create.png")}
                  style={{ height: 200, width: 200 }}
                />
              </View>

              <View className="items-center justify-center mt-10">
                <View>
                  <Text className="text-white font-bold text-4xl">
                    Create Profile
                  </Text>
                </View>

                <View>
                  <Text className="text-gray-200 p-5">
                    Create a chatbot profile that shows its skills, features,
                    and personality, making it helpful and easy to use.
                  </Text>
                </View>
              </View>
            </View>
            <View className="justify-end h-20">
              <AnimatedButton
                loading={loading}
                onPress={onButtonPress}
                title="Create"
                color="white"
              />
            </View>
            <View className="items-center top-[140px]">
              <Text className="text-gray-50">Sick of seeing this screen?</Text>
              <TouchableOpacity className="mt-1">
                <Text className="text-[#c5fae5]">Configure in Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};
