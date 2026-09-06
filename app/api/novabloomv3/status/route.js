import {
    mmres,
    mosyQuickSel
  } from '../../../apiUtils/dataControl/dataUtils';
  
  // ─────────────────────────────────────────────────────────────
  // POLICY CONSTANTS — these are business decisions, not technical
  // ones. Confirm both before relying on this in production.
  // ─────────────────────────────────────────────────────────────
  
  // Days past next_billing_date before a lapsed subscription moves from
  // a soft "restrictions" state to a full "/paused" block. Set to 0 for
  // instant hard block with no grace at all.
  const GRACE_PERIOD_DAYS = 3;
  
  // Where the hosted takeover pages live. Same host that will serve
  // /paused/[assetId]/[accountId] and /billing/pay/[assetId]/[accountId].
  const BILLING_BASE_URL = 'https://novabloom.asanetic.com';
  
  function daysOverdue(dateStr) {
    // Returns how many days PAST dateStr we are right now. Negative or
    // null means not yet due (or no date to check against at all).
    if (!dateStr) return null;
    const then = new Date(dateStr);
    if (Number.isNaN(then.getTime())) return null;
    const diffMs = Date.now() - then.getTime();
    return diffMs / (1000 * 60 * 60 * 24);
  }
  
  function buildUrls(assetId, accountId) {
    const suffix = `${encodeURIComponent(assetId)}/${encodeURIComponent(accountId)}`;
    return {
      pausedUrl: `${BILLING_BASE_URL}/paused/${suffix}`,
      payUrl: `${BILLING_BASE_URL}/billing/pay/${suffix}`
    };
  }
  
  export async function GET(request) {
    try {
      const { searchParams } = new URL(request.url);
      const assetId = searchParams.get('asset_id') || '';
      const accountId = searchParams.get('account_id') || '';
  
      if (!assetId || !accountId) {
        return Response.json(
          { status: 'error', message: 'asset_id and account_id are required' },
          { status: 400 }
        );
      }
  
      const safeAssetId = mmres(String(assetId));
      const safeAccountId = mmres(String(accountId));
  
      // Same lookup pattern loadaccount already uses — exact pair match,
      // most recent row wins if somehow more than one exists.
      const subscription = await mosyQuickSel(
        'subscriptions',
        `WHERE account_id='${safeAccountId}' AND asset_id='${safeAssetId}' ORDER BY primkey DESC LIMIT 1`,
        'r'
      );
  
      const { pausedUrl, payUrl } = buildUrls(safeAssetId, safeAccountId);
  
      // ── No subscription row at all for this pair ────────────────
      // Treat as blocked rather than silently letting an unregistered
      // asset/account through. If this fires unexpectedly for a real
      // customer, it usually means loadaccount was never called for
      // this asset+account pair yet.
      if (!subscription) {
        return Response.json({
          block: true,
          state: 'not_found',
          restrictions: {},
          expired_url: pausedUrl
        });
      }
  
      const storedStatus = (subscription.status || '').toLowerCase();
  
      // ── Explicitly cancelled — always hard block regardless of dates ──
      if (storedStatus === 'cancelled') {
        return Response.json({
          block: true,
          state: 'cancelled',
          restrictions: {},
          expired_url: pausedUrl
        });
      }
  
      // ── Compute lapse directly from next_billing_date — do NOT trust
      //    the stored status field alone, since it's only updated as a
      //    side effect of loadaccount being called (see markAccountExpiredIfNeeded).
      //    This endpoint needs to be correct even if that never ran. ──
      const overdueDays = daysOverdue(subscription.next_billing_date);
  
      // Not overdue yet (or no next_billing_date to check) — active.
      if (overdueDays === null || overdueDays <= 0) {
        return Response.json({
          block: false,
          state: 'active',
          restrictions: {}
        });
      }
  
      // Overdue but within grace window — soft gate only.
      if (overdueDays <= GRACE_PERIOD_DAYS) {
        return Response.json({
          block: false,
          state: 'grace',
          restrictions: {
            // Generic "add" key restricted for now. Extend this object
            // per action key as client apps (Rack POS, AssetGuard, etc.)
            // confirm which of their buttons should be soft-gated during
            // grace — this is a placeholder for the one case discussed
            // so far ("Add New" -> "Upgrade Account").
            add: {
              label: 'Upgrade Account',
              icon: 'arrow-up',
              variant: 'warning',
              action_url: payUrl
            }
          }
        });
      }
  
      // Past grace — hard block.
      return Response.json({
        block: true,
        state: 'expired',
        restrictions: {},
        expired_url: pausedUrl
      });
    } catch (err) {
      console.error('status GET failed:', err);
      return Response.json(
        { status: 'error', message: err?.message || 'Request failed' },
        { status: 500 }
      );
    }
  }