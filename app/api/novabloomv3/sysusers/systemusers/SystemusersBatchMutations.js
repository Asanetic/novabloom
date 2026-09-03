
/**
 * AUTO-GENERATED BATCH MUTATIONS
 * DO NOT EDIT MANUALLY
 */

export const SystemusersBatchMutations = {
"_system_role_bundles_bundle_name_user_role": {"type":"join","table":"system_role_bundles","link":"user_role:record_id","select":{"_system_role_bundles_bundle_name_user_role":"bundle_name"}},
"permissions": {"type":"count","table":"user_bundle_role_functions","link":"bundle_id:user_role"},
"permission_list": {"type":"mini","table":"user_bundle_role_functions","link":"bundle_id:user_role","columns":"role_name","limit":"20"}
};

export const listSystemusersMutationKeys = {
"_system_role_bundles_bundle_name_user_role": [],
"permissions": [],
"permission_list": [],

};

export default listSystemusersMutationKeys;
