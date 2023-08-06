import { Manifest } from "deno-slack-sdk/mod.ts";
import SnedBlogPostsMessageWorkflow from "./workflows/send_blog_posts_message_workflow.ts";

export default Manifest({
  name: "blog-posts-notifier",
  description: "Notify last month blog posts",
  icon: "assets/app_icon.png",
  workflows: [SnedBlogPostsMessageWorkflow],
  outgoingDomains: ["zenn.dev", "www.wantedly.com"],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
  ],
});
