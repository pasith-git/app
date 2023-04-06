
function generateInvoiceId() {
    const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
  const randomString = randomNumber.toString().padStart(4, '0'); // Convert the number to a string and pad it with leading zeroes
  return randomString;
}

export default generateInvoiceId;