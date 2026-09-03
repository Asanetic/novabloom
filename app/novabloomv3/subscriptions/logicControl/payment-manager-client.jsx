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

async function fetchUnusedCredits(accountNumber) {
  const token = btoa(String(accountNumber));
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

  return {
    ok: res.ok,
    status: res.status,
    txns,
    totalPaid: txns.reduce((sum, t) => sum + toNumber(t.amount), 0)
  };
}

async function sendReceivePaymentToSmartApi(paymentPayload = {}) {
  return mosyPostData({
    url: apiRoutes.smartapi.base,
    data: {
      action: "receivePayment",
      payload: paymentPayload
    }
  });
}

function buildPaymentHistoryPayload({ config = {}, result = {}, phoneNumber = "", remark = "" }) {
  const nowIso = new Date().toISOString();
  const trxIds = (result?.txns || []).map((t) => (t?.trxId || "").trim()).filter(Boolean);
  const uniqueTrxIds = [...new Set(trxIds)];

  return {
    record_id: config?.record_id || "",
    paid_on: config?.paid_on || nowIso,
    amount_paid: String(toNumber(config?.amount)),
    payment_for: config?.payment_for || "general",
    payment_notes: remark || config?.payment_notes || "M-Pesa payment via STK",
    transaction_ref: uniqueTrxIds.join(",") || `AUTO-${config?.account_number || "PAYMENT"}`,
    invoice_id: config?.invoice_id || "",
    subscription_id: config?.subscription_id || "",
    platform_id: config?.platform_id || "",
    pricing_plan_id: config?.pricing_plan_id || "",
    paid_by: config?.paid_by || "",
    phone_number: phoneNumber || "",
    client_id: config?.client_id || "",
    payment_method: config?.payment_method || "mpesa",
    payment_status: config?.payment_status || "completed",
    currency_code: config?.currency || config?.currency_code || "",
    created_at: config?.created_at || nowIso,
    updated_at: config?.updated_at || nowIso,
    hive_site_id: config?.hive_site_id || "",
    hive_site_name: config?.hive_site_name || ""
  };
}

async function watchPaymentAndSave({ paymentConfig = {}, phoneNumber = "", remark = "" }) {
  const accountNumber = paymentConfig?.account_number;
  const targetAmount = toNumber(paymentConfig?.amount);

  if (!accountNumber || targetAmount <= 0) {
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

      const check = await fetchUnusedCredits(accountNumber);
      const totalPaid = toNumber(check?.totalPaid);

      updatePromptStatus({
        text: `Waiting for payment... Check ${checkNo}/${maxChecks}`,
        totalPaid,
        targetAmount
      });

      if (totalPaid >= targetAmount) {
        updatePromptStatus({
          text: "Payment received. Saving now...",
          totalPaid,
          targetAmount
        });

        const paymentHistoryPayload = buildPaymentHistoryPayload({
          config: paymentConfig,
          result: check,
          phoneNumber,
          remark
        });

        await sendReceivePaymentToSmartApi(paymentHistoryPayload);

        // Plug your business logic here to attach payment to sales, subscription renewal, loan repayment, etc.
        // Example: await mosyPostData({ url: apiRoutes.smartapi.base, data: { action: "attachPaymentToSale", payload: {...} } });

        MosyNotify({
          id: "topmost",
          message: "Payment confirmed and recorded.",
          icon: "check-circle",
          addTimer: false
        });

        updatePromptStatus({
          text: "Payment confirmed and recorded successfully.",
          totalPaid,
          targetAmount
        });

        return;
      }
    } catch (err) {
      updatePromptStatus({
        text: "Payment check failed. Retrying...",
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
  const accountNo = payload?.account_number || "-";
  const accountName = payload?.account_name || "-";
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

async function executePromptMobileStk({ paymentConfig = {}, mobileNumber = "", remark = "" }) {
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
        action: "promptMobileStk",
        payload: {
          account_number: paymentConfig?.account_number,
          mpesa_mobile_number: mobileNumber,
          amount: paymentConfig?.amount,
          currency: paymentConfig?.currency,
          remark
        }
      }
    });

    MosyNotify({
      id: "topmost",
      message: res?.message || "STK prompt request sent",
      icon: "check-circle",
      addTimer: true
    });

    closeMosyCard("modal3");
    showPromptSentCard(paymentConfig);
    watchPaymentAndSave({ paymentConfig, phoneNumber: mobileNumber, remark });
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

export function requestMpesaPayment(paymentDetails = {}) {
  const accountNumber = paymentDetails?.account_number || paymentDetails?.record_id || "";
  const amount = paymentDetails?.amount || "";
  const currency = paymentDetails?.currency || paymentDetails?.currency_code || "";

  if (!accountNumber) {
    MosyNotify({
      message: "Account number is missing. Refresh and try again.",
      icon: "exclamation-triangle",
      addTimer: false
    });
    return;
  }

  MosyCard(
    "Request M-Pesa Payment",
    <div className="row justify-content-center col-md-12 p-0 m-0">
      <div className="col-md-12 text-left mb-3">
        <div><b>Account Number:</b> {accountNumber}</div>
        <div><b>Account Name:</b> {paymentDetails?.account_name || paymentDetails?.subscription_name || "-"}</div>
        <div><b>Amount:</b> {`${currency} ${amount}`.trim()}</div>
        <div><b>Payment For:</b> {paymentDetails?.payment_for || "general"}</div>
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
              paymentConfig: {
                ...paymentDetails,
                account_number: accountNumber,
                amount,
                currency,
                payment_method: paymentDetails?.payment_method || "mpesa"
              },
              mobileNumber,
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

export function promptMobileStk(subscriptionDetails = {}) {
  requestMpesaPayment({
    account_number: subscriptionDetails?.record_id,
    account_name: subscriptionDetails?.subscription_name || subscriptionDetails?.account_id || "",
    amount: subscriptionDetails?.amount || "",
    currency: subscriptionDetails?.currency || "",
    subscription_id: subscriptionDetails?.record_id || "",
    client_id: subscriptionDetails?.client_id || "",
    platform_id: subscriptionDetails?.platform_id || "",
    pricing_plan_id: subscriptionDetails?.pricing_plan_id || "",
    payment_for: "subscription",
    payment_notes: "Subscription payment via M-Pesa"
  });
}
