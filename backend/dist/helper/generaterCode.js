"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateOrderCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let orderCode = '';
    // Generate a random string of 6 characters
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        orderCode += characters.charAt(randomIndex);
    }
    // Add a timestamp to the order code
    const timestamp = new Date().getTime().toString();
    orderCode += timestamp;
    return orderCode;
}
exports.default = generateOrderCode;
