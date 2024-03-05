const apiSessions = require("../utils/apiSessions");
const apiProducts = require("../utils/apiProducts");
const orders = []
let orderNextId = 1;

const getOrders = () => orders;

const getOrdersBySessionId = (sessionId) => 
    orders.filter((order) => order.sessionId === sessionId);

const getFinishedOrdersBySessionId = (sessionId) => 
    orders.filter((order) => order.sessionId === sessionId && order.isFinished);

const getOrdersByUserId = (userId) =>
    orders.filter((order) => order.userId === userId);

const findUnfinishedOrderByUserId = (userId) =>
    orders.find((order) => order.userId === userId && !order.isFinished);

const getFinishedOrdersByUserId = (userId) =>
    orders.filter((order) => order.userId === userId && order.isFinished);

const getFinishedOrdersByParkId = (parkId) =>
    orders.filter((order) => order.parkId === parkId && order.isFinished);

const findOrderById = (id) =>
    orders.find((order) => order.id === id);

const createEmptyOrder = async (userId) => {
    try {
        const session = await apiSessions.get(`/session/user/${userId}`);   
        const order = {
            id: orderNextId++,
            userId: userId,
            sessionId: session.id,
            parkId: session.parkId,
            products: [],
            isFinished: false,
            totalPrice: 0
        };  
        orders.push(order);
        return { order };
    } catch (error) {
        console.log(error)
        return {
            error: "Internal server error during order creation",
            ok: false,
        };
    }
};

const deleteOrder = (id) => {
    const orderIndex = orders.findIndex((order) => order.id === id);
    if (orderIndex == -1) return { error: "Order not found", ok: false };
    orders.splice(orderIndex, 1);
    return { message: "Order " + id + " deleted", ok: true }
  };

const addProductToOrder = async (userId, productId, productNumber) => {
    try {
        const order = findUnfinishedOrderByUserId(userId)
        if (!order) return { error: "Order not found", ok: false }
        const resultProduct = await apiProducts.get(`/${productId}`); 
        let orderedProduct = order.products.find((orderedProduct) => orderedProduct.product.id === productId)
        if (orderedProduct) {
            orderedProduct.number += productNumber;
        }else {
            orderedProduct = {
                product: resultProduct.product,
                number: productNumber
            };
            order.products.push(orderedProduct);
        }
        order.totalPrice += resultProduct.product.price * productNumber;
        return { order };
    } catch (error) {
        console.log(error)
        return {
            error: "Internal server error during adding product",
            ok: false,
        };
    }
};

const sendOrder = async (userId, name, email, phoneNumber) => {
    try {
        const order = findUnfinishedOrderByUserId(userId);
        if (!order) return { error: "Order not found", ok: false };
        order.isFinished = true;
        order.userName = name;
        order.email = email;
        order.phoneNumber = phoneNumber;
        const body = {
            order: order,
            sessionId: order.sessionId
        };
        const resultSession = await apiSessions.post(`/session/order`, body); 
        if (!resultSession.ok) return { error: "Order not added", ok: false };
        return { message: "Order sent", ok: true, order: order, session: resultSession.session}
    } catch (error) {
        console.log(error)
        return {
            error: "Internal server error during sending order",
            ok: false,
        };
    }
};

module.exports = {
    createEmptyOrder,
    getOrders,
    getOrdersBySessionId,
    getOrdersByUserId,
    findOrderById,
    getFinishedOrdersBySessionId,
    getFinishedOrdersByUserId,
    deleteOrder,
    findUnfinishedOrderByUserId,
    addProductToOrder,
    sendOrder,
    getFinishedOrdersByParkId
};