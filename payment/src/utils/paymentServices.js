const stripe = require('stripe');
const emailService = require('./emailService');

// Importez les dépendances nécessaires

// Initialisez l'API de Stripe avec votre clé secrète
const stripeAPI = stripe(sk_test_51OqGBYIExhJxyN9wSxyKrlIXKgD8dMoBF23qN7snHz7zrDfy05XkTrDWSkXV05Sq79gLegwsh3pwJAVtmijWwtrU00DjQpxhLf);

// Fonction pour effectuer un paiement
async function processPayment(paymentDetails) {
    try {
        // Effectuez le paiement en utilisant l'API de Stripe
        const paymentIntent = await stripeAPI.paymentIntents.create({
            amount: paymentDetails.amount,
            currency: paymentDetails.currency,
            payment_method: paymentDetails.paymentMethod,
            confirm: true,
        });

        // Envoyez un reçu par e-mail au client
        emailService.sendReceipt(paymentDetails.email, paymentIntent.id);

        // Retournez les détails du paiement
        return {
            success: true,
            paymentId: paymentIntent.id,
        };
    } catch (error) {
        // Gérez les erreurs de paiement
        console.error('Erreur de paiement :', error);
        return {
            success: false,
            error: error.message,
        };
    }
}

// Exportez les fonctions nécessaires
module.exports = {
    processPayment,
};