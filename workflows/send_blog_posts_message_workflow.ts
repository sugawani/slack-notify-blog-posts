import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { FetchWantedlyArticles } from "../functions/fetch_wantedly_articles.ts";
import { FetchZennArticles } from "../functions/fetch_zenn_articles.ts";

const SendBlogPostsMessageWorkflow = DefineWorkflow({
  callback_id: "send_blog_posts_message",
  title: "Send blog posts message ",
  description: "Send blog posts summary message",
});

const fetchLastMonthZennArticleStep = SendBlogPostsMessageWorkflow.addStep(
  FetchZennArticles,
  {},
);

SendBlogPostsMessageWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: fetchLastMonthZennArticleStep.outputs.channel_id,
    message: fetchLastMonthZennArticleStep.outputs.message,
  },
);

const fetchLastMonthWantedlyArticleStep = SendBlogPostsMessageWorkflow.addStep(
  FetchWantedlyArticles,
  {},
);

SendBlogPostsMessageWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: fetchLastMonthWantedlyArticleStep.outputs.channel_id,
    message: fetchLastMonthWantedlyArticleStep.outputs.message,
  },
);

export default SendBlogPostsMessageWorkflow;
