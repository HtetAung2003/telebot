const { sequelize, Category, Package } = require('./db');

async function seed() {
    await sequelize.sync({ force: true });

    // Main Menus
    const games = await Category.create({ name: '🎮 ဂိမ်းများ (Games)' });
    const qanda = await Category.create({ name: '❓ သိလိုသည်များ (Q & A)' });
    const order = await Category.create({ name: '📦 အော်ဒါတင်ရန် (Order)' });
    const news = await Category.create({ name: '📰 နောက်ဆုံးရသတင်း (Latest News)' });

    // Sub-categories for Games
    const mlbb = await Category.create({ name: 'MLBB', parentId: games.id });
    const mlbb_sg = await Category.create({ name: 'MLBB 🇸🇬', parentId: games.id });
    const mlbb_csgg = await Category.create({ name: 'Magic Chess : GoGo', parentId: games.id });
    const pubg = await Category.create({ name: 'PUBG', parentId: games.id });
    const freefire = await Category.create({ name: 'Free Fire', parentId: games.id });
    const hok = await Category.create({ name: 'HOK', parentId: games.id });
    const sky = await Category.create({ name: 'Sky Children of the light', parentId: games.id });

    // MLBB Sub-categories
    const mlbb_double = await Category.create({ name: '💎 Double Diamond ဈေးနှုန်း', parentId: mlbb.id });
    const mlbb_normal = await Category.create({ name: '💎 ပုံမှန် ဈေးနှုန်း', parentId: mlbb.id });
    const mlbb_weekly = await Category.create({ name: '🎟️ Weekly Pass ဈေးနှုန်း', parentId: mlbb.id });
    const mlbb_twilight = await Category.create({ name: '🎟️ Twilight Pass ဈေးနှုန်း', parentId: mlbb.id });

    // MLBB Packages
    const mlbb_packages = [
        { name: 'Dia 50 + Bonus 50', price: '4,000 Ks', callbackData: 'pkg_50_50', categoryId: mlbb_double.id },
        { name: 'Dia 150 + Bonus 150', price: '10,000 Ks', callbackData: 'pkg_150_150', categoryId: mlbb_double.id },
        { name: 'Dia 250 + Bonus 250', price: '16,000 Ks', callbackData: 'pkg_250_250', categoryId: mlbb_double.id },
        { name: 'Dia 500 + Bonus 500', price: '35,000 Ks', callbackData: 'pkg_500_500', categoryId: mlbb_double.id },
        { name: '1 Weekly Pass', price: '6,000 Ks', callbackData: 'pkg_1wp', categoryId: mlbb_weekly.id },
        { name: '2 Weekly Pass', price: '12,000 Ks', callbackData: 'pkg_2wp', categoryId: mlbb_weekly.id },
        { name: '3 Weekly Pass', price: '18,000 Ks', callbackData: 'pkg_3wp', categoryId: mlbb_weekly.id },
        { name: '4 Weekly Pass', price: '24,000 Ks', callbackData: 'pkg_4wp', categoryId: mlbb_weekly.id },
        { name: '5 Weekly Pass', price: '30,000 Ks', callbackData: 'pkg_5wp', categoryId: mlbb_weekly.id },
        { name: 'Twilight Pass', price: '34,000 Ks', callbackData: 'pkg_tlp', categoryId: mlbb_twilight.id },
        { name: '11 Diamonds', price: '1,000 Ks', callbackData: 'pkg_11dia', categoryId: mlbb_normal.id },
        { name: '22 Diamonds', price: '2,000 Ks', callbackData: 'pkg_22dia', categoryId: mlbb_normal.id },
        { name: '33 Diamonds', price: '3,000 Ks', callbackData: 'pkg_33dia', categoryId: mlbb_normal.id },
        { name: '44 Diamonds', price: '4,000 Ks', callbackData: 'pkg_44dia', categoryId: mlbb_normal.id },
        { name: '86 Diamonds', price: '5,000 Ks', callbackData: 'pkg_86dia', categoryId: mlbb_normal.id },
        { name: '172 Diamonds', price: '10,000 Ks', callbackData: 'pkg_172dia', categoryId: mlbb_normal.id }
    ];

    for (const pkg of mlbb_packages) {
        await Package.create(pkg);
    }

    console.log('Database seeded with categories and MLBB packages!');
}

seed().catch(err => {
    console.error('Seeding failed:', err);
});
