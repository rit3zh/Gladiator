import { SafeAreaView, Text, View } from "react-native";
import * as React from "react";
import * as constants from "#/app/index";
import { onBoardingStyles as styles } from "styles/on-board/index";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Image } from "react-native";
import { AnimatedButton } from "~/index";
import { useState } from "react";
import { delay } from "@/utils";

export const OnBoardingScreen: React.FC<NativeStackHeaderProps> &
  React.FunctionComponent<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode & JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);

  const onPress = async () => {
    setLoading(true);
    await delay(1000);

    setLoading(false);

    setLoading(true);

    return props.navigation?.navigate("LoginScreen");
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="items-center justify-center flex-1">
        <View className="items-center justify-center bottom-5">
          <View className="mb-10 items-center justify-center">
            <Image source={require("assets/logo.png")} style={styles.logo} />
          </View>
          <View className="mt-10 items-center justify-center">
            <View>
              <Text className="text-white text-5xl font-bold">
                {constants.APP_TITLE}{" "}
                <Text className="text-emerald-300">{constants.APP_NAME}</Text>
              </Text>
            </View>

            <View className="items-center justify-center mt-2 m-10 top-8">
              <Text className="text-[#e3e3e3] font-normal text-[25px]">
                {constants.APP_DESCRIPTION}
              </Text>
            </View>
          </View>
          <View className="top-10">
            <AnimatedButton
              loading={loading}
              onPress={onPress}
              title="Get Started"
              color="#fff"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
