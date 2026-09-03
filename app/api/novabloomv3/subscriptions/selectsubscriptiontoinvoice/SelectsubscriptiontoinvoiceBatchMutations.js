
/**
 * AUTO-GENERATED BATCH MUTATIONS
 * DO NOT EDIT MANUALLY
 */

export const SelectsubscriptiontoinvoiceBatchMutations = {
"_app_users_full_name_account_id": {"type":"join","table":"app_users","link":"account_id:record_id","select":{"_app_users_full_name_account_id":"full_name"}},
"_assets_asset_name_asset_id": {"type":"join","table":"assets","link":"asset_id:record_id","select":{"_assets_asset_name_asset_id":"asset_name"}},
"_asset_pricing_model_name_pricing_id": {"type":"join","table":"asset_pricing","link":"pricing_id:record_id","select":{"_asset_pricing_model_name_pricing_id":"model_name"}},
"total_payments": {"type":"sum","table":"payments","link":"context_id:record_id","column":"amount"},
"days_to_next_billing": {"type":"compute","expr":"Math.ceil((new Date(next_billing_date) - new Date()) / (1000 * 60 * 60 * 24))"}
};

export const listSelectsubscriptiontoinvoiceMutationKeys = {
"_app_users_full_name_account_id": [],
"_assets_asset_name_asset_id": [],
"_asset_pricing_model_name_pricing_id": [],
"total_payments": [],
"days_to_next_billing": [],

};

export default listSelectsubscriptiontoinvoiceMutationKeys;
