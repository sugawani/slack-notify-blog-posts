import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { FetchLastMonthArticlesDefinition } from "../functions/fetch_last_month_articles_function.ts";

const SendMessageWorkflow = DefineWorkflow({
  callback_id: "sample_workflow",
  title: "Sample workflow",
  description: "A sample workflow",
});

const fetchLastMonthArticlesStep = SendMessageWorkflow.addStep(
  FetchLastMonthArticlesDefinition,
  {},
);

SendMessageWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: fetchLastMonthArticlesStep.outputs.channel_id,
    message: fetchLastMonthArticlesStep.outputs.message,
  },
);

export default SendMessageWorkflow;
