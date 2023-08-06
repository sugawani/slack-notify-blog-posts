import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { datetime } from "ptera/datetime.ts";
import { Post, WantedlyArticle } from "../types/wantedly_article.ts";
import { DOMParser } from "deno-dom/deno-dom-wasm.ts";

export const FetchWantedlyArticles = DefineFunction({
  callback_id: "fetch_wantedly_articles",
  title: "Fetch last month wantedly articles",
  source_file: "functions/fetch_wantedly_articles.ts",
  output_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Monthly wantedly article summary",
      },
      channel_id: {
        type: Schema.types.string,
        description: "Notify target channel id",
      },
    },
    required: ["message", "channel_id"],
  },
});

export default SlackFunction(
  FetchWantedlyArticles,
  async ({ env }) => {
    const companyID = env["COMPANY_ID"];
    if (companyID == null) {
      throw "COMPANY_ID env not found";
    }
    const channelID = env["NOTIFY_CHANNEL_ID"];
    if (channelID == null) {
      throw "NOTIFY_CHANNEL_ID env not found";
    }

    const response = await fetch(
      `https://www.wantedly.com/companies/company_${companyID}/stories`,
    );
    if (!response.ok) {
      throw `failed to fetch articles err: ${response.body}`;
    }

    const wantedlyArticle = parseHTML(await response.text());
    const posts = extractPosts(wantedlyArticle);
    const lastMonthArticles = extractLastMonthArticles(posts);

    return {
      outputs: {
        message: makeMessage(lastMonthArticles),
        channel_id: channelID,
      },
    };
  },
);

function parseHTML(HTMLText: string): WantedlyArticle {
  const doc = new DOMParser().parseFromString(
    HTMLText,
    "text/html",
  );
  if (!doc) {
    throw new Error("Failed to parse html");
  }

  const plaseHolderData = doc.querySelector("[data-placeholder-key]");
  if (plaseHolderData == null) {
    throw new Error("Failed to fetch router string");
  }

  // 頭に // が入っていてパースできないので取り除く
  const router = plaseHolderData.textContent.replace("// ", "");
  return JSON.parse(router) as WantedlyArticle;
}

function extractPosts(wantedlyArticle: WantedlyArticle): Post[] {
  // body の下のキーは変動するので無理やり取り出す
  const articleKey = Object.keys(wantedlyArticle.body)[0] as string;
  return wantedlyArticle["body"][articleKey]["posts"];
}

function extractLastMonthArticles(articles: Post[]): Post[] {
  const lastMonth = datetime().subtract({ month: 1 });
  const firstDayOfLastMonth = lastMonth.startOfMonth();
  const lastDayOfLastMonth = lastMonth.endOfMonth();

  return articles.filter((article) =>
    datetime(article.published_at).isBetween(
      firstDayOfLastMonth,
      lastDayOfLastMonth,
    )
  );
}

function makeMessage(articles: Post[]): string {
  let message = "先月のWantedlyブログ投稿です\n";
  articles.forEach((article) => {
    message +=
      `・ ${article.title} | https://www.wantedly.com${article.post_path} | ${
        datetime(article.published_at).toISODate()
      }\n`;
  });
  if (articles.length === 0) {
    message += `先月のWantedlyブログ投稿はありませんでした… :cry:`;
  }
  return message;
}
