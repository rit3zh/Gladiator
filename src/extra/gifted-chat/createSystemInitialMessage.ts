import { IMessage } from "react-native-gifted-chat";
import uuid from "react-native-uuid";

export const createSystemInitialMessage = (botId: string): IMessage => ({
  _id: uuid.v4(),
  user: { _id: botId },
  createdAt: new Date(),
  text: `This is a system's default message.`,
  system: true,
});
