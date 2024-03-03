const { findAvailableAlley, modifyAlley } = require("./alleys");
const apiProducts = require("../utils/apiProducts");
const sessions = [];

let sessionNextId = 1;

const getSessions = () => sessions;

const getSessionsByParkId = (parkId) => 
  sessions.filter((session) => session.parkId === parkId);

const findSessionByQrCode = (qrCode) =>
  sessions.find((session) => session.qrCode === qrCode);

const findSessionByUserId = (userId) =>
  sessions.find((session) => session.users.includes(userId));

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
    // Create the session object.
    const session = {
      id: sessionNextId++,
      ownerUserId: userId,
      users: [userId],
      parkId,
      alleyNb: alley.alleyNb,
      qrCode: alley.qrCode,
      orders: []
    };

    // Add the session to the sessions array.
    sessions.push(session);

    // Mark the alley as in use.
    modifyAlley(parkId, alley.alleyNb, true);

    // Return the successfully created session.
    return { session };
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

const joinSession = async (qrCode, userId) => {
  const session = findSessionByQrCode(qrCode);
  if (!session) return { error: "Session not found", ok: false };
  if (session.users.includes(userId)) return { error: "User already in session", ok: false };

  session.users.push(userId);
  return session;
};

const leaveSession = async (qrCode, userId) => {
  const session = findSessionByQrCode(qrCode);
  if (!session) return { error: "Session not found", ok: false };
  if (session.ownerUserId == userId) return { error: "Owner can't leave", ok: false };
  if (!session.users.includes(userId)) return { error: "User not in session", ok: false };
  const index = session.users.indexOf(userId);
  if (index > -1) { // only splice array when item is found
    session.users.splice(index, 1); 
  }
  return session;
};

const deleteSession = (id) => {
  const orderIndex = sessions.findIndex((session) => session.id === id);
  if (orderIndex == -1) return { error: "Session not found", ok: false };
  modifyAlley(sessions[orderIndex].parkId, sessions[orderIndex].alleyNb, false);
  sessions.splice(orderIndex, 1);
  return { message: "Session " + id + " deleted", ok: true }
};

module.exports = {
  findSessionByQrCode,
  findSessionByUserId,
  getSessionsByParkId,
  createSession,
  deleteSession,
  joinSession,
  leaveSession,
  getSessions,
};
