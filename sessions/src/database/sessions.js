const apiProducts = require("../utils/apiProducts");
const { findFreeAlley, modifyAlley } = require("./alleys");
const sessions = [];

let sessionNextId = 1;

const findSessionByQrCode = (qrCode) =>
  sessions.find((session) => session.qrCode === qrCode);

const getSessions = () => sessions;

const findSessionIndexById = (id) =>
  sessions.findIndex((session) => session.id === id);

const createSession = async (userId, parkId) => {
  const alley = findFreeAlley(parkId);
  if (!alley) return false;
  const bowlingSessionRes = await apiProducts.get(
    `/findBowlingByParkId?parkId=${parkId}`
  );
  if (!bowlingSessionRes.ok) return false;

  const bowlingSession = bowlingSessionRes.product;
  const session = {
    id: sessionNextId,
    ownerUserId: userId,
    users: [userId],
    parkId,
    cartTotal: bowlingSession.price,
    cartProductIds: [bowlingSession.id],
    cartRemaingAmount: bowlingSession.price,
    isStarted: false,
    qrCode: alley.qrCode,
  };
  sessionNextId++;
  sessions.push(session);
  modifyAlley(parkId, alley.alleyNb, true);
  return session;
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
