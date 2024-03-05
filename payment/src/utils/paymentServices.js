const stripe = require('stripe');
const apiSessions = require("../utils/apiSessions");
const apiOrders = require("../utils/apiOrders");

const pay = async (email, amount) => {
    const paymentDetails = {
        amount: amount,
        currency: "usd",
        email: email,
    };
    const result = await processPayment(paymentDetails);
    return result
}

const createEmailReceipt = (email) => {
    const result = {
        email: email,
        invoice: "content",
    };
    return result
}

const payForHimself = async (userId, email) => {
    try {
        const session = await apiSessions.get(`/session/user/${userId}`);
        const orders = await apiOrders.get(`/orders/user/finished/${userId}`); 
        let priceToBePaid = 0;
        orders.forEach(order => {
            priceToBePaid += order.totalPrice;
        });
        const resultPayment = await pay(email, priceToBePaid);
        const body = {
            sessionId: session.id,
            amount: session.totalPrice - priceToBePaid
        }
        const result = await apiSessions.post(`/updatePrice`, body);
        if (result.session.totalPrice == 0) await apiSessions.remove(`/session/${result.session.id}`)
        return { message: "Orders paid", ok: true, payment: resultPayment, session: result, email: createEmailReceipt(email)};
    } catch (error) {
        console.log(error)
        return {
            error: "Internal server error during payment",
            ok: false,
        };
    }
};

const payForGroup = async (userId, email) => {
    try {
        const session = await apiSessions.get(`/session/user/${userId}`);
        const resultPayment = await pay(email, session.totalPrice);
        const body = {
            sessionId: session.id,
            amount: 0
        }
        const result = await apiSessions.post(`/updatePrice`, body); 
        if (result.session.totalPrice == 0) await apiSessions.remove(`/session/${result.session.id}`)
        return { message: "Session paid", ok: true, payment: resultPayment, session: result, email: createEmailReceipt(email) };
    } catch (error) {
        console.log(error)
        return {
            error: "Internal server error during payment",
            ok: false,
        };
    }
};

const payAmount = async (userId, email, amount) => {
    try {
        const session = await apiSessions.get(`/session/user/${userId}`);
        const resultPayment = await pay(email, amount);
        const body = {
            sessionId: session.id,
            amount: session.totalPrice - amount
        }
        const result = await apiSessions.post(`/updatePrice`, body);
        if (result.session.totalPrice == 0) await apiSessions.remove(`/session/${result.session.id}`)
        return { message: `${amount} paid`, ok: true, payment: resultPayment, session: result, email: createEmailReceipt(email)};
    } catch (error) {
        console.log(error)
        return {
            error: "Internal server error during payment",
            ok: false,
        };
    }
};

const setAmountManually = async (sessionId, amount) => {
    try {
        const body = {
            sessionId: sessionId,
            amount: amount
        }
        const result = await apiSessions.post(`/updatePrice`, body);
        if (result.session.totalPrice == 0) await apiSessions.remove(`/session/${result.session.id}`)
        return { message: `${amount} paid`, ok: true, session: result};
    } catch (error) {
        console.log(error)
        return {
            error: "Internal server error during payment",
            ok: false,
        };
    }
}

// Initialisez l'API de Stripe avec votre clé secrète
const stripeAPI = stripe("sk_test_51OqGBYIExhJxyN9wSxyKrlIXKgD8dMoBF23qN7snHz7zrDfy05XkTrDWSkXV05Sq79gLegwsh3pwJAVtmijWwtrU00DjQpxhLf");

// Fonction pour effectuer un paiement
async function processPayment(paymentDetails) {
    try {
        // Effectuez le paiement en utilisant l'API de Stripe
        const paymentIntent = await stripeAPI.paymentIntents.create({
            amount: paymentDetails.amount*100,
            currency: paymentDetails.currency,
            confirm: false
        });

        // Retournez les détails du paiement
        return {
            ok: true,
            payment: paymentIntent,
        };
    } catch (error) {
        // Gérez les erreurs de paiement
        console.error('Erreur de paiement :', error);
        return {
            ok: false,
            error: error.message,
        };
    }
}

// Exportez les fonctions nécessaires
module.exports = {
    processPayment,
    payForHimself,
    payForGroup,
    payAmount,
    setAmountManually
};