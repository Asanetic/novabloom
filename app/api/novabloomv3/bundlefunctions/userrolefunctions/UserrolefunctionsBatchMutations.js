
/**
 * AUTO-GENERATED BATCH MUTATIONS
 * DO NOT EDIT MANUALLY
 */

export const UserrolefunctionsBatchMutations = {
"_system_role_bundles_bundle_name_bundle_id": {"type":"join","table":"system_role_bundles","link":"bundle_id:record_id","select":{"_system_role_bundles_bundle_name_bundle_id":"bundle_name"}},
"_system_module_manifest__access_name_role_id": {"type":"join","table":"system_module_manifest_","link":"role_id:capability_key","select":{"_system_module_manifest__access_name_role_id":"access_name"}}
};

export const listUserrolefunctionsMutationKeys = {
"_system_role_bundles_bundle_name_bundle_id": [],
"_system_module_manifest__access_name_role_id": [],

};

export default listUserrolefunctionsMutationKeys;
