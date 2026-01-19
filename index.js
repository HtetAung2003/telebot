const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// --- STATIC DATA ---
const categories = [
    { id: 1, name: `🎮 ဂိမ်းများ (Games)`, parentId: null, description: `🎮 ကစားလိုတဲ့ ဂိမ်းလေးကို ရွေးချယ်ပေးပါဦးရှင့်...` },
    { id: 2, name: `❓ သိလိုသည်များ (Q & A)`, parentId: null, description: `🙋 သိလိုသမျှကို ဒီမှာ မေးမြန်းနိုင်ပါတယ်ရှင့်... Topic လေးတစ်ခု ရွေးပေးပါနော်။` },
    {
        id: 3, name: `ဘယ်လို ဝယ်ရမလဲ?`, parentId: 2, description: `📝 **ဝယ်ယူပုံ အဆင့်ဆင့်:**
1. မိမိ ဝယ်လိုသော ဂိမ်းကို အရင်ရွေးပါ
2. လိုချင်တဲ့ Package ကို ရွေးချယ်ပါ
3. မိမိရဲ့ ID/Server ကို Admin ဆီသို့ ပေးပို့ပါ
4. ငွေလွှဲပိုင်လျှင် Gems များ ချက်ချင်း ရရှိမှာ ဖြစ်ပါတယ်ရှင့်!` },
    {
        id: 4, name: `ငွေပေးချေမှု ပုံစံများ`, parentId: 2, description: `💳 **ငွေပေးချေနိုင်သော ပုံစံများ:**
- KBZPay
- WaveMoney
- AYA Pay` },
    { id: 5, name: `Bot အခြေအနေ`, parentId: 2, description: `✅ Bot သည် လက်ရှိတွင် အဆင်သင့် ရှိနေပါတယ်ရှင့်!` },
    { id: 6, name: `Admin နှင့် ဆက်သွယ်ရန်`, parentId: 2, description: `👨‍💻 Admin နှင့် တိုက်ရိုက် စကားပြောရန်: @Qimiishere` },
    {
        id: 7, name: `📦 အော်ဒါတင်ရန် (Order)`, parentId: null, description: `📦 **အော်ဒါတင်ရန်**

မိမိ ကစားလိုသော ဂိမ်းကို "Games" menu မှတဆင့် ရွေးချယ်၍ အော်ဒါတင်နိုင်ပါတယ်ရှင်။

သို့မဟုတ် အောက်ပါ ဂိမ်းများမှ တိုက်ရိုက် ရွေးချယ်နိုင်ပါတယ် 👇` },
    { id: 8, name: `📰 နောက်ဆုံးရသတင်း (Latest News)`, parentId: null, description: null },
    { id: 9, name: `MLBB Global`, parentId: 1, description: null },
    {
        id: 10, name: `💎 Double Diamond ဈေးနှုန်း`, parentId: 9, description: `💎 **Double Diamond ဈေးနှုန်းများ** 💎
တစ်နှစ်မှတစ်ခါရမယ့် Double Bonus ဈေးနှုန်းလေးတွေ လာပါပြီရှင့်! 💎✨
                  
📋 Price List:
🌟 50 + 50 Bonus = 4,500 Ks 
🌟 150 + 150 Bonus = 12,500 Ks 
🌟 250 + 250 Bonus = 20,000 Ks 
🌟 500 + 500 Bonus = 40,000 Ks
2ဆ ကတစ်ကြိမ်ဘဲရပါမယ်ရှင်!` },
    {
        id: 11, name: `🎟️ Weekly Pass ဈေးနှုန်း`, parentId: 9, description: `ဈေးအသက်သာဆုံးနဲ့ Diamond အများဆုံးရမယ့် Weekly Pass လေးတွေ ရပါပြီရှင့်! 💎✨ 
🎫 Price List:
• 1 Weekly Pass = 6,000 Ks 
• 2 Weekly Pass = 12,000 Ks (14 Days) 
• 3 Weekly Pass = 18,000 Ks (21 Days) 
• 4 Weekly Pass = 24,000 Ks (28 Days)
• 5 Weekly Pass = 30,000 Ks (35 Days)
💡 Why buy this? (ဘာလိုတန်လဲ): Weekly Pass တစ်ပတ်ဝယ်ရုံနဲ့ Total 220 Diamonds အပြင် 1 day ကို COA, Starlight fragments, Rare fragment ,... တွေပါဝင်တဲ့ 1 box ကို ရမှာနော်! အရမ်းတန်... 😉` },
    {
        id: 12, name: `🎟️ Twilight Pass ဈေးနှုန်း`, parentId: 9, description: `Miya ရဲ့ Exclusive "Suzuhime" Skin ကို ချက်ချင်းလိုချင်ရင် Twilight Pass သာ ဝယ်လိုက်တော့နော်! 🏹💜 
🏷 Price: ✨ Twilight Pass = 34,000 Ks

🎁 ဘာတွေရမလဲ? 
• 💎 200 Diamonds (Instant) 
• 👗 Exclusive "Suzuhime" Skin (Permanent) 
• 🎟 Tickets & Star Protection Card များစွာ!` },
    { id: 13, name: `💎 ပုံမှန် ဈေးနှုန်း (Latest)`, parentId: 9, description: null },
    {
        id: 14, name: `🔥 Best Sellers`, parentId: 13, description: `🔥 Best Sellers
🎫 Price List:
💎 86 Dia = 5,000 Ks 
💎 172 Dia = 10,000 Ks` },
    {
        id: 15, name: `Small (< 10k)`, parentId: 13, description: `11 Dia = 1,000 Ks 
22 Dia = 2,000 Ks 
33 Dia = 3,000 Ks 
44 Dia = 4,000 Ks
86 Dia = 5,000 Ks
172 Dia = 10,000 Ks` },
    {
        id: 16, name: `Medium (< 30k)`, parentId: 13, description: `257 Dia = 15,500 Ks ⚠️ (Note: Recharge 250 Mission မပြည့်ပါ)
343 Dia = 20,000 Ks 
429 Dia = 25,000 Ks
514 Dia = 30,000 Ks ⚠️ (Note: Recharge 500 Mission မပြည့်ပါ)` },
    {
        id: 17, name: `Large Diamonds`, parentId: 13, description: `600 Dia = 35,000 Ks 
706 Dia = 40,000 Ks 
878 Dia = 55,000 Ks 
1050 Dia = 60,000 Ks` },
    {
        id: 18, name: `👑 Big Spenders`, parentId: 13, description: `1135 Dia = 65,000 Ks 
1220 Dia = 70,000 Ks 
1412 Dia = 80,000 Ks 
1584 Dia = 85,000 Ks 
1842 Dia = 103,000 Ks 
2195 Dia = 120,000 Ks 
3688 Dia = 203,000 Ks` },
    { id: 19, name: `MLBB 🇸🇬 Singapore`, parentId: 1, description: null },
    {
        id: 20, name: `💎 Double Diamond ဈေးနှုန်း`, parentId: 19, description: `💎 **Double Diamond ဈေးနှုန်းများ (SG)** 💎
        
🌟 50 + 50 Bonus = 4,500 Ks 
🌟 150 + 150 Bonus = 12,500 Ks 
🌟 250 + 250 Bonus = 20,000 Ks 
🌟 500 + 500 Bonus = 40,000 Ks` },
    {
        id: 21, name: `🎟️ Weekly Pass ဈေးနှုန်း`, parentId: 19, description: `💎 **Weekly Pass (SG)** 💎
• 1 Weekly Pass = 9,000 Ks 
• 2 Weekly Pass = 18,000 Ks (14 Days) 
• 3 Weekly Pass = 27,000 Ks (21 Days) 
• 4 Weekly Pass = 36,000 Ks (28 Days)
• 5 Weekly Pass = 45,000 Ks (35 Days)` },
    { id: 22, name: `💎 ပုံမှန် ဈေးနှုန်း`, parentId: 19, description: null },
    { id: 23, name: `Best Selected`, parentId: 22, description: null },
    { id: 24, name: `Small (< 10k)`, parentId: 22, description: null },
    { id: 25, name: `Medium (< 30k)`, parentId: 22, description: null },
    { id: 26, name: `Large`, parentId: 22, description: null },
    { id: 27, name: `Big Spenders`, parentId: 22, description: null },
    { id: 28, name: `Magic Chess : GoGo`, parentId: 1, description: null },
    {
        id: 29, name: `💎 Double Diamond`, parentId: 28, description: `🌟Dia 50+bonus 50 - 3300ks 
🌟Dia 150+ bonus 150-10000ks 
🌟Dia 250+ bonus 250 -16500ks
🌟Dia 500+ bonus 500- 32000 Ks` },
    {
        id: 30, name: `🎟️ Weekly Pass`, parentId: 28, description: `• 1 Weekly Pass = 7,000 Ks 
• 2 Weekly Pass = 14,000 Ks
• 3 Weekly Pass = 21,000 Ks
• 4 Weekly Pass = 28,000 Ks
• 5 Weekly Pass = 35,000 Ks` },
    { id: 31, name: `💎 Latest Price`, parentId: 28, description: null },
    { id: 32, name: `Best Seller`, parentId: 31, description: null },
    { id: 33, name: `Small`, parentId: 31, description: null },
    { id: 34, name: `Medium`, parentId: 31, description: null },
    { id: 35, name: `Large`, parentId: 31, description: null },
    { id: 36, name: `Big Spenders`, parentId: 31, description: null },
    { id: 37, name: `PUBG ( UC )`, parentId: 1, description: null },
    {
        id: 38, name: `Weekly Pass`, parentId: 37, description: `💎 **Weekly Diamond Pass ** 💎


🤷‍♀️ **ဘာလို့ Weekly Pass ဝယ်သင့်လဲ?**
✅ **500% Value:** ပုံမှန်ဝယ်တာထက် (၅) ဆ ပိုတန်ပါတယ်!
✅ **Total Rewards:** စုစုပေါင်း **220 Diamonds** အပြင် Starlight Point တွေပါ ရမှာနော်။
✅ **Event Friendly:** Recharge Event တွေမှာလည်း Count ဝင်လို့ အရမ်းအဆင်ပြေ! 🔥

🎁 **Daily Rewards (၇ ရက်တိတိ ရမည်):**
• 💎 20 Diamonds (Daily)
• 🎫 StarLight Point & Choice Bundle (Daily)


"အနည်းဆုံး ဈေးနှုန်းနဲ့ အများဆုံး အမြတ်ရဖို့ Weekly Pass သာ ဝယ်လိုက်တော့နော် အချစ်တို့ရေ... 😘` },
    {
        id: 39, name: `ELite Pass`, parentId: 37, description: `👑 PUBG Mobile Elite Pass (Royale Pass)
Season အသစ်ရဲ့ အမိုက်စား Outfit တွေနဲ့ Gun Skin တွေကို ပိုင်ဆိုင်ဖို့ အခုပဲ RP (Elite Pass) ဖွင့်လိုက်တော့နော်! 😎🔥

🤷‍♀️ ဘာကွာခြားလဲ?

✅ Elite Pass (360 UC) • RP ကို ဖွင့်ပေးပါမည်။ • Mission များကို ကိုယ်တိုင်ဆော့ကစားပြီး Level တင်ရပါမည်။ • တန်ဖိုးနည်းနည်းနဲ့ RP ဖွင့်ချင်သူများအတွက် အထူးသင့်လျော်! 👍

🌟 Elite Pass Plus (960 UC) • RP ဖွင့်ပြီးတာနဲ့ Rank (12) ဆင့် ချက်ချင်းတက်မည်! 🚀 • Exclusive Avatar Frame နှင့် အခြား Bonus လက်ဆောင်များ ချက်ချင်းရမည်။ • သူများထက် အရင်လန်းချင်သူတွေအတွက် Recommended ပါရှင့်! 🤩

"Mission တွေ ဖြည်းဖြည်းချင်းဆော့မလား? ချက်ချင်း Level တက်ပြီး Show နှိပ်မလား? စိတ်ကြိုက်ရွေးပါရှင့် ❤️"

👇 ပြုလုပ်လိုသော Pass ကို ရွေးချယ်ပါ:` },
    {
        id: 40, name: `Growth Pack`, parentId: 37, description: `📈 PUBG Mobile Growth Pack
UC တွေဝယ်ပြီး Skin အလန်းတွေလိုချင်ပေမယ့် UC ကုန်သွားမှာ နှမြောနေလား? 🥺 ဒါဆိုရင် Growth Pack က အသင့်တော်ဆုံးပါပဲရှင့်! ✨

🎁 ဘာလို့ Growth Pack ဝယ်သင့်လဲ?

✅ 100% Rebate: Growth Pack ဝယ်ပြီး Mission လုပ်ရုံနဲ့ ဝယ်ထားတဲ့ UC ပမာဏအတိုင်း ပြန်ရမည်! 😱 ✅ Free Permanent Skin: UC လည်းပြန်ရ၊ Outfit နဲ့ Gun Skin တွေလည်း အလကားရမှာနော်။ ✅ Super Value: လက်ရှိ PUBG မှာ အတန်ဆုံး Event တစ်ခုပါပဲ။

"UC လည်းမရှုံး၊ ပစ္စည်းလည်းရ... ဒီလိုအခွင့်အရေးက အမြဲမရဘူးနော် အချစ်တို့! Event အချိန်မကုန်ခင် မြန်မြန်ဝယ်ထားမှ စိတ်ချရမယ် 😉"

👇 Growth Pack ဝယ်ယူရန် ရွေးချယ်ပါ:` },
    {
        id: 41, name: `PUBG UC  💵 price `, parentId: 37, description: `🔫 PUBG Mobile UC (Global) Price List
"Unknown Battleground မှာ ဆရာကျဖို့ UC လိုနေပြီလား? Skin အသစ်တွေ၊ Gun Lab တွေမြှင့်ဖို့အတွက် ဈေးအသက်သာဆုံးနဲ့ အမြန်ဆုံး ဝန်ဆောင်မှုပေးနေပါပြီရှင့်! 🧡✨"
ဝယ်ယူလိုပါက အောက်ပါ Package လေးများကို နှိပ်ပြီး ရွေးချယ်ပေးပါရှင့် 👇` },
    {
        id: 42, name: `Prime & Prime Plus`, parentId: 37, description: `👑 PUBG Mobile Prime & Prime Plus
UC ကို ဈေးအသက်သာဆုံးနဲ့ လစဉ်ပုံမှန်လိုချင်သူများအတွက် အကောင်းဆုံး Subscription Plan လေးတွေပါ! 🌟

✅ Prime (Ordinary)
 • 💎 Daily Reward: နေ့စဉ် 5 UC ရရှိမည် (Total 150 UC/Month) 
• 🛒 Benefit: BP ဖြင့် Shop အတွင်းရှိ သီးသန့် Item များကို ဝယ်ယူနိုင်ခြင်း။

🌟 Prime Plus (Best Value!) 🔥 
 • 💎 Instant Reward: ဝယ်ဝယ်ချင်း 660 UC ချက်ချင်းရမည်! 😱
 • 💎 Daily Reward: နေ့စဉ် 8 UC + RP Points များ ရရှိမည် (Total 900 UC/Month) • 🎟 Bonus: Classic Crate Coupon, Premium Crate Coupon နှင့် Rename Card Discounts များပါဝင်!

"တစ်ခါတည်းဝယ်ပြီး UC အများကြီးစုချင်ရင် Prime Plus က အရမ်းတန်နော်! BP တွေပုံနေရင် Prime လေးဝယ်ပြီး Item တွေလှဲဝယ်လိုက်တော့ အချစ်တို့ရေ... 😉❤️"

👇 ဝယ်ယူလိုသော Subscription ကို ရွေးချယ်ပါ:` },
    { id: 43, name: `Sky Children of the light `, parentId: 1, description: null },
    {
        id: 44, name: `Season Pass`, parentId: 43, description: `☁️ Sky: Children of the Light Season Pass 🕯️
Season အသစ်မှာ အမိုက်စား Outfit တွေ၊ Emote တွေနဲ့ ကောင်းကင်ကြီးပေါ် ပျံသန်းဖို့ Adventure Pass လိုနေပြီလား? 🦋✨
Friend Add စရာမလို၊ Player ID လေးပေးရုံနဲ့ Gift တိုက်ရိုက် ပို့ပေးမှာမို အထူးလုံခြုံ စိတ်ချရပါတယ်ရှင့်! 🧡

📜 Package ရွေးချယ်ရန်:

🔸 Season Pass (Regular) 💰 Price: 31,500 Ks ✨ မိမိတစ်ယောက်တည်းအတွက် Season Item များနှင့် Pendant ကို ရယူလိုသူများအတွက်!

🎁 Season Pass Bundle (Pack) 💰 Price: 62,500 Ks ✨ ပါဝင်ပစ္စည်းများ: Main Pass (၁) ခု + Gift Pass (၂) ခု 💡 Tip: သူငယ်ချင်း (၃) ယောက် စုဝယ်ပြီး Share ယူမယ်ဆိုရင် ဒီ Pack က အရမ်းတန်နော်!

"Sky ID လေး Copy ကူးပြီး အခုပဲ မှာယူလိုက်တော့နော် Children of the Light လေးတို့ရေ... 👋☁️"

👇 ဝယ်ယူလိုသော Pass ကို ရွေးချယ်ပါ:` },
    {
        id: 45, name: `Regular Candles`, parentId: 43, description: `🕯️ Sky: Children of the Light - Regular Candles
Constellation တွေဖြည့်ဖို့၊ သူငယ်ချင်းသစ်တွေနဲ့ Friendship Tree ဖွင့်ဖို့ Candle လေးတွေ လိုနေပြီလား? 🥺✨ Farm ရတာမောနေရင် ဒီမှာ အသင့်ရှိပါတယ်ရှင့်!

✅ Safe & Fast: Login ပေးစရာမလို၊ Player ID လေးပေးရုံဖြင့် Candle များ ချက်ချင်းပို့ပေးနေပါပြီ။ 🧡

📜 Candle Price List:

• 🕯️ 15 Candles = 16,000 Ks • 🕯️ 35 Candles = 31,000 Ks • 🕯️ 72 Candles = 62,000 Ks • 🕯️ 190 Candles = 154,000 Ks

"CR (Candle Run) လုပ်ရတာ ပင်ပန်းနေရင် အမောပြေဝယ်လိုက်တော့နော်... အချိန်ကုန်သက်သာပြီး Item လှလှလေးတွေ မြန်မြန်ရယူလိုက်ပါ Sky Kid လေးတို့ရေ... ☁️🕊️"

👇 ဝယ်ယူလိုသော ပမာဏကို ရွေးချယ်ပါ:` },
    { id: 46, name: `HOK`, parentId: 1, description: null },
    { id: 47, name: `WP`, parentId: 46, description: null },
    { id: 48, name: `token`, parentId: 46, description: null },
    { id: 49, name: `Free Fire `, parentId: 1, description: null },
    {
        id: 50, name: `Pass`, parentId: 49, description: `🦅 Free Fire Membership Packages 🔥
Direct Top-up ထက် Diamond ပိုများများရပြီး အတန်ဆုံးဖြစ်တဲ့ Membership လေးတွေ ရပါပြီရှင့်! 💎✨

🆔 System: Player ID လေးပေးရုံဖြင့် 100% စိတ်ချရပြီး လုံခြုံမှုရှိပါတယ်။

📜 Package Details:

📅 Weekly Membership (7 Days) 💰 Price: 9,500 Ks 💎 Total: 450 Diamonds (ရရှိမည်) • Direct Top-up ထက် ဈေးသက်သာပြီး Diamond ပိုရ! • Instant 100 Dia + Daily 50 Dia (7 Days)

📆 Monthly Membership (30 Days) 💰 Price: 43,000 Ks 💎 Total: 2,600 Diamonds (ရရှိမည်) • အများကြီးစုပြီး Skin အလန်းတွေ ဝယ်ချင်သူများအတွက်! • Instant 500 Dia + Daily 70 Dia (30 Days) • Bonus: Weapon Skin Gift Box (30 Days) 🔫

⚡ Weekly Lite 💰 Price: 4,700 Ks • Budget သမားများအတွက် အသက်သာဆုံး Plan! • နည်းနည်းချင်းစီ စုချင်သူတွေအတွက် အဆင်ပြေဆုံးပါရှင့်။

"Booyah! 🏆 ရဖို့ Diamond တွေလိုနေပြီလား? Membership ဝယ်ပြီး Diamond တွေ နေ့တိုင်း Claim လိုက်တော့နော် Survivors တို့ရေ... 😉❤️"

👇 ဝယ်ယူလိုသော Package ကို ရွေးချယ်ပါ:` },
    {
        id: 51, name: `💎 prices`, parentId: 49, description: `🦅 Free Fire Diamonds (Player ID)
Battleground မှာ အမိုက်စား Skin တွေနဲ့ ရှယ်လန်းဖို့ Diamond တွေဈေးတန်တန်လေးနဲ့ ရပါပြီရှင့်! 🔥✨

✅ Service Guarantee: Login ပေးစရာမလို၊ Player ID လေးပေးရုံနဲ့ (၅) မိနစ်အတွင်း အရောက်ပို့ပေးမှာမို စိတ်ချလက်ချ ဝယ်ယူနိုင်ပါတယ်။

💎 Price List:

• 33 Diamonds = 1,500 Ks • 68 Diamonds = 3,200 Ks • 101 Diamonds = 4,800 Ks • 172 Diamonds = 7,500 Ks • 310 Diamonds = 14,000 Ks • 517 Diamonds = 22,500 Ks • 690 Diamonds = 30,000 Ks • 1,052 Diamonds = 45,000 Ks • 1,801 Diamonds = 75,000 Ks • 3,698 Diamonds = 140,000 Ks

"လိုချင်တဲ့ Diamond ပမာဏကို ရွေးချယ်ပေးပါနော် Survivors တို့ရေ... 😘❤️"

👇 ဝယ်ယူလိုသော ပမာဏကို ရွေးချယ်ပါ:` },
    {
        id: 52, name: `Where Winds Meet`, parentId: 1, description: `⚔️ Where Winds Meet (Wuxia Open World) 🍂
"သိုင်းလောကရဲ့ လေညင်းတွေဆုံရာ... ရာဇဝင်ထဲက Ten Kingdoms ခေတ်ဆီသို့..."

ဓားသိုင်းပညာနဲ့ Open World ကို စိတ်ကြိုက်လေ့လာနိုင်မယ့် Where Winds Meet ဂိမ်းအတွက် ဝန်ဆောင်မှုများ ရရှိနိုင်ပါပြီရှင်! 🗡️✨

🎐 Game Highlights: • ရုပ်ရှင်ဆန်တဲ့ Graphic တွေနဲ့ အမိုက်စား Wuxia Gameplay! • လွတ်လပ်တဲ့ "Wandering Swordsman" ဘဝကို ခံစားနိုင်မည်။

✅ Service Guarantee: Official Server မှ တိုက်ရိုက် ဝန်ဆောင်မှုပေးတာမို Account လုံခြုံမှုအတွက် (100%) အာမခံပါတယ်နော်။ 🧡` },
    {
        id: 53, name: `Beads Price `, parentId: 52, description: `⚔️ Where Winds Meet - Beads Top-up 🦪
"သိုင်းလောက (Jianghu) မှာ အလန်းဆုံး Outfit တွေဝတ်ပြီး ကိုယ်ပိုင်သိုင်းကွက်တွေနဲ့ ရှယ်ကြမ်းဖို့ Beads လေးတွေ ဖြည့်လိုက်တော့နော်! 🌪️✨"

👘 Unlock Your Style: Gacha မှာ Costume အသစ်တွေ လိုချင်တာပဲဖြစ်ဖြစ်၊ Item ကောင်းကောင်းတွေ ဝယ်ချင်တာပဲဖြစ်ဖြစ် ဈေးအသက်သာဆုံးနဲ့ ဝန်ဆောင်မှုပေးနေပါပြီရှင့်။

📋 Beads Price List:

• 🦪 60 Beads = 4,500 Ks • 🦪 180 Beads = 12,500 Ks • 🦪 300 Beads = 21,000 Ks • 🦪 600 Beads = 41,000 Ks • 🦪 900 Beads = 62,000 Ks • 🦪 1800 Beads = 125,000 Ks • 🦪 3000 Beads = 205,000 Ks

✅ Service: 100% Official & Safe. "Gacha ကံကောင်းပြီး Rare Item တွေပေါက်ပါစေလို့ ဆုတောင်းပေးပါတယ်ရှင်... 🙏🧡"

👇 ဝယ်ယူလိုသော ပမာဏကို ရွေးချယ်ပါ:` },
];

