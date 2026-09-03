/**
 * ════════════════════════════════════════════════════════════════
 * FILE: subscription-renewal.ts
 * PURPOSE: Backend API handlers for subscription renewal
 *
 * STRICT RULE:
 * subscriptions.billing_cycle = NUMBER OF DAYS (e.g. 7, 30, 90)
 * NO month logic, NO assumptions
 * ════════════════════════════════════════════════════════════════
 */

import { NextResponse } from 'next/server';
import { magicRandomStr, mosyQddata, mosyRightNow, mosySqlInsert, mosySqlUpdate } from '../../../apiUtils/dataControl/dataUtils';
import { mosySendSMS } from '../../../apiUtils/dataControl/send-sms';


// ════════════════════════════════════════════════════════════════
// HANDLER: renewSubscription
// ════════════════════════════════════════════════════════════════
export async function renewSubscription({ auth, payload }) {
  try {

    const {
      subscription_id,
      payment_mode,
      amount,
      ref_no = '',
      remark = ''
    } = payload;

    // ─────────────────────────────────────────────
    // 1️⃣ HARD VALIDATION
    // ─────────────────────────────────────────────
    if (!subscription_id) throw new Error('Missing subscription_id');
    if (!payment_mode) throw new Error('Missing payment mode');
    if (!amount || Number(amount) <= 0) throw new Error('Invalid amount');

    // ─────────────────────────────────────────────
    // 2️⃣ LOAD SUBSCRIPTION
    // ─────────────────────────────────────────────
    const subscription = await mosyQddata(
      'subscriptions',
      'record_id',
      subscription_id
    );

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const billingDays = Number(subscription.billing_cycle);

    if (!billingDays || billingDays <= 0) {
      throw new Error('Invalid billing_cycle (must be number of days)');
    }

    // ─────────────────────────────────────────────
    // 3️⃣ INSERT PAYMENT
    // ─────────────────────────────────────────────
    await mosySqlInsert(
      'payments',
      {
        record_id: magicRandomStr(),
        account_id: subscription.account_id,
        payment_context: subscription.subscription_name,
        context_id: subscription_id,
        app_id: subscription.asset_id,
        amount: amount,
        currency: subscription.currency,
        payment_method: payment_mode,
        payment_status: 'paid',
        external_reference: ref_no,
        paid_at: mosyRightNow(),
        created_at: mosyRightNow(),
        hive_site_id: auth.hive_site_id,
        hive_site_name: auth.hive_site_name
      },
      {}
    );

    // ─────────────────────────────────────────────
    // 4️⃣ EXTEND SUBSCRIPTION (DAYS ONLY)
    // ─────────────────────────────────────────────
    const now = new Date();

    const currentEnd = subscription.next_billing_date
      ? new Date(subscription.next_billing_date)
      : null;

    // If expired → start from today
    // If active → extend from current end
    const baseDate =
      !currentEnd || currentEnd < now
        ? now
        : currentEnd;

    const newEnd = new Date(baseDate);
    newEnd.setDate(newEnd.getDate() + billingDays);

    await mosySqlUpdate(
      'subscriptions',
      {
        start_date: baseDate.toISOString().slice(0, 10),
        end_date: newEnd.toISOString().slice(0, 10),
        next_billing_date: newEnd.toISOString().slice(0, 10),
        status: 'active',
        updated_at: mosyRightNow()
      },
      {},
      `record_id='${subscription_id}'`
    );

    // ─────────────────────────────────────────────
    // 5️⃣ LOAD USER PHONE
    // ─────────────────────────────────────────────
    const user = await mosyQddata(
      'app_users',
      'record_id',
      subscription.account_id
    );

    // ─────────────────────────────────────────────
    // 6️⃣ SEND SMS (NON-BLOCKING)
    // ─────────────────────────────────────────────
    if (user?.phone_number) {
      const smsMessage =
        `Dear customer, your ${subscription?.subscription_name} subscription has been renewed. ` +
        `\nAmount: ${amount} ${subscription.currency}. ` +
        `\nRef No: ${ref_no} ` +
        `\nValid until ${newEnd.toISOString().slice(0, 10)}.`;

      mosySendSMS(user.phone_number, smsMessage)
        .catch(err =>
          console.warn('⚠️ SMS failed:', err?.message)
        );
    }

    // ─────────────────────────────────────────────
    // 7️⃣ RESPONSE
    // ─────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      message: 'Subscription renewed successfully',
      data: {
        subscription_id,
        valid_until: newEnd.toISOString().slice(0, 10),
        billing_days: billingDays
      }
    });

  } catch (error) {

    console.error('❌ renewSubscription error:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Subscription renewal failed'
      },
      { status: 500 }
    );
  }
}
