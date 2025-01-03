import { View, SafeAreaView, Text as ReactNativeText } from "react-native";
import React from "react";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { List, Text, Section, HStack, Spacer } from "swiftui-react-native";
import { useUser } from "@/hooks";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "@/components/chat/bubble/avatar/Avatar";

export const BookmarkScreen: React.FC<NativeStackHeaderProps> &
  React.FunctionComponent<NativeStackHeaderProps> = (
  props: NativeStackHeaderProps
): React.ReactNode & React.JSX.Element => {
  const params = props.route.params as any;
  const user = useUser();

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <List listStyle="inset" style={{ flex: 1 }}>
        <Section>
          {user?.bookmarks?.map((bookmark) => (
            <HStack key={bookmark?.date?.toString()}>
              <View className="mb-5 mr-3">
                <Avatar
                  image={bookmark?.user?.avatar as string}
                  style={{ width: 50, height: 50 }}
                />
              </View>

              <View>
                <ReactNativeText className="text-white font-bold">
                  {bookmark?.user?.name}
                </ReactNativeText>
                <ReactNativeText
                  className="text-gray-300 max-w-[250px]"
                  numberOfLines={2}
                >
                  {bookmark?.content}
                </ReactNativeText>
              </View>
              <Spacer />
              <Text fontSize={11}>
                {formatDistanceToNow(new Date(bookmark?.date))}
              </Text>
            </HStack>
          ))}
        </Section>
      </List>
    </SafeAreaView>
  );
};
