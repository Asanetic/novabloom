/**
 * ════════════════════════════════════════════════════════════════
 * FILE: invoice-payments.jsx
 * PURPOSE: Frontend logic functions for invoice-payments
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { closeMosyCard, MosyCard } from "../../../components/MosyCard";
import { MosyNotify, MosyAlertCard } from "../../../MosyUtils/ActionModals";
import { mosyPostData } from "../../../MosyUtils/hiveUtils";
import { getApiRoutes } from "../../AppRoutes/apiRoutesHandler";

const apiRoutes = getApiRoutes();

// ════════════════════════════════════════════════════════════════
// FUNCTION: addInvoicePayment
/* 
Function flow notes
 
how addInvoicePayment works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function addInvoicePayment() {
    // Implement addInvoicePayment logic here
    alert("addInvoicePayment");
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: loadSubscriptionData
/* 
Function flow notes
 
how loadSubscriptionData works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function loadSubscriptionData(dataRes, handler) {
    // Implement loadSubscriptionData logic here 
    // Implement loadPricing logic here
        const subscription_name = dataRes?.subscription_name
        handler("total_amount", dataRes?.amount);
        handler("currency", dataRes?.currency);
        handler("billing_cycle", dataRes?.billing_cycle);
        handler("invoice_remark", subscription_name)
        
}

// ════════════════════════════════════════════════════════════════
// FUNCTION: addInvoicePayments
/* 
Function flow notes
 
how addInvoicePayments works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function addInvoicePayments(invoiceid) {

    if (!invoiceid) {
        MosyNotify({
            id: "topmost",
            message: "Invoice ID missing. Refresh and try again.",
            icon: "exclamation-triangle",
            addTimer: false,
        });
        return;
    }

    MosyCard(
        `Add Payment - Invoice ${invoiceid}`,
        <div className="row justify-content-center col-md-12 p-0 m-0 ">

            <div className="col-md-6 text-left form-group mb-3">
                <label>Payment Mode</label>
                <select id="txt_invpay_mode" className="form-control">
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
                    id="txt_invpay_amount"
                    type="number"
                    className="form-control"
                    placeholder="Enter amount"
                />
            </div>

            <div className="col-md-12 text-left form-group mb-3">
                <label>Reference Number</label>
                <input
                    id="txt_invpay_ref"
                    type="text"
                    className="form-control"
                    placeholder="Transaction / Ref number"
                />
            </div>

            <div className="col-md-12 text-left form-group mb-3">
                <label>Remarks (optional)</label>
                <textarea
                    id="txt_invpay_remark"
                    className="form-control"
                    rows="3"
                    style={{ minHeight: "160px" }}
                    placeholder="Any additional notes"
                />
            </div>

            <div className="text-right mt-4 col-md-12 p-0">
                <button
                    className="btn btn-secondary mr-2"
                    onClick={() => closeMosyCard("modal4")}
                >
                    Cancel
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => confirmAddInvoicePayment(invoiceid)}
                >
                    Confirm Payment
                </button>
            </div>
        </div>,
        true,
        "modal4"
    );
}

function confirmAddInvoicePayment(invoiceid) {
    const payment_method = document.getElementById("txt_invpay_mode")?.value?.trim();
    const amount = document.getElementById("txt_invpay_amount")?.value?.trim();
    const external_reference = document.getElementById("txt_invpay_ref")?.value?.trim();
    const remark = document.getElementById("txt_invpay_remark")?.value?.trim();

    if (!payment_method) {
        MosyNotify({ id: "topmost", message: "Please select a payment mode", icon: "exclamation-triangle", addTimer: false });
        return;
    }

    if (amount === "") {
        MosyNotify({ id: "topmost", message: "Amount is required", icon: "exclamation-triangle", addTimer: false });
        return;
    }

    if (payment_method !== "cash" && !external_reference) {
        MosyNotify({ id: "topmost", message: "Reference number is required for non-cash payments", icon: "exclamation-triangle", addTimer: false });
        return;
    }

    MosyAlertCard({
        id: "modal2",
        title: "Confirm Payment",
        message: "Do you want to add this payment to the invoice?",
        yesLabel: "Yes, Add",
        noLabel: "Cancel",
        onYes: () => {
            closeMosyCard("modal2");
            executeAddInvoicePayment(invoiceid, { payment_method, amount, external_reference, remark });
        },
    });
}

async function executeAddInvoicePayment(invoiceid, payload) {
    MosyNotify({ id: "topmost", message: "Adding payment...", icon: "refresh", addTimer: false });

    try {
        const res = await mosyPostData({
            url: apiRoutes.smartapi.base,
            data: {
                action: "addInvoicePayments",
                payload: {
                    invoice_id: invoiceid,
                    ...payload,
                },
            },
        });

        closeMosyCard("modal4");

        MosyNotify({
            id: "topmost",
            message: res?.data?.message || res?.message || "Payment added successfully",
            icon: "check-circle",
            addTimer: true,
        });

        return res;
    } catch (err) {
        MosyNotify({
            id: "topmost",
            message: "Failed to add invoice payment - try again",
            icon: "exclamation-triangle",
            addTimer: false,
        });

        return { status: "error", message: "Failed to add invoice payment" };
    }
}
