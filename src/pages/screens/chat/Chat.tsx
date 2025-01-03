import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { View, LayoutAnimation } from "react-native";
import { GiftedChat, type IMessage } from "react-native-gifted-chat";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import uuid from "react-native-uuid";

import firestore from "@react-native-firebase/firestore";
import { HeaderBackButton } from "@react-navigation/elements";
import { FloatingAction } from "react-native-floating-action";
import { DrawerToggleButton } from "@react-navigation/drawer";
import {
  ChatInputToolBar,
  MessageBubble,
  Tos,
  TypingIndicator,
  LoaderChat,
} from "~/index";
import { APP_COLOR } from "@/constants/app";
import { useTheme, useMessages, useUser } from "@/hooks";
import { Role, ThemeEnum } from "@/enums";
import { sendClientMessage } from "@/core/api/groq";
import { getHistoryFromFirestore } from "@/modifiers/url+modifers";
import type { ChatProfile, Message } from "@/typings";
import Animated, { FadeIn } from "react-native-reanimated";

export const Chat: React.FC<NativeStackHeaderProps> = (props) => {
  const params = props.route?.params as ChatProfile;

  const user = useUser();
  const _messages = useMessages(params.chatId);
  const { theme } = useTheme();
  const isDark = theme === ThemeEnum.Dark;
  const [showTos, setShowTos] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [renderingChats, setChatsRendering] = useState<boolean>(true);

  useEffect(() => {
    async function main() {
      const noMessage: boolean = _messages?.length === 0 ? true : false;
      console.log(_messages?.length);
      if (noMessage === true) {
        setShowTos(true);
        setChatsRendering(false);
      } else {
        return 0;
      }
    }
    main();
  }, [_messages]);

  const [value, setValue] = useState<string>("");
  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: `Chat with ${params.name}`,
      headerLeft: () => (
        <View style={{ marginLeft: 12 }}>
          <HeaderBackButton
            tintColor={isDark ? APP_COLOR : "#008752"}
            onPress={() => props.navigation.goBack()}
          />
        </View>
      ),
      headerRight: () => (
        <View style={{ marginRight: 12 }}>
          <DrawerToggleButton tintColor={isDark ? APP_COLOR : "#008752"} />
        </View>
      ),
      headerTintColor: isDark ? APP_COLOR : "#008752",
      headerTitleStyle: {
        color: isDark ? "white" : "black",
      },
    });
  }, [isDark, props.navigation, params.name]);

  const onSend = useCallback(
    async (newMessages: Message[], text: string) => {
      try {
        const chatId = params.chatId;

        const newMessage = newMessages[0];
        await firestore()
          .collection("messages")
          .doc(chatId)
          .collection("chats")
          .add(newMessage);

        GiftedChat.append(_messages, [newMessage as IMessage]);
        LayoutAnimation.spring();

        const history = await getHistoryFromFirestore(_messages!);

        const response = await sendClientMessage({
          history: history || [],
          key: process.env.EXPO_PUBLIC_GROQ_API_KEY || "",
          prompt: params.bio,
          text,
        });

        const replyMessage: Message = {
          _id: uuid.v4(),
          text: response.choices[0].message?.content || "",
          from: Role.Assistant,
          createdAt: Date.now(),
          timestamp: firestore.FieldValue.serverTimestamp(),
          user: {
            _id: 0,
          },
        };

        await firestore()
          .collection("messages")
          .doc(chatId)
          .collection("chats")
          .add(replyMessage);

        GiftedChat.append(_messages, [replyMessage as IMessage]);
        LayoutAnimation.spring();

        setLoading(false);

        return await firestore()
          .collection("profiles")
          .where("chatId", "==", params.chatId)
          .get()
          .then(
            async (document) =>
              await firestore()
                .collection("profiles")
                .doc(document.docs[0].id)
                .update({
                  lastMessage: replyMessage.text,
                  lastMessageTimestamp: Date.now(),
                })
          );
      } catch (error) {
        console.error("Failed to send message:", error);
        setLoading(false);
      }
    },
    [_messages, params.chatId, params.bio]
  );

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setValue("");
    setLoading(true);

    const newMessage: Message = {
      _id: uuid.v4(),
      text,
      createdAt: Date.now(),
      timestamp: firestore.FieldValue.serverTimestamp(),
      user: {
        _id: user?.uid || "",
        avatar:
          user?.photoURL ??
          "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
      },
      from: Role.User,
    };

    onSend([newMessage], text);
  };

  return (
    <React.Fragment>
      {showTos ? (
        <>
          <Tos
            name={params?.name as string}
            onAgreePress={() => {
              setChatsRendering(false);
              setShowTos(false);
            }}
          />
        </>
      ) : renderingChats ? (
        <Animated.View
          entering={FadeIn}
          className={"flex-1 items-center justify-center"}
        >
          <LoaderChat />
        </Animated.View>
      ) : (
        <React.Fragment>
          <GiftedChat
            messages={_messages as unknown as IMessage[]}
            user={{
              _id: user?.uid || "",
            }}
            renderInputToolbar={() => (
              <View
                style={{
                  marginBottom: 32,
                  marginTop: 12,
                  alignItems: "center",
                }}
              >
                <ChatInputToolBar
                  value={value}
                  onChangeText={setValue}
                  onSendPress={() => handleSend(value)}
                />
              </View>
            )}
            renderFooter={() => <TypingIndicator isTyping={loading} />}
            renderMessage={(messageProps) => (
              <MessageBubble
                id={params.chatId}
                {...messageProps}
                username={params.name}
                avatar={params.image}
              />
            )}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
