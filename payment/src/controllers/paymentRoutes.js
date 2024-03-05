const express = require('express');
const passport = require("passport");
const {
    payForHimself,
    payForGroup,
    payAmount,
    setAmountManually
  } = require("../utils/paymentServices.js");

const router = express.Router();

router.post(
    "/payForHimself",
    passport.authenticate("customer", { session: false }),
    async (req, res) => {
        const userId = req.user.id;
        const email = req.body.email
        if (!email)
            return res.status(400).json({ error: "Email is required", ok: false });
        const result = await payForHimself(userId, email);
        if (result.error) return res.status(400).json(result);
        else res.status(200).json(result)
    }
);

router.post(
    "/payForGroup",
    passport.authenticate("customer", { session: false }),
    async (req, res) => {
        const userId = req.user.id;
        const email = req.body.email
        if (!email)
            return res.status(400).json({ error: "Email is required", ok: false });
        const result = await payForGroup(userId, email);
        if (result.error) return res.status(400).json(result);
        else res.status(200).json(result)
    }
);

router.post(
    "/payAmount",
    passport.authenticate("customer", { session: false }),
    async (req, res) => {
        const userId = req.user.id;
        const amount = parseInt(req.body.amount);
        if (!amount)
            return res.status(400).json({ error: "Amount is required", ok: false });
        const email = req.body.email
        if (!email)
            return res.status(400).json({ error: "Email is required", ok: false });
        const result = await payAmount(userId, email, amount);
        if (result.error) return res.status(400).json(result);
        else res.status(200).json(result)
    }
);

router.post(
    "/setAmountManually",
    passport.authenticate("agent", { session: false }),
    async (req, res) => {
        const amount = parseInt(req.body.amount);
        if (amount == undefined)
            return res.status(400).json({ error: "Amount is required", ok: false });
        const sessionId = parseInt(req.body.sessionId);
        if (!sessionId)
            return res.status(400).json({ error: "Session ID is required", ok: false });
        const result = await setAmountManually(sessionId, amount);
        if (result.error) return res.status(400).json(result);
        else res.status(200).json(result)
    }
);

module.exports = router;