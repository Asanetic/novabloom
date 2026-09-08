"use client";

import { useEffect, useRef, useState } from 'react';
import { BillingCard, RefreshHostButton, SupportLine } from '../../../BillingShell';

// Same tuned constants the admin dashboard's M-Pesa flow already ships
// with (see payment-manager-client.jsx / prompt-payment.jsx) — not
// reimplemented from scratch, just ported out of the DOM-patching modal
// pattern into React state for this standalone page.
const PAYMENT_CHECK_INTERVAL_MS = 5000;
const PAYMENT_CHECK_TIMEOUT_MS = 3 * 60 * 1000;
const BILLING_API = '/api/novabloomv3/billing';

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normalizeMpesaNumber(value = '') {
  return value.replace(/\s+/g, '');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Ported as-is from payment-manager-client.jsx / prompt-payment.jsx —
// account_number here is the subscription_id, matching what the STK
// handler (prompt-payment.js) sends M-Pesa as the paybill account number.
async function fetchUnusedCredits(accountNumber) {
  const token = btoa(String(accountNumber));
  const url = `https://apps.asanetic.com/eb/be/hiveapi.php?unused_credits=${encodeURIComponent(token)}`;
  const res = await fetch(url, { method: 'GET' });
  const rawText = await res.text();

  let json = {};
  try {
    json = JSON.parse(rawText);
  } catch (err) {
    json = {};
  }

  const list = Array.isArray(json?.data) ? json.data : [];
  const txns = list.map((item) => {
    const amount = toNumber(item?.amount ?? item?.[2] ?? 0);
    const trxId = item?.trx_id || item?.[0] || '';
    return { amount, trxId };
  });

  return {
    txns,
    totalPaid: txns.reduce((sum, t) => sum + toNumber(t.amount), 0)
  };
}

function postToParent(assetId, accountId, status) {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'novabloom:billing', assetId, accountId, status }, '*');
    }
  } catch (err) {
    // no listener, or cross-origin parent that rejects — fine, page still shows its own success state
  }
}

// Purely cosmetic: lets the /paused iframe size itself to the actual
// content height instead of a fixed guess, so short steps (enter phone)
// don't leave dead space and tall steps (waiting + paybill fallback) don't
// get clipped. Never touches payment state.
function reportHeightToParent(assetId, accountId) {
  try {
    if (window.parent && window.parent !== window) {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: 'novabloom:billing:resize', assetId, accountId, height }, '*');
    }
  } catch (err) {
    // ignore — worst case the iframe keeps its default height
  }
}

