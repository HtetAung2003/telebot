const axios = require('axios');

const TELEGRAM_TOKEN = '8108896142:AAEO4138dMkokqTqDUIYxnUOmSwyrPkgmGI';
const WEBHOOK_URL = 'https://impressed-benefits-cement-arabic.trycloudflare.com/webhook';

axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook`, {
    url: WEBHOOK_URL
})
    .then(() => console.log('Webhook set successfully'))
    //  cloudflared tunnel --url http://localhost:3000
    .catch(err => console.error(err.response?.data || err.message));
// please  add callback data  in startsWith(pkg_) forbig_spen_price , large_dia_price ,medium_dia_price and small_dia_dia_price