
/**
 * AUTO-GENERATED BATCH MUTATIONS
 * DO NOT EDIT MANUALLY
 */

export const PlatformuserlistBatchMutations = {
"total_subscriptions": {"type":"count","table":"subscriptions","link":"account_id:record_id"},
"total_payments": {"type":"sum","table":"payments","link":"account_id:record_id","column":"amount"},
"latest_payments": {"type":"mini","table":"payments","link":"account_id:record_id","columns":"paid_at,amount,external_reference,payment_context","where":[],"limit":10,"order":"primkey:desc"},
"latest_subscriptions": {"type":"mini","table":"subscriptions","link":"account_id:record_id","columns":"subscription_name,amount,created_at,next_billing_date","where":[],"limit":10,"order":"primkey:desc"}
};

export const listPlatformuserlistMutationKeys = {
"total_subscriptions": [],
"total_payments": [],
"latest_payments": [],
"latest_subscriptions": [],

};

export default listPlatformuserlistMutationKeys;
