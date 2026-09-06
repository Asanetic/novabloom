// app/api/novabloomv3/billing/billingData.js
//
// Server-only helpers shared by /paused, /billing/pay and their public
// billing API route. This is the single place that knows how to load a
// billing snapshot for an asset and how to trigger STK / renewal — every
// route/page composes these instead of re-querying the DB or re-invoking
// the payment/renewal handlers directly.

import { mmres, mosyQddata, mosyQuickSel } from '../../apiUtils/dataControl/dataUtils';
import { promptMobileStk } from '../subscriptions/logicControl/prompt-payment';
import { renewSubscription } from '../subscriptions/logicControl/subscription-renewal';

function hasDatePassed(dateValue) {
  if (!dateValue) return false;
  const compareDate = new Date(dateValue);
  if (Number.isNaN(compareDate.getTime())) return false;
  return compareDate.getTime() < Date.now();
}

function resolveState(subscription) {
  const status = (subscription?.status || '').toLowerCase();
  if (status === 'suspended') return 'suspended';
  if (status === 'expired') return 'expired';
  if (hasDatePassed(subscription?.next_billing_date)) return 'expired';
  return 'active';
}

async function parseHandlerResponse(res) {
  if (res && typeof res.json === 'function') {
    return res.json();
  }
  return res;
}

// ─────────────────────────────────────────────
// Load everything /paused and /billing/pay need for one asset+account pair.
// Matched on both IDs (same as loadaccount/status) — asset_id alone can't
// be trusted to resolve a unique subscription if an asset is ever
// re-registered to a different account_id.
// Never trust client-supplied amount/status — this is the only source.
// ─────────────────────────────────────────────
export async function getBillingSnapshot(assetId, accountId) {
  const safeAssetId = mmres(String(assetId || ''));
  const safeAccountId = mmres(String(accountId || ''));
  if (!safeAssetId || !safeAccountId) {
    return { found: false, reason: 'missing_asset_or_account_id' };
  }

  const asset = await mosyQddata('assets', 'record_id', safeAssetId);
  if (!asset) {
    return { found: false, reason: 'asset_not_found' };
  }

  const subscription = await mosyQuickSel(
    'subscriptions',
    `WHERE asset_id='${safeAssetId}' AND account_id='${safeAccountId}' ORDER BY primkey DESC LIMIT 1`,
    'r'
  );

  if (!subscription) {
    return { found: false, reason: 'subscription_not_found', asset };
  }

  const [user, pricing] = await Promise.all([
    subscription.account_id ? mosyQddata('app_users', 'record_id', subscription.account_id) : null,
    subscription.pricing_id ? mosyQddata('asset_pricing', 'record_id', subscription.pricing_id) : null
  ]);

  return {
    found: true,
    state: resolveState(subscription),
    asset,
    subscription,
    user,
    pricing
  };
}

// ─────────────────────────────────────────────
// Send the M-Pesa STK prompt for an asset's active subscription.
// Reuses the same promptMobileStk handler the admin dashboard calls
// through /api/novabloomv3/smartapi — no new STK integration here.
// ─────────────────────────────────────────────
export async function sendStkForAsset({ assetId, accountId, mobileNumber }) {
  const snapshot = await getBillingSnapshot(assetId, accountId);
  if (!snapshot.found) {
    return { success: false, message: 'Subscription not found for this asset' };
  }

  if (!mobileNumber) {
    return { success: false, message: 'mpesa_mobile_number is required' };
  }

  const res = await promptMobileStk({
    auth: { hive_site_id: snapshot.asset?.hive_site_id, hive_site_name: snapshot.asset?.hive_site_name },
    payload: {
      subscription_id: snapshot.subscription.record_id,
      mpesa_mobile_number: mobileNumber,
      amount: snapshot.subscription.amount
    }
  });

  const data = await parseHandlerResponse(res);
  return {
    ...data,
    subscription_id: snapshot.subscription.record_id,
    amount: snapshot.subscription.amount,
    currency: snapshot.subscription.currency
  };
}

// ─────────────────────────────────────────────
// Write the renewal back once a payment has been confirmed client-side.
// Reuses the same renewSubscription handler as the admin dashboard —
// status flip + next_billing_date extension only ever happens there.
// ─────────────────────────────────────────────
export async function confirmRenewalForAsset({ assetId, accountId, subscriptionId, amount, refNo }) {
  const snapshot = await getBillingSnapshot(assetId, accountId);
  if (!snapshot.found) {
    return { success: false, message: 'Subscription not found for this asset' };
  }

  if (snapshot.subscription.record_id !== subscriptionId) {
    return { success: false, message: 'Subscription does not match this asset' };
  }

  const res = await renewSubscription({
    auth: { hive_site_id: snapshot.asset?.hive_site_id, hive_site_name: snapshot.asset?.hive_site_name },
    payload: {
      subscription_id: subscriptionId,
      payment_mode: 'mpesa',
      amount: String(amount),
      ref_no: refNo || `AUTO-${subscriptionId}`,
      remark: 'Renewal via public billing gate (/billing/pay)'
    }
  });

  return parseHandlerResponse(res);
}
