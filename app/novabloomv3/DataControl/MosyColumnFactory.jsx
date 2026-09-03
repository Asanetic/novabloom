const MosyColumnFactory = {

   //-- app_users cols--//
  app_users: ["record_id", "first_name", "last_name", "full_name", "email", "phone_number", "password_hash", "account_status", "email_verified", "phone_verified", "country", "currency", "created_at", "updated_at", "hive_site_id", "hive_site_name", "profile_photo"],

   //-- asset_pricing cols--//
  asset_pricing: ["record_id", "asset_id", "pricing_type", "price_model", "amount", "unit_price", "currency", "billing_cycle", "effective_from", "effective_to", "status", "created_at", "updated_at", "hive_site_id", "hive_site_name", "model_name", "model_features"],

   //-- assets cols--//
  assets: ["record_id", "asset_code", "asset_name", "asset_type", "pricing_type", "status", "description", "created_at", "updated_at", "hive_site_id", "hive_site_name", "logo"],

   //-- entitlements cols--//
  entitlements: ["record_id", "account_id", "asset_id", "order_id", "access_status", "granted_at", "expires_at", "hive_site_id", "hive_site_name"],

   //-- invoices cols--//
  invoices: ["record_id", "invoice_number", "client_id", "account_id", "order_id", "asset_id", "subscription_id", "invoice_type", "status", "subtotal_amount", "tax_amount", "discount_amount", "total_amount", "currency", "issue_date", "due_date", "paid_amount", "balance_due", "notes", "created_at", "updated_at", "invoice_remark", "hive_site_id", "hive_site_name"],

   //-- mosy_sql_roll_back cols--//
  mosy_sql_roll_back: ["roll_bk_key", "table_name", "roll_type", "where_str", "roll_timestamp", "value_entries", "hive_site_id", "hive_site_name"],

   //-- order_items cols--//
  order_items: ["record_id", "order_id", "asset_id", "pricing_id", "quantity", "unit_price", "total_price", "hive_site_id", "hive_site_name"],

   //-- orders cols--//
  orders: ["record_id", "account_id", "order_status", "total_amount", "currency", "created_at", "hive_site_id", "hive_site_name"],

   //-- page_manifest_ cols--//
  page_manifest_: ["manikey", "page_group", "site_id", "page_url", "hive_site_id", "hive_site_name", "project_id", "project_name"],

   //-- payments cols--//
  payments: ["record_id", "account_id", "payment_context", "context_id", "amount", "currency", "payment_method", "payment_status", "external_reference", "paid_at", "created_at", "hive_site_id", "hive_site_name", "app_id", "invoice_id"],

   //-- sent_messages cols--//
  sent_messages: ["record_id", "user_record_id", "send_channel", "receiver_phone", "receiver_email", "email_subject", "message_body", "send_status", "send_response", "sent_at", "hive_site_id", "hive_site_name"],

   //-- subscriptions cols--//
  subscriptions: ["record_id", "account_id", "asset_id", "pricing_id", "start_date", "next_billing_date", "end_date", "status", "billing_cycle", "amount", "currency", "created_at", "updated_at", "hive_site_id", "hive_site_name", "subscription_name"],

   //-- system_module_manifest_ cols--//
  system_module_manifest_: ["record_id", "component_name", "module_key", "module_name", "permission_type", "capability_key", "access_name", "relative_path", "hive_site_id", "hive_site_name"],

   //-- system_role_bundles cols--//
  system_role_bundles: ["record_id", "bundle_id", "bundle_name", "remark", "hive_site_id", "hive_site_name"],

   //-- system_users cols--//
  system_users: ["record_id", "name", "email", "tel", "login_password", "ref_id", "regdate", "user_no", "user_pic", "user_gender", "last_seen", "about", "hive_site_id", "hive_site_name", "auth_token", "token_status", "token_expiring_in", "project_id", "project_name", "user_role"],

   //-- usage_events cols--//
  usage_events: ["record_id", "account_id", "asset_id", "meter_id", "units_used", "unit_price_snapshot", "total_cost", "billing_status", "reference_id", "occurred_at", "hive_site_id", "hive_site_name"],

   //-- usage_meters cols--//
  usage_meters: ["record_id", "asset_id", "meter_code", "unit_name", "status", "hive_site_id", "hive_site_name"],

   //-- usage_wallet_ledger cols--//
  usage_wallet_ledger: ["record_id", "wallet_id", "direction", "amount", "reason", "reference_type", "reference_id", "created_at", "hive_site_id", "hive_site_name"],

   //-- usage_wallets cols--//
  usage_wallets: ["record_id", "account_id", "asset_id", "balance", "currency", "status", "updated_at", "hive_site_id", "hive_site_name"],

   //-- user_bundle_role_functions cols--//
  user_bundle_role_functions: ["record_id", "bundle_id", "bundle_name", "role_id", "role_name", "remark", "hive_site_id", "hive_site_name"],

   //-- user_manifest_ cols--//
  user_manifest_: ["admin_mkey", "user_id", "user_name", "role_id", "site_id", "role_name", "hive_site_id", "hive_site_name", "project_id", "project_name"],


};
export default MosyColumnFactory;