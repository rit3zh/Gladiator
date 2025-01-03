import {
  ScrollView,
  SafeAreaView,
  View,
  Image,
  Text,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useProfiles, useTheme, useUser } from "@/hooks";
import { theme as THEME } from "#/themes/Theme";
import Bounceable from "@freakycoder/react-native-bounceable";
import { List } from "react-native-ios-swipe-actions";
import { HStack, Spacer } from "swiftui-react-native";
import { FloatingAction } from "react-native-floating-action";
import { APP_COLOR } from "@/constants/app";
import { SymbolView } from "expo-symbols";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { ThemeEnum } from "@/enums";
import { deleteProfile } from "@/core";
import { EmptyState } from "@/components";

export const ChatScreen: React.FC<NativeStackHeaderProps> &
  React.FunctionComponent<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode & React.JSX.Element => {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { theme } = useTheme();
  const appTheme = THEME[theme];
  const isDark = theme === ThemeEnum.Dark;
  const user = useUser();
  const profiles = useProfiles();
  const onPressItem = async () => props.navigation.navigate("ProfileStack");

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerSearchBarOptions: {
        tintColor: theme === "dark" ? APP_COLOR : "#288560",
      },
    });
  }, [props.navigation]);
  const onActionClick = async (index: number) => {
    const selectedProfile = profiles[index];
    await deleteProfile(selectedProfile.chatProfileId);
  };

  return (
    <React.Fragment>
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentInsetAdjustmentBehavior={"always"}
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <SafeAreaView className="flex-1">
          {!profiles?.length ? (
            <>
              <Animated.View
                entering={FadeIn.springify()}
                className={"items-center justify-center"}
              >
                <EmptyState />
                {/* <ActivityIndicator color={isDark ? "gray" : "black"} /> */}
              </Animated.View>
            </>
          ) : (
            <List
              trailingFullSwipeDestructive
              trailingFullSwipeEnabled
              trailingSwipeActions={[
                {
                  icon: "trash.fill",
                  tint: "red",
                },
              ]}
              environment={{
                colorScheme: theme,
              }}
              onActionClick={onActionClick}
              style={{ flex: 1 }}
              listStyle="inset"
            >
              {profiles.map((item, index) => (
                <HStack key={index} style={{ marginTop: 10 }}>
                  <Image
                    source={{ uri: item?.image }}
                    style={{ width: 50, height: 50 }}
                    className="rounded-full"
                  />
                  <Bounceable
                    onPress={() =>
                      props.navigation?.navigate("DrawerStack", {
                        ...item,
                      })
                    }
                  >
                    <View className="ml-2">
                      <Text
                        className="font-bold"
                        style={{
                          color: appTheme.text,
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          color: appTheme.subtext,
                          maxWidth: 300,
                        }}
                        numberOfLines={2}
                      >
                        {item?.lastMessage || "Start your conversation"}
                      </Text>
                    </View>
                  </Bounceable>
                  <Spacer />
                </HStack>
              ))}
            </List>
          )}
        </SafeAreaView>
      </ScrollView>
      <View className="mb-20">
        <FloatingAction
          color={appTheme.appColor}
          onPressMain={onPressItem}
          floatingIcon={
            <SymbolView
              name="book.pages.fill"
              tintColor={theme === "dark" ? "#000" : "#303030"}
            />
          }
        />
      </View>
    </React.Fragment>
  );
};
