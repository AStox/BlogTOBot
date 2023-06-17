class Feed {
  constructor(page, feedUrl) {
    this.feedUrl = feedUrl;
    this.page = page;
  }

  async getFeedTweets() {
    // Navigate to the feed URL and wait until there are no more network connections for at least 500 ms.
    await this.page.goto(this.feedUrl, { waitUntil: "networkidle0" });

    // Scrape the feed tweets
    const feedTweets = await this.page.evaluate(() => {
      // This code runs in the browser context
      const feedTweets = document.querySelectorAll('div[data-testid="tweet"]');

      return feedTweets;
    });

    return feedTweets;
  }
}
