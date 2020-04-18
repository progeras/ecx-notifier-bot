require('dotenv').config();
const Telegraf = require('telegraf');
const { telegram } = require('./telegram');
const session = require('telegraf/session');
const rp = require('request-promise');
const express = require('express');
const app = express();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
bot.use(session());

bot.on('message', (ctx) => ctx.reply(`ChatId: ${ctx.chat.id}`))

process.env.NODE_ENV === 'development' ? startDevMode(bot) : startProdMode(bot);

function startDevMode(bot) {
    rp(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/deleteWebhook`).then(
        () => bot.startPolling(),
        () => bot.startPolling()
    );
}

function startProdMode(bot) {
    const API_TOKEN = process.env.TELEGRAM_TOKEN || '';
    const PORT = process.env.PORT || 3000;
    const URL = process.env.URL;

    bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
    bot.startWebhook(`/bot${API_TOKEN}`)
}

app.post('/notify', function (req, res) {
    telegram.sendMessage(req.query.chatid, req.query.message).then(() => {
        res.send(`Message sent to ${req.query.chatid}`);
    }).catch((err) => {
        res.send(err);
    });
    //res.send(`Message sent to ${req.query.chatid}`);
});

const expressPort = process.env.PORT || 3000;
app.listen(expressPort, function () {
    console.log(`Listening on port ${expressPort}!`);
});

bot.launch();
