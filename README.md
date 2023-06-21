# BlogTO Bot
BlogTO Bot is a Twitter bot that reads blogTO's clickbaity tweets and replies with a short summary of the article.

## Setup
Create a `.env` file from the `.env.example` and fill it with your OpenAI and Twitter keys.
Run `yarn install` to install the dependencies.
## Usage
Run the bot with `yarn start`.
## Cron Job
Currently the bot is set to run on a `*/30 * * * *` cron job, executing every 30 minutes.

## Contributing
Contributions are welcome! I don't know why you would, but feel free to submit pull requests or create issues.

## License
This project is licensed under the MIT License.
