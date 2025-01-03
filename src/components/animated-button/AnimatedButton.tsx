import { Text, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { MotiView, useDynamicAnimation } from "moti";
import Bounceable from "@freakycoder/react-native-bounceable";

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  loading: boolean;
  color?: string;
  textColor?: string;
  indicatorColor?: string;
  renderComponent?: () => React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = (
  props
): React.ReactNode => {
  const animation = useDynamicAnimation(() => ({
    width: 200,
    height: 60,
    borderRadius: 30,
  }));

  useEffect(() => {
    if (props.loading === true) {
      return animation.animateTo({
        width: 60,
        height: 60,
        borderRadius: 30,
        opacity: 0.5,
      });
    } else {
      return animation.animateTo({
        width: 200,
        height: 60,
        borderRadius: 30,
        opacity: 1,
      });
    }
  }, [props.loading]);

  return (
    <Bounceable onPress={props.onPress}>
      <MotiView
        state={animation}
        className="w-[30px] h-[30px] rounded-full items-center justify-center"
        style={{ backgroundColor: props.color ?? "#000" }}
      >
        {props.loading === true ? (
          <MotiView>
            <ActivityIndicator
              size="small"
              color={props?.indicatorColor ?? "#000"}
            />
          </MotiView>
        ) : (
          <React.Fragment>
            {props?.renderComponent ? (
              props.renderComponent()
            ) : (
              <Text
                className="font-bold text-lg"
                style={{ color: props?.textColor ?? "#000" }}
              >
                {props.title}
              </Text>
            )}
          </React.Fragment>
        )}
      </MotiView>
    </Bounceable>
  );
};
