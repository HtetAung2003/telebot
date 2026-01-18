const { sequelize, Category, Package } = require('./db');

async function seed() {
    await sequelize.sync({ force: true });

    // Main Menus
    const games = await Category.create({ name: '🎮 ဂိမ်းများ (Games)' });
    const qanda = await Category.create({
        name: '❓ သိလိုသည်များ (Q & A)',
        description: '🙋 သိလိုသမျှကို ဒီမှာ မေးမြန်းနိုင်ပါတယ်ရှင့်... Topic လေးတစ်ခု ရွေးပေးပါနော်။'
    });

    // Q&A Topics (Sub-categories)
    await Category.create({
        name: 'ဘယ်လို ဝယ်ရမလဲ?',
        parentId: qanda.id,
        description: `📝 **ဝယ်ယူပုံ အဆင့်ဆင့်:**
1. မိမိ ဝယ်လိုသော ဂိမ်းကို အရင်ရွေးပါ
2. လိုချင်တဲ့ Package ကို ရွေးချယ်ပါ
3. မိမိရဲ့ ID/Server ကို Admin ဆီသို့ ပေးပို့ပါ
4. ငွေလွှဲပိုင်လျှင် Gems များ ချက်ချင်း ရရှိမှာ ဖြစ်ပါတယ်ရှင့်!`
    });

    await Category.create({
        name: 'ငွေပေးချေမှု ပုံစံများ',
        parentId: qanda.id,
        description: `💳 **ငွေပေးချေနိုင်သော ပုံစံများ:**
- KBZPay
- WaveMoney
- AYA Pay`
    });

    await Category.create({
        name: 'Bot အခြေအနေ',
        parentId: qanda.id,
        description: '✅ Bot သည် လက်ရှိတွင် အဆင်သင့် ရှိနေပါတယ်ရှင့်!'
    });

    await Category.create({
        name: 'Admin နှင့် ဆက်သွယ်ရန်',
        parentId: qanda.id,
        description: '👨‍💻 Admin နှင့် တိုက်ရိုက် စကားပြောရန်: @Qimiishere'
    });

    const order = await Category.create({
        name: '📦 အော်ဒါတင်ရန် (Order)',
        description: '📦 **အော်ဒါတင်ရန်**\n\nမိမိ ကစားလိုသော ဂိမ်းကို "Games" menu မှတဆင့် ရွေးချယ်၍ အော်ဒါတင်နိုင်ပါတယ်ရှင်။\n\nသို့မဟုတ် အောက်ပါ ဂိမ်းများမှ တိုက်ရိုက် ရွေးချယ်နိုင်ပါတယ် 👇'
    });
    const news = await Category.create({ name: '📰 နောက်ဆုံးရသတင်း (Latest News)' });

    // ==========================================
    // 1. MLBB Global
    // ==========================================
    const mlbb = await Category.create({ name: 'MLBB Global', parentId: games.id });

    // MLBB Global Sub-categories
    const mlbb_double = await Category.create({
        name: '💎 Double Diamond ဈေးနှုန်း',
        parentId: mlbb.id,
        description: `💎 **Double Diamond ဈေးနှုန်းများ** 💎
တစ်နှစ်မှတစ်ခါရမယ့် Double Bonus ဈေးနှုန်းလေးတွေ လာပါပြီရှင့်! 💎✨
                  
📋 Price List:
🌟 50 + 50 Bonus = 4,500 Ks 
🌟 150 + 150 Bonus = 12,500 Ks 
🌟 250 + 250 Bonus = 20,000 Ks 
🌟 500 + 500 Bonus = 40,000 Ks
2ဆ ကတစ်ကြိမ်ဘဲရပါမယ်ရှင်!`
    });

    const mlbb_weekly = await Category.create({
        name: '🎟️ Weekly Pass ဈေးနှုန်း',
        parentId: mlbb.id,
        description: `ဈေးအသက်သာဆုံးနဲ့ Diamond အများဆုံးရမယ့် Weekly Pass လေးတွေ ရပါပြီရှင့်! 💎✨ 
🎫 Price List:
• 1 Weekly Pass = 6,000 Ks 
• 2 Weekly Pass = 12,000 Ks (14 Days) 
• 3 Weekly Pass = 18,000 Ks (21 Days) 
• 4 Weekly Pass = 24,000 Ks (28 Days)
• 5 Weekly Pass = 30,000 Ks (35 Days)
💡 Why buy this? (ဘာလိုတန်လဲ): Weekly Pass တစ်ပတ်ဝယ်ရုံနဲ့ Total 220 Diamonds အပြင် 1 day ကို COA, Starlight fragments, Rare fragment ,... တွေပါဝင်တဲ့ 1 box ကို ရမှာနော်! အရမ်းတန်... 😉`
    });

    const mlbb_twilight = await Category.create({
        name: '🎟️ Twilight Pass ဈေးနှုန်း',
        parentId: mlbb.id,
        description: `Miya ရဲ့ Exclusive "Suzuhime" Skin ကို ချက်ချင်းလိုချင်ရင် Twilight Pass သာ ဝယ်လိုက်တော့နော်! 🏹💜 
🏷 Price: ✨ Twilight Pass = 34,000 Ks

🎁 ဘာတွေရမလဲ? 
• 💎 200 Diamonds (Instant) 
• 👗 Exclusive "Suzuhime" Skin (Permanent) 
• 🎟 Tickets & Star Protection Card များစွာ!`
    });

    const mlbb_latest = await Category.create({ name: '💎 ပုံမှန် ဈေးနှုန်း (Latest)', parentId: mlbb.id });

    // Latest Sub-cats
    const mlbb_latest_best = await Category.create({
        name: '🔥 Best Sellers',
        parentId: mlbb_latest.id,
        description: `🔥 Best Sellers
🎫 Price List:
💎 86 Dia = 5,000 Ks 
💎 172 Dia = 10,000 Ks`
    });
    const mlbb_latest_small = await Category.create({
        name: 'Small (< 10k)',
        parentId: mlbb_latest.id,
        description: `11 Dia = 1,000 Ks 
22 Dia = 2,000 Ks 
33 Dia = 3,000 Ks 
44 Dia = 4,000 Ks
86 Dia = 5,000 Ks
172 Dia = 10,000 Ks`
    });
    const mlbb_latest_medium = await Category.create({
        name: 'Medium (< 30k)',
        parentId: mlbb_latest.id,
        description: `257 Dia = 15,500 Ks ⚠️ (Note: Recharge 250 Mission မပြည့်ပါ)
343 Dia = 20,000 Ks 
429 Dia = 25,000 Ks
514 Dia = 30,000 Ks ⚠️ (Note: Recharge 500 Mission မပြည့်ပါ)`
    });
    const mlbb_latest_large = await Category.create({
        name: 'Large Diamonds',
        parentId: mlbb_latest.id,
        description: `600 Dia = 35,000 Ks 
706 Dia = 40,000 Ks 
878 Dia = 55,000 Ks 
1050 Dia = 60,000 Ks`
    });
    const mlbb_latest_big = await Category.create({
        name: '👑 Big Spenders',
        parentId: mlbb_latest.id,
        description: `1135 Dia = 65,000 Ks 
1220 Dia = 70,000 Ks 
1412 Dia = 80,000 Ks 
1584 Dia = 85,000 Ks 
1842 Dia = 103,000 Ks 
2195 Dia = 120,000 Ks 
3688 Dia = 203,000 Ks`
    });

    // ==========================================
    // 2. MLBB Singapore (SG)
    // ==========================================
    const mlbb_sg = await Category.create({ name: 'MLBB 🇸🇬 Singapore', parentId: games.id });

    const mlbb_sg_double = await Category.create({
        name: '💎 Double Diamond ဈေးနှုန်း',
        parentId: mlbb_sg.id,
        description: `💎 **Double Diamond ဈေးနှုန်းများ (SG)** 💎
        
🌟 50 + 50 Bonus = 4,500 Ks 
🌟 150 + 150 Bonus = 12,500 Ks 
🌟 250 + 250 Bonus = 20,000 Ks 
🌟 500 + 500 Bonus = 40,000 Ks`
    });

    const mlbb_sg_weekly = await Category.create({
        name: '🎟️ Weekly Pass ဈေးနှုန်း',
        parentId: mlbb_sg.id,
        description: `💎 **Weekly Pass (SG)** 💎
• 1 Weekly Pass = 9,000 Ks 
• 2 Weekly Pass = 18,000 Ks (14 Days) 
• 3 Weekly Pass = 27,000 Ks (21 Days) 
• 4 Weekly Pass = 36,000 Ks (28 Days)
• 5 Weekly Pass = 45,000 Ks (35 Days)`
    });

    const mlbb_sg_latest = await Category.create({ name: '💎 ပုံမှန် ဈေးနှုန်း', parentId: mlbb_sg.id });
    // SG Latest Subcats
    const mlbb_sg_best = await Category.create({ name: 'Best Selected', parentId: mlbb_sg_latest.id });
    const mlbb_sg_small = await Category.create({ name: 'Small (< 10k)', parentId: mlbb_sg_latest.id });
    const mlbb_sg_medium = await Category.create({ name: 'Medium (< 30k)', parentId: mlbb_sg_latest.id });
    const mlbb_sg_large = await Category.create({ name: 'Large', parentId: mlbb_sg_latest.id });
    const mlbb_sg_big = await Category.create({ name: 'Big Spenders', parentId: mlbb_sg_latest.id });

    // ==========================================
    // 3. Magic Chess (CSGG)
    // ==========================================
    const csgg = await Category.create({ name: 'Magic Chess : GoGo', parentId: games.id });

    const csgg_double = await Category.create({
        name: '💎 Double Diamond',
        parentId: csgg.id,
        description: `🌟Dia 50+bonus 50 - 3300ks 
🌟Dia 150+ bonus 150-10000ks 
🌟Dia 250+ bonus 250 -16500ks
🌟Dia 500+ bonus 500- 32000 Ks`
    });

    const csgg_weekly = await Category.create({
        name: '🎟️ Weekly Pass',
        parentId: csgg.id,
        description: `• 1 Weekly Pass = 7,000 Ks 
• 2 Weekly Pass = 14,000 Ks
• 3 Weekly Pass = 21,000 Ks
• 4 Weekly Pass = 28,000 Ks
• 5 Weekly Pass = 35,000 Ks`
    });

    const csgg_latest = await Category.create({ name: '💎 Latest Price', parentId: csgg.id });
    const csgg_best = await Category.create({ name: 'Best Seller', parentId: csgg_latest.id });
    const csgg_small = await Category.create({ name: 'Small', parentId: csgg_latest.id });
    const csgg_medium = await Category.create({ name: 'Medium', parentId: csgg_latest.id });
    const csgg_large = await Category.create({ name: 'Large', parentId: csgg_latest.id });
    const csgg_big = await Category.create({ name: 'Big Spenders', parentId: csgg_latest.id });


    // ==========================================
    // PACKAGES
    // ==========================================
    const packages = [
        // MLBB Global Double
        { name: 'Dia 50 + 50', price: '4,500 Ks', callbackData: 'pkg_50_50', categoryId: mlbb_double.id },
        { name: 'Dia 150 + 150', price: '12,500 Ks', callbackData: 'pkg_150_150', categoryId: mlbb_double.id },
        { name: 'Dia 250 + 250', price: '20,000 Ks', callbackData: 'pkg_250_250', categoryId: mlbb_double.id },
        { name: 'Dia 500 + 500', price: '40,000 Ks', callbackData: 'pkg_500_500', categoryId: mlbb_double.id },

        // MLBB Global Weekly
        { name: '1 Weekly Pass', price: '6,000 Ks', callbackData: 'pkg_1wp', categoryId: mlbb_weekly.id },
        { name: '2 Weekly Pass', price: '12,000 Ks', callbackData: 'pkg_2wp', categoryId: mlbb_weekly.id },
        { name: '3 Weekly Pass', price: '18,000 Ks', callbackData: 'pkg_3wp', categoryId: mlbb_weekly.id },
        { name: '4 Weekly Pass', price: '24,000 Ks', callbackData: 'pkg_4wp', categoryId: mlbb_weekly.id },
        { name: '5 Weekly Pass', price: '30,000 Ks', callbackData: 'pkg_5wp', categoryId: mlbb_weekly.id },

        // MLBB Twilight
        { name: 'Twilight Pass', price: '34,000 Ks', callbackData: 'pkg_tlp', categoryId: mlbb_twilight.id },

        // MLBB Best Sellers
        { name: '86 Dia', price: '5,000 Ks', callbackData: 'pkg_86dia', categoryId: mlbb_latest_best.id },
        { name: '172 Dia', price: '10,000 Ks', callbackData: 'pkg_172dia', categoryId: mlbb_latest_best.id },

        // MLBB Small
        { name: '11 Dia', price: '1,000 Ks', callbackData: 'pkg_11dia', categoryId: mlbb_latest_small.id },
        { name: '22 Dia', price: '2,000 Ks', callbackData: 'pkg_22dia', categoryId: mlbb_latest_small.id },
        { name: '33 Dia', price: '3,000 Ks', callbackData: 'pkg_33dia', categoryId: mlbb_latest_small.id },
        { name: '44 Dia', price: '4,000 Ks', callbackData: 'pkg_44dia', categoryId: mlbb_latest_small.id },
        { name: '86 Dia', price: '5,000 Ks', callbackData: 'pkg_86dia_dup', categoryId: mlbb_latest_small.id },
        { name: '172 Dia', price: '10,000 Ks', callbackData: 'pkg_172dia_dup', categoryId: mlbb_latest_small.id },

        // MLBB Medium
        { name: '257 Dia', price: '15,500 Ks', callbackData: 'pkg_257dia', categoryId: mlbb_latest_medium.id },
        { name: '343 Dia', price: '20,000 Ks', callbackData: 'pkg_343dia', categoryId: mlbb_latest_medium.id },
        { name: '429 Dia', price: '25,000 Ks', callbackData: 'pkg_429dia', categoryId: mlbb_latest_medium.id },
        { name: '514 Dia', price: '30,000 Ks', callbackData: 'pkg_514dia', categoryId: mlbb_latest_medium.id },

        // MLBB Large
        { name: '600 Dia', price: '35,000 Ks', callbackData: 'pkg_600dia', categoryId: mlbb_latest_large.id },
        { name: '706 Dia', price: '40,000 Ks', callbackData: 'pkg_706dia', categoryId: mlbb_latest_large.id },
        { name: '878 Dia', price: '55,000 Ks', callbackData: 'pkg_878dia', categoryId: mlbb_latest_large.id },
        { name: '1050 Dia', price: '60,000 Ks', callbackData: 'pkg_1050dia', categoryId: mlbb_latest_large.id },

        // MLBB Big Spenders
        { name: '1135 Dia', price: '65,000 Ks', callbackData: 'pkg_1135dia', categoryId: mlbb_latest_big.id },
        { name: '1220 Dia', price: '70,000 Ks', callbackData: 'pkg_1220dia', categoryId: mlbb_latest_big.id },
        { name: '1412 Dia', price: '80,000 Ks', callbackData: 'pkg_1412dia', categoryId: mlbb_latest_big.id },
        { name: '1584 Dia', price: '85,000 Ks', callbackData: 'pkg_1584dia', categoryId: mlbb_latest_big.id },
        { name: '1842 Dia', price: '103,000 Ks', callbackData: 'pkg_1842dia', categoryId: mlbb_latest_big.id },
        { name: '2195 Dia', price: '120,000 Ks', callbackData: 'pkg_2195dia', categoryId: mlbb_latest_big.id },
        { name: '3688 Dia', price: '203,000 Ks', callbackData: 'pkg_3688dia', categoryId: mlbb_latest_big.id },

        // MLBB SG Double
        { name: 'Dia 50+50', price: '4,500 Ks', callbackData: 'pkg_50_50_sg', categoryId: mlbb_sg_double.id },
        { name: 'Dia 150+150', price: '12,500 Ks', callbackData: 'pkg_150_150_sg', categoryId: mlbb_sg_double.id },
        { name: 'Dia 250+250', price: '20,000 Ks', callbackData: 'pkg_250_250_sg', categoryId: mlbb_sg_double.id },
        { name: 'Dia 500+500', price: '40,000 Ks', callbackData: 'pkg_500_500_sg', categoryId: mlbb_sg_double.id },

        // MLBB SG Weekly
        { name: '1 Weekly Pass', price: '9,000 Ks', callbackData: 'pkg_1wp_sg', categoryId: mlbb_sg_weekly.id },
        { name: '2 Weekly Pass', price: '18,000 Ks', callbackData: 'pkg_2wp_sg', categoryId: mlbb_sg_weekly.id },
        { name: '3 Weekly Pass', price: '27,000 Ks', callbackData: 'pkg_3wp_sg', categoryId: mlbb_sg_weekly.id },
        { name: '4 Weekly Pass', price: '36,000 Ks', callbackData: 'pkg_4wp_sg', categoryId: mlbb_sg_weekly.id },
        { name: '5 Weekly Pass', price: '45,000 Ks', callbackData: 'pkg_5wp_sg', categoryId: mlbb_sg_weekly.id },

        // MLBB SG Latest
        { name: '70 Dia', price: '5,500 Ks', callbackData: 'pkg_70dia_sg', categoryId: mlbb_sg_best.id },
        { name: '140 Dia', price: '11,000 Ks', callbackData: 'pkg_140dia_sg', categoryId: mlbb_sg_best.id },
        { name: '210 Dia', price: '16,500 Ks', callbackData: 'pkg_210dia_sg', categoryId: mlbb_sg_best.id },

        { name: '14 Dia', price: '1,300 Ks', callbackData: 'pkg_14dia_sg', categoryId: mlbb_sg_small.id },
        { name: '28 Dia', price: '2,300 Ks', callbackData: 'pkg_28dia_sg', categoryId: mlbb_sg_small.id },
        { name: '42 Dia', price: '3,400 Ks', callbackData: 'pkg_42dia_sg', categoryId: mlbb_sg_small.id },
        { name: '70 Dia', price: '5,500 Ks', callbackData: 'pkg_70dia_sg_dup', categoryId: mlbb_sg_small.id },
        { name: '140 Dia', price: '11,000 Ks', callbackData: 'pkg_140dia_sg_dup', categoryId: mlbb_sg_small.id },

        { name: '210 Dia', price: '16,500 Ks', callbackData: 'pkg_210dia_sg_dup', categoryId: mlbb_sg_medium.id },
        { name: '284 Dia', price: '22,000 Ks', callbackData: 'pkg_284dia_sg', categoryId: mlbb_sg_medium.id },
        { name: '355 Dia', price: '27,300 Ks', callbackData: 'pkg_355dia_sg', categoryId: mlbb_sg_medium.id },

        { name: '429 Dia', price: '32,500 Ks', callbackData: 'pkg_429dia_sg', categoryId: mlbb_sg_large.id },
        { name: '513 Dia', price: '39,000 Ks', callbackData: 'pkg_513dia_sg', categoryId: mlbb_sg_large.id },
        { name: '639 Dia', price: '49,000 Ks', callbackData: 'pkg_639dia_sg', categoryId: mlbb_sg_large.id },
        { name: '716 Dia', price: '54,000 Ks', callbackData: 'pkg_716dia_sg', categoryId: mlbb_sg_large.id },

        { name: '870 Dia', price: '66,500 Ks', callbackData: 'pkg_870dia_sg', categoryId: mlbb_sg_big.id },
        { name: '1145 Dia', price: '87,000 Ks', callbackData: 'pkg_1145dia_sg', categoryId: mlbb_sg_big.id },
        { name: '1285 Dia', price: '98,000 Ks', callbackData: 'pkg_1285dia_sg', categoryId: mlbb_sg_big.id },
        { name: '1446 Dia', price: '109,000 Ks', callbackData: 'pkg_1446dia_sg', categoryId: mlbb_sg_big.id },
        { name: '1656 Dia', price: '125,000 Ks', callbackData: 'pkg_1656dia_sg', categoryId: mlbb_sg_big.id },
        { name: '1875 Dia', price: '140,000 Ks', callbackData: 'pkg_1875dia_sg', categoryId: mlbb_sg_big.id },
        { name: '2162 Dia', price: '163,000 Ks', callbackData: 'pkg_2162dia_sg', categoryId: mlbb_sg_big.id },
        { name: '2976 Dia', price: '215,000 Ks', callbackData: 'pkg_2976dia_sg', categoryId: mlbb_sg_big.id },
        { name: '3692 Dia', price: '273,000 Ks', callbackData: 'pkg_3692dia_sg', categoryId: mlbb_sg_big.id },
        { name: '4562 Dia', price: '335,000 Ks', callbackData: 'pkg_4562dia_sg', categoryId: mlbb_sg_big.id },
        { name: '5567 Dia', price: '410,000 Ks', callbackData: 'pkg_5567dia_sg', categoryId: mlbb_sg_big.id },

        // Magic Chess
        { name: 'Dia 50 + 50', price: '3,300 Ks', callbackData: 'pkg_50_50_csgg', categoryId: csgg_double.id },
        { name: 'Dia 150 + 150', price: '10,000 Ks', callbackData: 'pkg_150_150_csgg', categoryId: csgg_double.id },
        { name: 'Dia 250 + 250', price: '16,500 Ks', callbackData: 'pkg_250_250_csgg', categoryId: csgg_double.id },
        { name: 'Dia 500 + 500', price: '32,000 Ks', callbackData: 'pkg_500_500_csgg', categoryId: csgg_double.id },

        { name: '1 Weekly Pass', price: '7,000 Ks', callbackData: 'pkg_1wp_csgg', categoryId: csgg_weekly.id },
        { name: '2 Weekly Pass', price: '14,000 Ks', callbackData: 'pkg_2wp_csgg', categoryId: csgg_weekly.id },
        { name: '3 Weekly Pass', price: '21,000 Ks', callbackData: 'pkg_3wp_csgg', categoryId: csgg_weekly.id },
        { name: '4 Weekly Pass', price: '28,000 Ks', callbackData: 'pkg_4wp_csgg', categoryId: csgg_weekly.id },
        { name: '5 Weekly Pass', price: '35,000 Ks', callbackData: 'pkg_5wp_csgg', categoryId: csgg_weekly.id },

        { name: '172 Dia', price: '10,400 Ks', callbackData: 'pkg_172dia_csgg', categoryId: csgg_best.id },
        { name: '344 Dia', price: '20,800 Ks', callbackData: 'pkg_344dia_csgg', categoryId: csgg_best.id },

        { name: '86 Dia', price: '5,200 Ks', callbackData: 'pkg_86dia_csgg', categoryId: csgg_small.id },
        { name: '172 Dia', price: '10,400 Ks', callbackData: 'pkg_172dia_csgg_dup', categoryId: csgg_small.id },

        { name: '257 Dia', price: '15,500 Ks', callbackData: 'pkg_257dia_csgg', categoryId: csgg_medium.id },
        { name: '344 Dia', price: '20,800 Ks', callbackData: 'pkg_344dia_csgg_dup', categoryId: csgg_medium.id },

        { name: '514 Dia', price: '30,800 Ks', callbackData: 'pkg_514dia_csgg', categoryId: csgg_large.id },
        { name: '706 Dia', price: '41,500 Ks', callbackData: 'pkg_706dia_csgg', categoryId: csgg_large.id },

        { name: '1346 Dia', price: '75,000 Ks', callbackData: 'pkg_1346dia_csgg', categoryId: csgg_big.id },
        { name: '1825 Dia', price: '100,500 Ks', callbackData: 'pkg_1825dia_csgg', categoryId: csgg_big.id },
        { name: '2195 Dia', price: '120,500 Ks', callbackData: 'pkg_2195dia_csgg', categoryId: csgg_big.id },
        { name: '3688 Dia', price: '200,500 Ks', callbackData: 'pkg_3688dia_csgg', categoryId: csgg_big.id },
    ];

    for (const pkg of packages) {
        await Package.create(pkg);
    }

    console.log('Database seeded with ALL categories and packages (Global, SG, Magic Chess)!');
}

seed().catch(err => {
    console.error('Seeding failed:', err);
});
