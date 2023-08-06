import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import SnedBlogPostsMessageWorkflow from "../workflows/send_blog_posts_message_workflow.ts";
import { datetime } from "ptera/datetime.ts";

const MonthlyTrigger: Trigger<typeof SnedBlogPostsMessageWorkflow.definition> =
  {
    type: TriggerTypes.Scheduled,
    schedule: {
      start_time: datetime().add({ second: 30 }).toISO(),
      frequency: {
        type: "monthly",
        on_days: ["Monday"],
        on_week_num: 1,
      },
      timezone: "JST",
    },
    name: "Mothly trigger",
    description: "Trigger monthly first week on monday",
    workflow:
      `#/workflows/${SnedBlogPostsMessageWorkflow.definition.callback_id}`,
  };

export default MonthlyTrigger;
