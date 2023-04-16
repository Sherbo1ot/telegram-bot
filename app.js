require("dotenv").config();

const TelegramApi = require("node-telegram-bot-api");
const token_bot = process.env.TOKEN_BOT;
const bot = new TelegramApi(token_bot, { polling: true });

const { Configuration, OpenAIApi } = require("openai");

const openConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const webAppUrl = "https://ya.ru";

const openaiapi = new OpenAIApi(openConfig);

const start = async () => {
  bot.setMyCommands([{ command: "/start", description: "Start" }]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const user_name = msg.chat.first_name;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendMessage(
        chatId,
        `Hi ${user_name}! My name is The GhatGPT-Turbo, I was developed by @arbaevsherbolot, a Full-Stack developer from Kyrgyzstan`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: "Portfolio", web_app: { url: webAppUrl } }]],
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
