import Stripe from "stripe";

const stripe = new Stripe("sk_test_51Mq9FTCJXJBNEBmzrxG77wHz6iwD1bgHjXtOsjteXXHn1dzrJNCTnLe5Mmd57eaFkxuioSgX7GeZTPfHNZIG6Oas00YRwazTYt", {
    apiVersion: '2022-11-15',
});
export default stripe;