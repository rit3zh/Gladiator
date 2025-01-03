import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import {
  Bubble,
  IMessage,
  Message,
  MessageProps,
} from "react-native-gifted-chat";
import { Avatar } from "../avatar/Avatar";
import { Reactions } from "../../reactions/Reactions";
import { ImagePreview } from "react-native-images-preview";
import { AudioPlayer } from "../audio/AudioPlayer";
import { ThemeEnum } from "@/enums";
import { useTheme, useUser } from "@/hooks";
import { SystemMessage } from "../system-message/SystemMessage";
import { toast } from "@baronha/ting";
import {
  ContextMenuView,
  OnPressMenuItemEventObject,
} from "react-native-ios-context-menu";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_COLOR } from "@/constants/app";
import { updateUser } from "@/core";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

interface IProps extends MessageProps<IMessage> {
  username: string;
  avatar: string;
  id?: string;
}

export const MessageBubble: React.FC<IProps> &
  React.FunctionComponent<IProps> = (
  props: IProps
): React.ReactNode & React.JSX.Element => {
  const { theme } = useTheme();

  const user = useUser();

  const isDark = theme === ThemeEnum.Dark;
  const onCopyPress = async () => {
    const getItem = await AsyncStorage.getItem("copy");
    if (getItem) {
      return AsyncStorage.removeItem("copy");
    } else {
      await Clipboard.setStringAsync(props.currentMessage.text);
      toast({
        position: "bottom",
        title: "Copied",
        preset: "done",
        message: "Sucessfully copied the content.",
        shouldDismissByDrag: true,
        haptic: "success",
        duration: 1.5,
      });
      AsyncStorage.setItem("copy", "copied");
    }
  };

  const onPressMenuItem = (item: OnPressMenuItemEventObject) => {
    const { actionKey } = item.nativeEvent;
    if (actionKey === "book_mark") {
      updateUser({
        userId: user?.uid as string,
        data: {
          bookmarks: [
            ...(user?.bookmarks ?? []),
            {
              content: props?.currentMessage?.text,
              date: Date.now(),
              user: {
                name: props.username ?? "",
                avatar: (props?.avatar as string) ?? "",
              },
            },
          ],
        },
      });
    }
  };

  return (
    <View>
      {props.position === "left" ? (
        <>
          {props?.currentMessage?.system ? (
            <SystemMessage name={props.username!} />
          ) : (
            <View className="ml-5" style={styles.container}>
              <ContextMenuView
                onPressMenuItem={onPressMenuItem}
                menuConfig={{
                  menuTitle: "",

                  menuItems: [
                    {
                      actionKey: "book_mark",
                      actionTitle: "Bookmark",
                      icon: {
                        iconType: "SYSTEM",
                        iconValue: "bookmark",
                        iconTint: APP_COLOR,
                      },
                    },
                    {
                      actionKey: "like_response ",
                      actionTitle: "Like",
                      icon: {
                        iconType: "SYSTEM",
                        iconValue: "hand.thumbsup",
                        iconTint: APP_COLOR,
                      },
                    },
                    {
                      actionKey: "dislike_response ",
                      actionTitle: "Dislike",
                      icon: {
                        iconType: "SYSTEM",
                        iconValue: "hand.thumbsdown",
                        iconTint: APP_COLOR,
                      },
                    },
                  ],
                }}
              >
                <View className="ml-5">
                  <View className="mb-5">
                    {props?.currentMessage?.audio ? (
                      <AudioPlayer
                        url={props.currentMessage.audio?.toString() as string}
                      />
                    ) : null}

                    {props.currentMessage.image ? (
                      <ImagePreview
                        imageSource={{ uri: props.currentMessage.image }}
                        imageStyle={styles.image}
                        pinchZoomEnabled={true}
                        doubleTapZoomEnabled={true}
                        swipeDownCloseEnabled={true}
                      />
                    ) : null}
                  </View>
                  <Text style={{ color: isDark ? "white" : "black" }}>
                    {props.currentMessage.text}
                  </Text>
                </View>
                <Avatar
                  image={props.avatar as string}
                  style={{ width: 40, height: 40 }}
                />
              </ContextMenuView>
              <Reactions onCopyPress={onCopyPress} />
            </View>
          )}
        </>
      ) : (
        <Message
          showUserAvatar
          {...props}
          renderBubble={(bubbleProps) => (
            <Bubble
              {...bubbleProps}
              wrapperStyle={{
                right: {
                  overflow: "hidden",
                  marginLeft: 0,
                },
              }}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: WIDTH - 100,
  },
  image: {
    width: 320,
    height: 220,
    borderRadius: 5,
  },
});
