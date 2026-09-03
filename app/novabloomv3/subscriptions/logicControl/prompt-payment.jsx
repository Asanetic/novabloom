import { closeMosyCard, MosyCard } from "../../../components/MosyCard";
import { MosyNotify } from "../../../MosyUtils/ActionModals";
import { mosyPostData } from "../../../MosyUtils/hiveUtils";
import { getApiRoutes } from "../../AppRoutes/apiRoutesHandler";

const apiRoutes = getApiRoutes();
const PAYMENT_CHECK_INTERVAL_MS = 5000;
const PAYMENT_CHECK_TIMEOUT_MS = 3 * 60 * 1000;

function normalizeMpesaNumber(value = "") {
  return value.replace(/\s+/g, "");
}

function randomSecurityCode(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function updatePromptStatus({ text = "", totalPaid = null, targetAmount = null }) {
  const statusEl = document.getElementById("mpesa_prompt_status");
  const totalEl = document.getElementById("mpesa_prompt_total_paid");

  if (statusEl && text) {
    statusEl.innerText = text;
  }

  if (totalEl && totalPaid !== null && targetAmount !== null) {
    totalEl.innerText = `${totalPaid.toFixed(2)} / ${targetAmount.toFixed(2)}`;
  }
}

async function fetchUnusedCredits(subscriptionId) {
  const token = btoa(String(subscriptionId));
  const url = `https://apps.asanetic.com/eb/be/hiveapi.php?unused_credits=${encodeURIComponent(token)}`;
  const res = await fetch(url, { method: "GET" });
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
    const trxId = item?.trx_id || item?.[0] || "";
    const accountId = item?.account_id || item?.BillRefNumber || item?.[7] || "";
    return { amount, trxId, accountId };
  });

  const totalPaid = txns.reduce((sum, t) => sum + toNumber(t.amount), 0);

  return {
    ok: res.ok,
    status: res.status,
    txns,
    totalPaid
  };
}

async function sendRenewAccountToSmartApi({ subscriptionId, amount, refNo }) {
  return mosyPostData({
    url: apiRoutes.smartapi.base,
    data: {
      action: "renewSubscription",
      payload: {
        subscription_id: subscriptionId,
        payment_mode: "mpesa",
        amount: String(amount),
        ref_no: refNo || `AUTO-${subscriptionId}`,
        remark: "Auto renewal from M-Pesa payment verification"
      }
    }
  });
}

async function watchPaymentAndRenew(subscriptionPayload = {}) {
  const subscriptionId = subscriptionPayload?.subscription_id;
  const targetAmount = toNumber(subscriptionPayload?.amount);

  if (!subscriptionId || targetAmount <= 0) {
    updatePromptStatus({
      text: "Waiting for payment confirmation.",
      totalPaid: 0,
      targetAmount: targetAmount > 0 ? targetAmount : 0
    });
    return;
  }

  const maxChecks = Math.floor(PAYMENT_CHECK_TIMEOUT_MS / PAYMENT_CHECK_INTERVAL_MS);

  for (let checkNo = 1; checkNo <= maxChecks; checkNo++) {
    try {
      updatePromptStatus({
        text: `Waiting for payment... Check ${checkNo}/${maxChecks}`,
        totalPaid: 0,
        targetAmount
      });

      const check = await fetchUnusedCredits(subscriptionId);
      const totalPaid = toNumber(check?.totalPaid);

      updatePromptStatus({
        text: `Waiting for payment... Check ${checkNo}/${maxChecks}`,
        totalPaid,
        targetAmount
      });

      if (totalPaid >= targetAmount) {
        const trxRefNos = (check?.txns || [])
          .map((t) => (t?.trxId || "").trim())
          .filter(Boolean);

        const joinedRefNo = [...new Set(trxRefNos)].join(",");

        updatePromptStatus({
          text: "Payment received. Renewing account now...",
          totalPaid,
          targetAmount
        });

        await sendRenewAccountToSmartApi({
          subscriptionId,
          amount: targetAmount,
          refNo: joinedRefNo
        });

        MosyNotify({
          id: "topmost",
          message: "Payment confirmed. Subscription renewed.",
          icon: "check-circle",
          addTimer: false
        });

        updatePromptStatus({
          text: "Payment confirmed. Subscription renewed successfully.",
          totalPaid,
          targetAmount
        });

        return;
      }
    } catch (err) {
      updatePromptStatus({
        text: `Payment check failed. Retrying...`,
        totalPaid: 0,
        targetAmount
      });
    }

    await sleep(PAYMENT_CHECK_INTERVAL_MS);
  }

  MosyNotify({
    id: "topmost",
    message: "No payment detected yet. You can try again after confirming M-Pesa payment.",
    icon: "exclamation-triangle",
    addTimer: false
  });

  updatePromptStatus({
    text: "Timed out waiting for payment. Please try again.",
    totalPaid: 0,
    targetAmount
  });
}

