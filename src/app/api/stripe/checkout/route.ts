import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserFromRequest } from '@/lib/supabase/server';
import { rejectUntrustedRequest } from '@/lib/api-guard';

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

const PRODUCTS: Record<string, { name: string; amount: number }> = {
  'pass_3d': { name: '3-Day Short Trip Pass', amount: 199 },
  'pass_7d': { name: '7-Day Trip Pass', amount: 399 },
  'pass_30d': { name: '30-Day Trip Pass', amount: 999 },
};

export async function POST(req: NextRequest) {
  try {
    const rejected = rejectUntrustedRequest(req, 'checkout');
    if (rejected) return rejected;

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        {
          error: 'E_SERVICE_UNAVAILABLE',
          reason: 'Checkout is not configured.',
        },
        { status: 503 },
      );
    }

    const { productId } = await req.json();
    const product = typeof productId === 'string' ? PRODUCTS[productId] : undefined;
    if (!product) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    }

    // The webhook grants the pass to this id, so it must come from a verified session.
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'E_AUTH', reason: 'Sign in to buy a pass.' }, { status: 401 });
    }

    // Never build redirect targets from client-supplied headers.
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const referer = req.headers.get('referer') || '';
    const returnPage = referer.includes('/results') ? '/results' : '/profile';
    const successUrl = `${siteUrl}${returnPage}?payment=success&plan=${productId}`;
    const cancelUrl = `${siteUrl}${returnPage}?payment=cancelled`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: product.name },
          unit_amount: product.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: user.id,
      metadata: { productId, userId: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
