import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { FetchLastMonthArticlesDefinition } from "../functions/fetch_last_month_articles_function.ts";

const SendBlogPostsMessageWorkflow = DefineWorkflow({
  callback_id: "send_blog_posts_message",
  title: "Send blog posts message ",
  description: "Send blog posts summary message",
});

const fetchLastMonthArticlesStep = SendBlogPostsMessageWorkflow.addStep(
  FetchLastMonthArticlesDefinition,
  {},
);

SendBlogPostsMessageWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: fetchLastMonthArticlesStep.outputs.channel_id,
    message: fetchLastMonthArticlesStep.outputs.message,
  },
);

export default SendBlogPostsMessageWorkflow;
