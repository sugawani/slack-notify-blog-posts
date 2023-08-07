import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { FetchWantedlyArticles } from "../functions/fetch_wantedly_articles.ts";
import { FetchZennArticles } from "../functions/fetch_zenn_articles.ts";
import { SendMessage } from "../functions/send_message.ts";

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
  SendMessage,
  {
    message: fetchLastMonthZennArticleStep.outputs.message,
  },
);

const fetchLastMonthWantedlyArticleStep = SendBlogPostsMessageWorkflow.addStep(
  FetchWantedlyArticles,
  {},
);

SendBlogPostsMessageWorkflow.addStep(
  SendMessage,
  {
    message: fetchLastMonthWantedlyArticleStep.outputs.message,
  },
);

export default SendBlogPostsMessageWorkflow;
