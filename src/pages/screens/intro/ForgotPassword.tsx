import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { type NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { hasDynamicIsland, hasNotch } from "react-native-device-info";
import { AnimatedButton } from "@/components";
import { emailValidator } from "@/validators/z/index";
import { toast } from "@baronha/ting";
import auth from "@react-native-firebase/auth";

export const ForgotPassword: React.FC<NativeStackHeaderProps> = ({
  navigation,
  route,
}: NativeStackHeaderProps): React.ReactNode => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const onPress = async () => {
    setIsLoading(true);
    const isValidEmail = emailValidator(email);
    if (isValidEmail.error) {
      setIsLoading(false);
      toast({
        title: "Error",
        message: "Not a well formed email.",
        preset: "error",
      });
    } else {
      await auth().sendPasswordResetEmail(email);
      toast({
        title: "Email Sent",
        message: `Password reset link sent to ${email}`,
        preset: "done",
      });

      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-black"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <SafeAreaView className="flex-1 items-center justify-center bg-black">
          <View className="items-center justify-center">
            <View className="h-[90px] w-[90px] border-[#d9d9d9] border-[1px] rounded-xl items-center justify-center">
              <Ionicons
                name="finger-print"
                size={hasDynamicIsland() && hasNotch() ? 45 : 40}
                color="#424242"
              />
            </View>
            <View className="items-center justify-center">
              <View className="mt-3">
                <Text className="font-bold text-3xl">Forgot Password?</Text>
              </View>
              <View className="mt-3">
                <Text
                  className={`${
                    hasDynamicIsland() && hasNotch()
                      ? "text-[16px]"
                      : "text-[13px]"
                  } text-[#8f8f8f] font-medium`}
                >
                  No worries, we'll send you reset instructions
                </Text>
              </View>
            </View>
            <View className="">
              <View style={styles.containerFlex}>
                <View className="">
                  <TextInput
                    placeholder="Enter your email"
                    className="ml-4"
                    value={email.toLowerCase()}
                    onChangeText={(text) => setEmail(text)}
                  />
                </View>
              </View>
              <View className="items-center justify-center mt-10">
                <AnimatedButton
                  loading={isLoading}
                  onPress={onPress}
                  title="Reset"
                  color="#c5fae5"
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  containerFlex: {
    borderRadius: 12,
    height: 45.0,
    flexDirection: "row",
    alignItems: "center",

    marginTop: 20,
    width: hasDynamicIsland() && hasNotch() ? 320 : 290,
    borderColor: "#cfcfcf",
    borderWidth: 1,
  },
});
