const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Telegram configuration
const TELEGRAM_TOKEN = '8108896142:AAEO4138dMkokqTqDUIYxnUOmSwyrPkgmGI';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Test route
app.get('/', (req, res) => {
    res.send('Server is running 🚀');
});

// Webhook route
app.post('/webhook', async (req, res) => {

    // 1️⃣ Handle callback queries (inline button clicks)
    if (req.body.callback_query) {
        const callbackQuery = req.body.callback_query;
        const callbackChatId = callbackQuery.message.chat.id;
        const callbackData = callbackQuery.data;

        // Start button clicked
        if (callbackData === 'start_button') {
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: callbackChatId,
                text: "Please choose a game 🎮",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "MLBB & HOK", callback_data: "mlbb_hok" }],
                        [{ text: "PUBG UC & Free Fire", callback_data: "pubg_freefire" }],
                        [{ text: "Sky: Children of the Light", callback_data: "sky" }],
                        [{ text: "Where Winds Meet & MCGG", callback_data: "mcgg" }],
                        [{ text: "Game 5", callback_data: "game5" }],
                        [{ text: "Game 6", callback_data: "game6" }],
                        [{ text: "Game 7", callback_data: "game7" }]
                    ]
                }
            });
        }

        // Handle game buttons
        else if (callbackData === 'mlbb_hok') {
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: callbackChatId,
                text: "🎮 MLBB & HOK items:\n- Item 1\n- Item 2"
            });
        } else if (callbackData === 'pubg_freefire') {
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: callbackChatId,
                text: "🎮 PUBG UC & Free Fire items:\n- UC Pack\n- Free Fire Coins"
            });
        }
        // Add other game callbacks similarly...

        // Always answer callback query
        await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
            callback_query_id: callbackQuery.id
        });

        return res.sendStatus(200);
    }

    // 2️⃣ Handle normal messages (commands)
    if (req.body.message) {
        const chatId = req.body.message.chat.id;
        const text = req.body.message.text;

        if (text === '/start') {
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: chatId,
                text: `မင်္ဂလာပါရှင်! Gamer ကြီးတိုရေ... 👋
LUNAR Gaming Shop လေးကနေ နွေးထွေးစွာ ကြိုဆိုပါတယ်။`,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Start", callback_data: "start_button" }]
                    ]
                }
            });
        } else if (text === '/help') {
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: chatId,
                text: 'Available commands:\n/start - Start the bot\n/help - Show this help message'
            });
        } else {
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: chatId,
                text: `You said: ${text}`
            });
        }
    }

    res.sendStatus(200);
});

// Temporary test route
app.get('/test', async (req, res) => {
    try {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: 1605970043,   // your chat ID
            text: 'Hello! This is a test ✅'
        });
        res.send('Message sent successfully!');
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.send('Failed to send message');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
