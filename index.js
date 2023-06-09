const TelegramApi = require("node-telegram-bot-api");
const XLSX = require("xlsx");
const token = "5830715336:AAEdSoxBiam7xL6RzeCQmfUBKGyBAGYDK5c";
const bot = new TelegramApi(token, { polling: true });

const filePath = "./index.xlsx";
const sheetName = "index";
const workbook = XLSX.readFile(filePath);
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const userState = {};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Добро пожаловать!" },
    { command: "/search", description: "Поиск" },
  ]);
};

const mainMenuKeyboard = {
  reply_markup: {
    keyboard: [
      [
        `${String.fromCodePoint(0x1f50d)} ПОИСК`,
        `${String.fromCodePoint(0x25c0)} НАЗАД`,
      ],
    ],
    resize_keyboard: true,
  },
};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendSticker(
    chatId,
    "https://cdn.tlgrm.app/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/192/7.webp"
  );
  return bot.sendMessage(
    chatId,
    "Добро пожаловать в мой телеграм бот!",
    mainMenuKeyboard
  );
});

bot.onText(/\/search/, (msg) => {
  const chatId = msg.chat.id;
  userState[chatId] = { command: "/search" };
  bot.sendMessage(chatId, "Введите л/с:");
});

bot.on("message", (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (userState[chatId]) {
    if (userState[chatId].command === "/search") {
      const searchValue = text;
      const searchResults = data.filter(
        (row) => row[0] === parseInt(searchValue)
      );
      if (searchResults.length > 0) {
        bot.sendMessage(
          chatId,
          `Лицевой счет:  [ ${searchResults[0][0]} ]\nУчасток: ${searchResults[0][1]}\nАбонент: ${searchResults[0][2]}\nНомер водомера: ${searchResults[0][3]}`
        );
      } else {
        bot.sendMessage(chatId, `Нет результатов для л/с ${searchValue}`);
      }
      delete userState[chatId];
      return;
    }
  }
});

start();
