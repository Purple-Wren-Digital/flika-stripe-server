import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "Something is missing from the environment variable. Please check that all variables are defined."
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;