export default function PayClient({ assetId, accountId, snapshot, embedded = false }) {
  const [phone, setPhone] = useState(snapshot?.user?.phone_number || '');
  const [step, setStep] = useState('form'); // form | sending | waiting | success | failed
  const [errorMessage, setErrorMessage] = useState('');
  const [totalPaid, setTotalPaid] = useState(0);
  const [checkNo, setCheckNo] = useState(0);
  const cancelledRef = useRef(false);

  useEffect(() => () => { cancelledRef.current = true; }, []);

  // Cosmetic only: keep the parent /paused iframe sized to this page's
  // actual content as steps change (form -> waiting -> success/failed).
  useEffect(() => {
    if (!embedded || typeof window === 'undefined' || typeof ResizeObserver === 'undefined') return undefined;

    const report = () => reportHeightToParent(assetId, accountId);
    const observer = new ResizeObserver(report);
    observer.observe(document.documentElement);
    report();

    return () => observer.disconnect();
  }, [embedded, assetId, accountId]);

  if (!snapshot?.found) {
    return (
      <BillingCard embedded={embedded}>
        <div className="billing_headline">We couldn&apos;t find this account</div>
        <div className="billing_subtext">
          This payment link looks incomplete or out of date. Please reopen it from the app you were using.
        </div>
        <SupportLine text="Need help?" />
      </BillingCard>
    );
  }

  const { subscription, asset } = snapshot;
  const targetAmount = toNumber(subscription.amount);
  const maxChecks = Math.floor(PAYMENT_CHECK_TIMEOUT_MS / PAYMENT_CHECK_INTERVAL_MS);
  const progressPct = step === 'waiting' ? Math.min(100, Math.round((checkNo / maxChecks) * 100)) : 0;

  async function watchAndRenew() {
    for (let n = 1; n <= maxChecks; n++) {
      if (cancelledRef.current) return;
      setCheckNo(n);

      try {
        const check = await fetchUnusedCredits(subscription.record_id);
        const paidSoFar = toNumber(check.totalPaid);
        setTotalPaid(paidSoFar);

        if (paidSoFar >= targetAmount) {
          const refNo = [...new Set(check.txns.map((t) => (t.trxId || '').trim()).filter(Boolean))].join(',');

          const renewRes = await fetch(BILLING_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'renew',
              assetId,
              accountId,
              subscriptionId: subscription.record_id,
              amount: targetAmount,
              refNo
            })
          }).then((r) => r.json());

          if (cancelledRef.current) return;

          if (renewRes?.status === 'success') {
            setStep('success');
            postToParent(assetId, accountId, 'paid');
          } else {
            setErrorMessage(renewRes?.data?.message || 'Payment received but renewal failed. Contact support.');
            setStep('failed');
          }
          return;
        }
      } catch (err) {
        // transient network/API hiccup — keep polling until timeout
      }

      await sleep(PAYMENT_CHECK_INTERVAL_MS);
    }

    if (!cancelledRef.current) {
      setErrorMessage('No payment detected yet. If you completed the payment, you can check again.');
      setStep('failed');
    }
  }

  async function handlePayNow() {
    const mobileNumber = normalizeMpesaNumber(phone);
    if (!mobileNumber) {
      setErrorMessage('Please enter your M-Pesa mobile number');
      return;
    }

    setErrorMessage('');
    setStep('sending');

    try {
      const res = await fetch(BILLING_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stk', assetId, accountId, mobileNumber })
      }).then((r) => r.json());

      if (res?.status !== 'success') {
        setErrorMessage(res?.data?.message || 'Failed to send STK prompt. Please try again.');
        setStep('form');
        return;
      }

      setTotalPaid(0);
      setCheckNo(0);
      setStep('waiting');
      watchAndRenew();
    } catch (err) {
      setErrorMessage('Could not reach the payment service. Check your connection and try again.');
      setStep('form');
    }
  }

  if (step === 'success') {
    return (
      <BillingCard embedded={embedded} asset={asset}>
        <span className="billing_badge_soft">Payment confirmed</span>
        <div className="billing_headline">You&apos;re all set</div>
        <div className="billing_subtext">
          Your subscription has been renewed. You can close this window.
        </div>
        {!embedded ? <RefreshHostButton label="Refresh and continue" /> : null}
      </BillingCard>
    );
  }

  return (
    <BillingCard embedded={embedded} asset={asset}>
      <div className="billing_headline">Renew {subscription.subscription_name || 'Subscription'}</div>
      <div className="billing_subtext">Pay securely with M-Pesa to restore access instantly.</div>
      <div className="billing_amount">{subscription.currency} {subscription.amount}</div>

      {step === 'waiting' ? (
        <>
          <div className="billing_spinner" />
          <div className="billing_subtext" style={{ marginBottom: 6 }}>
            Check your phone to confirm the M-Pesa prompt…
          </div>
          <div className="billing_progress_track">
            <div className="billing_progress_fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="billing_subtext" style={{ marginBottom: 0 }}>
            Paid so far: {totalPaid.toFixed(2)} / {targetAmount.toFixed(2)}
          </div>

          <div className="billing_paybill_box">
            <b>Didn&apos;t get the prompt? Pay directly:</b>
            <ol style={{ margin: '8px 0 0', paddingLeft: 18 }}>
              <li>Go to Lipa na M-Pesa &rarr; Paybill</li>
              <li>Business number: <b>4091961</b></li>
              <li>Account number: <b>{subscription.record_id}</b></li>
              <li>Amount: <b>{subscription.currency} {subscription.amount}</b></li>
            </ol>
          </div>
        </>
      ) : (
        <>
          <label className="billing_label" htmlFor="billing_phone">M-Pesa mobile number</label>
          <input
            id="billing_phone"
            className="billing_input"
            type="text"
            placeholder="e.g. 07XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={step === 'sending'}
          />

          {errorMessage ? <div className="billing_error_text">{errorMessage}</div> : null}

          <button
            type="button"
            className="billing_btn_primary"
            onClick={handlePayNow}
            disabled={step === 'sending'}
          >
            {step === 'sending' ? 'Sending prompt…' : 'Pay Now'}
          </button>
        </>
      )}

      {step === 'failed' ? (
        <button type="button" className="billing_link_btn" onClick={() => setStep('form')}>
          Try again
        </button>
      ) : null}

      {/* Not shown when embedded in /paused — that page already has its
          own Refresh button, and this frame's window.top is the same
          host window either way so a second one here would be redundant. */}
      {!embedded ? <RefreshHostButton /> : null}
      <SupportLine />
    </BillingCard>
  );
}
