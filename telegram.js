const { Telegram } = require('telegraf');

const telegram = new Telegram(process.env.TELEGRAM_TOKEN, {});

module.exports = {
    telegram
}