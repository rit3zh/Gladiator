import { View, Text, SafeAreaView } from "react-native";
import React, { useRef, useState } from "react";
import { AnimatedButton } from "../animated-button/AnimatedButton";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { SystemMessage } from "../chat/bubble/system-message/SystemMessage";
import { APP_COLOR } from "@/constants/app";
import { ThemeEnum } from "@/enums";
import { useTheme } from "@/hooks";
import { Button } from "swiftui-react-native";

interface IProps {
  name: string;
  onAgreePress: () => any | void;
}

export const Tos: React.FC<IProps> & React.FunctionComponent<IProps> = ({
  name,
  onAgreePress,
}: IProps): React.ReactNode => {
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const sheet = useRef<TrueSheet>(null);

  const { theme } = useTheme();
  const isDark = theme === ThemeEnum.Dark;
  return (
    <React.Fragment>
      <SafeAreaView className="flex-1">
        <SystemMessage name={name} style={{ top: 50 }} />
        <View className="bottom-20 items-center justify-center">
          <AnimatedButton
            loading={buttonLoading}
            onPress={() => {
              setButtonLoading(true);
              return sheet.current?.present();
            }}
            title={"Terms & Condition"}
            color={isDark ? APP_COLOR : "#c5fae5"}
          />
        </View>
      </SafeAreaView>
      <TrueSheet
        ref={sheet}
        sizes={["medium", "large"]}
        cornerRadius={24}
        contentContainerStyle={{ flex: 1 }}
        blurTint={isDark ? "dark" : "light"}
        backgroundColor={isDark ? "#1a1a1a" : "#fff"}
        onDismiss={() => setButtonLoading(false)}
        grabber={true}
      >
        <SafeAreaView className="flex-1">
          <View className="items-center mt-14">
            <Text
              style={{
                color: isDark ? "white" : "black",
                fontSize: 30,
                fontWeight: "600",
              }}
            >
              Terms and Conditions
            </Text>
            <View className="mt-5 items-center">
              <Text
                style={{
                  color: isDark ? "#e6e6e6" : "#4d4d4d",
                  fontSize: 15,
                }}
                numberOfLines={2}
              >
                Please read and agree to the terms before
              </Text>
              <Text
                style={{
                  color: isDark ? "#e6e6e6" : "#4d4d4d",
                  fontSize: 15,
                }}
                numberOfLines={2}
              >
                before using {name}.
              </Text>
            </View>

            <View className="mt-10 items-center mb-10">
              <Text
                className="m-5"
                style={{
                  color: isDark ? "#e6e6e6" : "#616161",
                  fontSize: 13.5,
                }}
              >
                By using this {name}'s profile, you agreeing to communicate
                respectfully, avoid harmful content, and take responsibility for
                shared information. Misuse may result in suspension.
              </Text>
              <Text
                style={{
                  color: isDark ? "#e6e6e6" : "#616161",
                  fontSize: 13.5,
                  bottom: 18,
                }}
              >
                Messages may be logged to improve the service
              </Text>
            </View>
            <View
              className="bg-neutral-800 rounded-xl items-center justify-center"
              style={{
                width: 250,
                height: 50,
              }}
            >
              <Button action={onAgreePress} title="Agree" tint={APP_COLOR} />
            </View>
            <View className="mt-5">
              <Button
                action={() => {
                  sheet.current?.dismiss();
                  setButtonLoading(false);
                }}
                title="Don't Agree"
              />
            </View>
          </View>
        </SafeAreaView>
      </TrueSheet>
    </React.Fragment>
  );
};
