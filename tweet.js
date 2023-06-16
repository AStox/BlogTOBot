const puppeteer = require("puppeteer");

class Tweet {
  constructor(page, tweetUrl) {
    this.tweetUrl = tweetUrl;
    this.page = page;
  }

  async getTweetContent() {
    //   const tweetUrl = process.argv[2]; // Get the tweet URL from the command line arguments
    const tweetUrl = "https://twitter.com/blogTO/status/1669404405018554368";

    // Navigate to the tweet URL and wait until there are no more network connections for at least 500 ms.
    await this.page.goto(tweetUrl, { waitUntil: "networkidle0" });

    //   const pageContent = await this.page.content();
    //   console.log("Page content:", pageContent);

    // Scrape the tweet content
    const tweetContent = await this.page.evaluate(() => {
      // This code runs in the browser context
      const tweetElement = document.querySelector('div[data-testid="tweetText"]');
      return tweetElement.innerText;
    });

    const urlRegEx = /(https?:\/\/[^\s]+?)(?=\u2026|\s|$)/g;
    const link = tweetContent.match(urlRegEx)[0];

    return { tweetContent, linkUrl: link };
  }
}

module.exports = Tweet;
