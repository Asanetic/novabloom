
/**
 * AUTO-GENERATED BATCH MUTATIONS
 * DO NOT EDIT MANUALLY
 */

export const AssetpricingBatchMutations = {
"_assets_asset_name_asset_id": {"type":"join","table":"assets","link":"asset_id:record_id","select":{"_assets_asset_name_asset_id":"asset_name"}},
"total_subscriptions": {"type":"count","table":"subscriptions","link":"pricing_id:record_id"}
};

export const listAssetpricingMutationKeys = {
"_assets_asset_name_asset_id": [],
"total_subscriptions": [],

};

export default listAssetpricingMutationKeys;
