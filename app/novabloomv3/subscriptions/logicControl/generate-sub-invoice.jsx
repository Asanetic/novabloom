/**
 * ════════════════════════════════════════════════════════════════
 * FILE: generate-sub-invoice.jsx
 * PURPOSE: Frontend logic functions for generate-sub-invoice
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { mosyPostData, mosyTonum, mosyFormatDateTime, mosyFormatDateOnly } from "../../../MosyUtils/hiveUtils";
import { getApiRoutes } from "../../AppRoutes/apiRoutesHandler";
import { MosyNotify, MosyAlertCard } from "../../../MosyUtils/ActionModals";
import { closeMosyCard, MosyCard } from "../../../components/MosyCard";
import { senduserMessage } from "../../users/logicControl/user-notify";

const apiRoutes = getApiRoutes();

// ════════════════════════════════════════════════════════════════
// FUNCTION: generateSubInvoice
/* 
Function flow notes
 
how generateSubInvoice works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function generateSubInvoice(subscriptionsNode) {

    const node = subscriptionsNode

    // `subscriptionsNode` typically comes from subscriptions list/profile API response.
    // Keep mappings resilient since some fields can be empty strings.
    const subscription_id = node?.record_id || "";
    const account_id = node?.account_id  
    const customerName = node?._app_users_full_name_account_id || "-";

    const subscriptionName =
        (node?.subscription_name && String(node.subscription_name).trim()) ||
        (node?._assets_asset_name_asset_id && String(node._assets_asset_name_asset_id).trim()) ||
        (node?._asset_pricing_model_name_pricing_id && String(node._asset_pricing_model_name_pricing_id).trim()) ||
        "-";

    const currencyRaw = (node?.currency && String(node.currency).trim()) || "";
    const currency = currencyRaw || "-";
    const amountRaw = Number(node?.amount || 0);
    const amountLabel = currencyRaw ? `${currencyRaw} ${mosyTonum(amountRaw)}`.trim() : `${mosyTonum(amountRaw)}`;

    const invoiceDateSrc = node?.updated_at || node?.created_at || new Date().toISOString();
    const invoiceDate = mosyFormatDateTime(invoiceDateSrc);
    const dueDate = node?.next_billing_date ? mosyFormatDateOnly(node?.next_billing_date) : "-";

    if (!account_id) {
        MosyNotify({
            id: "topmost",
            message: "Account ID missing. Refresh and try again.",
            icon: "exclamation-triangle",
            addTimer: false,
        });
        return;
    }

    const invoice = {
        action: "generateSubInvoice",
        payload: {
            subscription_id,
            account_id,
            subscription_name: subscriptionName,
            currency: currencyRaw,
            amount: node?.amount ?? amountRaw,
            asset_id: node?.asset_id,
            pricing_id: node?.pricing_id,
            next_billing_date: node?.next_billing_date,
        },
        headerTitle: "Subscription Invoice",
        headerSubtitle: subscriptionName,
        invoiceNo: node?.record_id || "-",
        invoiceDate,
        dueDate,
        customerName,
        accountId: account_id,
        currency,
        amountLabel: amountLabel || "-",
        items: [
            {
                description: subscriptionName,
                qty: "1",
                rate: amountLabel,
                amount: amountLabel,
            }
        ],
        footerRemark: "Thank you for your business.",
    };

    MosyCard(
        <div className="col-md-12 text-left h3">Invoice Preview</div>,
        <div className="col-md-12 text-left">
            <div className="border rounded p-3 bg-white">
                <div className="d-flex justify-content-between align-items-start border-bottom pb-2 mb-3">
                    <div>
                        <div className="h5 mb-1">Asanetic Enterprises</div>
                        <div className="small text-muted">Tel: 254710766390</div>
                        <div className="small text-muted">Email: jereasanya@gmail.com</div>
                        <div className="small text-muted">Location: Nairobi, Kenya</div>
                    </div>
                    <div className="text-right small">
                        <div><b>Client:</b> {invoice.customerName}</div>
                        <div><b>Account ID:</b> {invoice.accountId}</div>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-start border-bottom pb-2 mb-3">
                    <div>
                        <h5 className="mb-1">{invoice.headerTitle}</h5>
                        <div className="text-muted small">{invoice.headerSubtitle}</div>
                    </div>
                    <div className="text-right small">
                        <div><b>Invoice No:</b> {invoice.invoiceNo}</div>
                        <div><b>Date:</b> {invoice.invoiceDate}</div>
                        <div><b>Due:</b> {invoice.dueDate}</div>
                    </div>
                </div>

                <div className="row m-0 p-0 mb-3">
                    <div className="col-md-6 p-0 pr-md-2">
                        <h6 className="mb-2">Invoice Details</h6>
                        <div className="small"><b>Subscription ID:</b> {subscription_id || "-"}</div>
                        <div className="small"><b>Payment For:</b> {subscriptionName}</div>
                        <div className="small"><b>Start Date:</b> {node?.start_date ? mosyFormatDateOnly(node.start_date) : "-"}</div>
                    </div>
                    <div className="col-md-6 p-0 pl-md-2 mt-3 mt-md-0">
                        <h6 className="mb-2">Totals</h6>
                        <div className="small"><b>Currency:</b> {invoice.currency}</div>
                        <div className="small"><b>Amount:</b> {invoice.amountLabel}</div>
                    </div>
                </div>

                <div className="table-responsive mb-3">
                    <table className="table table-sm table-bordered mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Description</th>
                                <th className="text-right">Qty</th>
                                <th className="text-right">Rate</th>
                                <th className="text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, idx) => (
                                <tr key={`invoice_item_${idx}`}>
                                    <td>{item.description}</td>
                                    <td className="text-right">{item.qty}</td>
                                    <td className="text-right">{item.rate}</td>
                                    <td className="text-right">{item.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan="3" className="text-right">Total</th>
                                <th className="text-right">{invoice.amountLabel}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="border-top pt-2 small text-muted">
                    <div><b>Remark:</b> {invoice.footerRemark}</div>
                </div>
            </div>

            <div className="form-group mt-3 mb-3">
                <label className="label_text">Optional Message</label>
                <textarea
                    id="txt_invoice_send_note"
                    className="form-control"
                    placeholder="Add a short message to include with this invoice"
                    defaultValue=""
                    style={{ minHeight: "90px" }}
                />
            </div>

            <div className="text-right">
                <button className="btn btn-outline-secondary mr-2" onClick={() => downloadInvoicePdf(invoice)}>
                    <i className="fa fa-download"></i> Download PDF
                </button>
                <button className="btn btn-secondary mr-2" onClick={() => closeMosyCard("modal3")}>
                    Cancel
                </button>
                <button className="btn btn-primary" onClick={() => confirmGenerateSubInvoice(invoice)}>
                    <i className="fa fa-paper-plane"></i> Generate / Send
                </button>
            </div>
        </div>,
        true,
        "modal3",
        "mosycard_wide"
    );
}

function confirmGenerateSubInvoice(invoicePayload) {
    MosyAlertCard({
        id: "modal2",
        title: "Generate Invoice",
        message: "Do you want to generate and send this invoice now?",
        yesLabel: "Yes, Continue",
        noLabel: "Cancel",
        onYes: () => {
            closeMosyCard("modal2");
            executeGenerateSubInvoice(invoicePayload);
        },
        onNo: () => closeMosyCard("modal2"),
    });
}

async function executeGenerateSubInvoice(invoicePayload) {
    const customMessage = document.getElementById("txt_invoice_send_note")?.value?.trim() || "";

    MosyNotify({
        message: "Generating invoice...",
        icon: "refresh",
        addTimer: false,
        id: "topmost",
    });

    try {
        const res = await mosyPostData({
            url: apiRoutes.smartapi.base,
            data: {
                action: invoicePayload.action,
                payload: {
                    ...invoicePayload.payload,
                    customMessage,
                },
            },
        });

        // Close invoice preview modal
        //closeMosyCard("modal3");

        const invData = res?.data || res || {};
        const invoiceNumber = invData?.invoice_number || invData?.invoiceNumber || "";
        const invoiceId = invData?.invoice_id || invData?.invoiceId || "";

        MosyNotify({
            message: invData?.message || "Invoice generated successfully",
            icon: "check-circle",
            addTimer: true,
            id: "topmost",
        });

        MosyAlertCard({
            id: "topmost",
            title: "Send Invoice",
            message: "Invoice generated. Do you want to send it to the client now?",
            yesLabel: "Yes, Send",
            noLabel: "No",
            onNo: () => {closeMosyCard("topmost")},
            onYes: () => {
                closeMosyCard("topmost");

                const subject = invoiceNumber
                    ? `Invoice ${invoiceNumber}`
                    : (invoiceId ? `Invoice ${invoiceId}` : "Subscription Invoice");

                const msgLines = [
                    `Hello ${invoicePayload?.customerName || "Customer"},`,
                    "",
                    "Your invoice has been generated.",
                    invoiceNumber ? `Invoice No: ${invoiceNumber}` : "",
                    invoiceId && !invoiceNumber ? `Invoice ID: ${invoiceId}` : "",
                    invoicePayload?.headerSubtitle ? `Service: ${invoicePayload.headerSubtitle}` : "",
                    invoicePayload?.amountLabel ? `Amount Due: ${invoicePayload.amountLabel}` : "",
                    invoicePayload?.dueDate && invoicePayload?.dueDate !== "-" ? `Due Date: ${invoicePayload.dueDate}` : "",
                    "",
                    "Asanetic Enterprises",
                    "Tel: 254710766390",
                    "Email: jereasanya@gmail.com",
                    "Location: Nairobi, Kenya",
                ].filter(Boolean).join("\n");

                senduserMessage({
                    userRecordId: invoicePayload?.accountId || invoicePayload?.payload?.account_id,
                    username: invoicePayload?.customerName || "Client",
                    subject,
                    message: msgLines,
                });
            },
        });

        return res;
    } catch (err) {
        MosyNotify({
            message: "Failed to generate invoice - try again",
            icon: "exclamation-triangle",
            addTimer: false,
            id: "topmost",
        });

        return { status: "error", message: "Failed to generate invoice" };
    }
}

function downloadInvoicePdf(invoice) {
    const customMessage = document.getElementById("txt_invoice_send_note")?.value?.trim() || "";

    const esc = (val) => String(val ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('\"', "&quot;")
        .replaceAll("'", "&#39;");

    const itemsHtml = (Array.isArray(invoice?.items) ? invoice.items : []).map((it) => `
      <tr>
        <td>${esc(it?.description)}</td>
        <td style="text-align:right;">${esc(it?.qty)}</td>
        <td style="text-align:right;">${esc(it?.rate)}</td>
        <td style="text-align:right;">${esc(it?.amount)}</td>
      </tr>
    `).join("");

    const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Invoice ${esc(invoice?.invoiceNo)}</title>
        <style>
          :root { --border:#e5e7eb; --muted:#6b7280; }
          body { font-family: Arial, Helvetica, sans-serif; color:#111827; margin:24px; }
          .row { display:flex; justify-content:space-between; gap:16px; }
          .muted { color: var(--muted); }
          .box { border:1px solid var(--border); border-radius:10px; padding:16px; }
          .mb16 { margin-bottom:16px; }
          table { width:100%; border-collapse: collapse; }
          th, td { border:1px solid var(--border); padding:8px; font-size:12px; }
          th { background:#f9fafb; text-align:left; }
          .right { text-align:right; }
          @media print { body { margin:0; } .no-print { display:none; } }
        </style>
      </head>
      <body>
        <div class="no-print mb16">
          <button onclick="window.print()">Print / Save as PDF</button>
        </div>
        <div class="box">
          <div class="row mb16" style="border-bottom:1px solid var(--border); padding-bottom:12px;">
            <div>
              <h3>Asanetic Enterprises</h3>
              <div class="muted" style="font-size:12px;">Tel: 254710766390</div>
              <div class="muted" style="font-size:12px;">Email: jereasanya@gmail.com</div>
              <div class="muted" style="font-size:12px;">Location: Nairobi, Kenya</div>
            </div>
            <div style="text-align:right; font-size:12px;">
              <div><b>Client:</b> ${esc(invoice?.customerName)}</div>
              <div><b>Account ID:</b> ${esc(invoice?.accountId)}</div>
            </div>
          </div>
          <div class="row mb16" style="border-bottom:1px solid var(--border); padding-bottom:12px;">
            <div>
              <h3>${esc(invoice?.headerTitle)}</h3>
              <div class="muted" style="font-size:12px;">${esc(invoice?.headerSubtitle)}</div>
            </div>
            <div style="text-align:right; font-size:12px;">
              <div><b>Invoice No:</b> ${esc(invoice?.invoiceNo)}</div>
              <div><b>Date:</b> ${esc(invoice?.invoiceDate)}</div>
              <div><b>Due:</b> ${esc(invoice?.dueDate)}</div>
            </div>
          </div>

          <table class="mb16">
            <thead>
              <tr>
                <th>Description</th>
                <th class="right">Qty</th>
                <th class="right">Rate</th>
                <th class="right">Amount</th>
              </tr>
            </thead>
            <tbody>${itemsHtml || ""}</tbody>
            <tfoot>
              <tr>
                <th colspan="3" class="right">Total</th>
                <th class="right">${esc(invoice?.amountLabel)}</th>
              </tr>
            </tfoot>
          </table>

          <div style="border-top:1px solid var(--border); padding-top:10px; font-size:12px;" class="muted">
            <div><b>Remark:</b> ${esc(invoice?.footerRemark)}</div>
            ${customMessage ? `<div><b>Message:</b> ${esc(customMessage)}</div>` : ""}
          </div>
        </div>
      </body>
    </html>
  `;

    let win = null;
    try {
        win = window.open("about:blank", "_blank", "width=900,height=700");
    } catch (e) {
        win = null;
    }

    if (win && win.document) {
        try {
            win.document.open();
            win.document.write(html);
            win.document.close();
            win.focus();
            return;
        } catch (e) { }
    }

    try {
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const opened = window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 60_000);

        if (!opened) {
            MosyNotify({
                message: "Popup blocked. Allow popups to download the invoice PDF.",
                icon: "exclamation-triangle",
                addTimer: true,
                id: "topmost",
            });
        }
    } catch (e) {
        MosyNotify({
            message: "Failed to open invoice preview for PDF download.",
            icon: "exclamation-triangle",
            addTimer: true,
            id: "topmost",
        });
    }
}
