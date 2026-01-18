const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { sequelize, Category, Package } = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Database sync
sequelize.sync();

// API Routes for Admin Panel
app.get('/api/categories', async (req, res) => {
    const categories = await Category.findAll({ include: ['subcategories', 'packages'] });
    res.json(categories);
});

app.post('/api/categories', async (req, res) => {
    try {
        const data = { ...req.body };
        if (!data.parentId) data.parentId = null; // Ensure null if empty/undefined
        const category = await Category.create(data);
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/categories/:id', async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.parentId === '') data.parentId = null; // Ensure null if empty string
        await Category.update(data, { where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    await Category.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
});

app.get('/api/packages', async (req, res) => {
    const packages = await Package.findAll({ include: ['category'] });
    res.json(packages);
});

app.post('/api/packages', async (req, res) => {
    const pkg = await Package.create(req.body);
    res.json(pkg);
});

app.put('/api/packages/:id', async (req, res) => {
    await Package.update(req.body, { where: { id: req.params.id } });
    res.json({ success: true });
});

app.delete('/api/packages/:id', async (req, res) => {
    await Package.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
});

// Telegram configuration
const TELEGRAM_TOKEN = '8108896142:AAEO4138dMkokqTqDUIYxnUOmSwyrPkgmGI';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const ADMIN_CHAT_ID = '5827436556'; // Found in /test route

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
                const gamesCategory = await Category.findOne({ where: { name: '🎮 ဂိမ်းများ (Games)' } });
                const subcats = await Category.findAll({ where: { parentId: gamesCategory.id } });

                const buttons = [];
                for (let i = 0; i < subcats.length; i += 3) {
                    buttons.push(subcats.slice(i, i + 3).map(c => ({ text: c.name, callback_data: `cat_${c.id}` })));
                }
                buttons.push([{ text: "⬅ ပြန်ထွက်မည်", callback_data: "back" }]);

                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: "🎮 ကစားလိုတဲ့ ဂိမ်းလေးကို ရွေးချယ်ပေးပါဦးရှင့်...",
                    reply_markup: {
                        inline_keyboard: buttons
                    }
                });
            }
            // Dynamic Category Handler
            else if (callbackData.startsWith('cat_')) {
                const catId = callbackData.split('_')[1];
                const category = await Category.findByPk(catId, { include: ['subcategories', 'packages'] });

                if (category) {
                    const buttons = [];

                    // Add subcategories
                    if (category.subcategories && category.subcategories.length > 0) {
                        for (let i = 0; i < category.subcategories.length; i += 2) {
                            buttons.push(category.subcategories.slice(i, i + 2).map(sc => ({ text: sc.name, callback_data: `cat_${sc.id}` })));
                        }
                    }

                    // Add packages
                    if (category.packages && category.packages.length > 0) {
                        for (let i = 0; i < category.packages.length; i += 1) {
                            buttons.push(category.packages.slice(i, i + 1).map(p => ({ text: `${p.name} - ${p.price}`, callback_data: p.callbackData })));
                        }
                    }

                    buttons.push([{ text: "⬅ နောက်သို့", callback_data: category.parentId ? `cat_${category.parentId}` : "games" }]);

                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: callbackChatId,
                        text: category.description || `${category.name} အတွက် ဝန်ဆောင်မှုလေးတွေ ရွေးပေးပါနော်...`,
                        reply_markup: {
                            inline_keyboard: buttons
                        }
                    });
                }
            }
            // Legacy handlers removed - Dynamic cat_ and pkg_ handlers are used now
            // Handle Package Selections
            else if (callbackData.startsWith('pkg_')) {
                const pkg = await Package.findOne({ where: { callbackData } });
                const pkgLabel = pkg ? `${pkg.name} (${pkg.price})` : null;

                // Safety check
                if (!pkgLabel) {
                    await axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: callbackChatId,
                        text: "❌ Package မတွေ့ပါ။ ပြန်လည်ရွေးချယ်ပါရှင် 🙏"
                    });
                    return;
                }

                // Save user state
                userStates[callbackChatId] = {
                    step: 'AWAITING_ID',
                    package: pkgLabel
                };

                // Ask for Game ID
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: callbackChatId,
                    text: `🛒 **ရွေးချယ်ထားသော Package:** ${pkgLabel}

                            ကျေးဇူးပြု၍ **Game ID (Server ID ပါ) နှင့် username ** ကို ပေးပို့ပါရှင် ✨
                                (ဥပမာ - 12345678 (1234) - hlahla)`,
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
