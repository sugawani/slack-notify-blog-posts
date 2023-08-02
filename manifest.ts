import { Manifest } from "deno-slack-sdk/mod.ts";
import SendMessageWorkflow from "./workflows/send_message_workflow.ts";

export default Manifest({
  name: "zenn-last-month-articles",
  description: "Notify monthly zenn articles",
  icon: "assets/app_icon.png",
  workflows: [SendMessageWorkflow],
  outgoingDomains: ["zenn.dev"],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
  ],
});
