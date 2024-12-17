import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/config/stripe';

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { amount, currency } = requestBody;
  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2024-11-20.acacia' }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    if (paymentIntent.client_secret === null) {
      throw new Error('Unable to create payment intent with Stripe.');
    }
    if (ephemeralKey.secret === null) {
      throw new Error('Unable to create Ephemeral Key with Stripe.');
    }
    if (customer.id === null) {
      throw new Error('Unable to create Customer with Stripe.');
    }

    return NextResponse.json({
      paymentIntent: paymentIntent.client_secret,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      customer: customer.id,
      ephemeralKey: ephemeralKey.secret,
    });
  } catch (error) {
    console.error('Internal Server Error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
