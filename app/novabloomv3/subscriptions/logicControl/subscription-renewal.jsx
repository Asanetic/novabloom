/** 
 * ════════════════════════════════════════════════════════════════
 * FILE: subscription-renewal.jsx
 * PURPOSE: Frontend logic for renewing a subscription
 *
 * Flow:
 * 1. Triggered with subscription_id only
 * 2. Opens MosyCard modal (id: modal3)
 * 3. User enters:
 *    - payment mode
 *    - amount
 *    - reference number
 *    - optional remarks
 * 4. User clicks Confirm
 * 5. Show topmost MosyNotify (processing)
 * 6. Send action + payload to smart API
 * ════════════════════════════════════════════════════════════════
 */

import { closeMosyCard, MosyCard } from "../../../components/MosyCard";
import { MosyNotify } from "../../../MosyUtils/ActionModals";
import { mosyPostData } from "../../../MosyUtils/hiveUtils";
import { getApiRoutes } from "../../AppRoutes/apiRoutesHandler";

const apiRoutes = getApiRoutes();


// ════════════════════════════════════════════════════════════════
// FUNCTION: renewSubscription
// ════════════════════════════════════════════════════════════════
export function renewSubscription(subscription_id) {

  if(!subscription_id)
  {
    MosyNotify({message: "Renewal action not available. Please refresh your page and try again", icon: "times-circle", iconColor: "text-danger", addTimer: false, id: "topmost"});
    return
  }
    MosyCard(
      `Renew Subscription ${subscription_id}`,
      <div className="row justify-content-center col-md-12 p-0 m-0 ">
  
        <div className="col-md-6 text-left form-group mb-3">
          <label>Payment Mode</label>
          <select id="txt_payment_mode" className="form-control">
            <option value="">-- Select --</option>
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="mpesa">Mpesa</option>
            <option value="card">Card</option>
          </select>
        </div>
  
        <div className="col-md-6 text-left form-group mb-3">
          <label>Amount Paid</label>
          <input
            id="txt_payment_amount"
            type="number"
            className="form-control"
            placeholder="Enter amount"
          />
        </div>
  
        <div className="col-md-12 text-left form-group mb-3">
          <label>Reference Number</label>
          <input
            id="txt_payment_ref_no"
            type="text"
            className="form-control"
            placeholder="Transaction / Ref number"
          />
        </div>
  
        <div className="col-md-12 text-left form-group mb-3">
          <label>Remarks (optional)</label>
          <textarea
            id="txt_payment_remark"
            className="form-control"
            rows="3"
            style={{ minHeight: "200px" }}
            placeholder="Any additional notes"
          />
        </div>
  
        <div className="text-right mt-4">
          <button
            className="btn btn-secondary mr-2"
            onClick={() => closeMosyCard("modal3")}
          >
            Cancel
          </button>
  
          <button
            className="btn btn-primary"
            onClick={async () => {
  
              const payment_mode = document.getElementById("txt_payment_mode")?.value?.trim();
              const amount = document.getElementById("txt_payment_amount")?.value?.trim();
              const ref_no = document.getElementById("txt_payment_ref_no")?.value?.trim();
              const remark = document.getElementById("txt_payment_remark")?.value?.trim();
  
              // ─────────────────────────────────────────────
              // 1️⃣ VALIDATION (STRICT + CONDITIONAL)
              // ─────────────────────────────────────────────
              if (!payment_mode) {
                MosyNotify({
                  id: "topmost",
                  message: "Please select a payment mode",
                  icon: "exclamation-triangle",
                  addTimer: false
                });
                return;
              }
  
              if (amount=="") {
                MosyNotify({
                  id: "topmost",
                  message: "Amount is required and must be greater than zero",
                  icon: "exclamation-triangle",
                  addTimer: false
                });
                return;
              }
  
              // 🔒 Reference number required ONLY if not cash
              if (payment_mode !== "cash" && !ref_no) {
                MosyNotify({
                  id: "topmost",
                  message: "Reference number is required for non-cash payments",
                  icon: "exclamation-triangle",
                  addTimer: false
                });
                return;
              }
  
              // ─────────────────────────────────────────────
              // 2️⃣ PROCESSING NOTIFY (AFTER VALIDATION)
              // ─────────────────────────────────────────────
              MosyNotify({
                id: "topmost",
                message: "Processing subscription renewal…",
                icon: "refresh",
                addTimer: false
              });
  
              try {
                const res = await mosyPostData({
                  url: apiRoutes.smartapi.base,
                  data: {
                    action: "renewSubscription",
                    payload: {
                      subscription_id,
                      payment_mode,
                      amount,
                      ref_no,
                      remark
                    }
                  }
                });
  
                // ─────────────────────────────────────────────
                // 3️⃣ SUCCESS
                // ─────────────────────────────────────────────
                MosyNotify({
                  id: "topmost",
                  message: res?.message || "Subscription renewed successfully",
                  icon: "check-circle",
                  addTimer: true
                });
  
                closeMosyCard("modal3");
  
              } catch (err) {
  
                // ─────────────────────────────────────────────
                // 4️⃣ FAILURE
                // ─────────────────────────────────────────────
                MosyNotify({
                  id: "topmost",
                  message: "Renewal failed. Please try again.",
                  icon: "exclamation-triangle",
                  addTimer: false
                });
              }
            }}
          >
            Confirm Renewal
          </button>
        </div>
      </div>,
      true,
      "modal3"
    );
  }
  
