import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import SendMessageWorkflow from "../workflows/send_message_workflow.ts";
import { datetime } from "ptera/datetime.ts";

const MonthlyTrigger: Trigger<typeof SendMessageWorkflow.definition> = {
  type: TriggerTypes.Scheduled,
  schedule: {
    start_time: datetime().add({ second: 30 }).toISO(),
    frequency: {
      type: "monthly",
      on_week_num: 1,
    },
    timezone: "JST",
  },
  name: "Mothly trigger",
  description: "Trigger monthly first week on monday",
  workflow: `#/workflows/${SendMessageWorkflow.definition.callback_id}`,
};

export default MonthlyTrigger;
