
/**
 * AUTO-GENERATED BATCH MUTATIONS
 * DO NOT EDIT MANUALLY
 */

export const DigitalassetlistBatchMutations = {
"total_pricing_models": {"type":"count","table":"asset_pricing","link":"asset_id:record_id"},
"active_subscriptions": {"type":"count","table":"subscriptions","link":"asset_id:record_id","where":{"status":"Active"}},
"total_revenue": {"type":"sum","table":"payments","link":"app_id:record_id","column":"amount"}
};

export const listDigitalassetlistMutationKeys = {
"total_pricing_models": [],
"active_subscriptions": [],
"total_revenue": [],

};

export default listDigitalassetlistMutationKeys;
