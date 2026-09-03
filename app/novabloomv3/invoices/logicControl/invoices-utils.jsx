/**
 * ════════════════════════════════════════════════════════════════
 * FILE: invoices-utils.jsx
 * PURPOSE: Frontend logic functions for invoices-utils
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { MosyCard } from "../../../components/MosyCard";
import { MosyNotify } from "../../../MosyUtils/ActionModals";
import { mosyFormatDateOnly, mosyTonum } from "../../../MosyUtils/hiveUtils";
import PaymentsList from "../../payments/uiControl/PaymentsList";
import { InteprateSelectsubscriptiontoinvoiceEvent } from "../../subscriptions/dataControl/SelectsubscriptiontoinvoiceRequestHandler";
import { IntepratePaymentsEvent } from "../../payments/dataControl/PaymentsRequestHandler";
import SelectsubscriptiontoinvoiceList from "../../subscriptions/uiControl/SelectsubscriptiontoinvoiceList";
import SubscriptionsList from "../../subscriptions/uiControl/SubscriptionsList";
import { senduserMessage } from "../../users/logicControl/user-notify";


// ════════════════════════════════════════════════════════════════
// FUNCTION: newInvoice
/* 
Function flow notes
 
how newInvoice works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function newInvoice() {
    // Implement newInvoice logic here
    //alert("newInvoice");

        MosyCard(`Select subscription to invoice`,   
            <SelectsubscriptiontoinvoiceList
                dataOut={{setChildDataOut: InteprateSelectsubscriptiontoinvoiceEvent}} 
                dataIn={{customProfilePath: "../subscriptions/profile",
                    showDataControlSections: true,
                    customQueryStr: ``}}/>, 
            true, "modal4","mosycard_wide")  
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewInvoicePayments
/* 
Function flow notes
 
how viewInvoicePayments works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewInvoicePayments(invoiceid) {
    // Implement viewInvoicePayments logic here
    //alert("viewInvoicePayments");

        MosyCard(`Invoice payments`,   
            <PaymentsList 
                dataOut={{setChildDataOut: IntepratePaymentsEvent}} 
                dataIn={{customProfilePath: "../payments/profile",
                    showDataControlSections: false,
                    customQueryStr: {invoiceId:btoa(invoiceid)}
                }}/>, 
            true, "modal4","mosycard_medium")  
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: sendInvoice
/* 
Function flow notes
 
how sendInvoice works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function sendInvoice(invoiceData) {
    const node = invoiceData

    const userRecordId = node?.account_id || node?.client_id || "";

    if (!userRecordId) {
        MosyNotify({
            id: "topmost",
            message: "Client account is missing. Refresh and try again.",
            icon: "exclamation-triangle",
            addTimer: false,
        });
        return;
    }

    const username = node?._app_users_full_name_client_id || "Client";
    const currency = String(node?.currency || "").trim();
    const formatMoney = (value) => {
        const amount = Number(value || 0);
        const label = mosyTonum(amount);
        return currency ? `${currency} ${label}` : label;
    };

    const subject = `Invoice ${node?.invoice_number || node?.record_id || ""}`.trim() || "Invoice";
    const message = [
        `Hello ${username},`,
        "",
        "Your invoice details:",
        `Invoice No: ${node?.invoice_number || "-"}`,
        `Description: ${node?.invoice_remark || node?._subscriptions_subscription_name_subscription_id || "-"}`,
        `Invoice Type: ${node?.invoice_type || "-"}`,
        `Status: ${node?.status || "-"}`,
        `Total Amount: ${formatMoney(node?.total_amount)}`,
        `Paid Amount: ${formatMoney(node?.payments_total)}`,
        `Balance Due: ${formatMoney(node?.invoice_balance)}`,
        `Issue Date: ${node?.issue_date ? mosyFormatDateOnly(node.issue_date) : "-"}`,
        `Due Date: ${node?.due_date ? mosyFormatDateOnly(node.due_date) : "-"}`,
        "",
        "Thank you.",
    ].join("\n");

    senduserMessage({
        userRecordId,
        username,
        subject,
        message,
    });
}
