import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { Article, User, ZennArticle } from "../types/zenn_article.ts";
import { datetime } from "ptera/datetime.ts";

interface UserArticles {
  userName: User["name"];
  userID: User["id"];
  articles: Article[];
}

export const FetchZennArticles = DefineFunction({
  callback_id: "fetch_zenn_articles",
  title: "Fetch last month zenn articles",
  source_file: "functions/fetch_zenn_articles.ts",
  output_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Monthly zenn article summary",
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
  FetchZennArticles,
  async ({ env }) => {
    const publicationName = env["PUBLICATION_NAME"];
    if (publicationName == null) {
      throw "PUBLICATION_NAME env not found";
    }
    const channelID = env["NOTIFY_CHANNEL_ID"];
    if (channelID == null) {
      throw "NOTIFY_CHANNEL_ID env not found";
    }

    const response = await fetch(
      `https://zenn.dev/api/articles?publication_name=${publicationName}&count=20&order=latest`,
    );
    if (!response.ok) {
      throw `failed to fetch articles err: ${response.body}`;
    }
    const data: ZennArticle = await response.json();
    const lastMonthArticles = extractLastMonthArticles(data.articles);
    const userArticles = reduceUserArticles(lastMonthArticles);

    return {
      outputs: {
        message: makeMessage(userArticles),
        channel_id: channelID,
      },
    };
  },
);

function extractLastMonthArticles(articles: Article[]): Article[] {
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

function reduceUserArticles(articles: Article[]): UserArticles[] {
  return articles.reduce(
    (acc: UserArticles[], article) => {
      const foundUser = acc.find((user) => user.userID === article.user.id);
      if (foundUser) {
        foundUser.articles.push(article);
        foundUser.articles.sort((a, b) =>
          a.published_at > b.published_at ? 1 : -1
        );
      } else {
        acc.push({
          userID: article.user.id,
          userName: article.user.name,
          articles: [article],
        });
      }
      return acc;
    },
    [],
  );
}

function makeMessage(userArticles: UserArticles[]): string {
  let message = "";
  userArticles.forEach((userArticle, i) => {
    let m = `${userArticle.userName} さんの先月のZennブログ投稿です\n`;
    userArticle.articles.forEach((article) => {
      m += `・ ${article.title} | https://zenn.dev${article.path} | ${
        datetime(article.published_at).toISODate()
      }\n`;
    });
    message += m;
    if (userArticles.length - 1 !== i) {
      message += `\n`;
    }
  });
  if (message === "") {
    `先月のZennブログ投稿はありませんでした… :cry:`;
  }
  return message;
}
