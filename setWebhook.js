const axios = require('axios');

const TELEGRAM_TOKEN = '8108896142:AAEO4138dMkokqTqDUIYxnUOmSwyrPkgmGI';
const WEBHOOK_URL = 'https://charming-subdivision-organisations-fine.trycloudflare.com/webhook';

axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook`, {
    url: WEBHOOK_URL
})
    .then(() => console.log('Webhook set successfully'))
    .catch(err => console.error(err.response?.data || err.message));
