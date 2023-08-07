import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const SendMessage = DefineFunction({
  callback_id: "send_message",
  title: "Send a message",
  description: "Send a message",
  source_file: "functions/send_message.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
      },
    },
    required: ["message"],
  },
  output_parameters: {
    properties: {
      notified: {
        type: Schema.types.boolean,
      },
      message: {
        type: Schema.types.string,
      },
    },
    required: ["notified", "message"],
  },
});

export default SlackFunction(
  SendMessage,
  async ({ inputs, env, client }) => {
    const notifyChannelID = env["NOTIFY_CHANNEL_ID"];
    if (notifyChannelID == null) {
      return {
        outputs: { notified: false, message: "env NOTIFY_CHANNEL_ID is empty" },
      };
    }

    const { message } = inputs;
    await client.chat.postMessage({
      channel: notifyChannelID,
      text: message,
    });

    return { outputs: { notified: true, message: message } };
  },
);
