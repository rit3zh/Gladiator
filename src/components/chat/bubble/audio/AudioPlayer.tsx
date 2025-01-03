import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { SymbolView, type SFSymbol } from "expo-symbols";
import Bounceable from "@freakycoder/react-native-bounceable";
import { APP_COLOR } from "@/constants/app";
import Animated, {
  useSharedValue,
  LinearTransition,
  FadeIn,
} from "react-native-reanimated";
import { Slider } from "react-native-awesome-slider";
import * as Haptics from "expo-haptics";
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";

import LoaderKit from "react-native-loader-kit";
import { SpinnerType } from "@/@types";
import { useTheme } from "@/hooks";
import { ThemeEnum } from "@/enums";

interface IProps {
  url: string;
}

export const AudioPlayer: React.FC<IProps> & React.FunctionComponent<IProps> = (
  props: IProps
): React.ReactNode & React.JSX.Element => {
  const { theme } = useTheme();
  const isDark = theme === ThemeEnum.Dark;

  const [isTrackEnded, setIsTrackEnded] = useState(false);

  useTrackPlayerEvents([Event.PlaybackQueueEnded], (event) => {
    if (event.type === Event.PlaybackQueueEnded) {
      setIsTrackEnded(true);
      setIsPlaying(false);
    }
  });

  const formatSecondsToMinutes = (seconds: number) => {
    if (!seconds) return undefined;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };
  const playBackState = usePlaybackState();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { duration, position } = useProgress(250);

  const isSliding = useSharedValue(false);
  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  const trackRemainingTime = formatSecondsToMinutes(duration - position);

  if (!isSliding.value) {
    progress.value = duration > 0 ? position / duration : 0;
  }
  useEffect(
    () => setIsPlaying(playBackState.state === State.Playing),
    [playBackState]
  );

  const onPress = async () => {
    if (isTrackEnded) {
      setIsTrackEnded(false);
      await TrackPlayer.seekTo(0);
      await TrackPlayer.play();
    } else {
      isPlaying ? await TrackPlayer.pause() : await TrackPlayer.play();
    }
  };

  useEffect(() => {
    async function TrackPlayerUtils() {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        url: props.url,
      });
    }
    TrackPlayerUtils();
  }, []);

  const getPlayButtonIcon = () => {
    if (isTrackEnded) return "arrow.trianglehead.clockwise";
    return isPlaying ? "pause.fill" : "play.fill";
  };

  return (
    <View style={styles.container} className="rounded-xl">
      <View className="mt-3 ml-3">
        <View className="flex-row items-center justify-between">
          <Bounceable onPress={onPress}>
            <SymbolView
              name={getPlayButtonIcon() as SFSymbol}
              tintColor={isDark ? APP_COLOR : "#28bf84"}
            />
          </Bounceable>
          <Slider
            containerStyle={styles.slider}
            theme={{
              maximumTrackTintColor: "#cfcfcf",
              minimumTrackTintColor: "#28bf84",
            }}
            heartbeat={false}
            thumbWidth={0}
            markWidth={0}
            sliderHeight={0}
            bubbleWidth={0}
            renderBubble={() => null}
            onSlidingStart={() => (isSliding.value = true)}
            onValueChange={async (value) => {
              await TrackPlayer.seekTo(value * duration);
            }}
            onSlidingComplete={async (value) => {
              if (!isSliding.value) return;

              isSliding.value = false;

              await TrackPlayer.seekTo(value * duration);
            }}
            disableTapEvent
            onHapticFeedback={async () =>
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
            }
            progress={progress}
            minimumValue={min}
            maximumValue={max}
          />
          <Animated.View
            layout={LinearTransition.springify(1000).mass(0.6)}
            className="mr-2"
          >
            {!trackRemainingTime ? (
              <>
                <Animated.View entering={FadeIn}>
                  <LoaderKit
                    name={SpinnerType.BallZigZag}
                    color={isDark ? "white" : "black"}
                    style={{ width: 18, height: 18 }}
                  />
                </Animated.View>
              </>
            ) : (
              <Animated.Text
                className=" text-right"
                style={{ color: isDark ? "white" : "black" }}
                entering={FadeIn}
              >
                {trackRemainingTime}
              </Animated.Text>
            )}
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 50,
  },
  slider: {
    borderRadius: 99,
    height: 10,
    width: 200,
    right: 0,
  },
});
