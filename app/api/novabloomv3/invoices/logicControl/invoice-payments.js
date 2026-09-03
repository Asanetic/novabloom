/**
 * ════════════════════════════════════════════════════════════════
 * FILE: invoice-payments.ts
 * PURPOSE: Backend API handlers for invoice-payments
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from 'next/server';
import { magicRandomStr, mosyQddata, mosyRightNow, mosySqlInsert, mosySqlUpdate, mosySumRows } from '../../../apiUtils/dataControl/dataUtils';
import { mosySendSMS } from '../../../apiUtils/dataControl/send-sms';

// ════════════════════════════════════════════════════════════════
// COMMON UTILITIES IMPORT
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// HANDLER: addInvoicePayments
// AUTH: Authentication and user data
// PAYLOAD: Request data from frontend
// RETURNS: NextResponse with { success, message, data }
/* 
addInvoicePayments Flow

*/
// ════════════════════════════════════════════════════════════════
export async function addInvoicePayments({auth, payload}) {
    try {
        const {
            invoice_id,
            payment_method,
            amount,
            external_reference = "",
            remark = "",
        } = payload || {};

        // 1) HARD VALIDATION (match subscription-renewal style)
        if (!invoice_id) {
            return { success: false, message: "Missing invoice_id" };
        }
        if (!payment_method) {
            return { success: false, message: "Missing payment_method" };
        }

        const paidAmount = Number(amount || 0);
        if (!Number.isFinite(paidAmount) || paidAmount <= 0) {
            return { success: false, message: "Invalid amount" };
        }

        // 2) LOAD INVOICE (to attach payment to right client/subscription/asset)
        const invoice = await mosyQddata("invoices", "record_id", invoice_id);
        if (!invoice) {
            return { success: false, message: "Invoice not found" };
        }

        const nowIso = new Date().toISOString();
        const paymentId = magicRandomStr(10);

        const paymentRow = {
            record_id: paymentId,
            account_id: invoice?.client_id || invoice?.account_id || "",
            payment_context: "invoice",
            context_id: invoice.subscription_id,
            invoice_id: invoice_id,
            amount: String(paidAmount),
            currency: invoice?.currency || "",
            payment_method: payment_method,
            payment_status: "paid",
            external_reference: external_reference || "",
            paid_at: nowIso,
            created_at: nowIso,
            hive_site_id: auth?.hive_site_id || invoice?.hive_site_id || "",
            hive_site_name: auth?.hive_site_name || invoice?.hive_site_name || "",
            app_id: invoice?.asset_id || "",
        };

        // 3) INSERT PAYMENT (custom insert because default payments gateway omits invoice_id)
        await mosySqlInsert("payments", paymentRow, {});

        // 4) UPDATE INVOICE TOTALS/STATUS
        const paidTotal = Number((await mosySumRows("payments", "amount", `where invoice_id='${invoice_id}'`))?.total || 0);
        const invoiceTotal = Number(invoice?.total_amount || 0);
        const balanceDue = invoiceTotal - paidTotal;

        await mosySqlUpdate(
            "invoices",
            {
                paid_amount: String(paidTotal),
                balance_due: String(balanceDue),
                status: balanceDue <= 0 ? "Paid" : "Issued",
                updated_at: mosyRightNow(),
            },
            {},
            `record_id='${invoice_id}'`
        );

        // 5) OPTIONAL: IF THIS IS A SUBSCRIPTION INVOICE AND IT'S FULLY PAID, EXTEND SUBSCRIPTION (DAYS ONLY)
        const subscriptionUpdate = { attempted: false, success: false, message: "" };
        if (balanceDue <= 0 && invoice?.subscription_id) {
            subscriptionUpdate.attempted = true;
            try {
                const subscription = await mosyQddata("subscriptions", "record_id", invoice.subscription_id);

                if (!subscription) {
                    subscriptionUpdate.message = "Subscription not found";
                } else {
                    const billingDays = Number(subscription.billing_cycle);
                    if (!billingDays || billingDays <= 0) {
                        subscriptionUpdate.message = "Invalid billing_cycle (must be number of days)";
                    } else {
                        const now = new Date();
                        const currentEnd = subscription.next_billing_date ? new Date(subscription.next_billing_date) : null;
                        const baseDate = (!currentEnd || currentEnd < now) ? now : currentEnd;

                        const newEnd = new Date(baseDate);
                        newEnd.setDate(newEnd.getDate() + billingDays);

                        await mosySqlUpdate(
                            "subscriptions",
                            {
                                start_date: baseDate.toISOString().slice(0, 10),
                                end_date: newEnd.toISOString().slice(0, 10),
                                next_billing_date: newEnd.toISOString().slice(0, 10),
                                status: "active",
                                updated_at: mosyRightNow(),
                            },
                            {},
                            `record_id='${invoice.subscription_id}'`
                        );

                        subscriptionUpdate.success = true;
                        subscriptionUpdate.message = "Subscription extended";
                    }
                }
            } catch (e) {
                subscriptionUpdate.message = e?.message || "Subscription update failed";
            }
        }

        // 6) OPTIONAL: SEND SMS (NON-BLOCKING) ABOUT PAYMENT
        const smsNotify = { attempted: false, success: false, message: "" };
        try {
            const userId = invoice?.client_id || invoice?.account_id;
            if (userId) {
                const user = await mosyQddata("app_users", "record_id", userId);
                if (user?.phone_number) {
                    smsNotify.attempted = true;
                    const smsMessage =
                        `Invoice payment received. ` +
                        `${invoice?.invoice_number ? `Invoice: ${invoice.invoice_number}. ` : ""}` +
                        `Amount: ${paidAmount}${invoice?.currency ? ` ${invoice.currency}` : ""}. ` +
                        `Balance: ${balanceDue}${invoice?.currency ? ` ${invoice.currency}` : ""}.`;

                    mosySendSMS(user.phone_number, smsMessage)
                        .then(() => {
                            smsNotify.success = true;
                            smsNotify.message = "SMS queued";
                        })
                        .catch((err) => {
                            smsNotify.message = err?.message || "SMS failed";
                        });
                }
            }
        } catch (e) {
            smsNotify.message = e?.message || "SMS notify failed";
        }

        return {
            success: true,
            message: "Payment added to invoice",
            payment_id: paymentId,
            invoice_id: invoice_id,
            paid_total: paidTotal,
            balance_due: balanceDue,
            subscription_update: subscriptionUpdate,
            sms_notify: smsNotify,
        };
    } catch (error) {
        console.error('Error in addInvoicePayments:', error);
        return { success: false, message: error.message || "Operation failed" };
    }
}
