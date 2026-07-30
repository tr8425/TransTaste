import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@/lib/supabase/server';

function getStripe() {
  if (
    process.env.ENABLE_STRIPE_CHECKOUT !== 'true' ||
    !process.env.STRIPE_SECRET_KEY
  ) {
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-03-25.dahlia',
  });
}

export async function POST(req: Request) {
  if (
    process.env.ENABLE_STRIPE_CHECKOUT !== 'true' ||
    !process.env.STRIPE_SECRET_KEY ||
    !process.env.STRIPE_WEBHOOK_SECRET
  ) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    const stripe = getStripe()!;
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, productId } = session.metadata || {};

    if (!userId || !productId) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Record payment
    await supabase.from('payments').insert({
      user_id: userId,
      type: productId,
      amount_usd: (session.amount_total || 0) / 100,
      stripe_session_id: session.id,
    });

    // Apply a server-verified trip pass.
    if (
      productId === 'pass_3d' ||
      productId === 'pass_7d' ||
      productId === 'pass_30d'
    ) {
      const days =
        productId === 'pass_3d' ? 3 : productId === 'pass_7d' ? 7 : 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);
      await supabase.from('passes').insert({
        user_id: userId,
        type: `${days}d`,
        expires_at: expiresAt.toISOString(),
      });
    }
  }

  return NextResponse.json({ received: true });
}
