const Tweet = require("./src/tweet.js");
const Link = require("./src/link.js");
const generateResponse = require("./src/responseGenerator.js");
const getLatestTweets = require("./src/getTweets.js");
const tweetReply = require("./src/tweetReply.js");
const { saveId, findId } = require("./src/readWriteFile.js");
import { logMessage } from "./src/logger.js";
const puppeteer = require("puppeteer");

async function run(event, context) {
  try {
    logMessage("Running...");
    const browser = await puppeteer.launch();
    logMessage("Browser launched");
    const page = await browser.newPage();
    logMessage("Page created");
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    );
    logMessage("User agent set");
    await page.setViewport({ width: 1366, height: 768 });

    logMessage("Getting latest tweets...");
    const latestTweets = await getLatestTweets(page, 5);
    logMessage("Latest tweets:", latestTweets);
    logMessage("Filtering replied tweets...");
    const filteredTweets = latestTweets.filter((tweetId) => !findId(tweetId));
    logMessage("Filtered tweets:", filteredTweets);

    logMessage("Generating response...");
    for (const tweetId of filteredTweets) {
      const tweetUrl = `https://twitter.com/blogTO/status/${tweetId}`;
      const tweet = new Tweet(page, tweetUrl);
      logMessage("Getting tweet content...");
      const { tweetContent, linkUrl } = await tweet.getTweetContent();
      logMessage("Tweet content:", tweetContent);
      logMessage("Tweet ID:", tweetId);
      logMessage("Link:", linkUrl);

      // Check if tweetContent contains "CONTEST"
      if (tweetContent.toUpperCase().includes("CONTEST")) {
        logMessage("Skipping tweet due to 'CONTEST' in content");
        continue; // Skip to next iteration of loop
      }

      const link = new Link(page, linkUrl);
      logMessage("Getting link content...");
      const linkContent = await link.getLinkContent();
      logMessage("Got link content");
      logMessage("generating response...");
      const response = await generateResponse(tweetContent, linkContent);
      logMessage("Response:", response);

      logMessage("Replying to tweet...");
      const replyUrl = await tweetReply(response, tweetId);
      saveId(tweetId);
      logMessage("Reply URL:", replyUrl);
    }

    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

exports.run = run;

// A local invocation function
if (require.main === module) {
  run().catch((error) => console.error(error));
}
