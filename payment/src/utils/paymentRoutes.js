const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Route pour créer un paiement
router.post('/payment', paymentController.createPayment);

// Route pour récupérer un paiement par son ID
router.get('/payment/:id', paymentController.getPaymentById);

// Route pour mettre à jour un paiement
router.put('/payment/:id', paymentController.updatePayment);

// Route pour supprimer un paiement
router.delete('/payment/:id', paymentController.deletePayment);

module.exports = router;