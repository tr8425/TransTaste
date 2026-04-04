import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-03-25.dahlia',
  });
}

const PRODUCTS: Record<string, { name: string; amount: number }> = {
  'pass_7d': { name: '7-Day Trip Pass', amount: 299 },
  'pass_30d': { name: '30-Day Trip Pass', amount: 599 },
  'credits_50': { name: '50 Scan Credits', amount: 199 },
};

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();
    const product = PRODUCTS[productId];
    if (!product) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    // Determine return page — use referer to return to the page that initiated checkout
    const referer = req.headers.get('referer') || '';
    const returnPage = referer.includes('/results') ? '/results' : '/profile';
    const successUrl = `${origin}${returnPage}?payment=success&plan=${productId}`;
    const cancelUrl = `${origin}${returnPage}?payment=cancelled`;

    // If Stripe key is configured, create real checkout session
    const stripe = getStripe();
    if (stripe) {
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
        metadata: { productId },
      });

      return NextResponse.json({ url: session.url });
    }

    // No Stripe key — redirect to success directly (dev/demo mode)
    console.warn('[TransTaste] Stripe not configured — using demo checkout');
    return NextResponse.json({ url: successUrl });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
