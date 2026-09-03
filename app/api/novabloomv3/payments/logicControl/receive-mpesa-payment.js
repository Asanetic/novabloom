import { magicRandomStr, mosyRightNow, mosySqlInsert } from '../../../apiUtils/dataControl/dataUtils';

function toSafeString(value = '') {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function toAmountString(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return '';
  return String(n);
}

export async function receiveMpesaPayment({ auth, payload }) {
  try {
    const amountPaid = toAmountString(payload?.amount_paid);
    const phoneNumber = toSafeString(payload?.phone_number);
    const paymentFor = toSafeString(payload?.payment_for || 'general');
    const currencyCode = toSafeString(payload?.currency_code || payload?.currency);

    if (!amountPaid) {
      return { success: false, message: 'amount_paid is required and must be greater than 0' };
    }

    if (!phoneNumber) {
      return { success: false, message: 'phone_number is required' };
    }

    if (!currencyCode) {
      return { success: false, message: 'currency_code is required' };
    }

    const now = mosyRightNow();
    const recordId = toSafeString(payload?.record_id) || magicRandomStr(12);

    const row = {
      record_id: recordId,
      paid_on: toSafeString(payload?.paid_on) || now,
      amount_paid: amountPaid,
      payment_for: paymentFor,
      payment_notes: toSafeString(payload?.payment_notes),
      transaction_ref: toSafeString(payload?.transaction_ref),
      invoice_id: toSafeString(payload?.invoice_id),
      subscription_id: toSafeString(payload?.subscription_id),
      platform_id: toSafeString(payload?.platform_id),
      pricing_plan_id: toSafeString(payload?.pricing_plan_id),
      paid_by: toSafeString(payload?.paid_by),
      phone_number: phoneNumber,
      client_id: toSafeString(payload?.client_id),
      payment_method: toSafeString(payload?.payment_method || 'mpesa'),
      payment_status: toSafeString(payload?.payment_status || 'completed'),
      currency_code: currencyCode,
      created_at: toSafeString(payload?.created_at) || now,
      updated_at: toSafeString(payload?.updated_at) || now,
      hive_site_id: toSafeString(payload?.hive_site_id || auth?.hive_site_id),
      hive_site_name: toSafeString(payload?.hive_site_name || auth?.hive_site_name)
    };

    await mosySqlInsert('payment_history', row, {});

    // Plug your business logic here to attach payment to sales, subscription renewal, loan repayment, etc.
    // Example: if (row.payment_for === 'sales') { ... }

    return {
      success: true,
      message: 'Payment received and saved successfully',
      data: {
        record_id: row.record_id,
        transaction_ref: row.transaction_ref,
        payment_for: row.payment_for,
        amount_paid: row.amount_paid,
        currency_code: row.currency_code
      }
    };
  } catch (error) {
    console.error('Error in receiveMpesaPayment:', error);
    return { success: false, message: error.message || 'Operation failed' };
  }
}
