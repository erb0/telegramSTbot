const TelegramApi = require("node-telegram-bot-api");

const token = "5830715336:AAEdSoxBiam7xL6RzeCQmfUBKGyBAGYDK5c";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

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
    await bot.sendMessage(
      chatId,
      "Я загадал число от 0 до 9. а ты должен угадать"
    );
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    console.log(chats);
    console.log(randomNumber);
    return bot.sendMessage(chatId, "Отгадывай");
  }
  return bot.sendMessage(chatId, "I don`t understand, try again");
});

start();
