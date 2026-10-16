import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@/lib/supabase/server';
import { securityLog } from '@/lib/api-guard';

const PASS_DAYS: Record<string, number> = { pass_3d: 3, pass_7d: 7, pass_30d: 30 };

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
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    securityLog('stripe_webhook_unsigned');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe()!;
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    securityLog('stripe_webhook_bad_signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true });
    }

    const userId = session.client_reference_id || session.metadata?.userId;
    const productId = session.metadata?.productId;
    const days = productId ? PASS_DAYS[productId] : undefined;
    if (!userId || !productId || !days) {
      // Acknowledge so Stripe stops retrying; the session can be reconciled manually.
      securityLog('stripe_webhook_missing_metadata', { sessionId: session.id });
      return NextResponse.json({ received: true });
    }

    const supabase = createServerClient();

    // Both writes are keyed by stripe_session_id (unique), so Stripe retries are
    // idempotent and a retry after a partial failure completes the missing row.
    const { error: paymentError } = await supabase.from('payments').upsert(
      {
        user_id: userId,
        type: productId,
        amount_usd: (session.amount_total || 0) / 100,
        stripe_session_id: session.id,
      },
      { onConflict: 'stripe_session_id', ignoreDuplicates: true },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    const { error: passError } = paymentError
      ? { error: null }
      : await supabase.from('passes').upsert(
          {
            user_id: userId,
            type: `${days}d`,
            expires_at: expiresAt.toISOString(),
            stripe_session_id: session.id,
          },
          { onConflict: 'stripe_session_id', ignoreDuplicates: true },
        );

    if (paymentError || passError) {
      console.error('Stripe webhook DB error:', paymentError || passError);
      // 500 makes Stripe retry later.
      return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
