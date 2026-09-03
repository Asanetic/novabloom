/**
 * ════════════════════════════════════════════════════════════════
 * FILE: generate-sub-invoice.ts
 * PURPOSE: Backend API handlers for generate-sub-invoice
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from 'next/server';
import { mosySqlInsert, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

// ════════════════════════════════════════════════════════════════
// COMMON UTILITIES IMPORT
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// HANDLER: generateSubInvoice
// AUTH: Authentication and user data
// PAYLOAD: Request data from frontend
// RETURNS: NextResponse with { success, message, data }
/* 
generateSubInvoice Flow

*/
// ════════════════════════════════════════════════════════════════
export async function generateSubInvoice({auth, payload}) {
    try {
        const {
            subscription_id,
            account_id,
            asset_id = "",
            pricing_id = "",
            subscription_name = "",
            currency = "",
            amount,
            next_billing_date,
            customMessage = "",
        } = payload || {};

        if (!account_id || !subscription_id) {
            return { success: false, message: "Missing account_id or subscription_id" };
        }

        const totalAmount = Number(amount || 0);
        if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
            return { success: false, message: "Invalid amount" };
        }

        const newId = magicRandomStr(7);
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const dueDate = (next_billing_date && String(next_billing_date).includes("T"))
            ? String(next_billing_date).split("T")[0]
            : (next_billing_date ? String(next_billing_date) : today);

        const nowIso = new Date().toISOString();

        const invoiceRow = {
            record_id: newId,
            invoice_number: `INV-${newId}`,
            client_id: account_id,
            invoice_remark: subscription_name || "Subscription Invoice",
            invoice_type: "Subscription",
            status: "Issued",
            total_amount: String(totalAmount),
            balance_due: String(totalAmount),
            issue_date: today,
            due_date: dueDate,
            account_id: auth?.account_id || auth?.record_id || account_id,
            order_id: "",
            asset_id: asset_id || "",
            subscription_id: subscription_id,
            subtotal_amount: String(totalAmount),
            tax_amount: "0",
            discount_amount: "0",
            currency: currency || "",
            paid_amount: "0",
            notes: customMessage || "",
            hive_site_id: auth?.hive_site_id || "",
            hive_site_name: auth?.hive_site_name || "",
            created_at: nowIso,
            updated_at: nowIso,
        };

        // Insert into invoices table
        await mosySqlInsert("invoices", invoiceRow, {});

        return {
            success: true,
            message: "Invoice created",
            invoice_id: newId,
            invoice_number: invoiceRow.invoice_number,
        };
    } catch (error) {
        console.error('Error in generateSubInvoice:', error);
        return { success: false, message: error.message || "Operation failed" };
    }
}
