const Tweet = require("./tweet.js");
const Link = require("./link.js");
const generateResponse = require("./response_generator.js");
const puppeteer = require("puppeteer");

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
  );
  await page.setViewport({ width: 1366, height: 768 });
  const tweetUrl = process.argv[2]; // Get the tweet URL from the command line arguments
  const tweet = new Tweet(page, tweetUrl);
  const { tweetContent, linkUrl } = await tweet.getTweetContent();
  console.log("Tweet content:", tweetContent);
  console.log("Link:", linkUrl);
  const link = new Link(page, linkUrl);

  const linkContent = await link.getLinkContent();
  console.log("Link content:", linkContent);
  const response = await generateResponse(tweetContent, linkContent);
  console.log("Response:", response);
  await browser.close();
}

run().catch((error) => console.error(error));
