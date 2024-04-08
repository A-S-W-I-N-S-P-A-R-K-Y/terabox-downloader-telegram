async function main() {
  const { Telegraf, Markup } = require("telegraf");
  const { getDetails } = require("./api");
  const {
    BOT_TOKEN,
    WEB_URL
  } = require("./config");
  const { sendFile } = require("./utils");
  const express = require("express");

  const bot = new Telegraf(`${BOT_TOKEN}`);

  bot.start(async (ctx) => {
    try {
      ctx.reply(
        `Hi ${ctx.message.from.first_name},\n\nI can Download Files from Terabox.\n\nMade with ❤️ by @belladesuda\n\nSend any terabox link to download.`,
        Markup.inlineKeyboard([
          Markup.button.url(" Devloper", "https://t.me/belladesuda"),
          Markup.button.url("Thund Group 💦", "https://t.me/+B5JE_d7N46owNDk1"),
        ]),
      );
    } catch (e) {
      console.error(e);
    }
  });

  bot.on("message", async (ctx) => {
    if (ctx.message && ctx.message.text) {
      const messageText = ctx.message.text;
      if (
        messageText.includes("terabox.com") ||
        messageText.includes("teraboxapp.com")
      ) {
        //const parts = messageText.split("/");
        //const linkID = parts[parts.length - 1];

        // ctx.reply(linkID)

        const details = await getDetails(messageText);
        if (details && details.direct_link) {
          try {
            ctx.reply(`Sending Files Please Wait.!!`);
            sendFile(details.direct_link, ctx);
          } catch (e) {
            console.error(e); // Log the error for debugging
          }
        } else {
          ctx.reply('API Not Working 😞');
        }
        console.log(details);
      } else {
        ctx.reply("Please send a valid Terabox link.");
      }
    } else {
      //ctx.reply("No message text found.");
    }
  });

  const app = express();
  // Set the bot API endpoint
  app.use(await bot.createWebhook({ domain: `${WEB_URL}` }));

  app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
}

main();
