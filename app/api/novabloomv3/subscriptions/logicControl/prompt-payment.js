/**
 * ════════════════════════════════════════════════════════════════
 * FILE: prompt-payment.ts
 * PURPOSE: Backend API handlers for prompt-payment
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from 'next/server';

// ════════════════════════════════════════════════════════════════
// COMMON UTILITIES IMPORT
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// HANDLER: promptMobileStk
// AUTH: Authentication and user data
// PAYLOAD: Request data from frontend
// RETURNS: NextResponse with { success, message, data }
/* 
promptMobileStk Flow

*/
// ════════════════════════════════════════════════════════════════
export async function promptMobileStk({auth, payload}) {
    try {
        const subscriptionId = payload?.subscription_id;
        const mpesaMobileNumber = payload?.mpesa_mobile_number;
        const amount = payload?.amount;

        if (!subscriptionId) {
            return NextResponse.json(
                { success: false, message: "subscription_id is required" },
                { status: 400 }
            );
        }

        if (!mpesaMobileNumber) {
            return NextResponse.json(
                { success: false, message: "mpesa_mobile_number is required" },
                { status: 400 }
            );
        }

        if (amount === undefined || amount === null || amount === "") {
            return NextResponse.json(
                { success: false, message: "amount is required" },
                { status: 400 }
            );
        }

        console.log("promptMobileStk called with:", { auth, payload });

        const STK_URL = "https://api.asanetic.com/mpesastk.php";
        const requestBody = new URLSearchParams({
            onlinetrx: "true",
            paidamt: String(amount),
            accno: String(subscriptionId),
            telno: String(mpesaMobileNumber)
        }).toString();

        const providerResponse = await fetch(STK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: requestBody
        });

        const rawBody = await providerResponse.text();
        let parsedBody = null;
        try {
            parsedBody = JSON.parse(rawBody);
        } catch (jsonErr) {
            parsedBody = null;
        }

        if (!providerResponse.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: `STK provider request failed (${providerResponse.status})`,
                    data: {
                        request_payload: {
                            onlinetrx: "true",
                            paidamt: String(amount),
                            accno: String(subscriptionId),
                            telno: String(mpesaMobileNumber)
                        },
                        provider_status: providerResponse.status,
                        provider_response: parsedBody || rawBody
                    }
                },
                { status: 502 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "M-Pesa STK prompt sent",
            data: {
                request_payload: {
                    onlinetrx: "true",
                    paidamt: String(amount),
                    accno: String(subscriptionId),
                    telno: String(mpesaMobileNumber)
                },
                provider_status: providerResponse.status,
                provider_response: parsedBody || rawBody
            }
        });
    } catch (error) {
        console.error('Error in promptMobileStk:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || 'Operation failed'
        }, { status: 500 });
    }
}
