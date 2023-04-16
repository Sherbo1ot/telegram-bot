require("dotenv").config();

const TelegramApi = require("node-telegram-bot-api");
const token_bot = process.env.TOKEN_BOT;
const bot = new TelegramApi(token_bot, { polling: true });

const { Configuration, OpenAIApi } = require("openai");

const openConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const webAppUrl = "https://portfolio-sherbolot.netlify.app";

const openaiapi = new OpenAIApi(openConfig);

const start = async () => {
  bot.setMyCommands([
    { command: "/start", description: "Start" },
    { command: "/gpt", description: "GhatGPT-Turbo 4" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const user_name = msg.chat.first_name;
    const chatId = msg.chat.id;

    if (text === "/start") {
      return bot.sendMessage(
        chatId,
        `Hi ${user_name}👋🏻! My name is The GhatGPT-Turbo 4 bot in Telegram 😎 I was developed by @arbaevsherbolot 🧑🏻‍💻, a Full-Stack developer from Kyrgyzstan. You can ask me anything here 😇`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Portfolio", web_app: { url: webAppUrl } }],
            ],
          },
        }
      );
    }

    const reply = await openaiapi.createCompletion({
      max_tokens: 100,
      model: "text-davinci-003",
      prompt: text,
      temperature: 0.9,
    });

    return bot.sendMessage(chatId, `${reply.data.choices[0].text}`);
  });
};

start();
