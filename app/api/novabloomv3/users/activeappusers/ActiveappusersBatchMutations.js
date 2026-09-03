
/**
 * AUTO-GENERATED BATCH MUTATIONS
 * DO NOT EDIT MANUALLY
 */

export const ActiveappusersBatchMutations = {
"total_subscriptions": {"type":"count","table":"subscriptions","link":"account_id:record_id"},
"total_payments": {"type":"sum","table":"payments","link":"account_id:record_id","column":"amount"},
"latest_payments": {"type":"mini","table":"payments","link":"account_id:record_id","columns":"paid_at,amount,external_reference,payment_context","where":[],"limit":10,"order":"primkey:desc"}
};

export const listActiveappusersMutationKeys = {
"total_subscriptions": [],
"total_payments": [],
"latest_payments": [],

};

export default listActiveappusersMutationKeys;