const packages = [
    { id: 1, name: `Dia 50 + 50`, price: `4,500 Ks`, callbackData: `pkg_50_50`, categoryId: 10, description: null },
    { id: 2, name: `Dia 150 + 150`, price: `12,500 Ks`, callbackData: `pkg_150_150`, categoryId: 10, description: null },
    { id: 3, name: `Dia 250 + 250`, price: `20,000 Ks`, callbackData: `pkg_250_250`, categoryId: 10, description: null },
    { id: 4, name: `Dia 500 + 500`, price: `40,000 Ks`, callbackData: `pkg_500_500`, categoryId: 10, description: null },
    { id: 5, name: `1 Weekly Pass`, price: `6,000 Ks`, callbackData: `pkg_1wp`, categoryId: 11, description: null },
    { id: 6, name: `2 Weekly Pass`, price: `12,000 Ks`, callbackData: `pkg_2wp`, categoryId: 11, description: null },
    { id: 7, name: `3 Weekly Pass`, price: `18,000 Ks`, callbackData: `pkg_3wp`, categoryId: 11, description: null },
    { id: 8, name: `4 Weekly Pass`, price: `24,000 Ks`, callbackData: `pkg_4wp`, categoryId: 11, description: null },
    { id: 9, name: `5 Weekly Pass`, price: `30,000 Ks`, callbackData: `pkg_5wp`, categoryId: 11, description: null },
    { id: 10, name: `Twilight Pass`, price: `34,000 Ks`, callbackData: `pkg_tlp`, categoryId: 12, description: null },
    { id: 11, name: `86 Dia`, price: `5,000 Ks`, callbackData: `pkg_86dia`, categoryId: 14, description: null },
    { id: 12, name: `172 Dia`, price: `10,000 Ks`, callbackData: `pkg_172dia`, categoryId: 14, description: null },
    { id: 13, name: `11 Dia`, price: `1,000 Ks`, callbackData: `pkg_11dia`, categoryId: 15, description: null },
    { id: 14, name: `22 Dia`, price: `2,000 Ks`, callbackData: `pkg_22dia`, categoryId: 15, description: null },
    { id: 15, name: `33 Dia`, price: `3,000 Ks`, callbackData: `pkg_33dia`, categoryId: 15, description: null },
    { id: 16, name: `44 Dia`, price: `4,000 Ks`, callbackData: `pkg_44dia`, categoryId: 15, description: null },
    { id: 17, name: `86 Dia`, price: `5,000 Ks`, callbackData: `pkg_86dia_dup`, categoryId: 15, description: null },
    { id: 18, name: `172 Dia`, price: `10,000 Ks`, callbackData: `pkg_172dia_dup`, categoryId: 15, description: null },
    { id: 19, name: `257 Dia`, price: `15,500 Ks`, callbackData: `pkg_257dia`, categoryId: 16, description: null },
    { id: 20, name: `343 Dia`, price: `20,000 Ks`, callbackData: `pkg_343dia`, categoryId: 16, description: null },
    { id: 21, name: `429 Dia`, price: `25,000 Ks`, callbackData: `pkg_429dia`, categoryId: 16, description: null },
    { id: 22, name: `514 Dia`, price: `30,000 Ks`, callbackData: `pkg_514dia`, categoryId: 16, description: null },
    { id: 23, name: `600 Dia`, price: `35,000 Ks`, callbackData: `pkg_600dia`, categoryId: 17, description: null },
    { id: 24, name: `706 Dia`, price: `40,000 Ks`, callbackData: `pkg_706dia`, categoryId: 17, description: null },
    { id: 25, name: `878 Dia`, price: `55,000 Ks`, callbackData: `pkg_878dia`, categoryId: 17, description: null },
    { id: 26, name: `1050 Dia`, price: `60,000 Ks`, callbackData: `pkg_1050dia`, categoryId: 17, description: null },
    { id: 27, name: `1135 Dia`, price: `65,000 Ks`, callbackData: `pkg_1135dia`, categoryId: 18, description: null },
    { id: 28, name: `1220 Dia`, price: `70,000 Ks`, callbackData: `pkg_1220dia`, categoryId: 18, description: null },
    { id: 29, name: `1412 Dia`, price: `80,000 Ks`, callbackData: `pkg_1412dia`, categoryId: 18, description: null },
    { id: 30, name: `1584 Dia`, price: `85,000 Ks`, callbackData: `pkg_1584dia`, categoryId: 18, description: null },
    { id: 31, name: `1842 Dia`, price: `103,000 Ks`, callbackData: `pkg_1842dia`, categoryId: 18, description: null },
    { id: 32, name: `2195 Dia`, price: `120,000 Ks`, callbackData: `pkg_2195dia`, categoryId: 18, description: null },
    { id: 33, name: `3688 Dia`, price: `203,000 Ks`, callbackData: `pkg_3688dia`, categoryId: 18, description: null },
    { id: 34, name: `Dia 50+50`, price: `4,500 Ks`, callbackData: `pkg_50_50_sg`, categoryId: 20, description: null },
    { id: 35, name: `Dia 150+150`, price: `12,500 Ks`, callbackData: `pkg_150_150_sg`, categoryId: 20, description: null },
    { id: 36, name: `Dia 250+250`, price: `20,000 Ks`, callbackData: `pkg_250_250_sg`, categoryId: 20, description: null },
    { id: 37, name: `Dia 500+500`, price: `40,000 Ks`, callbackData: `pkg_500_500_sg`, categoryId: 20, description: null },
    { id: 38, name: `1 Weekly Pass`, price: `9,000 Ks`, callbackData: `pkg_1wp_sg`, categoryId: 21, description: null },
    { id: 39, name: `2 Weekly Pass`, price: `18,000 Ks`, callbackData: `pkg_2wp_sg`, categoryId: 21, description: null },
    { id: 40, name: `3 Weekly Pass`, price: `27,000 Ks`, callbackData: `pkg_3wp_sg`, categoryId: 21, description: null },
    { id: 41, name: `4 Weekly Pass`, price: `36,000 Ks`, callbackData: `pkg_4wp_sg`, categoryId: 21, description: null },
    { id: 42, name: `5 Weekly Pass`, price: `45,000 Ks`, callbackData: `pkg_5wp_sg`, categoryId: 21, description: null },
    { id: 43, name: `70 Dia`, price: `5,500 Ks`, callbackData: `pkg_70dia_sg`, categoryId: 23, description: null },
    { id: 44, name: `140 Dia`, price: `11,000 Ks`, callbackData: `pkg_140dia_sg`, categoryId: 23, description: null },
    { id: 45, name: `210 Dia`, price: `16,500 Ks`, callbackData: `pkg_210dia_sg`, categoryId: 23, description: null },
    { id: 46, name: `14 Dia`, price: `1,300 Ks`, callbackData: `pkg_14dia_sg`, categoryId: 24, description: null },
    { id: 47, name: `28 Dia`, price: `2,300 Ks`, callbackData: `pkg_28dia_sg`, categoryId: 24, description: null },
    { id: 48, name: `42 Dia`, price: `3,400 Ks`, callbackData: `pkg_42dia_sg`, categoryId: 24, description: null },
    { id: 49, name: `70 Dia`, price: `5,500 Ks`, callbackData: `pkg_70dia_sg_dup`, categoryId: 24, description: null },
    { id: 50, name: `140 Dia`, price: `11,000 Ks`, callbackData: `pkg_140dia_sg_dup`, categoryId: 24, description: null },
    { id: 51, name: `210 Dia`, price: `16,500 Ks`, callbackData: `pkg_210dia_sg_dup`, categoryId: 25, description: null },
    { id: 52, name: `284 Dia`, price: `22,000 Ks`, callbackData: `pkg_284dia_sg`, categoryId: 25, description: null },
    { id: 53, name: `355 Dia`, price: `27,300 Ks`, callbackData: `pkg_355dia_sg`, categoryId: 25, description: null },
    { id: 54, name: `429 Dia`, price: `32,500 Ks`, callbackData: `pkg_429dia_sg`, categoryId: 26, description: null },
    { id: 55, name: `513 Dia`, price: `39,000 Ks`, callbackData: `pkg_513dia_sg`, categoryId: 26, description: null },
    { id: 56, name: `639 Dia`, price: `49,000 Ks`, callbackData: `pkg_639dia_sg`, categoryId: 26, description: null },
    { id: 57, name: `716 Dia`, price: `54,000 Ks`, callbackData: `pkg_716dia_sg`, categoryId: 26, description: null },
    { id: 58, name: `870 Dia`, price: `66,500 Ks`, callbackData: `pkg_870dia_sg`, categoryId: 27, description: null },
    { id: 59, name: `1145 Dia`, price: `87,000 Ks`, callbackData: `pkg_1145dia_sg`, categoryId: 27, description: null },
    { id: 60, name: `1285 Dia`, price: `98,000 Ks`, callbackData: `pkg_1285dia_sg`, categoryId: 27, description: null },
    { id: 61, name: `1446 Dia`, price: `109,000 Ks`, callbackData: `pkg_1446dia_sg`, categoryId: 27, description: null },
    { id: 62, name: `1656 Dia`, price: `125,000 Ks`, callbackData: `pkg_1656dia_sg`, categoryId: 27, description: null },
    { id: 63, name: `1875 Dia`, price: `140,000 Ks`, callbackData: `pkg_1875dia_sg`, categoryId: 27, description: null },
    { id: 64, name: `2162 Dia`, price: `163,000 Ks`, callbackData: `pkg_2162dia_sg`, categoryId: 27, description: null },
    { id: 65, name: `2976 Dia`, price: `215,000 Ks`, callbackData: `pkg_2976dia_sg`, categoryId: 27, description: null },
    { id: 66, name: `3692 Dia`, price: `273,000 Ks`, callbackData: `pkg_3692dia_sg`, categoryId: 27, description: null },
    { id: 67, name: `4562 Dia`, price: `335,000 Ks`, callbackData: `pkg_4562dia_sg`, categoryId: 27, description: null },
    { id: 68, name: `5567 Dia`, price: `410,000 Ks`, callbackData: `pkg_5567dia_sg`, categoryId: 27, description: null },
    { id: 69, name: `Dia 50 + 50`, price: `3,300 Ks`, callbackData: `pkg_50_50_csgg`, categoryId: 29, description: null },
    { id: 70, name: `Dia 150 + 150`, price: `10,000 Ks`, callbackData: `pkg_150_150_csgg`, categoryId: 29, description: null },
    { id: 71, name: `Dia 250 + 250`, price: `16,500 Ks`, callbackData: `pkg_250_250_csgg`, categoryId: 29, description: null },
    { id: 72, name: `Dia 500 + 500`, price: `32,000 Ks`, callbackData: `pkg_500_500_csgg`, categoryId: 29, description: null },
    { id: 73, name: `1 Weekly Pass`, price: `7,000 Ks`, callbackData: `pkg_1wp_csgg`, categoryId: 30, description: null },
    { id: 74, name: `2 Weekly Pass`, price: `14,000 Ks`, callbackData: `pkg_2wp_csgg`, categoryId: 30, description: null },
    { id: 75, name: `3 Weekly Pass`, price: `21,000 Ks`, callbackData: `pkg_3wp_csgg`, categoryId: 30, description: null },
    { id: 76, name: `4 Weekly Pass`, price: `28,000 Ks`, callbackData: `pkg_4wp_csgg`, categoryId: 30, description: null },
    { id: 77, name: `5 Weekly Pass`, price: `35,000 Ks`, callbackData: `pkg_5wp_csgg`, categoryId: 30, description: null },
    { id: 78, name: `172 Dia`, price: `10,400 Ks`, callbackData: `pkg_172dia_csgg`, categoryId: 32, description: null },
    { id: 79, name: `344 Dia`, price: `20,800 Ks`, callbackData: `pkg_344dia_csgg`, categoryId: 32, description: null },
    { id: 80, name: `86 Dia`, price: `5,200 Ks`, callbackData: `pkg_86dia_csgg`, categoryId: 33, description: null },
    { id: 81, name: `172 Dia`, price: `10,400 Ks`, callbackData: `pkg_172dia_csgg_dup`, categoryId: 33, description: null },
    { id: 82, name: `257 Dia`, price: `15,500 Ks`, callbackData: `pkg_257dia_csgg`, categoryId: 34, description: null },
    { id: 83, name: `344 Dia`, price: `20,800 Ks`, callbackData: `pkg_344dia_csgg_dup`, categoryId: 34, description: null },
    { id: 84, name: `514 Dia`, price: `30,800 Ks`, callbackData: `pkg_514dia_csgg`, categoryId: 35, description: null },
    { id: 85, name: `706 Dia`, price: `41,500 Ks`, callbackData: `pkg_706dia_csgg`, categoryId: 35, description: null },
    { id: 86, name: `1346 Dia`, price: `75,000 Ks`, callbackData: `pkg_1346dia_csgg`, categoryId: 36, description: null },
    { id: 87, name: `1825 Dia`, price: `100,500 Ks`, callbackData: `pkg_1825dia_csgg`, categoryId: 36, description: null },
    { id: 88, name: `2195 Dia`, price: `120,500 Ks`, callbackData: `pkg_2195dia_csgg`, categoryId: 36, description: null },
    { id: 89, name: `3688 Dia`, price: `200,500 Ks`, callbackData: `pkg_3688dia_csgg`, categoryId: 36, description: null },
    { id: 90, name: `Weekly Mythic Emblem `, price: `12500`, callbackData: `pkg_wme125`, categoryId: 38, description: null },
    { id: 91, name: `Weekly Deal Pack 1 `, price: `4000`, callbackData: `pkg_wdp_4`, categoryId: 38, description: null },
    { id: 92, name: `Weekly Deal Pack 2 `, price: `12500`, callbackData: `pkg_undefined`, categoryId: 38, description: null },
    { id: 93, name: `Elite Pass lv50 `, price: `23500`, callbackData: `pkg_epl_235`, categoryId: 39, description: null },
    { id: 94, name: `Elite Pass lv100 `, price: `47000`, callbackData: `pkg_epl_47000`, categoryId: 39, description: null },
    { id: 95, name: `Elite Pass Plus lv100 `, price: `105000`, callbackData: `pkg_epl_105`, categoryId: 39, description: null },
    { id: 96, name: `first purchase pack `, price: `4000`, callbackData: `pkg_fpp_4`, categoryId: 40, description: null },
    { id: 97, name: `Upgradable Firearm Material Pack `, price: `12000`, callbackData: `pkg_ufmp_12000`, categoryId: 40, description: null },
    { id: 98, name: `Mythic Emblem Pack`, price: `20000`, callbackData: `pkg_mep_20`, categoryId: 40, description: null },
    { id: 99, name: `10 uc `, price: `1500`, callbackData: `pkg_10uc_4`, categoryId: 41, description: null },
    { id: 100, name: `60 uc `, price: `5000`, callbackData: `pkg_60uc_5`, categoryId: 41, description: null },
    { id: 101, name: `325 uc `, price: `21000`, callbackData: `pkg_325uc_21`, categoryId: 41, description: null },
    { id: 102, name: `660 uc `, price: `40000`, callbackData: `pkg_660uc_40`, categoryId: 41, description: null },
    { id: 103, name: `1800 uc`, price: `99000`, callbackData: `pkg_1800uc_99`, categoryId: 41, description: null },
    { id: 104, name: `3850 uc `, price: `196000`, callbackData: `pkg_3860uc_196`, categoryId: 41, description: null },
    { id: 105, name: `8100 uc `, price: `390000`, callbackData: `pkg_8100uc_39`, categoryId: 41, description: null },
    { id: 106, name: `prime normal 1m =   4000 ks`, price: `4000`, callbackData: `pkg_pn1m_4`, categoryId: 42, description: null },
    { id: 107, name: `prime plus 1m =   40000 ks`, price: `40000`, callbackData: `pkg_pp1m_40`, categoryId: 42, description: null },
    { id: 108, name: `Season Pass Regular`, price: `31500`, callbackData: `pkg_spr_315`, categoryId: 44, description: null },
    { id: 109, name: `Season Pass Pack`, price: `62500`, callbackData: `pkg_spp_625`, categoryId: 44, description: null },
    { id: 110, name: `Journey Pack`, price: `76000`, callbackData: `pkg_jp_760`, categoryId: 43, description: null },
    { id: 111, name: `Gift Season Pass`, price: `31500`, callbackData: `pkg_gsp_315`, categoryId: 43, description: null },
    { id: 112, name: `15 season Candles`, price: `16000`, callbackData: `pkg_15sc_16`, categoryId: 43, description: null },
    { id: 113, name: `15 Regular Candles `, price: `16000`, callbackData: `pkg_15rc_16`, categoryId: 45, description: null },
    { id: 114, name: `35 Regular Candles`, price: `31000`, callbackData: `pkg_35rc_31`, categoryId: 45, description: null },
    { id: 115, name: `72 Regular Candles`, price: `62000`, callbackData: `pkg_72rc_62`, categoryId: 45, description: null },
    { id: 116, name: `190 Regular Candles`, price: `154000`, callbackData: `pkg_190rc_154`, categoryId: 45, description: null },
    { id: 117, name: `Wp`, price: `4000`, callbackData: `pkg_wp_4_hok`, categoryId: 47, description: null },
    { id: 118, name: `wp plus`, price: `15000`, callbackData: `pkg_wpplus_15_hok`, categoryId: 47, description: null },
    { id: 119, name: `16 tk`, price: `1500`, callbackData: `pkg_16tk_15`, categoryId: 48, description: null },
    { id: 120, name: `80 tk`, price: `4200`, callbackData: `pkg_80tk_42`, categoryId: 48, description: null },
    { id: 121, name: `240 tk`, price: `13000`, callbackData: `pkg_249tk_130`, categoryId: 48, description: null },
    { id: 122, name: `400 tk`, price: `20000`, callbackData: `pkg_400tk_20`, categoryId: 48, description: null },
    { id: 123, name: `560 tk`, price: `30000`, callbackData: `pkg_560tk_30`, categoryId: 48, description: null },
    { id: 124, name: `800 tk`, price: `40000`, callbackData: `pkg_800tk_40`, categoryId: 48, description: null },
    { id: 125, name: `1200 tk`, price: `58000`, callbackData: `pkg_1200tk_58`, categoryId: 48, description: null },
    { id: 126, name: `2400 tk`, price: `120000`, callbackData: `pkg_2400tk_120`, categoryId: 48, description: null },
    { id: 127, name: `4000 tk`, price: `200000`, callbackData: `pkg_4000tk_200`, categoryId: 48, description: null },
    { id: 128, name: `8000 tk`, price: `380000`, callbackData: `pkg_8000tk_380`, categoryId: 48, description: null },
    { id: 129, name: `Weekly Pass`, price: `9500`, callbackData: `pkg_wp_95`, categoryId: 50, description: null },
    { id: 130, name: `Monthly Pass`, price: `43000`, callbackData: `pkg_mp_43_ff`, categoryId: 50, description: null },
    { id: 131, name: `Weekly Lite`, price: `4700`, callbackData: `pkg_wl_47_ff`, categoryId: 50, description: null },
    { id: 132, name: `33 dia`, price: `1500`, callbackData: `pkg_33dia_ff_15`, categoryId: 51, description: null },
    { id: 133, name: `68 dia`, price: `3200`, callbackData: `pkg_68dia_ff_32`, categoryId: 51, description: null },
    { id: 134, name: `101 dia`, price: `4800`, callbackData: `pkg_101dia_ff`, categoryId: 51, description: null },
    { id: 135, name: `172 dia`, price: `7500`, callbackData: `pkg_172dia_ff_75`, categoryId: 51, description: null },
    { id: 136, name: `310 dia`, price: `14000`, callbackData: `pkg_310dia_ff_14`, categoryId: 51, description: null },
    { id: 137, name: `517 dia`, price: `22500`, callbackData: `pkg_517dia_ff_225`, categoryId: 51, description: null },
    { id: 138, name: `690 dia`, price: `30000`, callbackData: `pkg_690dia_ff_30`, categoryId: 51, description: null },
    { id: 139, name: `1052 dia`, price: `45000`, callbackData: `pkg_1052dia_ff_45`, categoryId: 51, description: null },
    { id: 140, name: `1801 dia`, price: `75000`, callbackData: `pkg_1801dia_ff_75`, categoryId: 51, description: null },
    { id: 141, name: `3698 dia`, price: `140000`, callbackData: `pkg_3698dia_ff_14`, categoryId: 51, description: null },
    { id: 142, name: `60 beads`, price: `4500`, callbackData: `pkg_60b_wwm`, categoryId: 53, description: null },
    { id: 143, name: `180 beads`, price: `12500`, callbackData: `pkg_180b_wwm`, categoryId: 53, description: null },
    { id: 144, name: `300 beads`, price: `21000`, callbackData: `pkg_300b_wwm`, categoryId: 53, description: null },
    { id: 145, name: `600 beads`, price: `41000`, callbackData: `pkg_600b_wwm`, categoryId: 53, description: null },
    { id: 146, name: `900 beads`, price: `62000`, callbackData: `pkg_900b_wwm`, categoryId: 53, description: null },
    { id: 147, name: `1800 beads`, price: `125000`, callbackData: `pkg_1800b_wwm`, categoryId: 53, description: null },
    { id: 148, name: `3000 beads`, price: `205000`, callbackData: `pkg_3000b_wwm`, categoryId: 53, description: null },
    { id: 149, name: `Monthly pass`, price: `21,000`, callbackData: `pkg_mp_wwm`, categoryId: 52, description: null },
    { id: 150, name: `Elite battle pass `, price: `40800`, callbackData: `pkg_ebp_wwm`, categoryId: 52, description: null },
    { id: 151, name: `Premium battle pass`, price: `76000`, callbackData: `pkg_pbp_wwm`, categoryId: 52, description: null },
];


