# PayPal Setup

Use PayPal-hosted Checkout only. Do not collect or store card details.

## Environment Variables
PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV, PAYPAL_WEBHOOK_ID, APP_ORIGIN and DB.

## Flow
Frontend requests order creation for a real product ID. Worker creates PayPal order server-side. Browser completes PayPal Checkout. Worker captures and verifies payment. D1 purchase record is written. Resource unlock happens only after verified payment.

## Webhooks
Verify PayPal signatures before accepting events. Store order/capture IDs to prevent duplicate unlocks.

## Notes
Product cards are placeholders until real contents, pricing, refund wording and legal copy are provided.
