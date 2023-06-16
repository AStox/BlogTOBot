const { Configuration, OpenAIApi } = require("openai");
const { default: Tweet } = require("./Tweet");
require("dotenv").config();

async function generatorResponse(tweetContent, linkContent) {
  // Initialize OpenAI API with the secret key
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // Generate a response using OpenAI's GPT
  const details =
    "The following is a clickbaity tweet for one of blogTO's latest articles. It purposefully withholds information to entice the reader to click on the link. Following are the original tweet and the article it links to. Please write a tweet in response that will give any other readers the missing information in as succinct a manner as possible.";
  const prompt = `${details}\nTweet: "${tweetContent}"\nLink Content:"${linkContent}"\nReply:`;
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
    max_tokens: 100,
    temperature: 0.5,
  });

  const response = completion.data.choices[0].text.trim();
  return response;
}

module.exports = generatorResponse;
