const Tweet = require("./src/tweet.js");
const Link = require("./src/link.js");
const generateResponse = require("./src/responseGenerator.js");
const getLatestTweets = require("./src/getTweets.js");
const tweetReply = require("./src/tweetReply.js");
const { saveId, findId } = require("./src/readWriteFile.js");
const puppeteer = require("puppeteer");

function isRuntimeLimitReached(startTime) {
  const elapsedMinutes = Math.floor((Date.now() - startTime) / (1000 * 60));
  return elapsedMinutes >= runtimeLimitInMinutes;
}

async function run(event, context) {
  try {
    console.log(
      `//------------ BLOGTO BOT AWAKENED. TIME: ${new Date().toISOString()} ------------//`
    );
    const browser = await puppeteer.launch({ headless: "new" });
    console.log("Browser launched");
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    );
    await page.setViewport({ width: 1366, height: 768 });

    console.log("Getting latest tweets...");
    const latestTweets = await getLatestTweets(page, 5);
    console.log("Latest tweets: ", latestTweets);
    console.log("Filtering replied tweets...");
    const filteredTweets = latestTweets.filter((tweetId) => !findId(tweetId));
    console.log("Filtered tweets: ", filteredTweets);

    console.log("Generating response...");
    for (const tweetId of filteredTweets) {
      if (isRuntimeLimitReached(startTime)) {
        console.log(`Runtime limit of ${runtimeLimitInMinutes} minutes reached. Exiting.`);
        process.exit(0); // Gracefully exit the script
      }
      const tweetUrl = `https://twitter.com/blogTO/status/${tweetId}`;
      const tweet = new Tweet(page, tweetUrl);
      console.log("Getting tweet content...");
      const { tweetContent, linkUrl } = await tweet.getTweetContent();
      console.log("Tweet content: ", tweetContent);
      console.log("Tweet ID: ", tweetId);
      console.log("Link: ", linkUrl);

      const link = new Link(page, linkUrl);
      console.log("Getting link content...");
      const linkContent = await link.getLinkContent();
      console.log("Got link content");
      console.log("generating response...");
      const response = await generateResponse(tweetContent, linkContent);
      console.log("Response: ", response);

      console.log("Replying to tweet...");
      const replyUrl = await tweetReply(response, tweetId);
      saveId(tweetId);
      console.log("Reply URL: ", replyUrl);
    }

    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

exports.run = run;

// A local invocation function
if (require.main === module) {
  run().catch((error) => console.error(error));
}
