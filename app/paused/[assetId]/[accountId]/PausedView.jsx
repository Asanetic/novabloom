"use client";

import { useEffect, useState } from 'react';
import { BillingCard, RefreshHostButton, SupportLine } from '../../../billing/BillingShell';

function formatDate(dateValue) {
  if (!dateValue) return '';
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return String(dateValue);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const COPY = {
  expired: {
    badge: 'Renewal needed',
    badgeClass: '',
    headline: 'Your subscription has expired',
    subtext: 'No worries — pick up right where you left off. Renew now to get everything back online.'
  },
  suspended: {
    badge: 'Account suspended',
    badgeClass: 'billing_badge_firm',
    headline: 'This account is suspended',
    subtext: 'Access has been paused because payment is overdue. Renew now to restore it immediately.'
  }
};

const IFRAME_MIN_HEIGHT = 360;

export default function PausedView({ assetId, accountId, snapshot }) {
  const [showPay, setShowPay] = useState(false);
  const [paid, setPaid] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(IFRAME_MIN_HEIGHT);

  useEffect(() => {
    function handleMessage(event) {
      const data = event?.data;
      if (!data || data.assetId !== assetId || data.accountId !== accountId) return;

      if (data.type === 'novabloom:billing' && data.status === 'paid') {
        setPaid(true);
      } else if (data.type === 'novabloom:billing:resize' && Number.isFinite(data.height)) {
        // Cosmetic only — keeps the embedded pay form's height matched to
        // its actual content instead of a fixed guess.
        setIframeHeight(Math.max(IFRAME_MIN_HEIGHT, Math.ceil(data.height)));
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [assetId, accountId]);

  if (!snapshot?.found) {
    return (
      <BillingCard>
        <div className="billing_headline">We couldn&apos;t find this account</div>
        <div className="billing_subtext">
          This billing link looks incomplete or out of date. Please reopen it from the app you were using.
        </div>
        <SupportLine text="Need help?" />
      </BillingCard>
    );
  }

  const { subscription, state, asset } = snapshot;
  const copy = COPY[state] || COPY.expired;

  if (paid) {
    return (
      <BillingCard asset={asset}>
        <span className="billing_badge_soft">All set</span>
        <div className="billing_headline">You&apos;re back up and running</div>
        <div className="billing_subtext">Payment received — this account has been renewed. You can close this window now.</div>
        <RefreshHostButton label="Refresh and continue" />
      </BillingCard>
    );
  }

  return (
    <BillingCard asset={asset}>
      <span className={`billing_badge_soft ${copy.badgeClass}`}>{copy.badge}</span>
      <div className="billing_headline">{copy.headline}</div>
      <div className="billing_subtext">{copy.subtext}</div>

      <div className="billing_summary">
        <div className="billing_summary_row">
          <span className="billing_summary_label">Plan</span>
          <span className="billing_summary_value">{subscription.subscription_name || 'Subscription'}</span>
        </div>
        <div className="billing_summary_row">
          <span className="billing_summary_label">Amount due</span>
          <span className="billing_summary_value">{subscription.currency} {subscription.amount}</span>
        </div>
        {subscription.next_billing_date ? (
          <div className="billing_summary_row">
            <span className="billing_summary_label">Payment was due</span>
            <span className="billing_summary_value">{formatDate(subscription.next_billing_date)}</span>
          </div>
        ) : null}
      </div>

      {!showPay ? (
        <button type="button" className="billing_btn_primary" onClick={() => setShowPay(true)}>
          Renew Now
        </button>
      ) : (
        <div className="billing_iframe_wrap">
          <iframe
            className="billing_iframe"
            style={{ height: iframeHeight }}
            src={`/billing/pay/${encodeURIComponent(assetId)}/${encodeURIComponent(accountId)}?embedded=1`}
            title="Renew subscription"
          />
        </div>
      )}

      <RefreshHostButton />
      <SupportLine />
    </BillingCard>
  );
}
