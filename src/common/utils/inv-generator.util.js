"use strict";
exports.__esModule = true;
function generateInvoiceId() {
    var randomNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    var randomString = randomNumber.toString().padStart(4, '0'); // Convert the number to a string and pad it with leading zeroes
    return randomString;
}
exports["default"] = generateInvoiceId;
