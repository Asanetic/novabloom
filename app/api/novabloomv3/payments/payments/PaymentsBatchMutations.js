
/**
 * AUTO-GENERATED BATCH MUTATIONS
 * DO NOT EDIT MANUALLY
 */

export const PaymentsBatchMutations = {
"_app_users_full_name_account_id": {"type":"join","table":"app_users","link":"account_id:record_id","select":{"_app_users_full_name_account_id":"full_name"}},
"_subscriptions_subscription_name_context_id": {"type":"join","table":"subscriptions","link":"context_id:record_id","select":{"_subscriptions_subscription_name_context_id":"subscription_name"}},
"_assets_asset_name_app_id": {"type":"join","table":"assets","link":"app_id:record_id","select":{"_assets_asset_name_app_id":"asset_name"}},
"_invoices_invoice_remark_invoice_id": {"type":"join","table":"invoices","link":"invoice_id:record_id","select":{"_invoices_invoice_remark_invoice_id":"invoice_remark"}}
};

export const listPaymentsMutationKeys = {
"_app_users_full_name_account_id": [],
"_subscriptions_subscription_name_context_id": [],
"_assets_asset_name_app_id": [],
"_invoices_invoice_remark_invoice_id": [],

};

export default listPaymentsMutationKeys;
