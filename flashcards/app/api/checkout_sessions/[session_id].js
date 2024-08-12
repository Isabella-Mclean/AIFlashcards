import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(req, { params }) {
  const { session_id } = params;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
