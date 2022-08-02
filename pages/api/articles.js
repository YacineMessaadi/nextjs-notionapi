require("dotenv").config();
// the following lines are required to initialize a Notion client
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DB_ID;

export default async function getArticles() {
  const response = await notion.databases.query({
    database_id: databaseId,
  });

  // options for the Date format of the articles
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const responseResults = response.results.map((page) => {
    return {
      id: page.id,
      tag: page.properties.tag.select.name,
      title: page.properties.title.title[0]?.plain_text,
      description: page.properties.description.rich_text[0].plain_text,
      image: page.properties.image.files[0].file.url,
      date: new Date(
        page.properties.creation_date.created_time
      ).toLocaleDateString("en-US", options),
    };
  });
  return responseResults;
}
