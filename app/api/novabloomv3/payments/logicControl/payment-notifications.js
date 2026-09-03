/**
 * ════════════════════════════════════════════════════════════════
 * FILE: payment-notifications.ts
 * PURPOSE: Backend API handlers for payment-notifications
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from 'next/server';
import { mosyQddata, mosySqlInsert } from '../../../apiUtils/dataControl/dataUtils';
import { mosySendSMS } from '../../../apiUtils/dataControl/send-sms';
import { mosySendEmail } from '../../../apiUtils/dataControl/send-gmail';
import { magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

// ════════════════════════════════════════════════════════════════
// COMMON UTILITIES IMPORT
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// HANDLER: sendPaymentReceipt
// AUTH: Authentication and user data
// PAYLOAD: Request data from frontend
// RETURNS: NextResponse with { success, message, data }
/* 
sendPaymentReceipt Flow

*/
// ════════════════════════════════════════════════════════════════
export async function sendPaymentReceipt({auth, payload}) {
    try {
        const payment = payload?.payment || {};
        const customMessage = (payload?.customMessage || "").trim();

        // In this app, `account_id` on many tables points to `app_users.record_id`.
        const userRecordId = payment?.account_id || payload?.account_id || payload?.userRecordId;
        if (!userRecordId) {
            return NextResponse.json(
                { success: false, message: 'Missing account_id/userRecordId for receipt delivery' },
                { status: 400 }
            );
        }

        const user = await mosyQddata('app_users', 'record_id', userRecordId);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found for receipt delivery' },
                { status: 404 }
            );
        }

        const customerName = payment?._app_users_full_name_account_id || user?.full_name || "Customer";
        const receiptNo = payment?.record_id || payment?.external_reference || payment?.primkey || "";
        const referenceNo = payment?.external_reference || payment?.record_id || "";
        const paymentFor = payment?._subscriptions_subscription_name_context_id || payment?.payment_context || payment?.context_id || "";
        const currency = payment?.currency || "";
        const amount = payment?.amount || "";
        const paidAt = payment?.paid_at || payment?.created_at || "";
        const method = payment?.payment_method || "";
        const status = payment?.payment_status || "";

        const smsBody = [
            `Receipt ${receiptNo}`.trim(),
            customerName ? `For ${customerName}` : "",
            paymentFor ? `Payment: ${paymentFor}` : "",
            (currency || amount) ? `Amount: ${currency} ${amount}`.trim() : "",
            method ? `Method: ${method}` : "",
            status ? `Status: ${status}` : "",
            referenceNo ? `Ref: ${referenceNo}` : "",
            paidAt ? `Date: ${paidAt}` : "",
            customMessage ? `${customMessage}` : "",
        ].filter(Boolean).join("\n");

        const emailSubject = `Payment Receipt${paymentFor ? ` - ${paymentFor}` : ""}`;
        const emailBody = [
            `Hello ${customerName},`,
            "",
            "Your payment receipt details:",
            receiptNo ? `Receipt No: ${receiptNo}` : "",
            referenceNo ? `Reference: ${referenceNo}` : "",
            paymentFor ? `Payment For: ${paymentFor}` : "",
            (currency || amount) ? `Amount: ${currency} ${amount}`.trim() : "",
            method ? `Method: ${method}` : "",
            status ? `Status: ${status}` : "",
            paidAt ? `Date: ${paidAt}` : "",
            "",
            customMessage ? `Message: ${customMessage}` : "",
            "",
            "Thank you.",
        ].filter(Boolean).join("\n");

        const baseInsert = {
            record_id: magicRandomStr(12),
            user_record_id: userRecordId,
            hive_site_id: auth?.hive_site_id || '',
            hive_site_name: auth?.hive_site_name || '',
            message_body: emailBody,
        };

        const results = {
            sms: { attempted: false, success: false, to: null, error: null },
            email: { attempted: false, success: false, to: null, error: null },
        };

        const tel = user?.phone_number;
        if (tel) {
            results.sms.attempted = true;
            results.sms.to = tel;
            try {
                await mosySendSMS(tel, smsBody);
                results.sms.success = true;

                await mosySqlInsert(
                    'sent_messages',
                    {
                        ...baseInsert,
                        record_id: magicRandomStr(12),
                        send_channel: 'sms',
                        receiver_phone: tel,
                        message_body: smsBody,
                        send_status: 'success',
                        send_response: 'SMS sent successfully',
                    },
                    {}
                );
            } catch (smsErr) {
                results.sms.error = smsErr?.message || 'SMS send failed';
                await mosySqlInsert(
                    'sent_messages',
                    {
                        ...baseInsert,
                        record_id: magicRandomStr(12),
                        send_channel: 'sms',
                        receiver_phone: tel,
                        message_body: smsBody,
                        send_status: 'failed',
                        send_response: results.sms.error,
                    },
                    {}
                );
            }
        }

        const email = user?.email;
        if (email) {
            results.email.attempted = true;
            results.email.to = email;
            try {
                await mosySendEmail(email, emailSubject, emailBody);
                results.email.success = true;

                await mosySqlInsert(
                    'sent_messages',
                    {
                        ...baseInsert,
                        record_id: magicRandomStr(12),
                        send_channel: 'email',
                        receiver_email: email,
                        email_subject: emailSubject,
                        send_status: 'success',
                        send_response: 'Email sent successfully',
                    },
                    {}
                );
            } catch (mailErr) {
                results.email.error = mailErr?.message || 'Email send failed';
                await mosySqlInsert(
                    'sent_messages',
                    {
                        ...baseInsert,
                        record_id: magicRandomStr(12),
                        send_channel: 'email',
                        receiver_email: email,
                        email_subject: emailSubject,
                        send_status: 'failed',
                        send_response: results.email.error,
                    },
                    {}
                );
            }
        }

        if (!results.sms.attempted && !results.email.attempted) {
            return NextResponse.json(
                { success: false, message: 'User has no phone_number or email for receipt delivery' },
                { status: 400 }
            );
        }

        const anySuccess = results.sms.success || results.email.success;
        return NextResponse.json({
            success: anySuccess,
            message: anySuccess ? 'Receipt sent' : 'Receipt delivery failed',
            data: results,
        });
    } catch (error) {
        console.error('Error in sendPaymentReceipt:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || 'Operation failed'
        }, { status: 500 });
    }
}
