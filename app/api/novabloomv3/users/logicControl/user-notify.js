/**
 * ════════════════════════════════════════════════════════════════
 * FILE: user-notify.ts
 * PURPOSE: Backend API handlers for user-notify
 *
 * FUNCTION FLOW NOTES
 * senduserMessage
 *
 * 1️⃣ Receive request from frontend with:
 *    - userRecordId
 *    - message
 *    - channel (sms | email)
 *    - subject (email only)
 * 2️⃣ Validate payload
 * 3️⃣ Load user from app_users
 * 4️⃣ Send message (SMS or Email)
 * 5️⃣ Insert message record into sent_messages table
 * 6️⃣ Return success or failure
 * ════════════════════════════════════════════════════════════════
 */

import { NextResponse } from 'next/server';
import {
  mosyQddata,
  mosySqlInsert
} from '../../../apiUtils/dataControl/dataUtils';
import { mosySendSMS } from '../../../apiUtils/dataControl/send-sms';
import { mosySendEmail } from '../../../apiUtils/dataControl/send-gmail';
import { magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

// ════════════════════════════════════════════════════════════════
// HANDLER: senduserMessage
// AUTH: Authentication context
// PAYLOAD: { userRecordId, message, channel, subject }
// ════════════════════════════════════════════════════════════════
export async function senduserMessage({ auth, payload }) {
  try {

    const {
      userRecordId,
      message,
      channel = "sms",
      subject
    } = payload || {};

    // 1️⃣ Validate base payload
    if (!userRecordId || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing userRecordId or message' },
        { status: 400 }
      );
    }

    // 2️⃣ Load user
    const user = await mosyQddata(
      'app_users',
      'record_id',
      userRecordId
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare common insert payload
    const baseInsert = {
      record_id: magicRandomStr(12),
      user_record_id: userRecordId,
      send_channel: channel,
      message_body: message,
      hive_site_id: auth?.hive_site_id || '',
      hive_site_name: auth?.hive_site_name || ''
    };

    // 3️⃣ SMS FLOW
    if (channel === "sms") {

      const tel = user.phone_number;

      if (!tel) {
        return NextResponse.json(
          { success: false, message: 'User has no phone number' },
          { status: 400 }
        );
      }

      try {
        await mosySendSMS(tel, message);

        // 4️⃣ Insert success log
        await mosySqlInsert(
          'sent_messages',
          {
            ...baseInsert,
            receiver_phone: tel,
            send_status: 'success',
            send_response: 'SMS sent successfully'
          },
          {}
        );

        return NextResponse.json({
          success: true,
          message: `SMS sent to ${tel}`
        });

      } catch (smsErr) {

        // 5️⃣ Insert failure log
        await mosySqlInsert(
          'sent_messages',
          {
            ...baseInsert,
            receiver_phone: tel,
            send_status: 'failed',
            send_response: smsErr?.message || 'SMS send failed'
          },
          {}
        );

        throw smsErr;
      }
    }

    // 6️⃣ EMAIL FLOW
    if (channel === "email") {

      const email = user.email;

      if (!email) {
        return NextResponse.json(
          { success: false, message: 'User has no email address' },
          { status: 400 }
        );
      }

      if (!subject) {
        return NextResponse.json(
          { success: false, message: 'Email subject is required' },
          { status: 400 }
        );
      }

      try {
        await mosySendEmail(
          email,
          subject,
          message
        );

        // 7️⃣ Insert success log
        await mosySqlInsert(
          'sent_messages',
          {
            ...baseInsert,
            receiver_email: email,
            email_subject: subject,
            send_status: 'success',
            send_response: 'Email sent successfully'
          },
          {}
        );

        return NextResponse.json({
          success: true,
          message: `Email sent to ${email}`
        });

      } catch (mailErr) {

        // 8️⃣ Insert failure log
        await mosySqlInsert(
          'sent_messages',
          {
            ...baseInsert,
            receiver_email: email,
            email_subject: subject,
            send_status: 'failed',
            send_response: mailErr?.message || 'Email send failed'
          },
          {}
        );

        throw mailErr;
      }
    }

    // 9️⃣ Unsupported channel
    return NextResponse.json(
      { success: false, message: 'Unsupported message channel' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in senduserMessage:', error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Operation failed'
      },
      { status: 500 }
    );
  }
}
