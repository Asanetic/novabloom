import {
  magicRandomStr,
  mmres,
  mosyQddata,
  mosyQuickSel,
  mosySqlInsert,
  mosySqlUpdate,
  mosyToday,
  mosyRightNow
} from '../../apiUtils/dataControl/dataUtils';
import { mosySendSMS } from '../../apiUtils/dataControl/send-sms';
import { mosySendEmail } from '../../apiUtils/dataControl/send-gmail';

function addDays(dateStr, days) {
  const dt = new Date(dateStr);
  if (Number.isNaN(dt.getTime())) return mosyToday();
  dt.setDate(dt.getDate() + Number(days || 0));
  return dt.toISOString().split('T')[0];
}

function normalizeBillingDays(rawValue) {
  const days = parseInt(rawValue, 10);
  return Number.isFinite(days) && days > 0 ? days : 7;
}

function hasDatePassed(dateValue) {
  if (!dateValue) return false;

  const compareDate = new Date(dateValue);
  if (Number.isNaN(compareDate.getTime())) return false;

  const now = new Date();
  return compareDate.getTime() < now.getTime();
}

async function markAccountExpiredIfNeeded({ user, subscription, safeAccountId }) {

    console.log("markAccountExpiredIfNeeded", user, subscription, hasDatePassed(subscription?.next_billing_date));


  if (!user || !subscription) return false;
  if (!hasDatePassed(subscription?.next_billing_date)) return false;
  if ((subscription?.status || '').toLowerCase() === 'expired') return false;

  await mosySqlUpdate(
    'subscriptions',
    {
      status: 'Expired',
      updated_at: mosyRightNow()
    },
    {},
    `account_id='${safeAccountId}'`
  );

  return true;
}

async function sendSubscriptionNotification({ name, tel, email, subscription, trialPackage }) {
  const displayName = name || 'Customer';
  const packageName = trialPackage?.model_name || 'Trial Package';
  const amount = subscription?.amount ?? trialPackage?.amount ?? 0;
  const currency = subscription?.currency || trialPackage?.currency || '';
  const nextBillingDate = subscription?.next_billing_date || '';

  const smsMessage = [
    `Hello ${displayName},`,
    `Your subscription is active.`,
    `Package: ${packageName}`,
    `Amount: ${currency} ${amount}`.trim(),
    nextBillingDate ? `Next Billing: ${nextBillingDate}` : '',
    `Subscription ID: ${subscription?.record_id || ''}`
  ].filter(Boolean).join('\n');

  const emailSubject = `Subscription Activated - ${packageName}`;
  const emailMessage = [
    `Hello ${displayName},`,
    ``,
    `Welcome. Your subscription has been created successfully.`,
    `Package: ${packageName}`,
    `Amount: ${currency} ${amount}`.trim(),
    nextBillingDate ? `Next Billing Date: ${nextBillingDate}` : '',
    `Subscription ID: ${subscription?.record_id || ''}`,
    ``,
    `Thank you.`
  ].filter(Boolean).join('\n');

  const notifyResults = {
    sms: { attempted: false, success: false },
    email: { attempted: false, success: false }
  };

  if (tel) {
    notifyResults.sms.attempted = true;
    const smsRes = await mosySendSMS(tel, smsMessage);
    notifyResults.sms.success = smsRes?.status === 'success';
  }

  if (email) {
    notifyResults.email.attempted = true;
    const emailRes = await mosySendEmail(email, emailSubject, emailMessage);
    notifyResults.email.success = emailRes?.status === 'success';
  }

  return notifyResults;
}

export async function POST(AccountRequest) {
  try {
    const body = await AccountRequest.json();
    const {
      name = '',
      tel = '',
      email = '',
      accountid = '',
      assetid = ''
    } = body || {};

    if (!accountid || !assetid) {
      return Response.json(
        {
          status: 'error',
          message: 'accountid and assetid are required'
        },
        { status: 400 }
      );
    }

    const safeAccountId = mmres(String(accountid));
    const safeAssetId = mmres(String(assetid));

    let user = await mosyQddata('app_users', 'record_id', safeAccountId);
    let isNewRegistration = false;

    if (!user) {
      const now = mosyRightNow();
      const newUserData = {
        record_id: safeAccountId,
        first_name: '',
        last_name: '',
        full_name: name || '',
        email: email || '',
        phone_number: tel || '',
        password_hash: '',
        account_status: 'Active',
        email_verified: 'No',
        phone_verified: 'No',
        country: '',
        currency: '',
        created_at: now,
        updated_at: now
      };

      await mosySqlInsert('app_users', newUserData, {});
      user = await mosyQddata('app_users', 'record_id', safeAccountId);
      isNewRegistration = true;
    }

    const existingSubscription = await mosyQuickSel(
      'subscriptions',
      `WHERE account_id='${safeAccountId}' AND asset_id='${safeAssetId}' ORDER BY primkey DESC LIMIT 1`,
      'r'
    );

    if (existingSubscription) {
      const accountMarkedExpired = await markAccountExpiredIfNeeded({
        user,
        subscription: existingSubscription,
        safeAccountId
      });

      return Response.json({
        status: 'success',
        message: 'Subscription already exists',
        is_new_registration: isNewRegistration,
        account_marked_expired: accountMarkedExpired,
        subscription: existingSubscription
      });
    }

    const trialPackage = await mosyQuickSel(
      'asset_pricing',
      `WHERE asset_id='${safeAssetId}' AND pricing_type='trial' AND status='active' ORDER BY primkey DESC LIMIT 1`,
      'r'
    );

    console.log(`trialPackage ${safeAssetId}`, trialPackage)
    if (!trialPackage) {
      return Response.json(
        {
          status: 'error',
          message: 'No active trial package found for this asset'
        },
        { status: 404 }
      );
    }

    const startDate = mosyToday();
    const billingCycleDays = normalizeBillingDays(trialPackage.billing_cycle);
    const nextBillingDate = addDays(startDate, billingCycleDays);
    const now = mosyRightNow();
    const subscriptionId = magicRandomStr(7);

    const newSubscription = {
      record_id: subscriptionId,
      account_id: safeAccountId,
      subscription_name: trialPackage.model_name || 'Trial Subscription',
      asset_id: safeAssetId,
      pricing_id: trialPackage.record_id,
      start_date: startDate,
      next_billing_date: nextBillingDate,
      end_date: '',
      status: 'Active',
      billing_cycle: String(billingCycleDays),
      amount: trialPackage.amount ?? 0,
      currency: trialPackage.currency || '',
      created_at: now,
      updated_at: now
    };

    await mosySqlInsert('subscriptions', newSubscription, {});

    let notifyResults = null;
    if (isNewRegistration) {
      notifyResults = await sendSubscriptionNotification({
        name: user?.full_name || name,
        tel: user?.phone_number || tel,
        email: user?.email || email,
        subscription: newSubscription,
        trialPackage
      });
    }

    return Response.json({
      status: 'success',
      message: 'Trial subscription allocated',
      is_new_registration: isNewRegistration,
      account: {
        record_id: safeAccountId,
        full_name: user?.full_name || '',
        phone_number: user?.phone_number || '',
        email: user?.email || ''
      },
      subscription: newSubscription,
      notifications: notifyResults
    });
  } catch (err) {
    console.error('loadaccount POST failed:', err);
    return Response.json(
      {
        status: 'error',
        message: err?.message || 'Request failed'
      },
      { status: 500 }
    );
  }
}
