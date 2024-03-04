const stripe = require('stripe');

// Configurez votre clé d'API Stripe ici
const stripeApiKey = sk_test_51OqGBYIExhJxyN9wSxyKrlIXKgD8dMoBF23qN7snHz7zrDfy05XkTrDWSkXV05Sq79gLegwsh3pwJAVtmijWwtrU00DjQpxhLf;

// Initialisez la bibliothèque Stripe avec votre clé d'API
const stripeInstance = stripe(stripeApiKey);

module.exports = stripeInstance;