// Helper to simulate DB include
const getCategoriesWithAll = () => {
    return categories.map(c => ({
        ...c,
        subcategories: categories.filter(sub => sub.parentId === c.id),
        packages: packages.filter(p => p.categoryId === c.id)
    }));
};

const getPackagesWithCategory = () => {
    return packages.map(p => ({
        ...p,
        category: categories.find(c => c.id === p.categoryId)
    }));
};

// API Routes for Admin Panel (ReadOnly for now as data is static)
app.get('/api/categories', (req, res) => {
    res.json(getCategoriesWithAll());
});

app.post('/api/categories', (req, res) => {
    res.status(405).json({ error: "Cannot add categories in static mode" });
});

app.put('/api/categories/:id', (req, res) => {
    res.status(405).json({ error: "Cannot update categories in static mode" });
});

app.delete('/api/categories/:id', (req, res) => {
    res.status(405).json({ error: "Cannot delete categories in static mode" });
});

app.get('/api/packages', (req, res) => {
    res.json(getPackagesWithCategory());
});

app.post('/api/packages', (req, res) => {
    res.status(405).json({ error: "Cannot add packages in static mode" });
});

app.put('/api/packages/:id', (req, res) => {
    res.status(405).json({ error: "Cannot update packages in static mode" });
});

app.delete('/api/packages/:id', (req, res) => {
    res.status(405).json({ error: "Cannot delete packages in static mode" });
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
                const gamesCategory = categories.find(c => c.name === '🎮 ဂိမ်းများ (Games)');
                const subcats = categories.filter(c => c.parentId === gamesCategory.id);

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
                const catId = parseInt(callbackData.split('_')[1]);
                const category = categories.find(c => c.id === catId);

                if (category) {
                    // Attach relation data manually
                    category.subcategories = categories.filter(c => c.parentId === catId);
                    category.packages = packages.filter(p => p.categoryId === catId);

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
            // Handle Package Selections
            else if (callbackData.startsWith('pkg_')) {
                const pkg = packages.find(p => p.callbackData === callbackData);
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
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
