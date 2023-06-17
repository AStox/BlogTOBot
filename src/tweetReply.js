const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config();

async function tweetReply(reply, tweetIdToReplyTo) {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  const tweet = await client.v2
    .tweet(reply, { reply: { in_reply_to_tweet_id: tweetIdToReplyTo } })
    .then((tweet) => {
      return `https://twitter.com/nomoreclickbait/status/${tweet.data.id}`;
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = tweetReply;