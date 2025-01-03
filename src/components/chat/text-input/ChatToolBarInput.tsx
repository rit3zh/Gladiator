import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from "react-native";
import EmojiPicker, { useRecentPicksPersistence } from "rn-emoji-keyboard";
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { hasNotch } from "react-native-device-info";
import {
  Entypo,
  FontAwesome,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import { MotiView, useDynamicAnimation } from "moti";

import Bounceable from "@freakycoder/react-native-bounceable";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { INPUT_BAR_COMPOSER_ACTIONS } from "#/actions";
import { APP_COLOR, EMOJI_STORAGE_KEY } from "#/app/index";
import { useTheme } from "@/hooks";
import { ThemeEnum } from "@/enums";
import { DARK_THEME_CONFIG } from "@/config";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

interface IProps {
  value: string;
  onChangeText: (text: string) => any | void;
  onSendPress: (text: string) => any | void;
}

export const ChatInputToolBar: React.FC<IProps> = ({
  value,
  onChangeText,
  onSendPress,
}: IProps) => {
  const { theme } = useTheme();

  useRecentPicksPersistence({
    initialization: () =>
      AsyncStorage.getItem(EMOJI_STORAGE_KEY).then((item) =>
        JSON.parse(item || "[]")
      ),
    onStateChange: (next) =>
      AsyncStorage.setItem(EMOJI_STORAGE_KEY, JSON.stringify(next)),
  });
  const animationState = useDynamicAnimation(() => ({
    width: 40,
    height: 40,
    backgroundColor: "#156bf5",
    borderRadius: 100,
  }));
  const [loading, setLoading] = useState<boolean>(false);
  const [showActions, setShowActions] = useState<boolean>(false);
  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState<boolean>(false);
  const onPress = () => {
    setLoading(!loading);
  };
  const onEmojiPress = () => setShowEmojiKeyboard(true);

  useEffect(() => {
    if (loading) {
      setShowActions(!showActions);
      animationState.animateTo({
        backgroundColor: "gray",
      });
    } else {
      setShowActions(false);
      animationState.animateTo({
        width: 40,
        height: 40,
        backgroundColor: APP_COLOR,
        borderRadius: 100,
      });
    }
  }, [loading]);

  const onDissMiss = () => {
    setShowActions(false);
    setLoading(false);
  };

  const isDark = theme === ThemeEnum.Dark;

  const emojiOpacity = useSharedValue(1);
  const emojiTranslateY = useSharedValue(0);
  const sendOpacity = useSharedValue(0);
  const sendTranslateY = useSharedValue(20);

  useEffect(() => {
    if (value) {
      emojiOpacity.value = withTiming(0, { duration: 200 });
      emojiTranslateY.value = withTiming(10, { duration: 200 });
      sendOpacity.value = withTiming(1, { duration: 200 });
      sendTranslateY.value = withSpring(0, { stiffness: 100 });
    } else {
      emojiOpacity.value = withTiming(1, { duration: 200 });
      emojiTranslateY.value = withTiming(0, { duration: 200 });
      sendOpacity.value = withTiming(0, { duration: 200 });
      sendTranslateY.value = withTiming(20, { duration: 200 });
    }
  }, [value]);

  const emojiStyle = useAnimatedStyle(() => ({
    opacity: emojiOpacity.value,
    transform: [{ translateY: emojiTranslateY.value }],
  }));

  const sendStyle = useAnimatedStyle(() => ({
    opacity: sendOpacity.value,
    transform: [{ translateY: sendTranslateY.value }],
  }));

  return (
    <React.Fragment>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? "#212121" : "#dedede",
          },
        ]}
        className=""
        entering={FadeInRight.delay(150).stiffness(20)}
      >
        <View className="ml-5 mt-2 flex-row items-center">
          <Bounceable onPress={onPress}>
            <MotiView
              state={animationState}
              className={`bg-[#c5fae5] rounded-full items-center justify-center`}
            >
              {loading ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <Ionicons name="add-outline" size={25} color={"black"} />
              )}
            </MotiView>
          </Bounceable>
          <View className="ml-5 flex-1">
            <TextInput
              value={value}
              onChangeText={onChangeText}
              cursorColor={APP_COLOR}
              selectionColor={APP_COLOR}
              placeholder="Type your message"
              style={{
                fontSize: 18,
                color: isDark ? "white" : "black",
                maxWidth: 200,
              }}
            />
          </View>
          <Bounceable
            onPress={
              value
                ? () => onSendPress(value)
                : () => setShowEmojiKeyboard(true)
            }
          >
            <View className="mr-8">
              <Animated.View style={emojiStyle}>
                <FontAwesome6 name="face-smile" size={24} color={"#919191"} />
              </Animated.View>
              <Animated.View style={[sendStyle, { position: "absolute" }]}>
                <Ionicons name="send" size={24} color={APP_COLOR} />
              </Animated.View>
            </View>
          </Bounceable>
        </View>
      </Animated.View>
      <Modal
        isVisible={showActions}
        onBackButtonPress={onDissMiss}
        onBackdropPress={onDissMiss}
        animationIn={"fadeIn"}
        backdropOpacity={1}
        hasBackdrop={true}
        customBackdrop={
          <View className="flex-1 bg-transparent">
            <BlurView
              style={{
                ...StyleSheet.absoluteFillObject,
              }}
              intensity={50}
              tint={
                theme === ThemeEnum.Dark
                  ? "systemThinMaterialDark"
                  : "systemThinMaterialLight"
              }
            />
            <SafeAreaView className="">
              <View className="items-end mr-10 mt-10">
                <Bounceable onPress={onDissMiss}>
                  <Ionicons
                    name="close"
                    color={isDark ? "white" : "black"}
                    size={40}
                  />
                </Bounceable>
              </View>
            </SafeAreaView>
          </View>
        }
        style={{
          justifyContent: "flex-end",
          marginBottom: 100,
        }}
        animationOut={"fadeOut"}
      >
        <FlatList
          data={INPUT_BAR_COMPOSER_ACTIONS}
          keyExtractor={(_, index) => index.toString()}
          horizontal={false}
          style={{
            maxHeight: HEIGHT - 250,
          }}
          contentContainerStyle={{
            alignItems: "flex-start",
            justifyContent: "flex-end",
            flex: 1,
            marginLeft: 20,
          }}
          renderItem={({ index, item }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 60).springify()}
              exiting={FadeInUp.delay(index * 60)}
              className="items-center justify-center m-5 right-5 flex-row"
            >
              <View className="rounded-full bg-white h-[50px] w-[50px] items-center justify-center mr-5">
                {item.name === "Photo" ? (
                  <Entypo name="image" size={22} color="black" />
                ) : item.name === "File" ? (
                  <FontAwesome name="file" size={22} color="black" />
                ) : (
                  <Ionicons name="videocam-sharp" size={22} color="black" />
                )}
              </View>
              <View>
                <Text
                  className="text-[18px] font-medium"
                  style={{ color: isDark ? "white" : "black" }}
                >
                  {item.name}
                </Text>
              </View>
            </Animated.View>
          )}
        />
      </Modal>
      <EmojiPicker
        open={showEmojiKeyboard}
        onClose={() => setShowEmojiKeyboard(false)}
        categoryPosition="floating"
        emojiSize={35}
        hideHeader={false}
        hideSearchBarClearIcon={false}
        enableSearchBar={true}
        expandable={true}
        enableRecentlyUsed={true}
        theme={isDark ? DARK_THEME_CONFIG : undefined}
        enableCategoryChangeAnimation={true}
        enableSearchAnimation={true}
        categoryOrder={["recently_used"]}
        enableCategoryChangeGesture={true}
        onEmojiSelected={() => setShowEmojiKeyboard(false)}
      />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDTH - 50,
    backgroundColor: "#dedede",
    height: hasNotch() ? 60 : 20,
    borderRadius: 40,
    marginBottom: 10,
  },
});
