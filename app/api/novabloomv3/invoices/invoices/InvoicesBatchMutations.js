
/**
 * AUTO-GENERATED BATCH MUTATIONS
 * DO NOT EDIT MANUALLY
 */

export const InvoicesBatchMutations = {
"_app_users_full_name_account_id": {"type":"join","table":"app_users","link":"account_id:record_id","select":{"_app_users_full_name_account_id":"full_name"}},
"_assets_asset_name_asset_id": {"type":"join","table":"assets","link":"asset_id:record_id","select":{"_assets_asset_name_asset_id":"asset_name"}},
"_subscriptions_subscription_name_subscription_id": {"type":"join","table":"subscriptions","link":"subscription_id:record_id","select":{"_subscriptions_subscription_name_subscription_id":"subscription_name"}},
"payments_total": {"type":"sum","table":"payments","link":"invoice_id:record_id","column":"amount"},
"invoice_balance": {"type":"compute","expr":"total_amount-payments_total"}
};

export const listInvoicesMutationKeys = {
"_app_users_full_name_account_id": [],
"_assets_asset_name_asset_id": [],
"_subscriptions_subscription_name_subscription_id": [],
"payments_total": [],
"invoice_balance": [],

};

export default listInvoicesMutationKeys;
