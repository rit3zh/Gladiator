import {
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  View,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import type { Image as UserImage } from "@/typings";
import { theme as THEME } from "@/constants/themes/Theme";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import {
  List,
  Toggle,
  Picker,
  Spacer,
  Section,
  Button,
  HStack,
  useBinding,
  Text,
} from "swiftui-react-native";
import { useTheme, useUser } from "@/hooks";
import { SymbolView } from "expo-symbols";
import { HeaderBackButton } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";
import { toast } from "@baronha/ting";
import { delay } from "@/utils";
import { uploadAvatar } from "@/storage";
import { LoadingModal } from "@/components";
import {
  validateBasicMagicProfile,
  validateProfile,
} from "@/validators/profile";
import { createProfile, createMessageCollection } from "@/core";

import uuid from "react-native-uuid";
import firestore from "@react-native-firebase/firestore";

import { INITIAL_IMAGE_FILE_NAME } from "#/keys/ImageFileNameKey";
import { APP_COLOR } from "@/constants/app";
import { createBasicBio, createBio } from "@/modifiers/url+modifers";
import { sendMessage } from "@/core/api/groq/index";
import Bounceable from "@freakycoder/react-native-bounceable";

export const ProfileScreen: React.FC<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode & React.JSX.Element => {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const user = useUser();
  const { theme } = useTheme();
  const appTheme = THEME[theme];
  const selection = useBinding("Male");
  const INITIAL_HOBBIES: string[] = [
    "Reading",
    "Dancing",
    "Traveling",
    "Cooking",
    "Gardening",
  ];
  const INITIAL_TECHNOLOGY: string[] = [
    "Coding",
    "Gadgets",
    "AI",
    "Gaming Tech",
  ];
  const INITIAL_CREATIVITY: string[] = [
    "Drawing",
    "Photography",
    "Writing",
    "Fashion",
  ];
  const [name, setName] = useState<string>();
  const [age, setAge] = useState<number>();
  const [technology, setTechnology] = useState<string>("Coding");
  const [technologyList, setTechnologyList] = useState<string[]>([
    ...INITIAL_TECHNOLOGY,
  ]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hobbies, setHobbies] = useState<string>("Reading");
  const [hobbiesList, setHobbiesList] = useState<string[]>([
    ...INITIAL_HOBBIES,
  ]);
  const [creativityList, setCreativityList] =
    useState<string[]>(INITIAL_CREATIVITY);
  const [creativity, setCreativity] = useState<string>("Drawing");
  const isOn = useBinding(false);
  const [avatar, setAvatar] = useState<UserImage>({
    uri: "https://surgassociates.com/wp-content/uploads/610-6104451_image-placeholder-png-user-profile-placeholder-image-png-1.jpg",
    fileName: INITIAL_IMAGE_FILE_NAME,
  });
  const [more, setMore] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useLayoutEffect(
    () =>
      props.navigation?.setOptions({
        headerRight: () => (
          <TouchableOpacity>
            <SymbolView name="info.circle" tintColor={appTheme.text} />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <HeaderBackButton
            tintColor={appTheme.appColor}
            onPress={() => props?.navigation?.goBack()}
          />
        ),
      }),

    []
  );

  const onMagicPress = async () => {
    const isValid = validateBasicMagicProfile(age!, name!);

    if (isValid) {
      setIsLoading(true);
      const bio = createBasicBio({
        age,
        name,
        hobby: hobbies,
        nsfw: isOn.value,
        others: creativity,
        sex: selection.value,
        tech: technology,
      });

      const response = await sendMessage({
        key: process.env.EXPO_PUBLIC_GROQ_API_KEY as string,
        question: bio.toString(),
      });
      const responseText = response?.choices[0]?.message?.content as string;
      setMore(responseText);
      setIsLoading(false);
    } else {
      return;
    }
  };

  const onActionPress = async () => {
    const isValid = validateProfile(age!, name!, more!);

    if (isValid) {
      setIsVisible(true);
      const chatId: string = uuid.v4().toString();
      const isSameFileName = avatar?.fileName === INITIAL_IMAGE_FILE_NAME;
      const profileBio = createBio({
        age: age as number,
        name: name as string,
        bio: more,
        hobby: hobbies,
        nsfw: isOn.value,
        others: creativity,
        sex: selection.value.toLowerCase(),
        tech: technology,
      });
      if (isSameFileName) {
        await createProfile({
          name: name as string,
          age: age as number,
          bio: profileBio,
          nsfw: isOn.value,
          interests: [hobbies, technology, creativity],
          sex: selection.value.toLowerCase(),
          chatId,
          chatProfileId: user?.uid!,
          createdAt: firestore.FieldValue.serverTimestamp(),
          image: avatar?.uri,
          lastMessage: "",
          lastMessageTimestamp: null,
        });
        await createMessageCollection(chatId);
      } else {
        const image = await uploadAvatar(
          avatar?.base64!,
          avatar?.fileName?.toString()!
        );

        await createProfile({
          name: name as string,
          age: age as number,
          chatProfileId: user?.uid!,
          bio: profileBio,
          nsfw: isOn.value,
          interests: [hobbies, technology, creativity],
          sex: selection.value.toLowerCase(),
          chatId,
          image: image?.data?.display_url!,
          deleteImage: image?.data?.delete_url!,
          createdAt: firestore.FieldValue.serverTimestamp(),
          lastMessage: "",
          lastMessageTimestamp: null,
        });

        await createMessageCollection(chatId);
      }
      setIsVisible(false);
      toast({
        title: "Profile Created",
        message: `Profile for ${name} has been created.`,
        preset: "done",
        haptic: "success",
        shouldDismissByDrag: true,
      });
    } else {
      console.log("no valid");
    }
  };

  const onPress = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      toast({
        title: "Grant Permission",
        message:
          "Permission not granted, please allow the application to pick images.",
        haptic: "error",
        preset: "error",
      });
      delay(2000);
      Alert.alert(
        "Permission Required",
        "This feature requires your permission to proceed. Would you like to grant it?",
        [
          {
            text: "Grant Permission",
            style: "default",
            onPress: async () => await Linking.openSettings(),
          },
          {
            text: "Cancel",
            style: "destructive",
          },
        ]
      );

      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    if (result.canceled) return;

    setAvatar({
      uri: result.assets[0].uri,
      fileName: result?.assets[0]?.fileName as string,
      base64: result?.assets[0]?.base64 as string,
    });
  };

  useEffect(() => {
    if (!hobbies) return setHobbiesList(INITIAL_HOBBIES);
    if (!technology) return setTechnologyList(INITIAL_TECHNOLOGY);
    if (!creativity) return setCreativityList(INITIAL_CREATIVITY);
  }, [hobbies]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="always"
      style={{
        backgroundColor: appTheme.backgroundColor,
        flex: 1,
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: appTheme.backgroundColor,
        flexGrow: 1,
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: appTheme.backgroundColor,
        }}
      >
        <View className="items-center">
          <TouchableOpacity onPress={onPress}>
            <Image
              source={{
                uri: avatar.uri,
              }}
              style={{
                width: 90,
                height: 90,
                borderRadius: 1000,
              }}
            />
          </TouchableOpacity>
        </View>

        <List
          environment={{
            colorScheme: theme,
          }}
          style={{ flex: 1 }}
        >
          <Section header="Information">
            <HStack>
              <TextInput
                placeholder="Name"
                style={{ color: appTheme.text }}
                className="w-[300px] ml-0"
                cursorColor={APP_COLOR}
                selectionColor={APP_COLOR}
                value={name}
                onChangeText={(text) => setName(text)}
              />
              <Spacer />
              <SymbolView name="star.fill" tintColor={"gray"} size={14} />
            </HStack>

            <HStack>
              <TextInput
                style={{ color: appTheme.text }}
                placeholder="Age"
                className="w-[300px] ml-0"
                value={age?.toString()}
                cursorColor={APP_COLOR}
                selectionColor={APP_COLOR}
                keyboardType="numeric"
                onChangeText={(text) => {
                  if (!text) return setAge(0);

                  if (/^\d{0,2}$/.test(text)) {
                    setAge(Number(text));
                  }
                }}
              />
              <Spacer />
              <SymbolView name="star.fill" tintColor={"gray"} size={14} />
            </HStack>

            <HStack>
              <Ionicons
                name={
                  selection.value.toLowerCase() === "other"
                    ? "transgender"
                    : (selection.value.toLowerCase() as any)
                }
                size={18}
                color={"gray"}
              />
              <Spacer />
              <View className="">
                <Picker selection={selection}>
                  <Text>Male</Text>
                  <Text>Female</Text>
                </Picker>
              </View>
            </HStack>

            <HStack>
              <Ionicons name={"warning"} size={18} color={"gray"} />
              <Text fontSize={14}>NSFW</Text>
              <Spacer />
              <View className="">
                <Toggle
                  isOn={isOn}
                  resizable={true}
                  animation={{
                    type: "easeIn",
                    value: 20,
                  }}
                />
              </View>
            </HStack>
          </Section>

          <Section header="Interests">
            <HStack>
              <TextInput
                placeholder="Hobbies"
                className="w-[200px] ml-0"
                style={{ color: appTheme.text }}
                value={hobbies}
                onChangeText={(newHobby) => {
                  setHobbies(newHobby);
                  setHobbiesList([...INITIAL_HOBBIES, newHobby]);
                }}
              />
              <Spacer />
              <View>
                <Picker
                  selection={hobbies}
                  onChange={(newHobby) => setHobbies(newHobby)}
                >
                  {hobbiesList.map((hobby, index) => (
                    <Text key={index.toString() + "_"}>{hobby}</Text>
                  ))}
                </Picker>
              </View>
              <Spacer />
            </HStack>

            <HStack>
              <TextInput
                placeholder="Technology"
                className="w-[200px] ml-0"
                style={{ color: appTheme.text }}
                value={technology}
                onChangeText={(newTechnology) => {
                  setTechnology(newTechnology);
                  setTechnologyList([...INITIAL_TECHNOLOGY, newTechnology]);
                }}
              />
              <Spacer />
              <View>
                <Picker
                  selection={technology}
                  onChange={(newTechnology) => setTechnology(newTechnology)}
                >
                  {technologyList.map((technology, index) => (
                    <Text key={index.toString() + "_"}>{technology}</Text>
                  ))}
                </Picker>
              </View>
              <Spacer />
            </HStack>
            <HStack>
              <TextInput
                placeholder="Creativity"
                className="w-[200px] ml-0"
                style={{ color: appTheme.text }}
                value={creativity}
                editable={false}
              />
              <Spacer />
              <View>
                <Picker
                  selection={creativity}
                  onChange={(newCreativity) => setCreativity(newCreativity)}
                >
                  {creativityList.map((creativity, index) => (
                    <Text key={index.toString() + "_"}>{creativity}</Text>
                  ))}
                </Picker>
              </View>
              <Spacer />
            </HStack>
          </Section>

          <Section header="Extra Information">
            <HStack>
              <TextInput
                placeholder="Describe a bit more to your custom chat bot…"
                editable={true}
                className="w-[300px] ml-0"
                style={{ color: appTheme.text }}
                value={more}
                onChangeText={(text) => setMore(text)}
                multiline={false}
              />
              <Spacer />
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <Bounceable onPress={onMagicPress}>
                  <SymbolView name="sparkles" tintColor={APP_COLOR} size={20} />
                </Bounceable>
              )}
            </HStack>
          </Section>

          <Button
            title="Create"
            action={onActionPress}
            buttonStyle="borderless"
          />
        </List>
        <LoadingModal isVisible={isVisible} />
      </SafeAreaView>
    </ScrollView>
  );
};
