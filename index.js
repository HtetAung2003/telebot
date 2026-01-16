const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Telegram configuration
const TELEGRAM_TOKEN = '8108896142:AAEO4138dMkokqTqDUIYxnUOmSwyrPkgmGI';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const ADMIN_CHAT_ID = '6997443698'; // Found in /test route

// In-memory state management
const userStates = {};

// Test route
app.get('/', (req, res) => {
    res.send('Server is running 🚀');
});

// Webhook route
app.post('/webhook', async (req, res) => {
    try {
        // 1️⃣ Handle callback queries (inline button clicks)
        if (req.body.callback_query) {
            const callbackQuery = req.body.callback_query;
            const callbackChatId = callbackQuery.message.chat.id;
            const callbackData = callbackQuery.data;

            // Start button clicked
            if (callbackData === 'start_button') {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: "ပြုလုပ်လိုတဲ့ ဝန်ဆောင်မှုကို ရွေးချယ်ပေးပါရှင်... ✨",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "🎮 ဂိမ်းများ (Games)", callback_data: "games" }],
                            [{ text: "❓ သိလိုသည်များ (Q & A)", callback_data: "qanda" }],
                            [{ text: "📦 အော်ဒါတင်ရန် (Order)", callback_data: "order" }],
                            [{ text: "📰 နောက်ဆုံးရသတင်း (Latest News)", callback_data: "lat_news" }],
                        ]
                    }
                });
            }

            else if (callbackData === 'games') {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: "🎮 ကစားလိုတဲ့ ဂိမ်းလေးကို ရွေးချယ်ပေးပါဦးရှင့်...",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "MLBB", callback_data: "mlbb" }, { text: "HOK", callback_data: "hok" }],
                            [{ text: "PUBG", callback_data: "pubg" }, { text: "Free Fire", callback_data: "freefire" }],
                            [{ text: "⬅ ပြန်ထွက်မည်", callback_data: "back" }]
                        ],
                    }
                });
            }
            else if (callbackData === 'mlbb') {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: "🎮 MLBB အတွက် ဝန်ဆောင်မှုလေးတွေ ရွေးပေးပါနော်...",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "💎 Double Diamond ဈေးနှုန်း", callback_data: "double_diamond_price" }, { text: "💎 ပုံမှန် ဈေးနှုန်း", callback_data: "latest_price" }],
                            [{ text: "🎟️ Weekly Pass ဈေးနှုန်း", callback_data: "weekly_pass_price" }, { text: "🎟️ Twilight Pass ဈေးနှုန်း", callback_data: "twilight_pass_price" }],
                            [{ text: "⬅ နောက်သို့", callback_data: "back" }]
                        ],
                    }
                });
            } else if (callbackData === 'double_diamond_price') {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: `💎 **Double Diamond ဈေးနှုန်းများ** 💎
                    တစ်နှစ်မှတစ်ခါရမယ့် Double Bonus ဈေးနှုန်းလေးတွေ လာပါပြီရှင့်! 💎✨
                    📋 Price List:
                        🌟 50 + 50 Bonus = 4,000 Ks 
🌟 150 + 150 Bonus = 10,000 Ks 
🌟 250 + 250 Bonus = 16,000 Ks 
🌟 500 + 500 Bonus = 35,000 Ks
2ဆ ကတစ်ကြိမ်ဘဲရပါမယ်ရှင်!

                        ပြုလုပ်လိုသော Package ကို ရွေးချယ်ပေးပါရှင်... ✨`,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "🌟 Dia 50+50 - 4000 Ks", callback_data: "pkg_50_50" }],
                            [{ text: "🌟 Dia 150+150 - 10000 Ks", callback_data: "pkg_150_150" }],
                            [{ text: "🌟 Dia 250+250 - 16000 Ks", callback_data: "pkg_250_250" }],
                            [{ text: "🌟 Dia 500+500 - 35000 Ks", callback_data: "pkg_500_500" }],
                            [{ text: "💎 Double Diamond ဆိုတာဘာလဲ?", callback_data: "dd_what" }],
                            [{ text: "🧭 Double Diamond ရယူနည်း (Step-by-Step)", callback_data: "dd_steps" }],
                            // [{ text: "📅 Event က ဘယ်အချိန်ထိရှိလဲ?", callback_data: "dd_duration" }],
                            // [{ text: "⚡ Bonus Diamond ချက်ချင်းရလား?", callback_data: "dd_instant" }],
                            // [{ text: "👤 ဘယ် Account တွေအတွက်ရလဲ?", callback_data: "dd_account" }],
                            // [{ text: "🔁 တစ်နေ့တစ်ခါပဲရလား?", callback_data: "dd_limit" }],
                            // [{ text: "🔐 Account Ban ဖြစ်နိုင်လား?", callback_data: "dd_safe" }],
                            [{ text: "⬅ နောက်သို့", callback_data: "mlbb" }]
                        ]
                    }
                });
            }
            else if (callbackData === 'weekly_pass_price') {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: `ဈေးအသက်သာဆုံးနဲ့ Diamond အများဆုံးရမယ့် Weekly Pass လေးတွေ ရပါပြီရှင့်! 💎✨ 
                            🎫 Price List:
                            • 1 Weekly Pass = 6,000 Ks 
                            • 2 Weekly Pass = 12,000 Ks (14 Days) 
                            • 3 Weekly Pass = 18,000 Ks (21 Days) 
                            • 4 Weekly Pass = 24,000 Ks (28 Days)
                             • 5 Weekly Pass = 30,000 Ks (35 Days)
                                💡 Why buy this? (ဘာလိုတန်လဲ): Weekly Pass တစ်ပတ်ဝယ်ရုံနဲ့ Total 220 Diamonds အပြင် 1 day ကို COA, Starlight fragments, Rare fragment ,... တွေပါဝင်တဲ့ 1 box ကို ရမှာနော်! အရမ်းတန်... 😉

                        ပြုလုပ်လိုသော Package ကို ရွေးချယ်ပေးပါရှင်... ✨`,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "1 Weekly Pass = 6000 Ks", callback_data: "pkg_1wp" }],
                            [{ text: "2 Weekly Pass = 12000 Ks", callback_data: "pkg_2wp" }],
                            [{ text: "3 Weekly Pass = 18000 Ks", callback_data: "pkg_3wp" }],
                            [{ text: "4 Weekly Pass = 24000 Ks", callback_data: "pkg_4wp" }],
                            [{ text: "5 Weekly Pass = 30000 Ks", callback_data: "pkg_5wp" }],
                            [{ text: "🧭 Double Diamond ရယူနည်း (Step-by-Step)", callback_data: "dd_steps" }],
                            // [{ text: "📅 Event က ဘယ်အချိန်ထိရှိလဲ?", callback_data: "dd_duration" }],
                            // [{ text: "⚡ Bonus Diamond ချက်ချင်းရလား?", callback_data: "dd_instant" }],
                            // [{ text: "👤 ဘယ် Account တွေအတွက်ရလဲ?", callback_data: "dd_account" }],
                            // [{ text: "🔁 တစ်နေ့တစ်ခါပဲရလား?", callback_data: "dd_limit" }],
                            // [{ text: "🔐 Account Ban ဖြစ်နိုင်လား?", callback_data: "dd_safe" }],
                            [{ text: "⬅ နောက်သို့", callback_data: "mlbb" }]
                        ]
                    }
                });
            }

            // Handle Package Selections
            else if (callbackData.startsWith('pkg_')) {
                const pkgLabel = {
                    'pkg_50_50': 'Dia 50 + Bonus 50 (4000 Ks)',
                    'pkg_150_150': 'Dia 150 + Bonus 150 (10000 Ks)',
                    'pkg_250_250': 'Dia 250 + Bonus 250 (16000 Ks)',
                    'pkg_500_500': 'Dia 500 + Bonus 500 (35000 Ks)',
                    'pkg_1wp': '1 Weekly Pass',
                    'pkg_2wp': '2 Weekly Pass',
                    'pkg_3wp': '3 Weekly Pass',
                    'pkg_4wp': '4 Weekly Pass',
                    'pkg_5wp': '5 Weekly Pass',
                }[callbackData];

                userStates[callbackChatId] = {
                    step: 'AWAITING_ID',
                    package: pkgLabel
                };

                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: `🛒 **ရွေးချယ်ထားသော Package:** ${pkgLabel}\n\nကျေးဇူးပြု၍ သင်၏ **Game ID** နှင့် **Server ID** ကို ရိုက်ပို့ပေးပါရှင်... ✨\n\n(ဥပမာ - 12345678 (1234))`,
                    parse_mode: "Markdown"
                });
            }

            else if (callbackData === 'dd_what') {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: `💎 **Double Diamond ဆိုတာဘာလဲ?**

Double Diamond Event မှာ Diamonds ဝယ်ယူရင်
ဝယ်တဲ့ Diamond အရေအတွက်နဲ့ **တူညီတဲ့ Bonus Diamond** ကို
အခမဲ့ ထပ်မံရရှိမှာဖြစ်ပါတယ်ရှင့် ❤️

**ဥပမာ**
50 Diamonds ဝယ် → Bonus 50
စုစုပေါင်း **100 Diamonds**`,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "⬅ ပြန်သွားမည်", callback_data: "double_diamond_price" }]
                        ]
                    }
                });
            }
            else if (callbackData === 'dd_steps') {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: `🧭 **Double Diamond ရယူနည်း (Step-by-Step)** 💎

                1️⃣ Double Diamond ဈေးနှုန်းစာရင်းထဲက  
                    မိမိဝယ်ယူလိုတဲ့ Package ကို ရွေးချယ်ပါ

                2️⃣ Game ID / Server ID ကို မှန်ကန်စွာ ပေးပို့ပါ

                3️⃣ Payment ပြုလုပ်ပါ (KBZPay / WavePay / AYA Pay)

                4️⃣ Admin မှ စစ်ဆေးပြီး  
                Official Top-up ဖြင့် Diamonds ဖြည့်ပေးပါမယ်

                5️⃣ Main Diamond + Bonus Diamond ကို  
                Account ထဲ **ချက်ချင်း** ရရှိပါမယ် ❤️

                📌 **Note:** Event အချိန်အတွင်းသာ Double Diamond ရရှိနိုင်ပါတယ်ရှင့်`,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "⬅ ဈေးနှုန်းများသို့ ပြန်သွားမည်", callback_data: "double_diamond_price" }]
                        ]
                    }
                });
            }

            else if (callbackData === 'dd_duration') {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: `📅 **Double Diamond Event အချိန်ကာလ**

                ဒီ Event ကတော့ Game Company မှ သတ်မှတ်ထားတဲ့
                **အချိန်အကန့်အသတ်ရှိတဲ့ Promotion** ဖြစ်ပါတယ်ရှင့်။

                        ⏳ Event ပြီးဆုံးချိန်ကို
                Bot မှာ သီးသန့် Update ပေးသွားပါမယ် ❤️`,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "⬅ ပြန်သွားမည်", callback_data: "double_diamond_price" }]
                        ]
                    }
                });
            }
            else if (callbackData === 'dd_instant') {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: `⚡ **Bonus Diamond ချက်ချင်းရလား?**

                ဟုတ်ပါတယ်ရှင့် ✅  
                Top-up ပြီးတာနဲ့ **Main Diamond + Bonus Diamond**
                        ကို **ချက်ချင်း** Account ထဲရရှိမှာဖြစ်ပါတယ် ❤️`,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "⬅ ပြန်သွားမည်", callback_data: "double_diamond_price" }]
                        ]
                    }
                });
            }
            else if (callbackData === 'dd_account') {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: `👤 **ဘယ် Account တွေအတွက်ရလဲ?**

                Double Diamond Event ကို  
                ✅ Old Account  
                ✅ New Account  
                နှစ်မျိုးလုံး အသုံးပြုနိုင်ပါတယ်ရှင့် ❤️`,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "⬅ ပြန်သွားမည်", callback_data: "double_diamond_price" }]
                        ]
                    }
                });
            }
            else if (callbackData === 'dd_limit') {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: `🔁 **တစ်နေ့တစ်ခါပဲရလား?**

                Event စည်းမျဉ်းအရ  
                Account တစ်ခုချင်းစီမှာ **အကြိမ်အရေအတွက် ကန့်သတ်ချက်**
               ရှိနိုင်ပါတယ်ရှင့်။

                အတိအကျ သိချင်ရင် Admin ကို ဆက်သွယ်နိုင်ပါတယ် @Qimiishere ❤️`,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "⬅ ပြန်သွားမည်", callback_data: "double_diamond_price" }]
                        ]
                    }
                });
            }
            else if (callbackData === 'dd_safe') {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: `🔐 **Account Ban ဖြစ်နိုင်လား?**

                မဖြစ်ပါဘူးရှင့် ❌  
                Official Top-up Method ကိုသာ အသုံးပြုတာဖြစ်လို့
                Account လုံးဝ လုံခြုံစိတ်ချရပါတယ် ❤️`,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "⬅ ပြန်သွားမည်", callback_data: "double_diamond_price" }]
                        ]
                    }
                });
            }


            else if (callbackData === 'qanda') {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: "🙋 သိလိုသမျှကို ဒီမှာ မေးမြန်းနိုင်ပါတယ်ရှင့်... Topic လေးတစ်ခု ရွေးပေးပါနော်။",
                    reply_markup: {
                        keyboard: [
                            ["ဘယ်လို ဝယ်ရမလဲ?", "ငွေပေးချေမှု ပုံစံများ"],
                            ["Bot အခြေအနေ", "Admin နှင့် ဆက်သွယ်ရန်"],
                            ["⬅ ပင်မစာမျက်နှာသို့ ပြန်မည်"]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: false
                    }
                }).catch(e => console.error("Error sending Q&A menu:", e.response?.data || e.message));
            }
            // Handle Payment Methods
            else if (callbackData.startsWith('pay_')) {
                const payMethod = {
                    'pay_kbz': 'KBZ Pay',
                    'pay_wave': 'Wave Pay',
                    'pay_cb': 'CB Pay',
                    'pay_aya': 'AYA Pay',
                    'pay_uab': 'uabpay'
                }[callbackData];

                if (userStates[callbackChatId]) {
                    userStates[callbackChatId].payment_method = payMethod;
                    userStates[callbackChatId].step = 'AWAITING_SCREENSHOT';
                }

                let paymentDetails = `💳 **${payMethod} ဖြင့် ငွေပေးချေရန်**\n\n`;
                if (payMethod === 'KBZ Pay') {
                    paymentDetails += `Name: LUNAR Shop\nNumber: 09123456789\n\n(သို့မဟုတ်) အောက်ပါ QR ကို Scan ဖတ်၍ ပေးချေနိုင်ပါတယ်ရှင် ✨`;
                    // Note: User can send QR photo here
                } else {
                    paymentDetails += `Name: LUNAR Shop\nNumber: 09123456789\n\nငွေလွှဲပိုင်လျှင် ဝန်ဆောင်မှု ပိုမိုမြန်ဆန်စေရန် Screenshot ပို့ပေးပါနော် ❤️`;
                }

                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: paymentDetails,
                    parse_mode: "Markdown"
                }).catch(e => console.error("Error sending payment details:", e.response?.data || e.message));

                /* 
                   COMMENTED OUT because the URL is a placeholder and causes a 400 error.
                   Please replace with a REAL URL when you have one.
                if (payMethod === 'KBZ Pay') {
                    await axios.post(`${TELEGRAM_API}/sendPhoto`, {
                        chat_id: callbackChatId,
                        photo: "https://your-qr-image-url.com/kbz_qr.jpg",
                        caption: "KBZ Pay QR Code 💳"
                    });
                }
                */

                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: "📷 ငွေလွှဲပြီးလျှင် **Screenshot (ဓာတ်ပုံ)** ပေးပို့ပေးပါရှင်..."
                }).catch(e => console.error("Error sending screenshot prompt:", e.response?.data || e.message));
            }
            else if (callbackData === 'back') {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: "ပြုလုပ်လိုတဲ့ ဝန်ဆောင်မှုကို ရွေးချယ်ပေးပါရှင်... ✨",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "🎮 ဂိမ်းများ (Games)", callback_data: "games" }],
                            [{ text: "❓ သိလိုသည်များ (Q & A)", callback_data: "qanda" }],
                            [{ text: "📦 အော်ဒါတင်ရန် (Order)", callback_data: "order" }],
                            [{ text: "📰 နောက်ဆုံးရသတင်း (Latest News)", callback_data: "lat_news" }],
                        ]
                    }
                });
            }
            // Add other game callbacks similarly...

            // Always answer callback query
            try {
                await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
                    callback_query_id: callbackQuery.id
                });
            } catch (err) {
                console.error("Error answering callback query:", err.message);
            }
        }

        // 2️⃣ Handle normal messages (commands) and photos
        if (req.body.message) {
            const chatId = req.body.message.chat.id;
            const text = req.body.message.text;

            // Handle incoming Photos (for Payment Screenshots)
            if (req.body.message.photo) {
                const photos = req.body.message.photo;
                const fileId = photos[photos.length - 1].file_id; // Get highest resolution

                if (userStates[chatId] && userStates[chatId].step === 'AWAITING_SCREENSHOT') {
                    const state = userStates[chatId];
                    const userDetails = req.body.message.from;
                    const userHandle = userDetails.username ? `@${userDetails.username}` : userDetails.first_name;

                    // 1. Confirm to User
                    const orderTime = new Date().toLocaleString('en-GB', {
                        timeZone: 'Asia/Yangon',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });

                    const confirmationText = `✅ **Screenshot လက်ခံရရှိပါပြီ!** ✨

အော်ဒါကို Admin ထံသို့ ပေးပို့လိုက်ပါပြီ။ ခေတ္တစောင့်ဆိုင်းပေးပါနော် ❤️

📜 **Order အသေးစိတ်:**
━━━━━━━━━━━━━━━━━━
📦 **Package:** ${state.package}
🆔 **Game ID:** ${state.game_id}
💳 **Payment:** ${state.payment_method}
⏰ **Time:** ${orderTime}
━━━━━━━━━━━━━━━━━━`;

                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: chatId,
                        text: confirmationText,
                        parse_mode: "Markdown"
                    });

                    // 2. Forward Order to Admin
                    try {
                        // Send Text Details First
                        await axios.post(`${TELEGRAM_API}/sendMessage`, {
                            chat_id: ADMIN_CHAT_ID,
                            text: `🔔 **Order အသစ်ရောက်ရှိလာပါပြီ!** ✨\n\n👤 **Customer:** ${userHandle}\n📦 **Package:** ${state.package}\n🆔 **Game/Server ID:** ${state.game_id}\n💳 **Payment:** ${state.payment_method}`,
                        });

                        // Send Screenshot
                        await axios.post(`${TELEGRAM_API}/sendPhoto`, {
                            chat_id: ADMIN_CHAT_ID,
                            photo: fileId,
                            caption: `📸 **Screenshot for:** ${userHandle} - ${state.package}`
                        });

                    } catch (error) {
                        console.error('Error forwarding to admin:', error.response?.data || error.message);
                    }

                    // Clear state
                    delete userStates[chatId];
                }
            }
            // Handle text messages
            else if (text) {
                if (text === '/start') {
                    await axios.post(`${TELEGRAM_API}/sendPhoto`, {
                        chat_id: chatId,
                        photo: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp", // 👈 public image URL
                        caption: `မင်္ဂလာပါရှင်! Gamer ကြီးတိုရေ... 👋
LUNAR Gaming Shop လေးကနေ နွေးထွေးစွာ ကြိုဆိုပါတယ်။`,
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "Start", callback_data: "start_button" }]
                            ]
                        }
                    });
                } else if (text === 'ဘယ်လို ဝယ်ရမလဲ?') {
                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: chatId,
                        text: "📝 **ဝယ်ယူပုံ အဆင့်ဆင့်:**\n1. မိမိ ဝယ်လိုသော ဂိမ်းကို အရင်ရွေးပါ\n2. လိုချင်တဲ့ Package ကို ရွေးချယ်ပါ\n3. မိမိရဲ့ ID/Server ကို Admin ဆီသို့ ပေးပို့ပါ\n4. ငွေလွှဲပိုင်လျှင် Gems များ ချက်ချင်း ရရှိမှာ ဖြစ်ပါတယ်ရှင့်!"
                    });
                } else if (text === 'ငွေပေးချေမှု ပုံစံများ') {
                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: chatId,
                        text: "💳 **ငွေပေးချေနိုင်သော ပုံစံများ:**\n- KBZPay\n- WaveMoney\n- AYA Pay"
                    });
                } else if (text === 'Bot အခြေအနေ') {
                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: chatId,
                        text: "✅ Bot သည် လက်ရှိတွင် အဆင်သင့် ရှိနေပါတယ်ရှင့်!"
                    });
                } else if (text === 'Admin နှင့် ဆက်သွယ်ရန်') {
                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: chatId,
                        text: "👨‍💻 Admin နှင့် တိုက်ရိုက် စကားပြောရန်: @Qimiishere"
                    });
                } else if (text === '⬅ ပင်မစာမျက်နှာသို့ ပြန်မည်') {
                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: chatId,
                        text: "ပင်မစာမျက်နှာသို့ ပြန်သွားနေပါပြီ...",
                        reply_markup: {
                            remove_keyboard: true
                        }
                    });
                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: chatId,
                        text: "ပြုလုပ်လိုတဲ့ ဝန်ဆောင်မှုကို ရွေးချယ်ပေးပါရှင်... ✨",
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "🎮 ဂိမ်းများ (Games)", callback_data: "games" }],
                                [{ text: "❓ သိလိုသည်များ (Q & A)", callback_data: "qanda" }],
                                [{ text: "📦 အော်ဒါတင်ရန် (Order)", callback_data: "order" }],
                                [{ text: "📰 နောက်ဆုံးရသတင်း (Latest News)", callback_data: "lat_news" }],
                            ]
                        }
                    });
                } else if (userStates[chatId] && userStates[chatId].step === 'AWAITING_ID') {
                    userStates[chatId].game_id = text;
                    userStates[chatId].step = 'AWAITING_PAYMENT';

                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: chatId,
                        text: `🆔 **လက်ခံရရှိသော ID:** ${text}\n\nငွေပေးချေလိုသော ပုံစံကို ရွေးချယ်ပေးပါရှင်... ✨`,
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "KBZ Pay", callback_data: "pay_kbz" }, { text: "Wave Pay", callback_data: "pay_wave" }],
                                [{ text: "CB Pay", callback_data: "pay_cb" }, { text: "AYA Pay", callback_data: "pay_aya" }],
                                [{ text: "uabpay", callback_data: "pay_uab" }]
                            ]
                        }
                    });
                }
                else if (text === '/help') {
                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: chatId,
                        text: 'အသုံးပြုနိုင်သော Command များ:\n/start - စတင်ရန်\n/help - အကူအညီ ရယူရန်'
                    });
                }
                else {
                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: chatId,
                        text: `You said: ${text}`
                    });
                }
            }
        }
    } catch (err) {
        console.error("GLOBAL WEBHOOK ERROR:", err.response?.data || err.message);
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
