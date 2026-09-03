
/**
 * AUTO-GENERATED BATCH MUTATIONS
 * DO NOT EDIT MANUALLY
 */

export const ApiuserlistBatchMutations = {
"total_subscriptions": {"table":"subscriptions","link":"account_id:record_id","type":"count"},
"payment_history": {"table":"payments","link":"account_id:record_id","type":"mini","columns":"paid_at,amount,external_reference,payment_context","limit":7}
};

export const listApiuserlistMutationKeys = {
"total_subscriptions": [],
"payment_history": [],

};

export default listApiuserlistMutationKeys;
