const Tweet = require("./src/tweet.js");
const Link = require("./src/link.js");
const generateResponse = require("./src/responseGenerator.js");
const getLatestTweets = require("./src/getTweets.js");
const checkReplied = require("./src/filterReplied.js");
const puppeteer = require("puppeteer");

const tweetReply = require("./src/tweetReply.js");

async function run(event, context) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
  );
  await page.setViewport({ width: 1366, height: 768 });

  const latestTweets = await getLatestTweets(page, 5);
  const filteredTweets = await filterRepliedTweets(page, latestTweets);
  console.log("Filtered tweets:", filteredTweets);

  // const tweetUrl = "https://twitter.com/blogTO/status/1670622428186431489";
  for (const tweetId of filteredTweets) {
    const tweetUrl = `https://twitter.com/blogTO/status/${tweetId}`;
    const tweet = new Tweet(page, tweetUrl);
    const { tweetContent, linkUrl } = await tweet.getTweetContent();

    console.log("Tweet content:", tweetContent);
    console.log("Tweet ID:", tweetId);
    console.log("Link:", linkUrl);

    // Check if tweetContent contains "CONTEST"
    if (tweetContent.toUpperCase().includes("CONTEST")) {
      console.log("Skipping tweet due to 'CONTEST' in content");
      continue; // Skip to next iteration of loop
    }

    const link = new Link(page, linkUrl);

    const linkContent = await link.getLinkContent();
    // console.log("Link content:", linkContent);
    const response = await generateResponse(tweetContent, linkContent);
    console.log("Response:", response);
  }

  const replyUrl = await tweetReply(response, tweetId);
  await browser.close();
}

async function filterRepliedTweets(page, latestTweets) {
  const filteredTweets = [];

  for (const tweet of latestTweets) {
    const isReplied = await checkReplied(page, tweet);

    if (!isReplied) {
      filteredTweets.push(tweet);
    }
  }

  return filteredTweets;
}

exports.run = run;

// A local invocation function
if (require.main === module) {
  run().catch((error) => console.error(error));
}
