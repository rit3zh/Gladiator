import { useEffect } from "react";
import TrackPlayer from "react-native-track-player";

export function useSetupPlayer() {
  useEffect(() => {
    async function SetupPlayer() {
      return await TrackPlayer.setupPlayer();
    }

    SetupPlayer();
  }, []);
}
