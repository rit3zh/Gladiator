import * as React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Modal from "react-native-modal";

interface IProps {
  isVisible: boolean;
}

export const LoadingModal: React.FC<IProps> = ({
  isVisible,
}): React.ReactNode => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
    >
      <View className="flex-1 items-center justify-center">
        <View
          style={styles.container}
          className="items-center justify-center rounded-lg"
        >
          <ActivityIndicator color={"white"} size={"large"} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    opacity: 0.5,
  },
});