function showPromptSentCard(payload = {}) {
  const accountNo = payload?.subscription_id || "-";
  const accountName = payload?.subscription_name || payload?.account_id || "-";
  const amount = `${payload?.currency || ""} ${payload?.amount || ""}`.trim() || "-";
  const securityCode = randomSecurityCode(10);

  MosyCard(
    "Payment Prompt Sent",
    <div className="mb-4 row justify-content-center m-0 p-0 col-md-12 pl-2 pr-2" style={{ lineHeight: "35px" }}>
      <div className="col-md-12 ctn_set">
        <div className="pt-2 row justify-content-center m-0 p-0 col-md-12">
          <h6 className="col-md-12 text-left p-0 m-0" style={{ lineHeight: "35px" }}>
            Your order has been placed. Please check your phone to confirm transaction request.
          </h6>

          <div className="pt-2 pb-2 border-bottom border_set row justify-content-left m-0 p-0 col-md-12" style={{ lineHeight: "30px" }}>
            <div className="col-md-12 border-bottom border_set bg-light mb-2 text-left"><b>Order Details</b></div>
            <div className="col-md-3 text-left"><b>Order No:</b> {accountNo}</div>
            <div className="col-md-5 text-left"><b>Account Name:</b> {accountName}</div>
            <div className="col-md-4 text-left"><b>Security Code:</b> {securityCode}</div>
          </div>

          <div className="col-md-12 text-left p-0 m-0" style={{ lineHeight: "30px" }}>
            Incase you cant see a transaction request on your phone please try again or try Direct Lipa na M-Pesa below.
            <div className="pb-2 pt-3"><b>Direct Lipa na M-Pesa</b></div>
          </div>

          <ol className="col-md-12 ml-4 text-left" style={{ lineHeight: "35px" }}>
            <li>Go to Lipa na M-Pesa</li>
            <li>Select paybill</li>
            <li>Enter <b className="text-danger">4091961</b> as business number</li>
            <li>Enter <b className="text-danger">{accountNo}</b> as account number</li>
            <li>Enter <b className="text-danger">{amount}</b> as amount and confirm</li>
          </ol>

          <div className="col-md-12 text-left font-weight-bold mb-3 border-top border-bottom p-3 border_set" style={{ lineHeight: "30px" }}>
            We will send you a payment receipt as proof of transaction.
          </div>

          <div className="col-md-12 text-left p-2 mb-3 border border_set rounded">
            <div id="mpesa_prompt_status"><b>Waiting for payment confirmation...</b></div>
            <div><b>Paid so far:</b> <span id="mpesa_prompt_total_paid">0.00 / {toNumber(payload?.amount).toFixed(2)}</span></div>
          </div>

          <div className="col-md-12 text-center pt-2">
            <button className="btn btn-primary" onClick={() => closeMosyCard("modal4")}>
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>,
    true,
    "modal4",
    "mosycard_wide"
  );
}

async function executePromptMobileStk(payload) {
  MosyNotify({
    id: "topmost",
    message: "Sending M-Pesa STK prompt...",
    icon: "refresh",
    addTimer: false
  });

  try {
    const res = await mosyPostData({
      url: apiRoutes.smartapi.base,
      data: {
        action: "ipromptMobileStk",
        payload
      }
    });

    MosyNotify({
      id: "topmost",
      message: res?.message || "STK prompt request sent",
      icon: "check-circle",
      addTimer: true
    });

    closeMosyCard("modal3");
    showPromptSentCard(payload);
    watchPaymentAndRenew(payload);
    return res;
  } catch (err) {
    MosyNotify({
      id: "topmost",
      message: "Failed to send STK prompt. Try again.",
      icon: "exclamation-triangle",
      addTimer: false
    });
    return null;
  }
}

export function promptMobileStk(subscriptionDetails = {}) {
  const subscriptionId = subscriptionDetails?.record_id;
  const amount = subscriptionDetails?.amount || "";
  const currency = subscriptionDetails?.currency || "";

  if (!subscriptionId) {
    MosyNotify({
      message: "Subscription details missing. Refresh and try again.",
      icon: "exclamation-triangle",
      addTimer: false
    });
    return;
  }

  MosyCard(
    "Request M-Pesa Payment",
    <div className="row justify-content-center col-md-12 p-0 m-0">
      <div className="col-md-12 text-left mb-3">
        <div><b>Subscription ID:</b> {subscriptionId}</div>
        <div><b>Subscription:</b> {subscriptionDetails?.subscription_name || "-"}</div>
        <div><b>Account ID:</b> {subscriptionDetails?.account_id || "-"}</div>
        <div><b>Next Billing:</b> {subscriptionDetails?.next_billing_date || "-"}</div>
        <div><b>Amount:</b> {`${currency} ${amount}`.trim()}</div>
      </div>

      <div className="col-md-12 text-left form-group mb-3">
        <label>M-Pesa Mobile Number</label>
        <input
          id="txt_mpesa_phone"
          type="text"
          className="form-control"
          placeholder="e.g 07XXXXXXXX or 2547XXXXXXXX"
        />
      </div>

      <div className="col-md-12 text-left form-group mb-3">
        <label>Remarks (optional)</label>
        <textarea
          id="txt_mpesa_remark"
          className="form-control"
          rows="3"
          placeholder="Add a short note"
        />
      </div>

      <div className="col-md-12 text-right mt-2">
        <button
          className="btn btn-secondary mr-2"
          onClick={() => closeMosyCard("modal3")}
        >
          Cancel
        </button>

        <button
          className="btn btn-primary"
          onClick={async () => {
            const mobileNumber = normalizeMpesaNumber(
              document.getElementById("txt_mpesa_phone")?.value || ""
            );
            const remark = document.getElementById("txt_mpesa_remark")?.value?.trim() || "";

            if (!mobileNumber) {
              MosyNotify({
                message: "Please enter M-Pesa mobile number",
                icon: "exclamation-triangle",
                addTimer: true
              });
              return;
            }

            await executePromptMobileStk({
              subscription_id: subscriptionId,
              mpesa_mobile_number: mobileNumber,
              amount,
              currency,
              account_id: subscriptionDetails?.account_id || "",
              subscription_name: subscriptionDetails?.subscription_name || "",
              next_billing_date: subscriptionDetails?.next_billing_date || "",
              remark
            });
          }}
        >
          Send STK Prompt
        </button>
      </div>
    </div>,
    true,
    "modal3",
    "mosycard_medium"
  );
}
