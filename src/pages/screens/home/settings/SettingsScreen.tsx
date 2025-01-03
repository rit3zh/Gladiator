import { View, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import {
  Button,
  HStack,
  List,
  Section,
  Image,
  Spacer,
  Text,
  Toggle,
  useBinding,
} from "swiftui-react-native";
import { useTheme, useUser } from "@/hooks";
import switchTheme from "react-native-theme-switch-animation";
import { Ionicons } from "@expo/vector-icons";
import { ThemeEnum } from "@/enums";
import { deleteUser } from "@/storage";

export const SettingsScreen: React.FC<NativeStackHeaderProps> &
  React.FunctionComponent<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode & React.JSX.Element => {
  const user = useUser();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === ThemeEnum.Dark;
  const toggleValue = useBinding(isDark);

  const onSignoutPress = async () => {
    await deleteUser();
    return props.navigation?.reset({
      routes: [{ name: "IntroStack" }],
    });
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <List style={{ flex: 1 }}>
        <Section header="Profile">
          <HStack>
            <Image systemName="person" imageScale="medium" />
            <Text font="subheadline">Personal Profile</Text>
            <Spacer />
            <Image systemName="chevron.forward" foregroundStyle={"gray"} />
          </HStack>
          <HStack>
            <Image systemName="moon" imageScale="medium" />
            <Text font="subheadline">Dark Mode</Text>
            <Spacer />
            <Toggle
              isOn={toggleValue}
              onChange={(value) =>
                switchTheme({
                  switchThemeFunction: () => toggleTheme(),
                })
              }
            />
          </HStack>
        </Section>
        <Section header="Notifications">
          <HStack>
            <Image systemName="bell" imageScale="medium" />
            <Text font="subheadline">Notifications</Text>
            <Spacer />
            <Toggle isOn={toggleValue} />
          </HStack>
        </Section>
        <Section header="Resources">
          <HStack>
            <Image systemName="safari" imageScale="medium" />
            <Text font="subheadline">Github</Text>
            <Spacer />
            <Image systemName="chevron.forward" foregroundStyle={"gray"} />
          </HStack>
        </Section>

        <Button
          action={onSignoutPress}
          title="Signout"
          foregroundStyle={"red"}
        />
      </List>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
