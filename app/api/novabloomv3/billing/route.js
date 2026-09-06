// app/api/novabloomv3/billing/route.js
//
// Public billing endpoint for the /paused and /billing/pay takeover pages.
// Intentionally NOT behind processAuthToken like /api/novabloomv3/smartapi —
// those pages have no logged-in user, only a valid asset_id/account_id pair
// in the URL, the same access model /api/novabloomv3/status already uses.
// Access control is "you know the asset_id + account_id", never a bearer
// token. Only STK-send and renewal go through here; the M-Pesa
// unused-credits poll stays a direct client-side call to hiveapi.php, same
// as the existing admin payment flow.

import { confirmRenewalForAsset, getBillingSnapshot, sendStkForAsset } from './billingData';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, assetId, accountId } = body || {};

    if (!assetId || !accountId) {
      return Response.json({ status: 'error', message: 'assetId and accountId are required' }, { status: 400 });
    }

    if (action === 'status') {
      const snapshot = await getBillingSnapshot(assetId, accountId);
      return Response.json({ status: 'success', data: snapshot });
    }

    if (action === 'stk') {
      const { mobileNumber } = body;
      const data = await sendStkForAsset({ assetId, accountId, mobileNumber });
      return Response.json({ status: data?.success ? 'success' : 'error', data });
    }

    if (action === 'renew') {
      const { subscriptionId, amount, refNo } = body;
      const data = await confirmRenewalForAsset({ assetId, accountId, subscriptionId, amount, refNo });
      return Response.json({ status: data?.success ? 'success' : 'error', data });
    }

    return Response.json({ status: 'error', message: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    console.error('billing route failed:', err);
    return Response.json({ status: 'error', message: err?.message || 'Request failed' }, { status: 500 });
  }
}
