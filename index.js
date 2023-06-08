const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "5830715336:AAEdSoxBiam7xL6RzeCQmfUBKGyBAGYDK5c";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Я загодал число от 0 до 9. а ты должен угадать"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветсвие" },
    { command: "/info", description: "Информация о пользователе" },
    { command: "/game", description: "Игра отгадай число" },
  ]);
};

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  if (text === "/start") {
    await bot.sendSticker(
      chatId,
      "https://cdn.tlgrm.app/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/192/7.webp"
    );
    return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот STBot!`);
  }
  if (text === "/info") {
    return bot.sendMessage(
      chatId,
      `You name ${msg.from.first_name} ${msg.from.last_name}`
    );
  }
  if (text === "/game") {
    startGame(chatId);
  }
  return bot.sendMessage(chatId, "I don`t understand, try again");
});

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  if (data === "/again") {
    return startGame(chatId);
  }
  if (data == chats[chatId]) {
    return await bot.sendMessage(
      chatId,
      `true it's ${chats[chatId]}`,
      againOptions
    );
  } else {
    return bot.sendMessage(chatId, `wrong it's ${chats[chatId]}`, againOptions);
  }
});

start();
