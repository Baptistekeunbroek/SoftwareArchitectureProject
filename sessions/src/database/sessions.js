const { findAvailableAlley, modifyAlley } = require("./alleys");
const apiProducts = require("../utils/apiProducts");
const sessions = [];

let sessionNextId = 1;

const findSessionByQrCode = (qrCode) =>
  sessions.find((session) => session.qrCode === qrCode);

const getSessions = () => sessions;

const findSessionIndexById = (id) =>
  sessions.findIndex((session) => session.id === id);
const createSession = async (userId, parkId) => {
  // First, find an available alley for the given parkId.
  const alley = findAvailableAlley(parkId);
  if (!alley) {
    console.error(`No available alley found for parkId: ${parkId}`);
    return { error: "No free alley available", ok: false };
  }

  try {
    // Make the API call to get bowling session details.
    const bowlingSessionRes = await apiProducts.get(
      `/findBowlingByParkId?parkId=${parkId}`
    );

    // Check if the API call was successful and the response is OK.
    if (!bowlingSessionRes.ok || !bowlingSessionRes.product) {
      console.error(
        `API call to findBowlingByParkId failed for parkId: ${parkId}`
      );
      return { error: "Error fetching bowling session details", ok: false };
    }

    const bowlingSession = bowlingSessionRes.product;

    // Create the session object.
    const session = {
      id: sessionNextId++,
      ownerUserId: userId,
      users: [userId],
      parkId,
      cartTotal: bowlingSession.price,
      cartProductIds: [bowlingSession.id],
      cartRemainingAmount: bowlingSession.price,
      isStarted: false,
      qrCode: alley.qrCode,
    };

    // Add the session to the sessions array.
    sessions.push(session);

    // Mark the alley as in use.
    modifyAlley(parkId, alley.alleyNb, true);

    // Return the successfully created session.
    return { ok: true, session };
  } catch (error) {
    console.error(
      `Error creating session for userId: ${userId}, parkId: ${parkId}`,
      error
    );
    return {
      error: "Internal server error during session creation",
      ok: false,
    };
  }
};

const joinSession = async (qrCode, userId, parkId) => {
  const session = findSessionByQrCode(qrCode);
  if (!session) return false;
  if (session.users.includes(userId)) return false;
  const bowlingSessionRes = await apiProducts.get(
    `/findBowlingByParkId?parkId=${parkId}`
  );
  if (!bowlingSessionRes.ok) return false;

  const bowlingSession = bowlingSessionRes.product;
  const newSession = {
    ...session,
    cartTotal: session.cartTotal + bowlingSession.price,
    cartRemaingAmount: session.cartRemaingAmount + bowlingSession.price,
    cartProductIds: [...session.cartProductIds, bowlingSession.id],
    users: [...session.users, userId],
  };
  sessions[findSessionIndexById(session.id)] = newSession;
  return newSession;
};

const sessionPayment = (qrCode, userId, amount) => {
  const session = findSessionByQrCode(qrCode);
  if (!session) return { message: "Session not found", ok: false };
  if (!session.users.includes(userId))
    return { message: "User not found", ok: false };
  if (amount > session.cartRemaingAmount)
    return { message: "Amount is too high", ok: false };
  const newSession = {
    ...session,
    cartRemaingAmount: session.cartRemaingAmount - amount,
    isStarted: session.cartRemaingAmount - amount === 0,
  };
  sessions[findSessionIndexById(session.id)] = newSession;
  return { message: "Payment done", ok: true, session: newSession };
};

const orderProduct = async (qrCode, userId, productId) => {
  const session = findSessionByQrCode(qrCode);
  if (!session) return false;
  if (!session.users.includes(userId)) return false;
  const productRes = await apiProducts.get(
    `/findProductByIdAndParkId?parkId=${session.parkId}&productId=${productId}`
  );
  if (!productRes.ok) return false;

  const product = productRes.product;
  const newSession = {
    ...session,
    cartTotal: session.cartTotal + product.price,
    cartRemaingAmount: session.cartRemaingAmount + product.price,
    cartProductIds: [...session.cartProductIds, product.id],
  };
  sessions[findSessionIndexById(session.id)] = newSession;
  return newSession;
};

const deleteSession = (id) => {
  const orderIndex = sessions.findIndex((session) => session.id === id);
  sessions.splice(orderIndex, 1);
};

module.exports = {
  findSessionByQrCode,
  createSession,
  deleteSession,
  joinSession,
  sessionPayment,
  orderProduct,
  getSessions,
};
